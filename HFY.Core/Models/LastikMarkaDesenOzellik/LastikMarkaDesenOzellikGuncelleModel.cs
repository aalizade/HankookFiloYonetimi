using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarkaDesenOzellik
{
    public class LastikMarkaDesenOzellikGuncelleModel : FixedHelperModel
    {
        public int LastikMarkaDesenOzellikID { get; set; }


        public decimal DisDerinligi { get; set; } = 0;

        public byte KatOrani { get; set; } = 0;

        [Required(ErrorMessage = "Lütfen Ebat seçimi yapınız.")]
        public int EbatID { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }

        [Required(ErrorMessage = "Lütfen Liste Aktifliğini belirtiniz.")]
        public bool ListeAktiflik { get; set; }
    }
}