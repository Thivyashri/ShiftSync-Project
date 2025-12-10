namespace ShiftSync.Api.DTOs
{
    public class DriverResetPasswordDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
