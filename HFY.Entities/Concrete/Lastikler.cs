using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HFY.Entities.Concrete
{
    public class Lastikler : IEntity
    {
        [Key]
        public int LastikID { get; set; }


        public int FirmaID { get; set; }
        public int AracID { get; set; }
        public DateTime KayitTarihi { get; set; }
        public int LastikMarkaID { get; set; }
        public int LastikMarkaDesenID { get; set; }
        public string SeriNo { get; set; }
        public decimal Fiyat { get; set; }
        public int EbatID { get; set; }
        public int LastikTurID { get; set; }
        public int LastikTipID { get; set; }
        public decimal DisSeviyesi { get; set; }
        public int LastikKilometre { get; set; }
        public int LastikKonumID { get; set; }
        public int OlusturanId { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
        public int DuzenleyenId { get; set; }
        public DateTime DuzenlemeTarihi { get; set; }
        public bool Aktif { get; set; }
        public bool ListeAktiflik { get; set; }

    }
}
