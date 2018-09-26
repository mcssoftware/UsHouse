using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using UsHouse.Models;

namespace UsHouse.Service
{
    public class LegislativeActivityService
    {
        internal SessionSummary GetSessionSummary(string path)
        {
            string text = System.IO.File.ReadAllText(path);
            return (new System.Web.Script.Serialization.JavaScriptSerializer()).Deserialize<SessionSummary>(text);
        }

        internal HouseStatistics GetHouseStatistics(uint congressNumber)
        {
            return new HouseStatistics { };
        }

        //internal Task GetRecentVotesForMember(string memberID, object currentCongress, uint v)
        //{
        //    throw new NotImplementedException();
        //}
    }
}