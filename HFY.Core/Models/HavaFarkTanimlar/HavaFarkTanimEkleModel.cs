using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.HavaFarkTanimlar
{
    public class HavaFarkTanimEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Tanım bilgisi giriniz.")]
        public string Tanim { get; set; }

        [Required(ErrorMessage = "Lütfen Minimum yüzde bilgisi giriniz.")]
        public byte HavaFarkMinimumYuzde { get; set; }

        [Required(ErrorMessage = "Lütfen Maksimum yüzde bilgisi giriniz.")]
        public byte HavaFarkMaksimumYuzde { get; set; }

        [Required(ErrorMessage = "Lütfen Kayıp bilgisi giriniz.")]
        public decimal Kayip { get; set; }
    }
}
