using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HFY.Entities.Concrete
{
    public class LastikMarkaDesenOzellikler : IEntity
    {
        [Key]
        public int LastikMarkaDesenOzellikID { get; set; }

        public int LastikMarkaDesenID { get; set; }
        public decimal DisDerinligi { get; set; }
        public byte KatOrani { get; set; }
        public int EbatID { get; set; }
        public int Sira { get; set; }
        public int OlusturanId { get; set; }

        public DateTime OlusturmaTarihi { get; set; }

        public int DuzenleyenId { get; set; }

        public DateTime DuzenlemeTarihi { get; set; }

        public bool Aktif { get; set; }

        public bool ListeAktiflik { get; set; }
    }
}
