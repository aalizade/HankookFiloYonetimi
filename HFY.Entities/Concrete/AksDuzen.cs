using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class AksDuzen : IEntity
    {
        [Key]
        public int AksDuzenID { get; set; }

        public int AracKategoriID { get; set; }

        public int AksPozisyonID { get; set; }

        public int OlusturanId { get; set; }

        public DateTime OlusturmaTarihi { get; set; }

        public int DuzenleyenId { get; set; }

        public DateTime DuzenlemeTarihi { get; set; }

        public bool Aktif { get; set; }

        public bool ListeAktiflik { get; set; }
    }
}
