namespace ShiftSync.Api.DTOs
{
    public class CreateDriverDto
    {
        public string Name { get; set; } = "";
        public string Phone { get; set; } = "";
        public string? Email { get; set; }
        public string Region { get; set; } = "";
        public string? Password { get; set; }
    }
}
