using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsHouse.Models
{
    public class SessionSummary
    {
        public bool inSessionToday { get; set; }
        public bool inSessionNow { get; set; }
        public bool inSessionThisWeek { get; set; }
        public DateTime? sessionStartDate { get; set; }
        public DateTime? sessionEndDate { get; set; }
        public DateTime? nextSessionStartDate { get; set; }
        public string eventName { get; set; }
        public uint congressNumber { get; set; }
        public uint sessionNumber { get; set; }
        public List<string> sessionDays { get; set; }
        public string streamingUrl { get; set; }
    }
}