// IFFE with document ready to increse preformance and 
// avoid conflicts keeping $ locally scoped
(function($) {
  "use strict";

  // The DOM is ready!
  $(function() {
    library.accordion_events();
    library.fix_carousel_heights();
    // library.dataTables_init_settings();
  });

  // Trigger event when window resize stop
  $(window).on("resize", function() {
    clearTimeout(library.resizeTimer);
    library.resizeTimer = setTimeout(library.carousel_onscroll, 200);
  });

  var library = {
    // clearTimeout helper (work out to trigger event after window resize "performance")
    resizeTimer: "",
    // Accordion events
    accordion_events: function() {
      // Create links to open or close all accodion links
      $(".closeall").on("click", function() {
        // trigger the right accordion using the accordion id
        var accordionId = $(this).parents(".panel-group").attr("id");

        $("#" + accordionId + " .panel-collapse.in")
          .collapse("hide");
      });

      $(".openall").on("click", function() {
        // trigger the right accordion using the accordion id
        var accordionId = $(this).parents(".panel-group").attr("id");
        $("#" + accordionId + " .panel-collapse:not(\".in\")")
          .collapse("show");
      });

      // Toggle accordion icon. Using .library-panel do avoid conflict with BS original
      $(".collapse").on("show.bs.collapse", function() {
        var i = $(this).parent(".library-panel").find("i");
        i.toggleClass("fa-minus fa-plus");
      }).on("hide.bs.collapse", function() {
        var i = $(this).parent(".library-panel").find("i");
        i.toggleClass("fa-plus fa-minus");
      });
    },
    // carousel heights fixes on window scroll
    carousel_onscroll: function() {
      var carousel_caption_height = $(".carousel").find(".active.item .library-carousel_caption").height();
      var carousel_img_height = $(".carousel").find(".active.item .library-carousel_image").height();
      $(".carousel").find(".active.item").parent().animate({ height: carousel_img_height }, 300);
      $(".carousel").find(".library-carousel_control").animate({ height: carousel_caption_height }, 300);
    },
    // carousel heights fixes on slide
    fix_carousel_heights: function() {
      var caption_height = $(".carousel").find(".active.item .library-carousel_caption").height();
      $(".carousel").find(".library-carousel_control").height(caption_height);

      $(".carousel").carousel({
        interval: 5000
        // fix caption heights after slide
      }).on("slid.bs.carousel", function(e) {
        var arr_height = $(e.relatedTarget).find(".library-carousel_caption").height();
        $(this).find(".library-carousel_control").animate({ height: arr_height + 20 }, 300);

        var nextH = $(e.relatedTarget).height();
        $(this).find(".active.item").parent().animate({ height: nextH }, 500);
      });
    },
    dataTables_init_settings: function() {
      // dataTables default
      // Disable default or implemente it usgin html5 data-* attributes
      // Attributes with value as obj such as language shoud be added on data-* as an object
      $.extend($.fn.dataTable.defaults, {
        searching: true,
        ordering: false,

        bLengthChange: false,
        paging: false,

        responsive: true,
        language: {
          search: "<span class=\"sr-only\">Filter by name or keywords</span>",
          searchPlaceholder: "Filter by name or keywords",
          zeroRecords: "0 Results",
          info: "_TOTAL_ Results",
          infoEmpty: "0 Results",
          infoFiltered: " from _MAX_ Total Records",
          paginate: {
            "next": "<span class=\"sr-only\">Next</span>",
            "previous": "<span class=\"sr-only\">Previous</span>"
          }
        },
        fnPreDrawCallback: function(oSettings, json) {
          $(".dataTables_info").addClass("library-table_info");
          $(".dataTables_filter").addClass("library-table_filter");
          $(".dataTables_filter label").addClass("library-table_toolbar-src_label");
          $(".dataTables_filter input").addClass("library-table_toolbar-src_input");

          // Add class ".no-filter" to fix table titles issue
          // This will be added to the tables with bFiltered = false 
          if (!oSettings.bFiltered) {
            $(".dataTables_wrapper").addClass("no-filter");
          }
        },
        // dom: "<"toolbar"fri>tp"
        dom: "l<\"library-table_toolbar\"fi><\"table-responsive\"t><\"library-table_toolbar-footer\"ip>"
      });

      // Initialize all tables with class ".library-table"
      $(".library-table.table").each(function() {
        // $(this).dataTable();
        var tables = $(this).dataTable().api();

        // Add Class to main wrapper
        $(tables.table().container()).addClass("library-table_wrapper");
      });
    }
  };
}(jQuery));
