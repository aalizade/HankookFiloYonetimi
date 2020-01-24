export class Lastikler {
  LastikID: number;

  FirmaID: number;
  AracID: number;
  KayitTarihi: Date | string;
  LastikMarkaID: number;
  LastikMarkaDesenID: number;
  SeriNo: string;
  Fiyat: number;
  EbatID: number;
  LastikTurID: number;
  LastikTipID: number;
  DisSeviyesi: number;
  LastikKilometre: number;
  LastikKonumID: number;
  OlusturanId: number;
  OlusturmaTarihi: Date | string;
  DuzenleyenId: number;
  DuzenlemeTarihi: Date | string;
  Aktif: boolean;
  ListeAktiflik: boolean;

  jqueryDataTableLastikler() {
    return [{ data: 'FirmaID' }, { data: 'LastikMarkaID' }, { data: 'LastikMarkaDesenID' },
    { data: 'SeriNo' }, { data: 'EbatID' }, { data: 'LastikTipID' }, { data: 'LastikKilometre' }, { data: 'DisSeviyesi' }, { data: 'LastikKonumID' }, {data:'AracID'} , // plaka
    { data: 'Aktif' } // İşlemler
    ]
  }
}
