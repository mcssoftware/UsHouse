using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using UsHouse.Models;
using UsHouse.Service;

namespace UsHouse.Controllers
{
    public class MembersController : AsyncController
    {
        private readonly LegislativeActivityService service;
        private readonly MemberInformationService mService;

        public UsStates State { get; set; }

        public MembersController() : this(new LegislativeActivityService(), new MemberInformationService())
        { }

        public MembersController(LegislativeActivityService clerkService, MemberInformationService memberService)
        {
            service = clerkService ?? throw new ArgumentNullException(nameof(clerkService));
            this.mService = memberService ?? throw new ArgumentNullException(nameof(memberService));
        }

        public ViewResult IndexAsync(uint page = 1, string keyword = "")
        {
            ViewBag.Page = page;
            ViewBag.Keyword = keyword;
            return View(service.GetSessionSummary());
        }

        public async Task<ActionResult> ViewMemberProfiles()
        {
            ViewMemberProfileModel model = new ViewMemberProfileModel()
            {
                Members = await GetAllMembers()
            };
            return PartialView(model);
        }

        public async Task<ActionResult> ViewMemberList()
        {
            ViewMemberProfileModel model = new ViewMemberProfileModel()
            {
                Members = await GetAllMembers()
            };
            return PartialView(model);
        }

        public async Task<ActionResult> ViewFindRepresentative()
        {
            ViewMemberProfileModel model = new ViewMemberProfileModel()
            {
                Members = await GetAllMembers()
            };
            return PartialView(model);
        }

        private async Task<List<Member>> GetAllMembers()
        {
            List<Member> memberList = new List<Member>();
            try
            {
                memberList = await mService.GetMembers();
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


        public async Task<ActionResult> ViewMemberDetails(string memberID, uint page = 1)
        {
            Member member = new Member();
            try
            {
                List<Member> pageMember = await mService.GetMemberById(memberID);
                member = pageMember.FirstOrDefault();
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
                SessionSummary = service.GetSessionSummary()
            };
            ViewBag.Page = page;
            return PartialView(model);
        }

        private async Task<List<Member>> GetLegislativeMembers()
        {
            List<Member> memberList = new List<Member>();
            memberList = await mService.GetMembers();

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