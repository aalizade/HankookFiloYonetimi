using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class LastikOlcumler : IEntity
    {
        [Key]
        public int LastikOlcumID { get; set; }

        public int LastikID { get; set; }
        public int AracID { get; set; }
        public DateTime Tarih { get; set; }
        public int AracKilometre { get; set; }
        public int LastikKilometre { get; set; }
        public string DisDerinligiJSON { get; set; }
        public decimal GuvenliDisSeviyesi { get; set; }
        public byte Basinc { get; set; }
        public bool BasincAlinamadi { get; set; }
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
