using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsHouse.Models
{
    public class HouseStatistics
    {
        public uint republicanNumber { get; set; }
        public uint democratNumber { get; set; }
        public uint independentNumber { get; set; }
        public uint vacancyNumber { get; set; }
        public uint daysInSession { get; set; }
        public uint numOfVotes { get; set; }
        public uint measuresIntroduced { get; set; }
        public uint measuresPassed { get; set; }
        public uint floorUpdatesNumber { get; set; }
        public uint committeeMeetingsNumber { get; set; }
        public string eventName { get; set; }
    }
}