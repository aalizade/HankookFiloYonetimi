using System;
using System.ComponentModel.DataAnnotations;

namespace HFY.Core.Models.AracBakim
{
    public class AracBakimModel : FixedHelperModel
    {

        public int AracBakimID { get; set; }
        public int AracID { get; set; }
        public int LastikID { get; set; }
        public int AksPozisyonID { get; set; }


        // Bu kısmın alt tanımları, araç bakım sayfasında bazı kontroller için eklenmiştir. veritabanında bu haneler bulunmamaktadır.
        public bool DoluBos { get; set; }
        public string GeldigiYer { get; set; } // Örn; Depo
        public string BulunduguYer { get; set; }
        public string SeriNo { get; set; } // Aynı seri no iki kere girilemez.
        public int AracKilometre { get; set; } // Araç Kilometre Bilgisi
        public DateTime ServisTarihi { get; set; } // Servis Tarihi Bilgisi

    }
}
