export class LastikTipler {
    LastikTipID: number;
    Ad: string;
    Kod: string;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableLastikTipler() {
        return [{ data: 'LastikTipID' }, { data: 'Ad' }, { data: 'Kod' },
        { data: 'Aktif' } // İşlemler
        ]
    }
}
