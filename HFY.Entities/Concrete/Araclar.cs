using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class Araclar : IEntity
    {
        [Key]
        public int AracID { get; set; }

        public string Plaka { get; set; }

        public int MarkaID { get; set; }

        public int ModelID { get; set; }

        public int FirmaID { get; set; }

        public byte Aks1 { get; set; }

        public byte Aks2 { get; set; }

        public byte Aks3 { get; set; }

        public byte Aks4 { get; set; }

        public int OlusturanId { get; set; }

        public DateTime OlusturmaTarihi { get; set; }

        public int DuzenleyenId { get; set; }

        public DateTime DuzenlemeTarihi { get; set; }

        public bool Aktif { get; set; }

        public bool ListeAktiflik { get; set; }
    }
}
