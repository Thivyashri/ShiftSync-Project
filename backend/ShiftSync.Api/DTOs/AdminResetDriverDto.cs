namespace ShiftSync.Api.DTOs
{
    public class AdminResetDriverDto
    {
        public int DriverId { get; set; }
        public string? NewPassword { get; set; }
    }
}
