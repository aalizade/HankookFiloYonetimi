using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class AksDuzenGuncelleModel : FixedHelperModel
    {
        public int AksDuzenID { get; set; }

        [Required(ErrorMessage = "Lütfen Araç Kategorisi seçiniz.")]
        public int AracKategoriID { get; set; }

        [Required(ErrorMessage = "Lütfen Aks Pozisyonu seçiniz.")]
        public int AksPozisyonID { get; set; }

        [Required(ErrorMessage = "Lütfen Liste Aktifliğini belirtiniz.")]
        public bool ListeAktiflik { get; set; }
    }
}