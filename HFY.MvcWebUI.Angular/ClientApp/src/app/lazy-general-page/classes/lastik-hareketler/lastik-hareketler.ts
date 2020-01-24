export class LastikHareketler {
    LastikHareketID: number;

    LastikID: number;
    AracID: number;
    HareketTip: string;
    Hareket: string;
    HareketYonu: string;
    YapilanIslem: string;
    Tarih: Date | string;
    AracKilometre: number;
    LastikKilometre: number;
    DisDerinligiJSON: string;
    GuvenliDisSeviyesi: number;
    Basinc: number;
    BasincAlinamadi: boolean;
    EkBilgi: string;
    LastikKonumID: number;
    LastikPozisyonID: number;
    LastikTipID: number;
    LastikMarkaID: number;
    TavsiyeBasinc: number;
    Plaka: string;
    Aciklama: string;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableLastikHareketler() {
        return [
            { data: 'Tarih' },
            { data: 'Hareket' }, // Hareket
            { data: 'HareketYonu' }, // Hareket Yönü
            { data: 'YapilanIslem' }, // Yapılan
            { data: 'LastikOlcumID' }, // Güncel Diş Derinliği
            { data: 'Basinc' },
            // { data: 'LastikOlcumID' }, // 1mm Çalışma // Hankook'da Gizlendi.
            // { data: 'LastikOlcumID' }, // Gercek Saat Maliyeti // Hankook'da Gizlendi.
            { data: 'LastikKilometre' }, // Guncel Performans // Lastik Kilometre olarak değiştirildi.
            { data: 'AracKilometre' },
            { data: 'Plaka' },
            { data: 'LastikPozisyonID' },
            
            // { data: 'Aciklama' },
            { data: 'OlusturanId' },
            { data: 'OlusturmaTarihi' },

            { data: 'Aktif' } // İşlemler
        ]
    }

}
