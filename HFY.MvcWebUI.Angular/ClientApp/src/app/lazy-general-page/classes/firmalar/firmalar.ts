export class Firmalar {
  FirmaID: number;

  Rol: string;
  BagliOlduguID: number;
  FirmaAd: string;
  FirmaKisaAd: string;
  TelefonNumarasi: string;
  SMSTelefonNumarasi: string;
  GoogleMapsAdresi: string;
  VergiTCNo: string;
  FaturaAdresi: string;
  Adres: string;
  Eposta: string;
  PsiBar:string;
  DisDerinligiSayisi:number;
  ParaBirimID:number;
  KayitTarihi: Date;
  KullaniciGorevi:string;
  KullaniciKisaKod:string;
  YetkiliKisi:string;
  OlusturanId: number;
  OlusturmaTarihi: Date | string;
  DuzenleyenId: number;
  DuzenlemeTarihi: Date | string;
  Aktif: boolean;
  ListeAktiflik: boolean;

  jqueryDataTableFirmalar() {
    return [{ data: 'YetkiliKisi' }, { data: 'BagliOlduguID' }, { data: 'FirmaAd' }, //{ data: 'FirmaKisaAd' },
    { data: 'Aktif' } // işlemler
    ]
  }

  jqueryDataTableIsletmeler() {
    return [{ data: 'VergiTCNo' }, { data: 'FirmaAd' }, //{ data: 'FirmaKisaAd' },
    { data: 'Aktif' } // işlemler
    ]
  }

  // Kullanıcı listesini çekerken bunu çağırıyoruz.
  jqueryDataTableKullanicilar() {
    return [{ data: 'FirmaAd' }, { data: 'FirmaKisaAd' }, { data: 'KullaniciGorevi' },
    { data: 'Aktif' } // işlemler
    ]
  }
}
