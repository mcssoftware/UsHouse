using System.Web;
using System.Web.Optimization;

namespace UsHouse
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            bundles.UseCdn = true;
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery.min.js",
                "~/Scripts/jquery-ui.js",
                "~/Scripts/bootstrap.min.js",
                "~/Scripts/bootstrap-tabcollapse.js",
                "~/Scripts/jquery.dataTables.min.js",
                "~/Scripts/placeholders.min.js",
                "~/Scripts/library.js",
                "~/Scripts/site.js",
                "~/Scripts/committeeDetail.js"
            ));

            //Custom Style
            bundles.Add(new StyleBundle("~/Content/custom").Include(
                 "~/Content/assets/css/main.css",
                 "~/Content/assets/css/font-awesome.css",
                "~/Content/assets/css/fonts.css"
            ));

            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            //// Use the development version of Modernizr to develop with and learn from. Then, when you're
            //// ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //          "~/Scripts/bootstrap.js"));

            //bundles.Add(new StyleBundle("~/Content/css").Include(
            //          "~/Content/bootstrap.css",
            //          "~/Content/site.css"));
        }
    }
}
