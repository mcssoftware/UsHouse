using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace UsHouse.Service
{
    public static class StringExtentions
    {
        public static string AddOrdinal(this uint num)
        {
            switch (num % 100)
            {
                case 11:
                case 12:
                case 13:
                    return num + "th";
            }

            switch (num % 10)
            {
                case 1:
                    return num + "st";
                case 2:
                    return num + "nd";
                case 3:
                    return num + "rd";
                default:
                    return num + "th";
            }
        }

        public static string GetPlainText(this string htmlContent, int length = 0)
        {
            string htmlTag = "<.*?>";
            string plainText = Regex.Replace(htmlContent, htmlTag, string.Empty);
            return length > 0 && plainText.Length > length ? plainText.Substring(0, length) : plainText;
        }
    }
}

public class MyCustomDateProvider : IFormatProvider, ICustomFormatter
{
    public object GetFormat(Type formatType)
    {
        if (formatType == typeof(ICustomFormatter))
            return this;

        return null;
    }

    public string Format(string format, object arg, IFormatProvider formatProvider)
    {
        if (!(arg is DateTime)) throw new NotSupportedException();

        var dt = (DateTime)arg;

        string suffix;

        if (new[] { 11, 12, 13 }.Contains(dt.Day))
        {
            suffix = "th";
        }
        else if (dt.Day % 10 == 1)
        {
            suffix = "st";
        }
        else if (dt.Day % 10 == 2)
        {
            suffix = "nd";
        }
        else if (dt.Day % 10 == 3)
        {
            suffix = "rd";
        }
        else
        {
            suffix = "th";
        }
        return string.Format("{0:MMMM} {1}{2}, {0:yyyy}", arg, dt.Day, suffix);
    }
}