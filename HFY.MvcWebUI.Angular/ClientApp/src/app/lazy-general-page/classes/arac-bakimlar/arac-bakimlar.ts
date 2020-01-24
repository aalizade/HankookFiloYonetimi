export class AracBakimlar {
    AracBakimID: number;
    AracID:number;
    LastikID: number;
    AksPozisyonID: number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;

    // Bu kısmın alt tanımları, araç bakım sayfasında bazı kontroller için eklenmiştir. veritabanında bu haneler bulunmamaktadır.
    DoluBos:boolean
    GeldigiYer:string; // Örn;Depo
    BulunduguYer:string;
    SeriNo:string // Aynı seri no iki kere girilemez.
    LastikTipID:number; // Lastiğin rengini bulmak için.
    AracKilometre:number // Araç kilometresini elde tutmak için.
    ServisTarihi:string; // Servis tarihini elde tutmak için.
}
