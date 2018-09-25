/// <reference path="jquery.d.ts" />
var Ushouse;
(function (Ushouse) {
    "use strict";
    var MembersDetailsView = (function () {
        function MembersDetailsView() {
        }

        /**
         * @summary: the function that sends the ajax request and loads the partial view in Members Vote page
         * @param url: the url for sending the request to along with filter form values and page appended using Url.Action()
         * @param page: page number from pagination
         */
        MembersDetailsView.prototype.loadMembersVotes = function (url, scroll) {
            var _this = this;
            url = url.replace(/&amp;/g, "&");
            url = url.replace(/=&/g, "=");
            var div = $("#recent-votes");
            this.showLoadingBar(div);
            $.get(url, function (result) {
                div.html(result);
                _this.getBillLink();
                if (scroll) {
                    scrollToElement("#recent-votes");
                }
            });
        };

        MembersDetailsView.prototype.animate = function (elem, style, unit, from, to, time, prop) {
            if (!elem) {
                return;
            }
            var start = new Date().getTime();
            var timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    elem[style] = (from + step * (to - from)) + unit;
                }
                else {
                    elem.style[style] = (from + step * (to - from)) + unit;
                }
                if (step === 1) {
                    clearInterval(timer);
                }
            }, 25);
            if (prop) {
                elem[style] = from + unit;
            }
            else {
                elem.style[style] = from + unit;
            }
        };

        /**
       * @summmary: this function gets the congress number and legis number from view and
       * replaces the legis number span's html with bill's link created from createCongressLink function.
       */
        MembersDetailsView.prototype.getBillLink = function () {
            var that = this;
            var congressNum = this.GetCongressNumber(new Date().getFullYear());
            if (typeof ($(".legisNum")) !== "undefined") {
                for (var i = 0; i < $(".legisNum").length; i++) {
                    var billNo = $(".legisNum")[i];
                    billNo.innerHTML = that.createCongressLink(billNo.innerText, congressNum);
                    billNo.hidden = false;
                }
            }
        };

        MembersDetailsView.prototype.createCongressLink = function (legisNum, congressNum) {
            var congressLink = "https://www.congress.gov/bill/";
            if (legisNum) {
                var currBill = legisNum.replace(/\s|\./gi, ''), type = currBill.match(/^[a-zA-Z]+/), num = currBill.match(/[\d]+$/), currType = type ? type[0] : "", currNum = num ? num[0] : "";
                return "<a target='_blank' href='" + congressLink + congressNum + "/" + currType + "/" + currNum + "'>" + legisNum + "</a>";
            };
            return "";
        };

        /**
        *@summary: the function that returns the congress number based on the year passed as parameter
        */
        MembersDetailsView.prototype.GetCongressNumber = function (year) {
            var x = (((year - 1789) / 2)) + 1;
            return Math.floor(x);
        };

        /**
       *@summary: the function that displays the loading bar within the div passed
       */
        MembersDetailsView.prototype.showLoadingBar = function (div) {
            div.html("<div class=\"link-row\"><div>Loading. Please wait.<br/><img src=\"/content/assets/img/loading-bar.gif\" alt=\"\"></div></div>");
        };
        return MembersDetailsView;
    })();
    Ushouse.MembersDetailsView = MembersDetailsView;
})(Ushouse || (Ushouse = {}));
