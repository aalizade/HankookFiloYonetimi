export class LastikMarkalar {
    LastikMarkaID: number;
    Kod: string;
    Ad: string;
    KaplamaMarka: boolean;
    Sira: number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableLastikMarkalar() {
        return [{ data: 'Sira' }, { data: 'Kod' }, { data: 'Ad' }, { data: 'KaplamaMarka' }, { data: 'ListeAktiflik' },
        { data: 'Aktif' }]
    }
}
