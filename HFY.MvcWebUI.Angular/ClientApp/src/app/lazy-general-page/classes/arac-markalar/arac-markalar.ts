export class AracMarkalar {
    AracMarkaID: number;

    Ad: string;

    Sira: number;

    OlusturanId: number;

    OlusturmaTarihi: Date | string;

    DuzenleyenId: number;

    DuzenlemeTarihi: Date | string;

    Aktif: boolean;

    ListeAktiflik: boolean;

    jqueryDataTableAracMarkalar() {
        return [{ data: 'Sira' }, { data: 'Ad' }
            , { data: "Aktif" } // işlemler
        ]
    }
}
