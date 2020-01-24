using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class AracEkleModel : FixedHelperModel
    {

        [Required(ErrorMessage = "Lütfen Plaka alanını doldurunuz.")]
        [MaxLength(49, ErrorMessage = "Lütfen maksimum 50 karakter giriniz.")]
        public string Plaka { get; set; }

        [Required(ErrorMessage = "Lütfen Araç markası seçiniz.")]
        public int MarkaID { get; set; }

        [Required(ErrorMessage = "Lütfen Araç modeli seçiniz.")]
        public int ModelID { get; set; }

        [Required(ErrorMessage = "Lütfen Firma seçiniz.")]
        public int FirmaID { get; set; }

        public byte Aks1 { get; set; } = 0;

        public byte Aks2 { get; set; } = 0;

        public byte Aks3 { get; set; } = 0;

        public byte Aks4 { get; set; } = 0;

    }
}
