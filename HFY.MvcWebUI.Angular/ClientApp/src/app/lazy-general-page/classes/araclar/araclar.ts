export class Araclar {
    AracID: number;
    Plaka: string;
    MarkaID: number;
    ModelID: number;
    FirmaID: number;
    Aks1:number;
    Aks2:number;
    Aks3:number;
    Aks4:number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableAraclar() {
        return [{ data: 'FirmaID' }, { data: 'Plaka' }, { data: 'MarkaID' }, { data: 'ModelID' }, { data: 'ModelID' }, // araç kategorisi
        { data: 'Aktif' } // İşlemler
        ]
    }
}
