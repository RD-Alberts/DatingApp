using Microsoft.IdentityModel.Protocols;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
       public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;

            if (dob.Date > today.AddYears(-age)) age--;
            return age;
        }

        public static DateTime? SetKindUtc(this DateTime? dateTime)
        {
            if (dateTime.HasValue)
            {
                return dateTime.Value.SetKindUtc();
            }
            else
            {
                return null;
            }
        }
        public static DateTime SetKindUtc(this DateTime dateTime)
        {
            if (dateTime.Kind == DateTimeKind.Utc) { return dateTime; }
            return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }
    }
}