using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarka
{
    public class LastikMarkaGuncelleModel : FixedHelperModel
    {
        public int LastikMarkaID { get; set; }


        [Required(ErrorMessage = "Lütfen Kod bilgisi giriniz.")]
        public string Kod { get; set; }

        [Required(ErrorMessage = "Lütfen Ad bilgisi giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen Kaplama Marka durumunu belirtiniz.")]
        public bool KaplamaMarka { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }

        [Required(ErrorMessage = "Lütfen Liste Aktifliğini belirtiniz.")]
        public bool ListeAktiflik { get; set; }
    }
}