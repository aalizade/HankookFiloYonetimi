using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Lastik
{
    public class LastikEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Firma seçimi yapınız.")]
        public int FirmaID { get; set; }

        [Required(ErrorMessage = "Lütfen Kayıt Tarihi alanını doldurunuz.")]
        [DataType(DataType.Date)]
        public DateTime KayitTarihi { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Markası seçimi yapınız.")]
        public int LastikMarkaID { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Marka Desen seçimi yapınız.")]
        public int LastikMarkaDesenID { get; set; }

        [Required(ErrorMessage = "Lütfen Seri No giriniz.")]
        public string SeriNo { get; set; }

        public decimal Fiyat { get; set; }

        [Required(ErrorMessage = "Lütfen Ebat seçimi yapınız.")]
        public int EbatID { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Türü seçimi yapınız.")]
        public int LastikTurID { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Tipi seçimi yapınız.")]
        public int LastikTipID { get; set; }

        [Required(ErrorMessage = "Lütfen Diş Seviyesi giriniz.")]
        public decimal DisSeviyesi { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Kilometresini giriniz.")]
        public int LastikKilometre { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Konum seçimi yapınız.")]
        public int LastikKonumID { get; set; }
    }
}
