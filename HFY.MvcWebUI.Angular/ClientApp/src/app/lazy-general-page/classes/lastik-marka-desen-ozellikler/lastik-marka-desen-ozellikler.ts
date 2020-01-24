export class LastikMarkaDesenOzellikler {
    LastikMarkaDesenOzellikID: number;

    LastikMarkaDesenID: number;
    DisDerinligi: number;
    KatOrani: number;
    EbatID:number;
    Sira: number;
    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

    jqueryDataTableLastikMarkaDesenOzellikler() {
        return [ { data: 'DisDerinligi' }, { data: 'KatOrani' }, { data: 'Sira' }, { data: 'EbatID' },
        { data: 'Aktif' }]
    }
}
