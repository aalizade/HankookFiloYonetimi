using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.LastikMarka
{
    public class LastikOlcumEkleGozlemModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Lastik belirtiniz.")]
        public int LastikID { get; set; }

        public int AracID { get; set; } = 0;

        // Ölçümle kısmından bir lastik ölçümü girilirse ve ardından gözlem yapılmak istenirse bu input değeri dolu gelmelidir.
        public int LastikOlcumID { get; set; } = 0;

        public int LastikPozisyonID { get; set; } = 0;

        [Required(ErrorMessage = "Lütfen Gözlem bilgisi giriniz.")]
        public string GozlemJSON { get; set; }

        [Required(ErrorMessage = "Lütfen Araç Kilometre bilgisi giriniz.")]
        public int AracKilometre { get; set; }

        [Required(ErrorMessage = "Lütfen Servis Tarihi bilgisi giriniz.")]
        public DateTime ServisTarihi { get; set; }

    }
}
