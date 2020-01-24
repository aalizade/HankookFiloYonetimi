export class LastikMarkaDesenler{
    LastikMarkaDesenID: number;

    LastikMarkaID: number;
    Ad: string;
    Sira: number;
    OlusturanId: number;

    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableLastikMarkaDesenler() {
        return [{ data: 'Sira' }, { data: 'Ad' }, { data: 'Ad' }, // Ozellik Sayısı
        { data: 'Aktif' }]
    }
}
