using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class AracBakimHareketler : IEntity
    {
        [Key]
        public int AracBakimHareketID { get; set; }


        public int AracBakimID { get; set; }
        public int AracID { get; set; }
        public int LastikID { get; set; }
        public int AksPozisyonID { get; set; }
        public string EkBilgi { get; set; }
        public string HareketTip { get; set; }
        public string Hareket { get; set; }
        public string HareketYonu { get; set; }
        public string YapilanIslem { get; set; }

        public string Aciklama { get; set; }
        public int OlusturanId { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
        public int DuzenleyenId { get; set; }
        public DateTime DuzenlemeTarihi { get; set; }
        public bool Aktif { get; set; }

    }
}
