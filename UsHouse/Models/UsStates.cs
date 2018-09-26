using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsHouse.Models
{
    public class UsStates
    {
        public string State { get; set; }
        public string Code { get; set; }
        public static UsStates ConvertCode(string stateCode)
        {
            return GetAllStates().Find(s => s.Code == stateCode);
        }
        public static List<UsStates> GetAllStates()
        {
            return new List<UsStates>
            {
            new UsStates { Code = "AL", State= "Alabama" },
            new UsStates { Code = "AK", State= "Alaska" },
            new UsStates { Code = "AS", State= "American Samoa" },
            new UsStates { Code = "AZ", State= "Arizona" },
            new UsStates { Code = "AR", State= "Arkansas" },
            new UsStates { Code = "CA", State= "California" },
            new UsStates { Code = "CO", State= "Colorado" },
            new UsStates { Code = "CT", State= "Connecticut" },
            new UsStates { Code = "DC", State= "District of Columbia" },
            new UsStates { Code = "DE", State= "Delaware" },
            new UsStates { Code = "FL", State= "Florida" },
            new UsStates { Code = "GA", State= "Georgia" },
            new UsStates { Code = "GU", State= "Guam" },
            new UsStates { Code = "HI", State= "Hawaii" },
            new UsStates { Code = "ID", State= "Idaho" },
            new UsStates { Code = "IL", State= "Illinois" },
            new UsStates { Code = "IN", State= "Indiana" },
            new UsStates { Code = "IA", State= "Iowa" },
            new UsStates { Code = "KS", State= "Kansas" },
            new UsStates { Code = "KY", State= "Kentucky" },
            new UsStates { Code = "LA", State= "Louisiana" },
            new UsStates { Code = "ME", State= "Maine" },
            new UsStates { Code = "MD", State= "Maryland" },
            new UsStates { Code = "MA", State= "Massachusetts" },
            new UsStates { Code = "MI", State= "Michigan" },
            new UsStates { Code = "MN", State= "Minnesota" },
            new UsStates { Code = "MS", State= "Mississippi" },
            new UsStates { Code = "MO", State= "Missouri" },
            new UsStates { Code = "MT", State= "Montana" },
            new UsStates { Code = "NE", State= "Nebraska" },
            new UsStates { Code = "NV", State= "Nevada" },
            new UsStates { Code = "NH", State= "New Hampshire" },
            new UsStates { Code = "NJ", State= "New Jersey" },
            new UsStates { Code = "NM", State= "New Mexico" },
            new UsStates { Code = "NY", State= "New York" },
            new UsStates { Code = "NC", State= "North Carolina" },
            new UsStates { Code = "ND", State= "North Dakota" },
            new UsStates { Code = "MP", State= "Northern Mariana Islands" },
            new UsStates { Code = "OH", State= "Ohio" },
            new UsStates { Code = "OK", State= "Oklahoma" },
            new UsStates { Code = "OR", State= "Oregon" },
            new UsStates { Code = "PA", State= "Pennsylvania" },
            new UsStates { Code = "PR", State= "Puerto Rico" },
            new UsStates { Code = "RI", State= "Rhode Island" },
            new UsStates { Code = "SC", State= "South Carolina" },
            new UsStates { Code = "SD", State= "South Dakota" },
            new UsStates { Code = "TN", State= "Tennessee" },
            new UsStates { Code = "TX", State= "Texas" },
            new UsStates { Code = "UT", State= "Utah" },
            new UsStates { Code = "VT", State= "Vermont" },
            new UsStates { Code = "VI", State= "Virgin Islands" },
            new UsStates { Code = "VA", State= "Virginia" },
            new UsStates { Code = "WA", State= "Washington" },
            new UsStates { Code = "WV", State= "West Virginia" },
            new UsStates { Code = "WI", State= "Wisconsin" },
            new UsStates { Code = "WY", State= "Wyoming" }
            };
        }
    }
}