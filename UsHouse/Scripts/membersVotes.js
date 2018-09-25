/// <reference path="jquery.d.ts" />
var Ushouse;
function getVotesUrlParameter(name, url) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var queryString = url.split("?");
    var results = null;
    if (queryString.length > 1) {
        var queryStringToLower = url.split("?")[1].toLowerCase();
        results = regex.exec("?" + queryStringToLower);
    }
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
(function (Ushouse) {
    "use strict";
    Ushouse.States = [
        { StateCode: "AL", State: "Alabama" },
        { StateCode: "AK", State: "Alaska" },
        { StateCode: "AZ", State: "Arizona" },
        { StateCode: "AR", State: "Arkansas" },
        { StateCode: "CA", State: "California" },
        { StateCode: "CO", State: "Colorado" },
        { StateCode: "CT", State: "Connecticut" },
        { StateCode: "DE", State: "Delaware" },
        { StateCode: "FL", State: "Florida" },
        { StateCode: "GA", State: "Georgia" },
        { StateCode: "HI", State: "Hawaii" },
        { StateCode: "ID", State: "Idaho" },
        { StateCode: "IL", State: "Illinois" },
        { StateCode: "IN", State: "Indiana" },
        { StateCode: "IA", State: "Iowa" },
        { StateCode: "KS", State: "Kansas" },
        { StateCode: "KY", State: "Kentucky" },
        { StateCode: "LA", State: "Louisiana" },
        { StateCode: "ME", State: "Maine" },
        { StateCode: "MD", State: "Maryland" },
        { StateCode: "MA", State: "Massachusetts" },
        { StateCode: "MI", State: "Michigan" },
        { StateCode: "MN", State: "Minnesota" },
        { StateCode: "MS", State: "Mississippi" },
        { StateCode: "MO", State: "Missouri" },
        { StateCode: "MT", State: "Montana" },
        { StateCode: "NE", State: "Nebraska" },
        { StateCode: "NV", State: "Nevada" },
        { StateCode: "NH", State: "New Hampshire" },
        { StateCode: "NJ", State: "New Jersey" },
        { StateCode: "NM", State: "New Mexico" },
        { StateCode: "NY", State: "New York" },
        { StateCode: "NC", State: "North Carolina" },
        { StateCode: "ND", State: "North Dakota" },
        { StateCode: "OH", State: "Ohio" },
        { StateCode: "OK", State: "Oklahoma" },
        { StateCode: "OR", State: "Oregon" },
        { StateCode: "PA", State: "Pennsylvania" },
        { StateCode: "RI", State: "Rhode Island" },
        { StateCode: "SC", State: "South Carolina" },
        { StateCode: "SD", State: "South Dakota" },
        { StateCode: "TN", State: "Tennessee" },
        { StateCode: "TX", State: "Texas" },
        { StateCode: "UT", State: "Utah" },
        { StateCode: "VT", State: "Vermont" },
        { StateCode: "VA", State: "Virginia" },
        { StateCode: "WA", State: "Washington" },
        { StateCode: "WV", State: "West Virginia" },
        { StateCode: "WI", State: "Wisconsin" },
        { StateCode: "WY", State: "Wyoming" }
    ];

    Ushouse.OrderBy = [
    { Value: "startDate desc", Text: "Vote Date (Most Recent First)" },
    {
        Value: "startDate", Text: "Vote Date (Oldest First)"
    },
        {
            Value: "legisNum", Text: "Bill Number (A to Z)"
        },
        {
            Value: "legisNum desc", Text: "Bill Number (Z to A)"
        }
    ];

    var getOrdinalNumber = function (i) {
        var j = i % 10, k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    };

    /**
     * @summary: Class for Member-votes and its detail page
     */
    var MemberVotesView = (function () {
        function MemberVotesView() {
            this.filterParams = {};
            this.unmatchedContent = [];
            this.matchedCount = 0;
            this.currentCongress = 0;
            this.availableSessions = ["1st", "2nd"];
            this.searchButtonText = [
                "Search <span class=\"fa fa-search\"></span>",
                "Close <span class=\"fa fa-close\"></span>"
            ];
            var congress = document.getElementById("currentCongress");
            var session = document.getElementById("currentSession");
            if (congress !== null && session !== null) {
                this.currentCongress = parseInt(congress.innerHTML);
                this.currentSession = session.innerHTML;
            }
            var that = this;
            window.onresize = function () {
                that.dropDownFilterConfig();
            };
            $('#sidebar-form input[type="text"]:not(.hasDatepicker)').bind('keypress', function (e) {
                if (e.keyCode == 13) {
                    that.searchVotes("/Votes/MemberVotes");
                }
            });

        }

        /**
        * @summary: this function hides Feedback button in mobile view
        * @param none
        */
        MemberVotesView.prototype.hideFeebackOnMobileView = function () {
            var feed = $('.survey--hidden');
            if (feed.hasClass('hidden-xs')) {
                $(feed).removeClass('hidden-xs');
               } else {
                $(feed).addClass('hidden-xs');
           }
      };

        /**
         * @summary: this function calls the dropdown config for filtering on window resizing
         * @param divId
         */
        MemberVotesView.prototype.assignDropDown = function (divId) {
            this.dropDownFilterConfig(divId);
            $(divId + ".dropdown-menu").click(function (e) {
                e.stopPropagation();
            });
        };
        /**
         * @summary: this function changes the targeted div to the dropdown body/content.
         * @param divId
         */
        MemberVotesView.prototype.dropDownFilterConfig = function (divId) {
            if (divId === void 0) {
                divId = "#filter-dropdown";
            }
            var div = $(divId);
            if (window.innerWidth >= 768) {
                if (div.hasClass("dropdown-menu")) {
                    div.removeClass("dropdown-menu");
                    div.find("div").removeClass("dropdown-menu-right");
                }
            }
            else {
                if (!div.hasClass("dropdown-menu")) {
                    div.addClass("dropdown-menu");
                    div.find("div").addClass("dropdown-menu-right");
                }
            }
        };
        /**
         * @for loading States in dropdown
         * @param selector: selector can be class or id but should be dropdown
         */
        MemberVotesView.prototype.loadStates = function (selector) {
            for (var i = 0; i < Ushouse.States.length; i++) {
                $(selector).append("<option value=\"" + Ushouse.States[i].StateCode + "\">" + Ushouse.States[i].State + "</option>");
            }
        };

        MemberVotesView.prototype.loadOrderBy = function () {
            var orderByElem = $("#member-votes-order");
            var options = "";
            var selectedOrderBy = orderByElem.val();
            for (var i = 0; i < Ushouse.OrderBy.length; i++) {
                if (Ushouse.OrderBy[i].Value === selectedOrderBy) {
                    options += "<option value=\"" + Ushouse.OrderBy[i].Value + "\" selected>" + Ushouse.OrderBy[i].Text + "</option>";
                }
                else {
                    options += "<option value=\"" + Ushouse.OrderBy[i].Value + "\">" + Ushouse.OrderBy[i].Text + "</option>";
                }
            }
            orderByElem.html(options);
        };

        MemberVotesView.prototype.validate = function (url) {
            var formData = {
                RollCallNum: $("#rollCallNum").val().replace(/[^0-9a-z]/gi, ""),
                BillNum: $("#billNum").val().replace(/[^\w\.]/gi, ''),
                CongressNum: $("#member-votes-congress").val(),
                Session: $("#member-votes-session").val(),
                Date: $("#startdate").val(),
                Title: $("#title").val(),
                Question: $("#question").val(),
                VoteType: $("#member-votes-type").val().toUpperCase(),
                OrderBy: $("#member-votes-order").val()
            };

            var isValid = true;
            if (formData.BillNum.length > 15) {
                isValid = false;
                this.changeValidationStyle($("#billNum"), false);
            } else {
                this.changeValidationStyle($("#billNum"), true);
            }
            if (formData.Title.length > 100) {
                isValid = false;
                this.changeValidationStyle($("#title"), false);
            } else {
                this.changeValidationStyle($("#title"), true);
            }
            if (formData.Question.length > 100) {
                isValid = false;
                this.changeValidationStyle($("#question"), false);
            } else {
                this.changeValidationStyle($("#question"), true);
            }
            return isValid;
        }

        MemberVotesView.prototype.changeValidationStyle = function (elem, isValid) {
            if (isValid) {
                elem.siblings(".error-message").removeClass("has-error").addClass("hidden");
                elem.removeClass("input-textbox-error");
            } else {
                elem.siblings(".error-message").addClass("has-error").removeClass("hidden");
                elem.addClass("input-textbox-error");
                elem.focus();
            }
        }
        /**
         * @summary: called when search button is clicked
         * @param url: here only url with page "1" is passed
         */
        MemberVotesView.prototype.searchVotes = function (url) {
            if (this.validate()) {
                url = this.handleQuery(url);
                this.loadMembersVotes(url);
                this.scrollToTop();
            }
        };

        MemberVotesView.prototype.handleQuery = function (url) {
            var filterForm = $("#members-votes-filter");
            if (filterForm.find(".has-error").length === 0) {
                var formData = {
                    RollCallNum: $("#rollCallNum").val().replace(/[^0-9a-z]/gi, ""),
                    BillNum: $("#billNum").val().replace(/[^\w\.]/gi, ''),
                    CongressNum: $("#member-votes-congress").val(),
                    Session: $("#member-votes-session").val(),
                    Date: $("#startdate").val(),
                    Title: $("#title").val(),
                    Question: $("#question").val(),
                    VoteType: $("#member-votes-type").val().toUpperCase(),
                    OrderBy: $("#member-votes-order").val()
                };
                var count = 0;
                var excludeCongress = false;
                if (formData["CongressNum"] === this.currentCongress.toString() && formData["Session"] === this.currentSession) {
                    excludeCongress = true;
                }
                var tempUrl = url.split("?")[0];
                for (var i in formData) {
                    if (formData[i] !== null && formData[i] !== "") {
                        if (excludeCongress && (i === "CongressNum" || i === "Session")) { }
                        else if (i === "OrderBy") {
                        }
                        else if (i === "VoteType" && formData[i] === "") {
                        }
                        else {
                            if (count > 0)
                                tempUrl += "&" + i + "=" + formData[i];
                            else
                                tempUrl += "?" + i + "=" + formData[i];
                            count++;
                        }
                    }
                }
                if (url.split("?").length > 1) {
                    var pageNumber = parseInt(getVotesUrlParameter("page", url), 10);
                    if (pageNumber > 1) {

                        if (tempUrl.indexOf("?") == -1) {
                            tempUrl += "?" + "page=" + pageNumber;
                        }
                        else {
                            tempUrl += "&" + "page=" + pageNumber;
                        }
                    }
                }

                return tempUrl;
            }
        }

        MemberVotesView.prototype.scrollToTop = function (buttonId, sidebar) {
            if (buttonId === void 0) {
                buttonId = "#search-button";
            }
            if (sidebar === void 0) {
                sidebar = false;
            }
            var filter = $(".votes-filter");
            var dropdown = $("#filter-dropdown.dropdown-menu");
            dropdown.toggleClass("open");
            var that = this;
            if (!sidebar) {
                $("html,body").animate({ scrollTop: 0 }, "slow");
                //for not making any change to sidebar filter when browser window is desktop view
                if (window.innerWidth < 768) {
                    if (filter.hasClass("fixed-filter-heading")) {
                        $(buttonId).html(that.searchButtonText[0]);
                        filter.removeClass("fixed-filter-heading");
                        $("body").css("overflow-y", "auto");
                    }
                    else {
                        $(buttonId).html(that.searchButtonText[1]);
                        filter.addClass("fixed-filter-heading");
                        $("body").css("overflow-y", "hidden");
                    }
                }
            }
            this.hideFeebackOnMobileView();

        };
        /**
         * @summary: the function that sends the ajax request and loads the partial view in Members Vote page
         * @param url: the url for sending the request to along with filter form values and page appended using Url.Action()
         * @param page: page number from pagination
         */
        MemberVotesView.prototype.loadMembersVotes = function (url) {
            var _this = this;
            if (typeof url != "undefined") {
                url = url.replace(/&amp;/g, "&");
                url = url.replace(/=&/g, "=");
                url = this.handleQuery(url);
                var filterForm = $("#members-votes-filter");
                var index = window.location.href; //we are using ajax to load partial view so it doesnot change the url so we are generating it manually
                index = index.split("?")[0];
                if (url.split("?").length > 1) {
                    index += "?" + url.split("?")[1];
                }
                if (filterForm.find(".has-error").length === 0) {
                    var div = $("#membersvotes");
                    if (div.val === "") {
                        this.showLoadingBar(div);
                    }
                    $.ajax({
                        type: "Post",
                        url: "/Votes/ValidateFilter",
                        data: filterForm.serialize(),
                        success: function (response) {
                            if (response.IsValid) {
                                _this.showLoadingBar(div);
                                $.get(url, function (result) {
                                    div.val("loaded");
                                    div.html(result);
                                    _this.loadOrderBy();
                                    window.history.pushState("", "", index);
                                    _this.getBillLink();
                                });
                            } else {
                                _this.validateFilter(response.Errors);
                                if (div.val() === "") {
                                    _this.showFilterError(div);
                                }
                            }
                        }
                    });
                }
            }
        };

        MemberVotesView.prototype.validateFilter = function (errors) {
            if (!$(".error-message").has("hidden")) {
                $(".error-message").addClass("hidden").removeClass("has-error");
            };
            if (errors != null) {
                errors.forEach(function (error) {
                    var input = $("[name='" + error.Key + "']");
                    var errorSpan = input.siblings(".error-message").length > 0 ? input.siblings(".error-message") : input.parents().siblings(".error-message");
                    errorSpan.removeClass("hidden").addClass("has-error");
                    var message = "";
                    if (Array.isArray(error.Value)) {
                        error.Value.forEach(function (msg) {
                            message += msg;
                        });
                    } else {
                        message = error.Value;
                    }
                    errorSpan.html(message);
                });
            }
        }

        /**
            * @summary: this function allocates the Sessions for the available Congress.
            *@case1: if current Session is 1st, then the current Congress will have only 1st Session
                  else if current Session is 2nd, then current Congress will have both 1st and 2nd Session.
            *@case2: for the last Congress "101", there will be only "2nd" Session
         */
        MemberVotesView.prototype.getSession = function (selectIndex) {
            var sessionElem = $("#member-votes-session");
            var congress = parseInt($("#member-votes-congress").val());
            var options = "";
            var selectedSession = sessionElem.val();
            if (selectIndex != null) {
                selectedSession = this.availableSessions[selectIndex];
            }
            if (congress > 101) {
                options += "<option value=\"" + this.availableSessions[0] + "\"";
                if (selectedSession === this.availableSessions[0]) {
                    options += " selected";
                }
                options += ">" + this.availableSessions[0] + " Session" + "</option>";
            }
            if (congress < this.currentCongress || this.currentSession === this.availableSessions[1]) {
                options += "<option value=\"" + this.availableSessions[1] + "\"";
                if (selectedSession === this.availableSessions[1]) {
                    options += " selected";
                }
                options += ">" + this.availableSessions[1] + " Session" + "</option>";
            }
            sessionElem.html(options);
        };
        /**
         * @summary: function to filter the all votes table in members votes detail page
         */
        MemberVotesView.prototype.filterVotes = function () {
            this.filterParams = {
                state: document.getElementById("state"),
                party: document.getElementById("party"),
                votes: document.getElementById("votes"),
                keyword: document.getElementById("keyword")
            };
            var tbody = document.getElementById("member-votes");
            var rows = tbody.getElementsByTagName("tr");
            //rows.length-1 for excluding "No Match" row of the table
            for (var i = 0; i < rows.length - 1; i++) {
                this.unmatchedContent.push(rows[i]);
                var td = rows[i].getElementsByTagName("td");
                if (this.getVotesMatchResult(td)) {
                    this.display(rows[i]);
                }
                else {
                    this.display(rows[i], false);
                }
                if (this.matchedCount > 0) {
                    document.getElementById("nomatch").style.display = "none";
                }
                else {
                    document.getElementById("nomatch").style.display = "";
                }
            }
        };
        /**
         *@summary: function that alters the display style of row to either "none" or ""
                    along with background color, depending on whether row is odd or even.
         * @param row : a single row of table
         * @param show : to show or hide
         */
        MemberVotesView.prototype.display = function (row, show) {
            if (show === void 0) {
                show = true;
            }
            if (show) {
                row.style.display = "";
                this.matchedCount++;
                if ((this.matchedCount % 2) === 0) {
                    row.classList.remove("oddRow");
                    row.classList.remove("evenRow");
                    row.classList.add("evenRow");
                }
                else {
                    row.classList.remove("oddRow");
                    row.classList.remove("evenRow");
                    row.classList.add("oddRow");
                }
            }
            else {
                row.style.display = "none";
            }
        };
        /**
         * @summary: returns if the every columns matches the filter criteria, not matching one filter criteria returns false
         * @param column: array of column within a row
         */
        MemberVotesView.prototype.getVotesMatchResult = function (columns) {
            var display = true;
            if (this.filterParams.keyword.value !== "" || this.filterParams.party.value !== "" || this.filterParams.state.value !== "" || this.filterParams.votes.value !== "") {
                if (this.filterParams.keyword.value !== "" && columns[1].innerHTML.toUpperCase().indexOf((this.filterParams.keyword.value).toUpperCase()) < 0) {
                    display = false;
                }
                else if (this.filterParams.party.value !== "" && columns[2].innerHTML.toUpperCase().indexOf((this.filterParams.party.value).toUpperCase()) !== 0) {
                    display = false;
                }
                else if (this.filterParams.state.value !== "" && columns[4].innerHTML.toUpperCase().indexOf((this.filterParams.state.value).toUpperCase()) !== 0) {
                    display = false;
                }
                else if (this.filterParams.votes.value !== "") {
                    display = false;
                    var valueToCompare = columns[5].innerHTML.trim().toUpperCase();
                    if (this.filterParams.votes.value === "yea") {
                        if (valueToCompare === "YES" || valueToCompare === "AYE" || valueToCompare === "YEA") {
                            display = true;
                        }
                    }
                    else if (this.filterParams.votes.value === "nay") {
                        if (valueToCompare === "NO" || valueToCompare === "NAY") {
                            display = true;
                        }
                    }
                    else {
                        if (valueToCompare === this.filterParams.votes.value.toUpperCase()) {
                            display = true;
                        }
                    }
                }
            }
            return display;
        };

        /**
         * @summary: for setting up Jquery datepicker
         */
        MemberVotesView.prototype.datepicker = function () {
            new Ushouse.Datepicker("membervotes");
        };

        MemberVotesView.prototype.SetCongressSession = function (year) {
            var congress = this.GetCongressNumber(year);
            var memberVotesCongressOptions = [];
            $("#member-votes-congress option").each(function () {
                memberVotesCongressOptions.push($(this).val());
            });
            var congressExists = false;
            for (var i = 0; i < memberVotesCongressOptions.length && !congressExists; i++) {
                congressExists = memberVotesCongressOptions[i] === congress.toString();
            }
            if (congressExists) {
                $('#member-votes-congress').val(congress.toString());
                $("#startdate").parent().siblings(".error-message-congress").removeClass("has-congress-error").addClass("hidden").removeClass("has-error");

                if (year % 2 == 0)
                    this.getSession(1);
                else
                    this.getSession(0);
            } else {
                if (year != "") {
                    $("#startdate").parent().siblings(".error-message-congress").removeClass("has-congress-error").addClass("hidden").removeClass("has-error");
                }
                else { $("#startdate").parent().siblings(".error-message-congress").addClass("has-congress-error").removeClass("hidden"); }
            }
        };

        MemberVotesView.prototype.GetCongressNumber = function (year) {
            var x = (((year - 1789) / 2)) + 1;
            return Math.floor(x);
        };

        MemberVotesView.prototype.VotesDetailLoaded = function () {
            var that = this;
            var congressNum = $("#currentCongress").html();
            if (typeof ($(".legisNum")) !== "undefined") {
                var billNo = $(".legisNum");
                billNo.html(that.createCongressLink(billNo.html(), congressNum, billNo.attr("aria-label")));
                billNo.removeAttr("hidden");
            }
        };

        /**
       * @summmary: this function gets the congress number and legis number from view and
       * replaces the legis number span's html with bill's link created from createCongressLink function.
       */
        MemberVotesView.prototype.getBillLink = function () {
            var that = this;
            var congressNum = $("#currentCongress").html();
            if (typeof ($("#votes .legisNum")) !== "undefined") {
                for (var i = 0; i < $("#votes .legisNum").length; i++) {
                    var billNo = $("#votes .legisNum")[i];
                    billNo.innerHTML = that.createCongressLink(billNo.innerText, congressNum, billNo.getAttribute("aria-label"));
                    billNo.hidden = false;
                }
            }
        };
        MemberVotesView.prototype.createCongressLink = function (legisNum, congressNum, ariaLabel) {
            var congressLink = "https://www.congress.gov/bill/";
            //&& utils.validateLegisNum(legisNum)
            if (typeof ariaLabel === "undefined")
                ariaLabel = "";
            if (legisNum) {
                var currBill = legisNum.replace(/\s|\./gi, ''), type = currBill.match(/^[a-zA-Z]+/), num = currBill.match(/[\d]+$/), currType = type ? type[0] : "", currNum = num ? num[0] : "";
                return "<a target='_blank' tabindex='0' aria-label='bill number, " + currBill + "' href='" + congressLink + congressNum + "/" + currType + "/" + currNum + "'>" + legisNum + "</a>";
            }
            ;
            return "";
        };

        /**
       *@summary: the function that displays the loading bar within the div passed
       */
        MemberVotesView.prototype.showLoadingBar = function (div) {
            if (div.attr("data-loading")) {
                div.html("<div class=\"link-row\"><div>Loading. Please wait.<br/><img src=\"/content/assets/img/loading-bar.gif\" alt=\"\"></div></div>");
            }
        };

        /**
       *@summary: the function that displays the error message for votes page when bill filter is invalid
       */
        MemberVotesView.prototype.showFilterError = function (div) {
            div.html("<div class=\"link-row\"><div><hr/>Invalid filter</div></div>");
        };
        return MemberVotesView;

    })();
    Ushouse.MemberVotesView = MemberVotesView;
})(Ushouse || (Ushouse = {}));