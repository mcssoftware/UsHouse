/// <reference path="jquery.d.ts" />
var Ushouse;
(function (Ushouse) {
    "use strict";
    Ushouse.Years = [
        2017, 2016, 2015
    ];
    Ushouse.Months = [
        "Jan", "Feb", "March"
    ]


    /**
     * @summary: Class for BroadcastEventView and its detail page
     */
    var BroadcastEventView = (function () {

        function BroadcastEventView() {
            var _this = this;
            window.onresize = function () {
                _this.videoPlayerHeightManager();
            }
        }

        /**
         * @summary: the function that sends the ajax request and loads the partial view in Broadcast event page
         * @param url: the url for sending the request to along with filter form values and page appended using Url.Action()
         * @param page: page number from pagination
         */
        BroadcastEventView.prototype.loadBroadCastEvents = function (url, div) {
            var _this = this;
            url = url.replace(/&amp;/g, "&");
            url = url.replace(/=&/g, "=");
            var index = window.location.href; //we are using ajax to load partial view so it doesnot change the url so we are generating it manually
            index = index.split("?")[0];
            if (url.split("?").length > 1) {
                if (url.split("?").length > 1) {
                    index += "?" + url.split("?")[1];
                    var queryString = url.split("?")[1];
                    var finalQs = "?";
                    if (queryString.length > 0) {
                        var queryStrings = queryString.split("&");
                        for (var i = 0; i < queryStrings.length; i++) {
                            var qs = queryStrings[i].split("=");
                            var connector = "";
                            if (finalQs.split("?")[1].length > 1) {
                                connector += "&";
                            }
                            if (qs[0] === "Page") {
                                if (parseInt(qs[1], 10) > 1) {
                                    finalQs += connector + "Page=" + parseInt(qs[1]);
                                }
                            }
                            else if (qs[0] === "Year") {
                                if (parseInt(qs[1], 10) > 0) {
                                    finalQs += connector + "Year=" + parseInt(qs[1]);
                                }
                            }
                            else if (qs[0] === "Month") {
                                if (parseInt(qs[1], 10) > 0) {
                                    finalQs += connector + "Month=" + parseInt(qs[1]);
                                }
                            }
                            else if (qs[0] === "EventType") {
                                if (qs[1] !== "Proceedings") {
                                    finalQs += connector + qs[0] + "=" + qs[1];
                                }
                            }
                        }
                        finalQs = finalQs.split("?")[1].length > 0 ? finalQs : "";
                        index = index.split("?")[0] + finalQs;
                    }
                }
            }

            var div = $("#" + div);
            this.showLoadingBar(div);
            $.get(url, function (result) {
                div.html(result);
                window.history.pushState("", "", index);
            });
        };

        /**
         * @summary: called when search button is clicked
         * @param url: here only url with page "1" is passed
         */
        BroadcastEventView.prototype.search = function (url, div) {
            var year = $("#year").val();
            var month = $("#month").val();

            if (month !== "" && year === "") {
                $("#year").attr("required", "true");
                $("#year").parent().addClass("has-error");
            } else {
                $("#year").attr("required", "false");
                $("#year").parent().removeClass("has-error");

                var eventType = $("#eventType input[name='eventType']:checked").val();
                var queryString = "";
                queryString += "eventType=" + eventType;
                if (year !== "") {
                    if (queryString !== "") {
                        queryString += "&";
                    }
                    queryString += "year=" + year;
                    if (month !== "") {
                        if (queryString !== "") {
                            queryString += "&";
                        }
                        queryString += "month=" + month;
                    }
                }
                url = url + "?" + queryString;
                this.loadBroadCastEvents(url, div);
            }
        }

        BroadcastEventView.prototype.filterTranscripts = function () {
            var keywordFilter = $("#transcript-keyword").val();
            var nameFilter = $("#transcript-name").val();
            var rows = $("#transcripts").find("tr");
            if (this.value == "") {
                rows.show();
                return;
            }
            rows.hide();

            //Recusively filter the jquery object to get results.
            rows.filter(function (i, v) {
                //var $t = $(this);
                var title = v.cells[0].getAttribute("data-title");
                var description = v.cells[0].getAttribute("data-description");
                if (title.indexOf(nameFilter) !== -1 && title.indexOf(keywordFilter) !== -1)
                    return true;
                return false;
            }).show();
        }

        /**
       *@summary: the function that displays the loading bar within the div passed
       */
        BroadcastEventView.prototype.showLoadingBar = function (div) {
            if (div.attr("data-loading")) {
                div.html("<div class=\"link-row\"><div>Loading. Please wait.<br/><img src=\"/content/assets/img/loading-bar.gif\" alt=\"\"></div></div>");
            }
        };

        BroadcastEventView.prototype.videoPlayerHeightManager = function () {
            var video = $(".video-stream");
            var width = video[0].offsetWidth;
            var height = Math.ceil(width * 9 / 16);
            $("#video").height(height);
            $("#video").width(width);
        }
        return BroadcastEventView;

    })();
    Ushouse.BroadcastEventView = BroadcastEventView;
})(Ushouse || (Ushouse = {}));
