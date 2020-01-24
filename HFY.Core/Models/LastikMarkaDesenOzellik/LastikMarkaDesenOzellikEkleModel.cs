using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarkaDesenOzellik
{
    public class LastikMarkaDesenOzellikEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Desen bilgisi belirtiniz.")]
        public int LastikMarkaDesenID { get; set; }

        public decimal DisDerinligi { get; set; } = 0;

        public byte KatOrani { get; set; } = 0;

        [Required(ErrorMessage = "Lütfen Ebat seçimi yapınız.")]
        public int EbatID { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }
    }
}
