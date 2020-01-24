using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.HavaFarkTanimlar
{
    public class HavaFarkTanimGuncelleModel : FixedHelperModel
    {
        public int HavaFarkID { get; set; }

        [Required(ErrorMessage = "Lütfen Tanım bilgisi giriniz.")]
        public string Tanim { get; set; }

        [Required(ErrorMessage = "Lütfen Minimum yüzde bilgisi giriniz.")]
        public byte HavaFarkMinimumYuzde { get; set; }

        [Required(ErrorMessage = "Lütfen Maksimum yüzde bilgisi giriniz.")]
        public byte HavaFarkMaksimumYuzde { get; set; }

        [Required(ErrorMessage = "Lütfen Kayıp bilgisi giriniz.")]
        public decimal Kayip { get; set; }

        [Required(ErrorMessage = "Lütfen Liste Aktifliğini belirtiniz.")]
        public bool ListeAktiflik { get; set; }
    }
}