/// <reference path="jquery.d.ts" />
var Ushouse;
(function (Ushouse) {
    "use strict";
    /**
     * @summary: Class for Discharge Petition and its detail page
     */
    var SubNavigation = (function () {
        function SubNavigation() {
        }
        SubNavigation.prototype.activeMenu = function (id) {
            $('#' + id).siblings().removeClass('active');
            $('#' + id).addClass('active');
            var activeText = $('#' + id).find('a');
            $('#active-subMenu').html(activeText.text());
        };
        return SubNavigation;
    }());
    Ushouse.SubNavigation = SubNavigation;
    var DischargePetitionView = (function () {
        function DischargePetitionView() {
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
            if (congress !== null) {
                this.currentCongress = parseInt(congress.innerHTML);
            }
            var that = this;
            window.onresize = function () {
                that.dropDownFilterConfig();
            };
        }
        /**
         * @summary: this function calls the dropdown config for filtering on window resizing
         * @param divId
         */
        DischargePetitionView.prototype.assignDropDown = function (divId) {
            this.dropDownFilterConfig(divId);
            $(divId + ".dropdown-menu").click(function (e) {
                e.stopPropagation();
            });
        };
        /**
         * @summary: this function changes the targeted div to the dropdown body/content.
         * @param divId
         */
        DischargePetitionView.prototype.dropDownFilterConfig = function (divId) {
            if (divId === void 0) { divId = "#filter-dropdown"; }
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
         * @summary: called when search button is clicked
         * @param url: here only url with page "1" is passed
         */
        DischargePetitionView.prototype.search = function (url, div) {
            var filterForm = $("#sidebar-filter");
            if (filterForm.find(".has-error").length === 0) {
                var congress = $("#congressNum").val();
                if (congress !== this.currentCongress.toString()) {
                    url += "?congressNum=" + congress;
                }
                this.loadDischargePetitions(url, div);
                this.scrollToTop();
            }
        };
        DischargePetitionView.prototype.scrollToTop = function (buttonId, sidebar) {
            if (buttonId === void 0) { buttonId = "#search-button"; }
            if (sidebar === void 0) { sidebar = false; }
            var filter = $(".votes-filter");
            var dropdown = $("#filter-dropdown.dropdown-menu");
            dropdown.toggleClass("open");
            var that = this;
            if (!sidebar) {
                $("html,body").animate({ scrollTop: 0 }, "slow");
                if (filter.hasClass("fixed-filter-heading")) {
                    $(buttonId).html(that.searchButtonText[0]);
                    filter.removeClass("fixed-filter-heading");
                }
                else {
                    $(buttonId).html(that.searchButtonText[1]);
                    filter.addClass("fixed-filter-heading");
                }
            }
        };
        /**
         * @summary: the function that sends the ajax request and loads the partial view in DischargePetition page
         * @param url: the url for sending the request to along with filter form values and page appended using Url.Action()
         *@param div: div to fill in the result
         * @param page: page number from pagination
         */
        DischargePetitionView.prototype.loadDischargePetitions = function (url, divId) {
            var _this = this;
            url = url.replace(/&amp;/g, "&");
            var filterForm = $("#sidebar-filter");
            var index = window.location.href; //we are using ajax to load partial view so it doesnot change the url so we are generating it manually
            index = index.split("?")[0];
            if (url.split("?").length > 1)
                index += "?" + url.split("?")[1];
            if (filterForm.find(".has-error").length === 0) {
                var div = $("#" + divId);
                this.showLoadingBar(div);
                $.get(url, function (result) {
                    div.html(result);
                    _this.getCurrentCongressInfo();
                    window.history.pushState("", "", index);
                    _this.getBillLink();
                });
            }
        };
        /**
         * @summary: this function retrieves the current congress info whenever a request from the members votes page is made
         * and depending on the current congress modifies the filter for Congress
         */
        DischargePetitionView.prototype.getCurrentCongressInfo = function () {
            var congressElem = $("#congressNum");
            var options = "";
            var selectedCongress = parseInt(congressElem.val());
            for (var i = this.currentCongress; i > 104; i--) {
                if (i === selectedCongress) {
                    options += "<option value=\"" + i + "\" selected>" + i + "th Congress</option>";
                }
                else {
                    options += "<option value=\"" + i + "\">" + i + "th Congress</option>";
                }
            }
            congressElem.html(options);
        };
        /**
         *@summary: function that alters the display style of row to either "none" or ""
                    along with background color, depending on whether row is odd or even.
         * @param row : a single row of table
         * @param show : to show or hide
         */
        DischargePetitionView.prototype.display = function (row, show) {
            if (show === void 0) { show = true; }
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
        DischargePetitionView.prototype.SetCongressSession = function (year) {
            var congress = this.GetCongressNumber(year);
            $('#sidebar-congress').val(congress.toString());
        };
        DischargePetitionView.prototype.GetCongressNumber = function (year) {
            var x = (((year - 1789) / 2)) + 1;
            return Math.ceil(x);
        };

        /**
       * @summmary: this function gets the congress number and legis number from view and
       * replaces the legis number span's html with bill's link created from createCongressLink function.
       */
        DischargePetitionView.prototype.getBillLink = function () {
            var that = this;
            var congressNum = $("#currentCongress").html();
            if (typeof ($("#petitions .legisNum")) !== "undefined") {
                for (var i = 0; i < $("#petitions .legisNum").length; i++) {
                    var billNo = $("#petitions .legisNum")[i];
                    billNo.innerHTML = that.createCongressLink(billNo.innerText, congressNum);
                    billNo.hidden = false;
                }
            }
        };
        DischargePetitionView.prototype.createCongressLink = function (legisNum, congressNum) {
            var congressLink = "https://www.congress.gov/bill/";
            //&& utils.validateLegisNum(legisNum)
            if (legisNum) {
                var currBill = legisNum.replace(/\s|\./gi, ''), type = currBill.match(/^[a-zA-Z]+/), num = currBill.match(/[\d]+$/), currType = type ? type[0] : "", currNum = num ? num[0] : "";
                return "<a target='_blank' href='" + congressLink + congressNum + "/" + currType + "/" + currNum + "'>" + legisNum + "</a>";
            }
            ;
            return "";
        };

        /**
       *@summary: the function that displays the loading bar within the div passed
       */
        DischargePetitionView.prototype.showLoadingBar = function (div) {
            if (div.attr("data-loading")) {
                div.html("<div class=\"link-row\"><div>Loading. Please wait.<br/><img src=\"/content/assets/img/loading-bar.gif\" alt=\"\"></div></div>");
            }
        };
        return DischargePetitionView;
    }());
    Ushouse.DischargePetitionView = DischargePetitionView;
})(Ushouse || (Ushouse = {}));
