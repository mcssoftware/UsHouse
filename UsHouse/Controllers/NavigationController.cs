using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UsHouse.Controllers
{
    public class NavigationController : Controller
    {
        // GET: Navigation
        public PartialViewResult _Navigation()
        {
            return PartialView();
        }
    }
}