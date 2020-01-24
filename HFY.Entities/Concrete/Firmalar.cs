using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HFY.Entities.Concrete
{
    public class Firmalar: IEntity
    {
        [Key]
        public int FirmaID { get; set; }

        public string Rol { get; set; }
        public int BagliOlduguID { get; set; }
        public string FirmaAd { get; set; }
        public string FirmaKisaAd { get; set; }
        public string Sifre { get; set; }

        public string TelefonNumarasi { get; set; }
        public string SMSTelefonNumarasi { get; set; }
        public string GoogleMapsAdresi { get; set; }
        public string VergiTCNo { get; set; }
        public string FaturaAdresi { get; set; }
        public string Adres { get; set; }
        public string Eposta { get; set; }
        public string PsiBar { get; set; }
        public byte DisDerinligiSayisi { get; set; }
        public int ParaBirimID { get; set; }
        public DateTime? KayitTarihi { get; set; }

        public string KullaniciGorevi { get; set; }
        public string KullaniciKisaKod { get; set; }

        public string YetkiliKisi { get; set; }

        public int OlusturanId { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
        public int DuzenleyenId { get; set; }
        public DateTime DuzenlemeTarihi { get; set; }
        public DateTime? SonGirisTarihi { get; set; }
        public bool Aktif { get; set; }
        public bool ListeAktiflik { get; set; }
    }
}

