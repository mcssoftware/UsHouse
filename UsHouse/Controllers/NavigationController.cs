using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using UsHouse.Models;
using UsHouse.Service;

namespace UsHouse.Controllers
{
    public class NavigationController : Controller
    {
        private readonly string sessionpath;
        private readonly LegislativeActivityService service;

        public NavigationController() : this(new LegislativeActivityService())
        { }

        public NavigationController(LegislativeActivityService clerkService)
        {
            sessionpath = HostingEnvironment.MapPath("~/App_Data/sessionsummary.json");
            if (clerkService == null)
            {
                throw new ArgumentNullException(nameof(clerkService));
            }
            this.service = clerkService;
        }

        // GET: Navigation
        public PartialViewResult _Navigation()
        {
            SessionSummary sessionSummary = Task.Run(() => service.GetSessionSummary(sessionpath)).Result;
            ViewNavigationModel navigationModel = new ViewNavigationModel
            {
                HouseStatistics = Task.Run(() => service.GetHouseStatistics(sessionSummary.congressNumber)).Result,
                SessionSummary = sessionSummary
            };
            return PartialView(navigationModel);
        }
    }
}