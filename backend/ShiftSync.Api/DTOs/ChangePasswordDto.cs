namespace ShiftSync.Api.DTOs
{
    public class ChangePasswordDto
    {
        public int DriverId { get; set; }
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}
