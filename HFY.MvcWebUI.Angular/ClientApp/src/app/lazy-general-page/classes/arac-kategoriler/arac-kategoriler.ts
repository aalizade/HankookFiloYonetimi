export class AracKategoriler {
    AracKategoriID: number;

    Ad: string;

    AksSayisi:number;

    Sira: number;

    OlusturanId: number;

    OlusturmaTarihi: Date | string;

    DuzenleyenId: number;

    DuzenlemeTarihi: Date | string;

    Aktif: boolean;

    ListeAktiflik: boolean;

    jqueryDataTableAracKategoriler() {
        return [{ data: 'Sira' }, { data: 'Ad' }
            , { data: "Aktif" } // işlemler
        ]
    }
}
