export class HavaFarkTanimlar {
    HavaFarkID: number;

    Tanim: string;

    HavaFarkMinimumYuzde: number;

    HavaFarkMaksimumYuzde: number;

    Kayip: number;

    OlusturanId: number;

    OlusturmaTarihi: Date | string;

    DuzenleyenId: number;

    DuzenlemeTarihi: Date | string;

    Aktif: boolean;

    ListeAktiflik: boolean;

    jqueryDataTableHavaFarkTanimlar() {
        return [{ data: 'Tanim' }, { data: 'HavaFarkMinimumYuzde' }, { data: 'HavaFarkMaksimumYuzde' }, { data: 'Kayip' }, { data: 'ListeAktiflik' },
        { data: 'Aktif' } // İşlemler
        ]
    }
}
