/// <reference path="jquery.d.ts" />
var Ushouse;
(function (Ushouse) {
    var SelectedMemorialsView = (function () {
        function SelectedMemorialsView() {
            this.dataTables_init_settings("#selected-memorials");
        }

        SelectedMemorialsView.prototype.dataTables_init_settings = function (container) {
            $.extend($.fn.dataTable.defaults, {
                searching: true,
                ordering: true,
                aaSorting: [[0, "desc"], [1, "asc"]],
                columnDefs: [
                    {
                        orderable: false,
                        targets: "no-sort"
                    }
                ],
                paging: false,
                bLengthChange: false,
                responsive: true,
                language: {
                    search: "<span class='sr-only'>Filter by name or keywords</span>",
                    searchPlaceholder: "Filter by name or keywords",
                    zeroRecords: "0 Results",
                    info: "_TOTAL_ Results",
                    infoEmpty: "0 Results",
                    infoFiltered: " from _MAX_ Total Records",
                    paginate: {
                        "next": "<span class='sr-only'>Next</span>",
                        "previous": "<span class='sr-only'>Previous</span>"
                    }
                },
                pagingType: "simple_numbers",
                fnPreDrawCallback: function (oSettings, json) {
                    $('.dataTables_info').addClass('library-table_info');
                    $('.dataTables_filter').addClass('library-table_filter');
                    $('.dataTables_filter label').addClass('library-table_toolbar-src_label');
                    $('.dataTables_filter input').addClass('library-table_toolbar-src_input');
                    if (!oSettings.bFiltered) {
                        var elem = this[0].parentElement.parentElement
                        elem.className += " no-filter";
                    }
                },
                dom: 'l<"library-table_toolbar"fi><"table-responsive"t><"library-table_toolbar-footer"p>'
            });

            //Initialize all tables with class ".library-table"
            $(container).find(".library-table.table").each(function (i) {
                //check if bills considered and add the columns to fix view details
                var tables = $(this).dataTable().addClass("initialized").api();
                //Add Class to main wrapper
                $(tables.table().container()).addClass("library-table_wrapper");
            });
        };

        return SelectedMemorialsView;
    }());
    Ushouse.SelectedMemorialsView = SelectedMemorialsView;
})(Ushouse || (Ushouse = {}));