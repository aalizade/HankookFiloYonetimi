export class AracModeller{
    AracModelID: number;
    AracMarkaID: number;
    AracKategoriID:number;
    Ad: string;
    Sira: number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableAracModeller() {
        return [{ data: 'Sira' }, { data: 'Ad' }
        , { data: "Aktif" } // Kategori
            , { data: "Aktif" } // işlemler
        ]
    }
}