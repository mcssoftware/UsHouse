using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsHouse.Models
{
    public class Member
    {
        public string _id { get; set; }
        public string active { get; set; }
        public string createDate { get; set; }
        public string updateDate { get; set; }
        public string editor { get; set; }
        public string status { get; set; }
        public string statusDate { get; set; }
        public string reviewer { get; set; }
        public string type { get; set; }
        public string bioGivenNames { get; set; }
        public string honorificPrefix { get; set; }
        public string givenName { get; set; }
        public string additionalName { get; set; }
        public string middleName { get; set; }
        public string familyName { get; set; }
        public string nickName { get; set; }
        public string displayLastName { get; set; }
        public string honorificSuffix { get; set; }
        public string officialName { get; set; }
        public string formalName { get; set; }
        public string sortName { get; set; }
        public string oathOfAccessDate { get; set; }
        public string oathOfOfficeDate { get; set; }
        public IEnumerable<MemberAddress> addresses { get; set; }
        public IEnumerable<string> jobTitle { get; set; }
        public IEnumerable<string> sameAs { get; set; }
        public string image { get; set; }
        public string url { get; set; }
        public string websiteUrl { get; set; }
        public string birthMonth { get; set; }
        public string birthDay { get; set; }
        public string birthYear { get; set; }
        public string birthCirca { get; set; }
        public string deathMonth { get; set; }
        public string deathDay { get; set; }
        public string deathYear { get; set; }
        public string deathCirca { get; set; }
        public IEnumerable<MemberRelatedTo> relatedTo { get; set; }
        public IEnumerable<MemberNonCongressionalPosition> nonCongressionalPositions { get; set; }
        public IEnumerable<MemberCongress> congresses { get; set; }
        public MemberPredecessor predecessor { get; set; }
    }

    public class MemberAddress
    {
        public string name { get; set; }
        public string addressType { get; set; }
        public string streetAddress { get; set; }
        public string addressLocality { get; set; }
        public string addressRegion { get; set; }
        public string postalCode { get; set; }
        public string telephone { get; set; }
    }

    public class MemberCaucusAffiliation
    {
        public string type { get; set; }
        public string name { get; set; }
        public string position { get; set; }
        public string startMonth { get; set; }
        public string startDay { get; set; }
        public string startYear { get; set; }
        public string startCirca { get; set; }
        public string endMonth { get; set; }
        public string endDay { get; set; }
        public string endYear { get; set; }
        public string endCirca { get; set; }
    }

    public class MemberCommitteeAssignment
    {
        public string committeeName { get; set; }
        public string committeeCode { get; set; }
        public IEnumerable<MemberLeadershipPosition> leadershipPositions { get; set; }
    }
    public class MemberSubCommitteeAssignment
    {
        public string subCommitteeName { get; set; }
        public string subCommitteeCode { get; set; }
        public IEnumerable<MemberLeadershipPosition> leadershipPositions { get; set; }
    }

    public class MemberCongress
    {
        public string type { get; set; }
        public string congressNum { get; set; }
        public string specialElection { get; set; }
        public string runOff { get; set; }
        public string position { get; set; }
        public string chamber { get; set; }
        public string stateCode { get; set; }
        public string stateDistrict { get; set; }
        public string ballotHonorificPrefix { get; set; }
        public string ballotGivenName { get; set; }
        public string ballotAdditionalName { get; set; }
        public string ballotFamilyName { get; set; }
        public string ballotHonorificSuffix { get; set; }
        public string ballotNickName { get; set; }
        public string officialHonorificPrefix { get; set; }
        public string officialGivenName { get; set; }
        public string officialAdditionalName { get; set; }
        public string officialFamilyName { get; set; }
        public string officialNickName { get; set; }
        public string officialHonorificSuffix { get; set; }
        public string duplicateName { get; set; }
        public List<string> otherNames { get; set; }
        public string electionMonth { get; set; }
        public string electionDay { get; set; }
        public string electionYear { get; set; }
        public string electionCirca { get; set; }
        public string swornMonth { get; set; }
        public string swornDay { get; set; }
        public string swornYear { get; set; }
        public string swornCirca { get; set; }
        public string startMonth { get; set; }
        public string startDay { get; set; }
        public string startYear { get; set; }
        public object startCirca { get; set; }
        public string departureMonth { get; set; }
        public string departureDay { get; set; }
        public string departureYear { get; set; }
        public string departureCirca { get; set; }
        public string departureReason { get; set; }
        public IEnumerable<MemberCommitteeAssignment> committeeAssignments { get; set; }
        public IEnumerable<MemberPartyAffiliation> partyAffiliations { get; set; }
        public IEnumerable<MemberCaucusAffiliation> caucusAffiliations { get; set; }
        public IEnumerable<MemberSubCommitteeAssignment> subCommitteeAssignments { get; set; }
    }

    public class MemberLeadershipPosition
    {
        public string jobTitle { get; set; }
        public string startMonth { get; set; }
        public string startDay { get; set; }
        public string startYear { get; set; }
        public string startCirca { get; set; }
        public string endMonth { get; set; }
        public string endDay { get; set; }
        public string endYear { get; set; }
        public string endCirca { get; set; }
    }

    public class MemberNonCongressionalPosition
    {
        public string jobTitle { get; set; }
        public string startMonth { get; set; }
        public string startDay { get; set; }
        public string startYear { get; set; }
        public string startCirca { get; set; }
        public string endMonth { get; set; }
        public string endDay { get; set; }
        public string endYear { get; set; }
        public string endCirca { get; set; }
    }

    public class MemberPartyAffiliation
    {
        public string type { get; set; }
        public string name { get; set; }
        public string startMonth { get; set; }
        public string startDay { get; set; }
        public string startYear { get; set; }
        public string startCirca { get; set; }
        public string endMonth { get; set; }
        public string endDay { get; set; }
        public string endYear { get; set; }
        public string endCirca { get; set; }
    }

    public class MemberRelatedTo
    {
        public string type { get; set; }
        public string usCongressBio { get; set; }
        public string relationship { get; set; }
    }

    public class MemberPredecessor
    {
        public string type { get; set; }
        public string usCongressBio { get; set; }
        public string givenName { get; set; }
        public string middleName { get; set; }
        public string familyName { get; set; }
        public string formalName { get; set; }
        public string sortName { get; set; }
        public string footnotes { get; set; }
        public MemberPredVacateDate predVacateDate { get; set; }
    }

    public class MemberPredVacateDate
    {
        public string date { get; set; }
        public string value { get; set; }
    }
}