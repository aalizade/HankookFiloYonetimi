using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class AracModeller : IEntity
    {
        [Key]
        public int AracModelID { get; set; }

        public int AracMarkaID { get; set; }

        public int AracKategoriID { get; set; }

        public string Ad { get; set; }

        public int Sira { get; set; }

        public int OlusturanId { get; set; }

        public DateTime OlusturmaTarihi { get; set; }

        public int DuzenleyenId { get; set; }

        public DateTime DuzenlemeTarihi { get; set; }

        public bool Aktif { get; set; }

        public bool ListeAktiflik { get; set; }
    }

}
