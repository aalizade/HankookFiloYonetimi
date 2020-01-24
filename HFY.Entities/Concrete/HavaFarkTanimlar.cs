using HFY.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HFY.Entities.Concrete
{
    public class HavaFarkTanimlar : IEntity
    {
        [Key]
        public int HavaFarkID { get; set; }

        public string Tanim { get; set; }

        public byte HavaFarkMinimumYuzde { get; set; }

        public byte HavaFarkMaksimumYuzde { get; set; }

        public decimal Kayip { get; set; }

        public int OlusturanId { get; set; }

        public DateTime OlusturmaTarihi { get; set; }

        public int DuzenleyenId { get; set; }

        public DateTime DuzenlemeTarihi { get; set; }

        public bool Aktif { get; set; }

        public bool ListeAktiflik { get; set; }
    }
}
