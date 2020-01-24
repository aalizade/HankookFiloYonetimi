using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarkaDesen
{
    public class LastikMarkaDesenEkleModel : FixedHelperModel
    {

        [Required(ErrorMessage = "Lütfen Marka bilgisi belirtiniz.")]
        public int LastikMarkaID { get; set; }

        [Required(ErrorMessage = "Lütfen Ad bilgisi giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }
    }
}
