using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShiftSync.Api.Models
{
    [Table("drivers")]
    public class Driver
    {
        [Key]
        [Column("driver_id")]
        public int DriverId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Column("email")]
        public string? Email { get; set; }

        [Required]
        [Column("region")]
        public string Region { get; set; } = string.Empty;

        [Column("password_hash")]
        public string? PasswordHash { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
