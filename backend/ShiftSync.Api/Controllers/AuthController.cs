using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ShiftSync.Api.Data;
using ShiftSync.Api.DTOs;
using ShiftSync.Api.Models;
using ShiftSync.Api.Utils;


namespace ShiftSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Try admin first (username OR email)
            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(a => a.Username == dto.Username || a.Email == dto.Username);

            if (admin != null && PasswordHasher.VerifyPassword(dto.Password, admin.PasswordHash))
            {
                var token = GenerateToken(admin.AdminId.ToString(), admin.Username, admin.Role);
                admin.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new LoginResponseDto
                {
                    Token = token,
                    ExpiresIn = Convert.ToInt32(_config["Jwt:ExpireMinutes"] ?? "1440"),
                    User = new UserDto
                    {
                        Id = admin.AdminId,
                        Name = admin.FullName ?? admin.Username,
                        Role = admin.Role,
                        Email = admin.Email ?? ""
                    }
                });
            }

            // Then try driver (phone OR email)
            var driver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.Phone == dto.Username || d.Email == dto.Username);

            if (driver != null && !string.IsNullOrEmpty(driver.PasswordHash) &&
                PasswordHasher.VerifyPassword(dto.Password, driver.PasswordHash))
            {
                var token = GenerateToken(driver.DriverId.ToString(), driver.Name, "DRIVER");

                return Ok(new LoginResponseDto
                {
                    Token = token,
                    ExpiresIn = Convert.ToInt32(_config["Jwt:ExpireMinutes"] ?? "1440"),
                    User = new UserDto
                    {
                        Id = driver.DriverId,
                        Name = driver.Name,
                        Role = "DRIVER",
                        Email = driver.Email ?? ""
                    }
                });
            }

            return Unauthorized(new { message = "Invalid credentials" });
        }

        // --- Dev helper: seed admin (dev only) ---
        [HttpPost("seed-admin")]
        public async Task<IActionResult> SeedAdmin([FromBody] SeedAdminDto dto)
        {
            if (await _context.AdminUsers.AnyAsync(a => a.Username == dto.Username || a.Email == dto.Email))
                return BadRequest(new { message = "Admin already exists" });

            var admin = new AdminUser
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                FullName = dto.FullName ?? dto.Username,
                Role = dto.Role ?? "ADMIN",
                CreatedAt = DateTime.UtcNow
            };

            _context.AdminUsers.Add(admin);
            await _context.SaveChangesAsync();
            return Ok(new { admin.AdminId });
        }

        // Admin creates driver (admin provides initial default password)
        [HttpPost("create-driver")]
        public async Task<IActionResult> CreateDriver([FromBody] CreateDriverDto dto)
        {
            if (await _context.Drivers.AnyAsync(d => d.Phone == dto.Phone))
                return BadRequest(new { message = "Phone already exists" });

            var driver = new Driver
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                Region = dto.Region,
                PasswordHash = PasswordHasher.HashPassword(dto.Password ?? "Driver@123"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            return Ok(new { driver.DriverId });
        }

        // Driver changes own password (requires old password)
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var driver = await _context.Drivers.FindAsync(dto.DriverId);
            if (driver == null) return NotFound(new { message = "Driver not found" });

            if (string.IsNullOrEmpty(driver.PasswordHash) || !PasswordHasher.VerifyPassword(dto.OldPassword, driver.PasswordHash))
                return BadRequest(new { message = "Invalid old password" });

            driver.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
            driver.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed" });
        }

        // Admin resets driver password (emergency)
        [HttpPost("admin-reset-driver-password")]
        public async Task<IActionResult> AdminResetDriver([FromBody] AdminResetDriverDto dto)
        {
            var driver = await _context.Drivers.FindAsync(dto.DriverId);
            if (driver == null) return NotFound(new { message = "Driver not found" });

            driver.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword ?? "Driver@123");
            driver.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Driver password reset" });
        }

        private string GenerateToken(string id, string name, string role)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Role, role)
            };
            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [HttpPost("driver-reset-password")]
        public async Task<IActionResult> DriverResetPassword([FromBody] DriverResetPasswordDto dto)
{
    // Get user ID from JWT
    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null)
        return Unauthorized(new { message = "Invalid token" });

    int driverId = int.Parse(userIdClaim.Value);

    var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.DriverId == driverId);
    if (driver == null)
        return NotFound(new { message = "Driver not found" });

    // Verify old password
    if (!PasswordHasher.VerifyPassword(dto.OldPassword, driver.PasswordHash!))
        return BadRequest(new { message = "Incorrect current password" });

    // Set new password
    driver.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
    driver.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Password updated successfully" });
}

    }
}
