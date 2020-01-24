export class YukIndeksler {
    YukIndexID: number;
    Kod: string;
    Ad: string;
    Sira: number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableYukIndeksler() {
        return [{ data: 'Sira' },  {data:'Kod'}, { data: 'Ad' },
        { data: 'Aktif' } // İşlemler
    ]
    }
}
