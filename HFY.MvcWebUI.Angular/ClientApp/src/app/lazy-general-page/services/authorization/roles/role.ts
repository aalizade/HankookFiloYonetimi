export class Role {
    public static readonly Admin: string = "Admin";
    public static readonly Isletme: string = "Isletme"; // İşletme hesabı örneğin "Hankook" kendisi giremez, admin tarafından tanımlanan kullanıcılar vasıtasıyla giriş yapabilir.
    public static readonly IsletmeKullanicisi: string = "IsletmeKullanicisi";
    public static readonly Firma: string = "Firma"; // Firma hesabı örneğin "ERENLER TURİZM" kendisi giremez, admin tarafından tanımlanan kullanıcılar vasıtasıyla giriş yapabilir.
    public static readonly FirmaKullanicisi: string = "FirmaKullanicisi";
    public static readonly Sube: string = "Sube"; // Şube hesabı örneğin "ERENLER ALT BAYİ" kendisi giremez, admin tarafından tanımlanan kullanıcılar vasıtasıyla giriş yapabilir.
    public static readonly SubeKullanicisi: string = "SubeKullanicisi";
}
