using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class AksDuzenEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Araç Kategorisi seçiniz.")]
        public int AracKategoriID { get; set; }

        [Required(ErrorMessage = "Lütfen Aks Pozisyonu seçiniz.")]
        public int AksPozisyonID { get; set; }
    }
}
