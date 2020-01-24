export class AksDuzenler {
    AksDuzenID: number;
    AracKategoriID: number;
    AksPozisyonID: number;

    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

  jqueryDataTableAksDuzenler() {
    return [{ data: 'AksPozisyonID' }, { data: 'AksPozisyonID' }
    ,{data:"Aktif"} // işlemler
  ]
  }
}
