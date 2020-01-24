using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarka
{
    public class LastikOlcumEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Lastik belirtiniz.")]
        public int LastikID { get; set; }

        public int AracID { get; set; } = 0;

        [Required(ErrorMessage = "Lütfen Tarih bilgisi giriniz.")]
        public DateTime Tarih { get; set; }

        [Required(ErrorMessage = "Lütfen Araç Kilometre bilgisi giriniz.")]
        public int AracKilometre { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Kilometre bilgisi giriniz.")]
        public int LastikKilometre { get; set; }

        [Required(ErrorMessage = "Lütfen Diş Derinliği bilgisi giriniz.")]
        public string DisDerinligiJSON { get; set; }

        [Required(ErrorMessage = "Lütfen Güvenli Diş Seviyesi bilgisi giriniz.")]
        public byte GuvenliDisSeviyesi { get; set; }

        [Required(ErrorMessage = "Lütfen Basınç bilgisi giriniz.")]
        public byte Basinc { get; set; }

        public bool BasincAlinamadi { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Konum seçimi yapınız.")]
        public int LastikKonumID { get; set; }


        public int LastikPozisyonID { get; set; } = 0;

        public byte TavsiyeBasinc { get; set; } = 0;

        public string Plaka { get; set; } = "";

        public string GozlemJSON { get; set; }
        public bool GozlemYapildiMi { get; set; }

    }
}
