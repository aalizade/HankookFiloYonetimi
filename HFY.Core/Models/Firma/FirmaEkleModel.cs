using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Firma
{
    public class FirmaEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Rol seçiniz.")]
        public string Rol { get; set; }

        public int BagliOlduguID { get; set; } = 0;

        [Required(ErrorMessage = "Lütfen Firma Ad alanını doldurunuz.")]
        [MaxLength(90, ErrorMessage = "Lütfen maksimum 90 karakter giriniz.")]
        public string FirmaAd { get; set; }

        [Required(ErrorMessage = "Lütfen Firma Kısa Ad alanını doldurunuz.")]
        [MaxLength(45, ErrorMessage = "Lütfen maksimum 45 karakter giriniz.")]
        public string FirmaKisaAd { get; set; }

        [Required(ErrorMessage = "Lütfen Şifre alanını doldurunuz.")]
        [MaxLength(25, ErrorMessage = "Lütfen maksimum 25 karakter giriniz.")]
        public string Sifre { get; set; }

        [Required(ErrorMessage = "Lütfen Telefon Numarası alanını doldurunuz.")]
        [MaxLength(45, ErrorMessage = "Lütfen maksimum 45 karakter giriniz.")]
        public string TelefonNumarasi { get; set; }

        [Required(ErrorMessage = "Lütfen Vergi/TC.No alanını doldurunuz.")]
        [MaxLength(45, ErrorMessage = "Lütfen maksimum 45 karakter giriniz.")]
        public string VergiTCNo { get; set; }

        [MaxLength(230, ErrorMessage = "Lütfen maksimum 230 karakter giriniz.")]
        public string FaturaAdresi { get; set; }
        [MaxLength(230, ErrorMessage = "Lütfen maksimum 230 karakter giriniz.")]
        public string Adres { get; set; }

        [MaxLength(45, ErrorMessage = "Lütfen maksimum 45 karakter giriniz.")]
        public string Eposta { get; set; }

        [Required(ErrorMessage = "Lütfen Psi/Bar alanını doldurunuz.")]
        [MaxLength(5, ErrorMessage = "Lütfen maksimum 5 karakter giriniz.")]
        public string PsiBar { get; set; }

        [Required(ErrorMessage = "Lütfen Diş Derinliği Sayısı alanını doldurunuz.")]
        public byte DisDerinligiSayisi { get; set; }

        [Required(ErrorMessage = "Lütfen Para Birim alanını doldurunuz.")]
        public int ParaBirimID { get; set; }

        [Required(ErrorMessage = "Lütfen Kayıt Tarihi alanını doldurunuz.")]
        [DataType(DataType.Date)]
        public DateTime KayitTarihi { get; set; }

        [MaxLength(50, ErrorMessage = "Lütfen maksimum 50 karakter giriniz.")]
        public string KullaniciGorevi { get; set; }

        [MaxLength(50, ErrorMessage = "Lütfen maksimum 50 karakter giriniz.")]
        public string KullaniciKisaKod { get; set; }

        [MaxLength(50, ErrorMessage = "Lütfen maksimum 50 karakter giriniz.")]
        public string YetkiliKisi { get; set; }
    }
}
