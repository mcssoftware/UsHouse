var Ushouse;
(function (Ushouse) {
    "use strict";

    var FloorSummaryView = (function () {
        function FloorSummaryView() {
        }

        FloorSummaryView.prototype.getFormattedDateText = function (dateText) {
            //for displaying
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var date = new Date(dateText);
            var month = monthNames[date.getMonth()];
            var day = date.getDate().toString();
            var year = date.getFullYear().toString();
            return month + " " + day + ", " + year;
        }
        
        FloorSummaryView.prototype.datepickerSelected = function (date) {
            var _this = this;
            $("#currentDate").html(_this.getFormattedDateText(date));
            MyAppUrlSettings = {
                ViewFloorProceedings: "/FloorSummary/ViewFloors?date=" + date,
                ViewBills: "/FloorSummary/ViewBills?date=" + date,
                ViewVotes: "/FloorSummary/ViewVotes?date=" + date
            };
            if (window.innerWidth >= 768)
                $("#floor-summary li.active>a").trigger("click");
            else
                if ($("#floor-summary #section-tabs-accordion a[aria-expanded='true']").length <= 0) {
                    var link = $("#floor-summary #section-tabs-accordion a").eq(0);
                    _this.triggerDblClick(link);
                }
                else {
                    var links = $("#floor-summary #section-tabs-accordion .panel-heading");
                    for (var i = 0; i < links.length; i++) {
                        var link = links.eq(i).find("a");
                        if (link.attr("aria-expanded").toUpperCase() === "true".toUpperCase()) {
                            var id = link.attr("id");
                            var link = $("#" + id);
                            _this.triggerDblClick(link);
                        }
                    }
                }
            
        }
        FloorSummaryView.prototype.datepicker = function () {
            new Ushouse.Datepicker("floorsummary");
            $("#calendar").click(function () {
                $("#floor-summary-date").datepicker("show");
            });
        }
        FloorSummaryView.prototype.triggerDblClick = function (jqueryelement) {
            jqueryelement.trigger("click");
            setTimeout(function () {
                jqueryelement.trigger("click");
            }, 1000);
        }
        return FloorSummaryView;
    })();
    Ushouse.FloorSummaryView = FloorSummaryView;
})(Ushouse || (Ushouse = {}));
