using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class KullaniciYetkiler : IEntity
    {
        [Key]
        public int KullaniciYetkiID { get; set; }


        public int FirmaID { get; set; }

        public string YetkiTip { get; set; }

        public int IlgiliID { get; set; }

        public int OlusturanId { get; set; }

        public DateTime OlusturmaTarihi { get; set; }

        public int DuzenleyenId { get; set; }

        public DateTime DuzenlemeTarihi { get; set; }

        public bool Aktif { get; set; }

        public bool ListeAktiflik { get; set; }
    }
}
