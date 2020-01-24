export class Ebatlar {
  EbatID: number;
  Ad: string;
  Sira:number;
  OlusturanId: number;
  OlusturmaTarihi: Date | string;
  DuzenleyenId: number;
  DuzenlemeTarihi: Date | string;
  Aktif: boolean;
  ListeAktiflik: boolean;

  jqueryDataTableEbatlar() {
    return [ { data: 'Ad' },  { data: 'ListeAktiflik' }, { data: 'Sira' },
     { data: 'Aktif' }]
  }
}



