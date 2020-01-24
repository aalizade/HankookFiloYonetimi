using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class LastikHareketler : IEntity
    {
        [Key]
        public int LastikHareketID { get; set; }

        public int LastikID { get; set; }
        public int AracID { get; set; }
        public string HareketTip { get; set; }
        public string Hareket { get; set; }
        public string HareketYonu { get; set; }
        public string YapilanIslem { get; set; }

        public DateTime Tarih { get; set; }
        public int AracKilometre { get; set; }
        public int LastikKilometre { get; set; }
        public string DisDerinligiJSON { get; set; }
        public decimal GuvenliDisSeviyesi { get; set; }
        public byte Basinc { get; set; }
        public bool BasincAlinamadi { get; set; }
        public string EkBilgi { get; set; } // bir id bilgisi vermek ya da gerekli bir bilgiyi programa iletmek gibi kullanım amaçları olabilir. 15.08.2019
        public int LastikKonumID { get; set; }
        public int LastikPozisyonID { get; set; }
        public int LastikTipID { get; set; }
        public int LastikMarkaID { get; set; }
        public byte TavsiyeBasinc { get; set; }
        public string Plaka { get; set; }
        public string Aciklama { get; set; }
        public string GozlemJSON { get; set; }
        public int OlusturanId { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
        public int DuzenleyenId { get; set; }
        public DateTime DuzenlemeTarihi { get; set; }
        public bool Aktif { get; set; }
        public bool ListeAktiflik { get; set; }
    }
}
