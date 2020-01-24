export class AksPozisyonlar {
    AksPozisyonID: number;
    Ad: string;
    AksNo: number;
    Pozisyon: number;
    OnArkaId: number;
    SolSagId: number;
    IcDisId: number;
    Ceker: number;
    Sira: number;

    OlusturanId: number;
    OlusturmaTarihi: Date | string;
    DuzenleyenId: number;
    DuzenlemeTarihi: Date | string;
    Aktif: boolean;
    ListeAktiflik: boolean;

  jqueryDataTableAksPozisyonlar() {
    return [{ data: 'Sira' }, { data: 'Ad' }, {data:"AksNo"},{data:"Pozisyon"},{data:"OnArkaId"},{data:"SolSagId"},{data:"IcDisId"},{data:"Ceker"}
    ,{data:"Aktif"} // işlemler
  ]
  }
}
