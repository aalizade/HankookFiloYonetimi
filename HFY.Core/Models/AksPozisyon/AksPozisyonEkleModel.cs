using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class AksPozisyonEkleModel : FixedHelperModel
    {

        [Required(ErrorMessage = "Lütfen Ad alanını doldurunuz.")]
        [MaxLength(99, ErrorMessage = "Lütfen maksimum 100 karakter giriniz.")]
        public string Ad { get; set; }

        [Required(ErrorMessage = "Lütfen AksNo alanını doldurunuz.")]
        public int AksNo { get; set; }

        [Required(ErrorMessage = "Lütfen Pozisyon alanını doldurunuz.")]
        public byte Pozisyon { get; set; }

        [Required(ErrorMessage = "Lütfen Ön / Arka belirtiniz.")]
        public byte OnArkaId { get; set; }

        [Required(ErrorMessage = "Lütfen Sol / Sağ belirtiniz.")]
        public byte SolSagId { get; set; }

        [Required(ErrorMessage = "Lütfen İç / Dış belirtiniz.")]
        public byte IcDisId { get; set; }

        [Required(ErrorMessage = "Lütfen Çeker alanını doldurunuz.")]
        public byte Ceker { get; set; }

        [Required(ErrorMessage = "Lütfen Sıra alanını doldurunuz.")]
        public int Sira { get; set; }

        [Required(ErrorMessage = "Lütfen Liste Aktifliğini belirtiniz.")]
        public bool ListeAktiflik { get; set; }
    }
}
