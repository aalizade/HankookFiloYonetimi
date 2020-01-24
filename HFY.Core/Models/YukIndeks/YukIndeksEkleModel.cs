using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class YukIndeksEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Kod bilgisi giriniz.")]
        public string Kod { get; set; }

        [Required(ErrorMessage = "Lütfen Ad bilgisi giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }
    }
}
