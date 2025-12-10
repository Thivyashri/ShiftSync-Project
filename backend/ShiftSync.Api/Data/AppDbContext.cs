using Microsoft.EntityFrameworkCore;
using ShiftSync.Api.Models;

namespace ShiftSync.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<Driver> Drivers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AdminUser>()
                .HasIndex(a => a.Username)
                .IsUnique();

            modelBuilder.Entity<AdminUser>()
                .HasIndex(a => a.Email)
                .IsUnique();

            modelBuilder.Entity<Driver>()
                .HasIndex(d => d.Phone)
                .IsUnique();

            modelBuilder.Entity<Driver>()
                .HasIndex(d => d.Email)
                .IsUnique();
        }
    }
}
