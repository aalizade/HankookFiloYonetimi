using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class AracModelEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Araç Markasını belirtiniz.")]
        public int AracMarkaID { get; set; }

        [Required(ErrorMessage = "Lütfen Araç Kategorisi seçiniz.")]
        public int AracKategoriID { get; set; }

        [Required(ErrorMessage = "Lütfen Ad alanını doldurunuz.")]
        [MaxLength(99, ErrorMessage = "Lütfen maksimum 100 karakter giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra alanını doldurunuz.")]
        public int Sira { get; set; }
        
    }
}
