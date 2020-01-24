using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.Lastik
{
    public class LastikRotasyonaKopyalaModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Lastik ID belirtiniz.")]
        public int LastikID { get; set; }

        [Required(ErrorMessage = "Lütfen Tarih giriniz.")]
        public DateTime Tarih { get; set; }

        [Required(ErrorMessage = "Lütfen Seri No giriniz.")]
        public string SeriNo { get; set; }

        [Required(ErrorMessage = "Lütfen Lastik Pozisyon ID giriniz.")]
        public int LastikPozisyonID { get; set; }
    }
}
