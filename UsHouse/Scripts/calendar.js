//  Custom calendar here
var Ushouse;
(function (Ushouse) {
    "use strict";
    var Datepicker = (function () {
        function Datepicker(pageSpecific, selector, showToday) {
            if (pageSpecific === void 0) { pageSpecific = null; }
            if (selector === void 0) { selector = ".datepicker"; }
            if (showToday === void 0) { showToday = false; }
            this.availableDates = [];
            this.showAvailableDates = false;
            this.showToday = true;
            this.dateFormat = "mm/dd/yy";
            this.div = selector;
            this.datepickerElement = $(selector);
            if (this.isValidDate(this.datepickerElement.val())) {
                this.setDateToAllocatedFormat(this.datepickerElement.val());
            }
            else {
                this.datepickerElement.val(null);
            }
            this.datepickerFormat(pageSpecific);
            this.showToday = showToday;
        }

        Datepicker.prototype.setPageSpecificSettings = function (pageName) {
            if (pageName === "floorsummary") {
                this.dateFormat = "yymmdd";
                this.showAvailableDates = true;
            }
            else
                this.dateFormat = "mm/dd/yy";
        }

        Datepicker.prototype.setDateToAllocatedFormat = function (datevalue) {
            if (datevalue !== null && datevalue !== "") {
                datevalue = new Date(datevalue);
                var month = ("0" + (datevalue.getMonth() + 1)).slice(-2);
                var date = ("0" + datevalue.getDate()).slice(-2);
                var year = datevalue.getFullYear();
                var seperator = "/";
                if (this.dateFormat === "mm/dd/yy") {
                    this.datepickerElement.val(month + seperator + date + seperator + year);
                }
            }
        };
        //  set the date format
        Datepicker.prototype.available = function (date) {
            var jquery = $;
            var f = jquery.datepicker.formatDate("yymmdd", date);
            this.dateFormat = "yymmdd";
            var availableDates = $("#inSessionDateList").length ? $("#inSessionDateList").val().split(",") : [];
            var today = new Date();
            var todayFormatted = today.getFullYear().toString() + String("0" + (today.getMonth() + 1)).slice(-2).toString() + String("0" + (today.getDate())).slice(-2).toString();
            if (availableDates.indexOf(todayFormatted) < 0) {
                availableDates.push(todayFormatted);
            }
            if ($.inArray(f, availableDates) !== -1) {
                return [true, "", "In Session"];
            }
            else {
                return [false, "", ""];
            }
        };

        Datepicker.prototype.datepickerFormat = function (pageName) {
            this.setPageSpecificSettings(pageName);
            var _this = this;
            if (pageName === void 0) { pageName = null; }
            this.datepickerElement.datepicker({
                gotoCurrent: true,
                dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
                dateFormat: _this.dateFormat,
                beforeShowDay: this.available,
                //  for disabling dates that are not available
                onSelect: function (date) {
                    var obj = $(_this.datepickerElement);
                    var datepickerObj = $(obj);
                    if(pageName==="floorsummary")
                        date = date.substring(4, 6) + "/" + date.substring(6, 8) + "/" + date.substring(0, 4);
                    _this.dateValidation(pageName, datepickerObj, date);
                }
            }).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
            }).on("change", function (e) {
                _this.dateValidation(pageName, $(_this.datepickerElement), e.target.value);
            });
    };

Datepicker.prototype.dateValidation = function (pageName, datepicker, date) {
    var errorLabel = datepicker.parent().siblings(".formerror");
    var errorDiv = datepicker.parent().parent();
    if (errorLabel && errorDiv) {
        if (pageName === "floorsummary") {
            new Ushouse.FloorSummaryView().datepickerSelected(date);
        }
        if (this.isValidDate(date)) {
            if (pageName === "membervotes") {
                new Ushouse.MemberVotesView().SetCongressSession(new Date(date).getFullYear());
            }
            if (!errorDiv.hasClass("hidden")) {
                errorLabel.addClass("hidden");
            }
            errorDiv.removeClass("has-error");
        }
        else {
            errorLabel.removeClass("hidden");
            if (!errorDiv.hasClass("has-error")) {
                errorDiv.addClass("has-error");
            }
        }
    }
};
Datepicker.prototype.isValidDate = function (str) {
    if (str === "" || str === null) {
        return true;
    }
    var parms = str.split(/[\.\-\/]/);
    var mm = parseInt(parms[0], 10);
    var dd = parseInt(parms[1], 10);
    var yyyy = parseInt(parms[2], 10);
    var dates = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    return (mm === (dates.getMonth() + 1) && dd === dates.getDate() && yyyy === dates.getFullYear());
};
Datepicker.prototype.datePickHandler = function () {
    var activeDate;
    var container = document.getElementsByClassName("ui-datepicker-inline");
    if (!container) {
        return;
    }
    $(container).find("table").first().attr("role", "grid");
    $(container).attr("role", "application");
    $(container).attr("aria-label", "Calendar view date-picker");
    //  the top controls:
    var prev = $(".ui-datepicker-prev");
    var next = $(".ui-datepicker-next");
    //  This is the line that needs to be fixed for use on pages with base URL set in head
    $(next).attr("href", "javascript:void(0)");
    $(prev).attr("href", "javascript:void(0)");
    $(next).attr("role", "button");
    $(next).removeAttr("title");
    $(prev).attr("role", "button");
    $(prev).removeAttr("title");
    this.appendOffscreenMonthText(next);
    this.appendOffscreenMonthText(prev);
    //   delegation won"t work here for whatever reason, so we are
    //   forced to attach individual click listeners to the prev /
    //   next month buttons each time they are added to the DOM
    $(next).on("click", this.handleNextClicks);
    $(prev).on("click", this.handlePrevClicks);
    this.monthDayYearText();
    $(container).on("keydown", function calendarKeyboardListener(keyVent) {
        var which = keyVent.which;
        var target = keyVent.target;
        var dateCurrent = null;
        this.getCurrentDate(container);
        if (!dateCurrent) {
            dateCurrent = $("a.ui-state-default")[0];
            this.setHighlightState(dateCurrent, container);
        }
        if (which === 27) {
            keyVent.stopPropagation();
            return this.closeCalendar();
        }
        else if (which === 9 && keyVent.shiftKey) {
            keyVent.preventDefault();
            if ($(target).hasClass("ui-datepicker-close")) {
                $(".ui-datepicker-prev")[0].focus();
            }
            else if ($(target).hasClass("ui-state-default")) {
                $(".ui-datepicker-close")[0].focus();
            }
            else if ($(target).hasClass("ui-datepicker-prev")) {
                $(".ui-datepicker-next")[0].focus();
            }
            else if ($(target).hasClass("ui-datepicker-next")) {
                activeDate =
                    //  $(".ui-state-highlight") ||
                    $(".ui-state-active")[0];
                if (activeDate) {
                    activeDate.focus();
                }
            }
        }
        else if (which === 9) {
            keyVent.preventDefault();
            if ($(target).hasClass("ui-state-default")) {
                $(".ui-datepicker-next")[0].focus();
            }
            else if ($(target).hasClass("ui-datepicker-next")) {
                $(".ui-datepicker-prev")[0].focus();
            }
            else if ($(target).hasClass("ui-datepicker-prev")) {
                if ($(".ui-state-active").length) {
                    $(".ui-state-active")[0].focus();
                }
                else {
                    $(".ui-state-highlight")[0].focus();
                }
            }
        }
        else if (which === 37) {
            //  if we"re on a date link...
            if (!$(target).hasClass("ui-datepicker-close") && $(target).hasClass("ui-state-default")) {
                keyVent.preventDefault();
                this.previousDay(target);
            }
        }
        else if (which === 39) {
            //  if we"re on a date link...
            if (!$(target).hasClass("ui-datepicker-close") && $(target).hasClass("ui-state-default")) {
                keyVent.preventDefault();
                this.nextDay(target);
            }
        }
        else if (which === 38) {
            if (!$(target).hasClass("ui-datepicker-close") && $(target).hasClass("ui-state-default")) {
                keyVent.preventDefault();
                this.upHandler(target, container, prev);
            }
        }
        else if (which === 40) {
            if (!$(target).hasClass("ui-datepicker-close") && $(target).hasClass("ui-state-default")) {
                keyVent.preventDefault();
                this.downHandler(target, container, next);
            }
        }
        else if (which === 13) {
            if ($(target).hasClass("ui-state-default")) {
                setTimeout(function () {
                    this.closeCalendar();
                }, 100);
            }
            else if ($(target).hasClass("ui-datepicker-prev")) {
                this.handlePrevClicks();
            }
            else if ($(target).hasClass("ui-datepicker-next")) {
                this.handleNextClicks();
            }
        }
        else if (which === 32) {
            if ($(target).hasClass("ui-datepicker-prev") || $(target).hasClass("ui-datepicker-next")) {
                target.click();
            }
        }
        else if (which === 33) {
            this.moveOneMonth(target, "prev");
        }
        else if (which === 34) {
            this.moveOneMonth(target, "next");
        }
        else if (which === 36) {
            var firstOfMonth = $(target).closest("tbody").find(".ui-state-default")[0];
            if (firstOfMonth) {
                firstOfMonth.focus();
                this.setHighlightState(firstOfMonth, $("#ui-datepicker-div")[0]);
            }
        }
        else if (which === 35) {
            var $daysOfMonth = $(target).closest("tbody").find(".ui-state-default");
            var lastDay = $daysOfMonth[$daysOfMonth.length - 1];
            if (lastDay) {
                lastDay.focus();
                this.setHighlightState(lastDay, $("#ui-datepicker-div")[0]);
            }
        }
        $(".ui-datepicker-current").hide();
    });
};
//  Close calendar when choose date
Datepicker.prototype.closeCalendar = function () {
    $(".dropdown.open").find(".dropdown-toggle").focus().trigger("click");
};
Datepicker.prototype.removeAria = function () {
    // make the rest of the page accessible again:
    $("#dp-container").removeAttr("aria-hidden");
    $("#skipnav").removeAttr("aria-hidden");
};
//  /////////////////////////////
//  ////////////////////////// //
//  /////////////////////// // //
//   UTILITY-LIKE THINGS // // //
//  /////////////////////// // //
//  ////////////////////////// //
//  /////////////////////////////
Datepicker.prototype.isOdd = function (num) {
    return num % 2;
};
Datepicker.prototype.moveOneMonth = function (currentDate, dir) {
    var button = (dir === "next")
        ? $(".ui-datepicker-next")[0]
        : $(".ui-datepicker-prev")[0];
    if (!button) {
        return;
    }
    var ENABLED_SELECTOR = "#ui-datepicker-div tbody td:not(.ui-state-disabled)";
    var $currentCells = $(ENABLED_SELECTOR);
    var currentIdx = $.inArray(currentDate.parentNode, $currentCells);
    button.click();
    setTimeout(function () {
        this.updateHeaderElements();
        var $newCells = $(ENABLED_SELECTOR);
        var newTd = $newCells[currentIdx];
        var newAnchor = newTd && $(newTd).find("a")[0];
        while (!newAnchor) {
            currentIdx--;
            newTd = $newCells[currentIdx];
            newAnchor = newTd && $(newTd).find("a")[0];
        }
        this.setHighlightState(newAnchor, $("#ui-datepicker-div")[0]);
        newAnchor.focus();
    }, 0);
};
Datepicker.prototype.handleNextClicks = function () {
    setTimeout(function () {
        this.updateHeaderElements();
        this.prepHighlightState();
        $(".ui-datepicker-next").focus();
        $(".ui-datepicker-current").hide();
    }, 0);
};
Datepicker.prototype.handlePrevClicks = function () {
    setTimeout(function () {
        this.updateHeaderElements();
        this.prepHighlightState();
        $(".ui-datepicker-prev").focus();
        $(".ui-datepicker-current").hide();
    }, 0);
};
Datepicker.prototype.previousDay = function (dateLink) {
    //  var container = document.getElementById("ui-datepicker-div");
    var container = document.getElementsByClassName("ui-datepicker-inline");
    if (!dateLink) {
        return;
    }
    var td = $(dateLink).closest("td");
    if (!td) {
        return;
    }
    var prevTd = $(td).prev();
    var prevDateLink = $("a.ui-state-default", prevTd)[0];
    if (prevTd && prevDateLink) {
        this.setHighlightState(prevDateLink, container);
        prevDateLink.focus();
    }
    else {
        this.handlePrevious(dateLink);
    }
};
Datepicker.prototype.handlePrevious = function (target) {
    //  var container = document.getElementById("ui-datepicker-div");
    var container = document.getElementsByClassName("ui-datepicker-inline");
    if (!target) {
        return;
    }
    var currentRow = $(target).closest("tr");
    if (!currentRow) {
        return;
    }
    var previousRow = $(currentRow).prev();
    if (!previousRow || previousRow.length === 0) {
        //  there is not previous row, so we go to previous month...
        this.previousMonth();
    }
    else {
        var prevRowDates = $("td a.ui-state-default", previousRow);
        var prevRowDate = prevRowDates[prevRowDates.length - 1];
        if (prevRowDate) {
            setTimeout(function () {
                this.setHighlightState(prevRowDate, container);
                prevRowDate.focus();
            }, 0);
        }
    }
};
Datepicker.prototype.previousMonth = function () {
    var prevLink = $(".ui-datepicker-prev")[0];
    //  var container = document.getElementById("ui-datepicker-div");
    var container = document.getElementsByClassName("ui-datepicker-inline");
    prevLink.click();
    //  focus last day of new month
    setTimeout(function () {
        var trs = $("tr", container);
        var lastRowTdLinks = $("td a.ui-state-default", trs[trs.length - 1]);
        var lastDate = lastRowTdLinks[lastRowTdLinks.length - 1];
        // updating the cached header elements
        this.updateHeaderElements();
        this.setHighlightState(lastDate, container);
        lastDate.focus();
    }, 0);
};
// /////////////// NEXT /////////////////
/**
 * Handles right arrow key navigation
 * @param  {HTMLElement} dateLink The target of the keyboard event
 */
Datepicker.prototype.nextDay = function (dateLink) {
    //  var container = document.getElementById("ui-datepicker-div");
    var container = document.getElementsByClassName("ui-datepicker-inline");
    if (!dateLink) {
        return;
    }
    var td = $(dateLink).closest("td");
    if (!td) {
        return;
    }
    var nextTd = $(td).next();
    var nextDateLink = $("a.ui-state-default", nextTd)[0];
    if (nextTd && nextDateLink) {
        this.setHighlightState(nextDateLink, container);
        nextDateLink.focus(); //    the next day (same row)
    }
    else {
        this.handleNext(dateLink);
    }
};
Datepicker.prototype.handleNext = function (target) {
    //  var container = document.getElementById("ui-datepicker-div");
    var container = document.getElementsByClassName("ui-datepicker-inline");
    if (!target) {
        return;
    }
    var currentRow = $(target).closest("tr");
    var nextRow = $(currentRow).next();
    if (!nextRow || nextRow.length === 0) {
        this.nextMonth();
    }
    else {
        var nextRowFirstDate = $("a.ui-state-default", nextRow)[0];
        if (nextRowFirstDate) {
            this.setHighlightState(nextRowFirstDate, container);
            nextRowFirstDate.focus();
        }
    }
};
Datepicker.prototype.nextMonth = function () {
    var nextMon = $(".ui-datepicker-next")[0];
    //  var container = document.getElementById("ui-datepicker-div");
    var container = document.getElementsByClassName("ui-datepicker-inline");
    nextMon.click();
    // focus the first day of the new month
    setTimeout(function () {
        // updating the cached header elements
        this.updateHeaderElements();
        var firstDate = $("a.ui-state-default", container)[0];
        // var firstDate = $("a.ui-state-default");
        this.setHighlightState(firstDate, container);
        firstDate.focus();
    }, 0);
};
// ///////// UP ///////////
/**
 * Handle the up arrow navigation through dates
 * @param  {HTMLElement} target   The target of the keyboard event (day)
 * @param  {HTMLElement} cont     The calendar container
 * @param  {HTMLElement} prevLink Link to navigate to previous month
 */
Datepicker.prototype.upHandler = function (target, cont, prevLink) {
    prevLink = $(".ui-datepicker-prev")[0];
    var rowContext = $(target).closest("tr");
    if (!rowContext) {
        return;
    }
    var rowTds = $("td", rowContext);
    var rowLinks = $("a.ui-state-default", rowContext);
    var targetIndex = $.inArray(target, rowLinks);
    var prevRow = $(rowContext).prev();
    var prevRowTds = $("td", prevRow);
    var parallel = prevRowTds[targetIndex];
    var linkCheck = $("a.ui-state-default", parallel)[0];
    if (prevRow && parallel && linkCheck) {
        // there is a previous row, a td at the same index
        // of the target AND theres a link in that td
        this.setHighlightState(linkCheck, cont);
        linkCheck.focus();
    }
    else {
        // we"re either on the first row of a month, or we"re on the
        // second and there is not a date link directly above the target
        prevLink.click();
        setTimeout(function () {
            // updating the cached header elements
            this.updateHeaderElements();
            var newRows = $("tr", cont);
            var lastRow = newRows[newRows.length - 1];
            var lastRowTds = $("td", lastRow);
            var tdParallelIndex = $.inArray(target.parentNode, rowTds);
            var newParallel = lastRowTds[tdParallelIndex];
            var newCheck = $("a.ui-state-default", newParallel)[0];
            if (lastRow && newParallel && newCheck) {
                this.setHighlightState(newCheck, cont);
                newCheck.focus();
            }
            else {
                // theres no date link on the last week (row) of the new month
                // meaning its an empty cell, so we"ll try the 2nd to last week
                var secondLastRow = newRows[newRows.length - 2];
                var secondTds = $("td", secondLastRow);
                var targetTd = secondTds[tdParallelIndex];
                var linkCheck = $("a.ui-state-default", targetTd)[0];
                if (linkCheck) {
                    this.setHighlightState(linkCheck, cont);
                    linkCheck.focus();
                }
            }
        }, 0);
    }
};
// ////////////// DOWN ////////////////
/**
 * Handles down arrow navigation through dates in calendar
 * @param  {HTMLElement} target   The target of the keyboard event (day)
 * @param  {HTMLElement} cont     The calendar container
 * @param  {HTMLElement} nextLink Link to navigate to next month
 */
Datepicker.prototype.downHandler = function (target, cont, nextLink) {
    nextLink = $(".ui-datepicker-next")[0];
    var targetRow = $(target).closest("tr");
    if (!targetRow) {
        return;
    }
    var targetCells = $("td", targetRow);
    var cellIndex = $.inArray(target.parentNode, targetCells); // the td (parent of target) index
    var nextRow = $(targetRow).next();
    var nextRowCells = $("td", nextRow);
    var nextWeekTd = nextRowCells[cellIndex];
    var nextWeekCheck = $("a.ui-state-default", nextWeekTd)[0];
    if (nextRow && nextWeekTd && nextWeekCheck) {
        // theres a next row, a TD at the same index of `target`,
        // and theres an anchor within that td
        this.setHighlightState(nextWeekCheck, cont);
        nextWeekCheck.focus();
    }
    else {
        nextLink.click();
        setTimeout(function () {
            // updating the cached header elements
            this.updateHeaderElements();
            var nextMonthTrs = $("tbody tr", cont);
            var firstTds = $("td", nextMonthTrs[0]);
            var firstParallel = firstTds[cellIndex];
            var firstCheck = $("a.ui-state-default", firstParallel)[0];
            if (firstParallel && firstCheck) {
                this.setHighlightState(firstCheck, cont);
                firstCheck.focus();
            }
            else {
                // lets try the second row b/c we didnt find a
                // date link in the first row at the target"s index
                var secondRow = nextMonthTrs[1];
                var secondTds = $("td", secondRow);
                var secondRowTd = secondTds[cellIndex];
                var secondCheck = $("a.ui-state-default", secondRowTd)[0];
                if (secondRow && secondCheck) {
                    this.setHighlightState(secondCheck, cont);
                    secondCheck.focus();
                }
            }
        }, 0);
    }
};
Datepicker.prototype.onCalendarHide = function () {
    this.closeCalendar();
};
// add an aria-label to the date link indicating the currently focused date
// (formatted identically to the required format: mm/dd/yyyy)
Datepicker.prototype.monthDayYearText = function () {
    var cleanUps = $(".amaze-date");
    $(cleanUps).each(function (clean) {
        // each(cleanUps, function (clean) {
        clean.parentNode.removeChild(clean);
    });
    var datePickDiv = document.getElementById("ui-datepicker-div");
    // in case we find no datepick div
    if (!datePickDiv) {
        return;
    }
    var dates = $("a.ui-state-default", datePickDiv);
    $(dates).each(function (index, date) {
        var currentRow = $(date).closest("tr");
        var currentTds = $("td", currentRow);
        var currentIndex = $.inArray(date.parentNode, currentTds);
        var headThs = $("thead tr th", datePickDiv);
        var dayIndex = headThs[currentIndex];
        var daySpan = $("span", dayIndex)[0];
        var monthName = $(".ui-datepicker-month", datePickDiv)[0].innerHTML;
        var year = $(".ui-datepicker-year", datePickDiv)[0].innerHTML;
        var number = date.innerHTML;
        if (!daySpan || !monthName || !number || !year) {
            return;
        }
        // AT Reads: {month} {date} {year} {day}
        // "December 18 2014 Thursday"
        var dateText = monthName + " " + date.innerHTML + " " + year + " " + daySpan.title;
        // AT Reads: {date(number)} {name of day} {name of month} {year(number)}
        // var dateText = date.innerHTML + " " + daySpan.title + " " + monthName + " " + year;
        // add an aria-label to the date link reading out the currently focused date
        date.setAttribute("aria-label", dateText);
    });
};
// update the cached header elements because we"re in a new month or year
Datepicker.prototype.updateHeaderElements = function () {
    var context = document.getElementById("ui-datepicker-div");
    if (!context) {
        return;
    }
    $(context).find("table").first().attr("role", "grid");
    var prev = $(".ui-datepicker-prev");
    var next = $(".ui-datepicker-next");
    //  make them click/focus - able
    $(next).attr("href", "javascript:void(0)");
    $(prev).attr("href", "javascript:void(0)");
    $(next).attr("role", "button");
    $(prev).attr("role", "button");
    this.appendOffscreenMonthText(next);
    this.appendOffscreenMonthText(prev);
    $(next).on("click", this.handleNextClicks);
    $(prev).on("click", this.handlePrevClicks);
    // add month day year text
    this.monthDayYearText();
};
Datepicker.prototype.prepHighlightState = function () {
    var highlight;
    var cage = document.getElementsByClassName("ui-datepicker-inline");
    highlight = $(".ui-state-highlight", cage) ||
        $(".ui-state-default", cage);
    if (highlight && cage) {
        this.setHighlightState(highlight, cage);
    }
};
// Set the highlighted class to date elements, when focus is recieved
Datepicker.prototype.setHighlightState = function (newHighlight, container) {
    var prevHighlight = this.getCurrentDate(container);
    // remove the highlight state from previously
    // highlighted date and add it to our newly active date
    $(prevHighlight).removeClass("ui-state-highlight");
    $(newHighlight).addClass("ui-state-highlight");
};
// grabs the current date based on the hightlight class
Datepicker.prototype.getCurrentDate = function (container) {
    var currentDate = $(".ui-state-highlight", container)[0];
    //  var currentDate = $(".ui-state-highlight");
    return currentDate;
};
/**
 * Appends logical next/prev month text to the buttons
 * - ex: Next Month, January 2015
 *       Previous Month, November 2014
 */
Datepicker.prototype.appendOffscreenMonthText = function (button) {
    var buttonText;
    var isNext = $(button).hasClass("ui-datepicker-next");
    var months = [
        "january", "february",
        "march", "april",
        "may", "june", "july",
        "august", "september",
        "october",
        "november", "december"
    ];
    var currentMonth = $(".ui-datepicker-title .ui-datepicker-month").text().toLowerCase();
    var monthIndex = $.inArray(currentMonth.toLowerCase(), months);
    var currentYear = $(".ui-datepicker-title .ui-datepicker-year").text().toLowerCase();
    var adjacentIndex = (isNext) ? monthIndex + 1 : monthIndex - 1;
    if (isNext && currentMonth === "december") {
        currentYear = parseInt(currentYear, 10) + 1;
        adjacentIndex = 0;
    }
    else if (!isNext && currentMonth === "january") {
        currentYear = parseInt(currentYear, 10) - 1;
        adjacentIndex = months.length - 1;
    }
    buttonText = (isNext)
        ? "Next Month, " + this.firstToCap(months[adjacentIndex]) + " " + currentYear
        : "Previous Month, " + this.firstToCap(months[adjacentIndex]) + " " + currentYear;
    $(button).find(".ui-icon").html(buttonText);
};
// Returns the string with the first letter capitalized
Datepicker.prototype.firstToCap = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
};
return Datepicker;
}());
Ushouse.Datepicker = Datepicker;
})(Ushouse || (Ushouse = {}));
