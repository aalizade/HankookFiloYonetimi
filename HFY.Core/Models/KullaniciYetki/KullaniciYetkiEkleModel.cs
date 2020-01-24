using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.KullaniciYetki
{
    public class KullaniciYetkiEkleModel : FixedHelperModel
    {
        [Required(ErrorMessage = "Lütfen Firma seçimi yapınız.")]
        public int FirmaID { get; set; }

        [Required(ErrorMessage = "Lütfen Yetki Tip alanını doldurunuz.")]
        public string YetkiTip { get; set; }

        [Required(ErrorMessage = "Lütfen ilgili Kullanıcı seçimini yapınız.")]
        public int IlgiliID { get; set; }

    }
}
