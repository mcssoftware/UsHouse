using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using UsHouse.Models;

namespace UsHouse.Service
{
    public class MemberInformationService
    {
        internal List<Member> GetMembers(string path)
        {
            string text = System.IO.File.ReadAllText(path);
            return (new System.Web.Script.Serialization.JavaScriptSerializer()).Deserialize<List<Member>>(text);
        }

        internal Member GetMemberById(string path, string memberID)
        {
            var members = GetMembers(path);
            return members.FirstOrDefault(a => a._id == memberID);
        }
    }
}