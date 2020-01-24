export class LastikKonumlar {
    LastikKonumID: number;
    Kod: string;
    Ad: string;
    Sira: number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableLastikKonumlar() {
        return [{ data: 'Sira' }, { data: 'Ad' }, { data: 'Kod' },
        { data: 'Aktif' } // İşlemler
        ]
    }
}
