using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsHouse.Service
{
    public static class DateExtensions
    {
        public static string ToApiDate(this DateTime self)
        {
            return self.ToString("yyyyMMdd");
        }

        public static string ToFormatedDate(this DateTime self)
        {
            return self.ToString("yyyy-MM-dd");
        }

        public static DateTime StartOfWeek(this DateTime self)
        {
            return self.StartOfWeek(DayOfWeek.Monday);
        }

        public static DateTime StartOfWeek(this DateTime date, DayOfWeek startOfWeek)
        {
            int diff = date.DayOfWeek - startOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return date.AddDays(-1 * diff).Date;
        }

        public static DateTime ToEasternStandardTime(this DateTime self)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(self, TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"));
        }

        public static bool IsToday(this DateTime self)
        {
            return self.Date == DateTime.UtcNow.ToEasternStandardTime().Date;
        }
    }
}