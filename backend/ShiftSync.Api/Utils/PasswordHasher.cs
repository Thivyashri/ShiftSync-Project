using System.Security.Cryptography;

namespace ShiftSync.Api.Utils
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16; 
        private const int KeySize = 32;
        private const int Iterations = 100_000;

        public static string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[SaltSize];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            var key = pbkdf2.GetBytes(KeySize);

            return $"{Iterations}:{Convert.ToBase64String(salt)}:{Convert.ToBase64String(key)}";
        }

        public static bool VerifyPassword(string password, string stored)
        {
            var parts = stored.Split(':');
            if (parts.Length != 3) return false;

            var iterations = int.Parse(parts[0]);
            var salt = Convert.FromBase64String(parts[1]);
            var storedKey = Convert.FromBase64String(parts[2]);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
            var computedKey = pbkdf2.GetBytes(storedKey.Length);

            return CryptographicOperations.FixedTimeEquals(storedKey, computedKey);
        }
    }
}
