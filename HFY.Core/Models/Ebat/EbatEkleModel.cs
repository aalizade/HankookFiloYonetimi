using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Ebat
{
    public class EbatEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Ad bilgisi giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }
    }
}
