using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsHouse.Models
{
    public class ViewMemberProfileModel
    {
        public List<Member> Members { get; set; }
    }

    public class ViewMemberDetailModel
    {
        public Member Member { get; set; }
        public SessionSummary SessionSummary { get; set; }
    }
}