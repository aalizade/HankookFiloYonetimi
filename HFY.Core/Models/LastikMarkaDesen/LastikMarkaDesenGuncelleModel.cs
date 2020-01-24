using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarkaDesen
{
    public class LastikMarkaDesenGuncelleModel : FixedHelperModel
    {
        public int LastikMarkaDesenID { get; set; }


        [Required(ErrorMessage = "Lütfen Ad bilgisi giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra bilgisi giriniz.")]
        public int Sira { get; set; }

        [Required(ErrorMessage = "Lütfen Liste Aktifliğini belirtiniz.")]
        public bool ListeAktiflik { get; set; }
    }
}