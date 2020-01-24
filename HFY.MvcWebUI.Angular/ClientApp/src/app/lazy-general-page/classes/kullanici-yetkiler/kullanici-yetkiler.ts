export class KullaniciYetkiler {
    KullaniciYetkiID: number;


    FirmaID: number;

    YetkiTip: string;

    IlgiliID: number;

    OlusturanId: number;

    OlusturmaTarihi: Date | string;

    DuzenleyenId: number;

    DuzenlemeTarihi: Date | string;

    Aktif: boolean;

    ListeAktiflik: boolean;

    jqueryDataTableKullaniciYetkiler() {
        return [{ data: 'FirmaID' }, { data: 'FirmaID' },
        { data: 'Aktif' } // İşlemler
        ]
    }
}
