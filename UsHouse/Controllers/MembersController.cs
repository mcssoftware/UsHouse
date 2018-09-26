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
    public class MembersController : Controller
    {
        private readonly LegislativeActivityService service;
        private readonly MemberInformationService mService;
        private readonly string memberpath;
        private readonly string sessionpath;

        public UsStates State { get; set; }

        public MembersController() : this(new LegislativeActivityService(), new MemberInformationService())
        { }

        public MembersController(LegislativeActivityService clerkService, MemberInformationService memberService)
        {
            memberpath = HostingEnvironment.MapPath("~/App_Data/members.json");
            sessionpath = HostingEnvironment.MapPath("~/App_Data/sessionsummary.json");
            service = clerkService ?? throw new ArgumentNullException(nameof(clerkService));
            this.mService = memberService ?? throw new ArgumentNullException(nameof(memberService));
        }

        public ActionResult Index(uint page = 1, string keyword = "")
        {
            ViewBag.Page = page;
            ViewBag.Keyword = keyword;
            return View(service.GetSessionSummary(sessionpath));
        }

        public ActionResult ViewMemberProfiles()
        {
            ViewMemberProfileModel model = new ViewMemberProfileModel()
            {
                Members = GetAllMembers()
            };
            return PartialView(model);
        }

        public ActionResult ViewMemberList()
        {
            ViewMemberProfileModel model = new ViewMemberProfileModel()
            {
                Members = GetAllMembers()
            };
            return PartialView(model);
        }

        public ActionResult ViewFindRepresentative()
        {
            ViewMemberProfileModel model = new ViewMemberProfileModel()
            {
                Members = GetAllMembers()
            };
            return PartialView(model);
        }

        private List<Member> GetAllMembers()
        {
            List<Member> memberList = new List<Member>();
            try
            {
                memberList = mService.GetMembers(memberpath);
            }
            catch (Exception ex)
            {
                memberList = null;
            }
            return memberList;
        }

        public ActionResult ViewLeadership()
        {
            return PartialView();
        }


        public ActionResult ViewMemberDetails(string memberID, uint page = 1)
        {
            Member member = new Member();
            try
            {
                member = mService.GetMemberById(memberpath, memberID);
                State = UsStates.ConvertCode(member.congresses.First().stateCode);
                member.congresses.First().stateCode = State.State + " (" + member.congresses.First().stateCode + ")";
            }
            catch (Exception ex)
            {
                member = null;
            }
            ViewMemberDetailModel model = new ViewMemberDetailModel()
            {
                Member = member,
                SessionSummary = service.GetSessionSummary(sessionpath)
            };
            ViewBag.Page = page;
            return PartialView(model);
        }

        private List<Member> GetLegislativeMembers()
        {
            List<Member> memberList = new List<Member>();
            memberList = mService.GetMembers(memberpath);

            foreach (var member in memberList)
            {
                if (string.Equals(member.active, "yes", StringComparison.InvariantCultureIgnoreCase))
                {
                    memberList.Add(member);
                }
                else
                {
                    var membercongress = member.congresses.FirstOrDefault();
                    if (membercongress != null)
                    {
                        var district = Convert.ToUInt32(new String(membercongress.stateDistrict.Where(char.IsDigit).ToArray())).AddOrdinal();
                        var usstate = UsStates.ConvertCode(member.congresses.First().stateCode);
                        if (usstate != null)
                        {
                            member.givenName = member.middleName = member.honorificSuffix = member._id = string.Empty;
                            member.officialName = member.familyName = $"Office of the {char.ToUpper(district[0]) + district.Substring(1)} Congressional District of {usstate.State}";
                            membercongress.partyAffiliations.First().name = " ";
                            memberList.Add(member);
                        }
                    }

                }
            }
            return memberList;
        }

        /// <summary>
        /// Function to return the current Congress and Session,
        /// currently static values are passed, later needs to be replaced by values from service 
        /// </summary>
        /// <returns></returns>
        public CurrentCongressInfo GetCurrentCongressInfo()
        {
            var congressessionCalc = (DateTime.Now.Year - 1789) / 2;
            return new CurrentCongressInfo
            {
                CurrentCongress = "115th",
                CurrentSession = "2nd"
            };
        }
    }
}