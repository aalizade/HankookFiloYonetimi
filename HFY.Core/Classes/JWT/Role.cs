using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HFY.Core.Classes.JWT
{
    public static class Role
    {
        public const string Admin = "Admin";
        public const string _Isletme = "Isletme"; // İşletme hesabı örneğin "Hankook" kendisi giremez, admin tarafından tanımlanan kullanıcılar vasıtasıyla giriş yapabilir.
        public const string IsletmeKullanicisi = "IsletmeKullanicisi";
        public const string _Firma = "Firma"; // Firma hesabı örneğin "ERENLER TURİZM" kendisi giremez, admin tarafından tanımlanan kullanıcılar vasıtasıyla giriş yapabilir.
        public const string FirmaKullanicisi = "FirmaKullanicisi";
        public const string _Sube = "Sube"; // Şube hesabı örneğin "ERENLER ALT BAYİ" kendisi giremez, admin tarafından tanımlanan kullanıcılar vasıtasıyla giriş yapabilir.
        public const string SubeKullanicisi = "SubeKullanicisi";
    }
}
