using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Entities.Concrete;
using HFY.Core.Models.AracBakim;
using HFY.Core.Entities;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]
    public class AracBakimController : ControllerBase
    {
        IAracBakimlarService _aracBakimlarService;
        IAracBakimHareketlerService _aracBakimHareketlerService;
        IAraclarService _araclarService;
        IAksPozisyonService _aksPozisyonService;
        ILastiklerService _lastiklerService;
        ILastikHareketlerService _lastikHareketlerService;
        ILastikKonumlarService _lastikKonumlarService;
        IKullaniciYetkilerService _kullaniciYetkilerService;
        IFirmalarService _firmalarService;

        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AracBakimController(IAracBakimlarService aracBakimlarService, IAracBakimHareketlerService aracBakimHareketlerService, IAraclarService araclarService, IKullaniciYetkilerService kullaniciYetkilerService,
            IFirmalarService firmalarService,
            IAksPozisyonService aksPozisyonService, 
            ILastiklerService lastiklerService, ILastikHareketlerService lastikHareketlerService, ILastikKonumlarService lastikKonumlarService, IHttpContextAccessor httpContextAccessor)
        {
            _aracBakimlarService = aracBakimlarService;
            _aracBakimHareketlerService = aracBakimHareketlerService;
            _araclarService = araclarService;
            _aksPozisyonService = aksPozisyonService;
            _lastiklerService = lastiklerService;
            _lastikHareketlerService = lastikHareketlerService;
            _lastikKonumlarService = lastikKonumlarService;
            _kullaniciYetkilerService = kullaniciYetkilerService;
            _firmalarService = firmalarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }


        [HttpGet("AracBakimForAracID/{aracId}")]
        public ActionResult AracBakimForAracID(int aracId)
        {
            var aracBakimlars = _aracBakimlarService.GetAll(a => a.AracID == aracId && a.Aktif == true).ToList();
            return Ok(aracBakimlars);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult AracBakim(int id)
        {
            var value = _aracBakimlarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("AracBakimIslemleriKaydet")]
        public ActionResult AracBakimIslemleriKaydet(AracBakimModelWithKM model)
        {
            DateTime dt = DateTime.Now;
            foreach (var item in model.model)
            {
                for (int i = 0; i < item.Length; i++)
                {
                    if (item[i].AracBakimID != 0)
                    {
                        // kaydı güncelle
                        var aracBakimBul = _aracBakimlarService.GetByID(item[i].AracBakimID);

                        var lastikSonHareketBul = _lastikHareketlerService.GetAll(a => a.LastikID == aracBakimBul.LastikID && a.AracID == aracBakimBul.AracID && a.Aktif == true).OrderByDescending(a => a.LastikHareketID).FirstOrDefault();

                        int aracKilometreCopy = 0;
                        try
                        {
                            aracKilometreCopy = item[i].AracKilometre;
                        }
                        catch { }

                        if (item[i].BulunduguYer == "Hurdalık")
                        {
                            aracBakimBul.Aktif = false;
                            _aracBakimlarService.Update(aracBakimBul);

                            var aracBulucu = _araclarService.GetByID(item[i].AracID);

                            var aracBakimHareketEkle = new AracBakimHareketler
                            {
                                AracBakimID = aracBakimBul.AracBakimID,
                                HareketTip = LastikHareketTipler.ARACTAN_HURDAYA,
                                Hareket = LastikHareketTipler.ARAC,
                                HareketYonu = LastikHareketTipler.HURDA,
                                YapilanIslem = LastikHareketTipler.HURDA,
                                Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araçtan hurdaya taşındı.",
                                EkBilgi = "",
                                AksPozisyonID = item[i].AksPozisyonID,
                                Aktif = true,
                                AracID = item[i].AracID,
                                LastikID = item[i].LastikID,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };

                            _aracBakimHareketlerService.Add(aracBakimHareketEkle);

                            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                            var lastikBulucu = _lastiklerService.GetByID(item[i].LastikID);
                            lastikBulucu.LastikKonumID = hurdaKonumTipBulucu.LastikKonumID;
                            lastikBulucu.AracID = 0;
                            _lastiklerService.Update(lastikBulucu);

                            string hareketIslem = LastikHareketTipler.ARACTAN_HURDAYA;
                            string hareketIslemDetay = "Araç'tan Hurda'ya aktarıldı.";

                            var lastikHareketEkle = new LastikHareketler
                            {
                                Tarih = item[i].ServisTarihi,
                                Aciklama = hareketIslemDetay,
                                AracKilometre = aracKilometreCopy,
                                AracID = item[i].AracID, // Bu ID'li araçtan hurdaya aktarılmış olduğunu ifade eder.
                                Basinc = 0,
                                BasincAlinamadi = false,
                                DisDerinligiJSON = lastikSonHareketBul.DisDerinligiJSON,
                                GuvenliDisSeviyesi = 0,
                                LastikID = lastikBulucu.LastikID,
                                LastikKilometre = lastikBulucu.LastikKilometre,
                                LastikMarkaID = lastikBulucu.LastikMarkaID,
                                LastikPozisyonID = item[i].AksPozisyonID,
                                LastikTipID = lastikBulucu.LastikTipID,
                                LastikKonumID = lastikBulucu.LastikKonumID,
                                Plaka = aracBulucu.Plaka,
                                EkBilgi = hareketIslemDetay,
                                HareketTip = hareketIslem,
                                Hareket = LastikHareketTipler.ARAC,
                                HareketYonu = LastikHareketTipler.HURDA,
                                YapilanIslem = LastikHareketTipler.HURDA,
                                Aktif = true,
                                ListeAktiflik = true,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };
                            _lastikHareketlerService.Add(lastikHareketEkle);
                        }
                        else if (item[i].BulunduguYer == "Depoya Geldi")
                        {
                            aracBakimBul.Aktif = false;
                            _aracBakimlarService.Update(aracBakimBul);

                            var aracBulucu = _araclarService.GetByID(item[i].AracID);

                            var aracBakimHareketEkle = new AracBakimHareketler
                            {
                                AracBakimID = aracBakimBul.AracBakimID,
                                HareketTip = LastikHareketTipler.ARACTAN_DEPOYA,
                                Hareket = LastikHareketTipler.ARAC,
                                HareketYonu = LastikHareketTipler.DEPO,
                                YapilanIslem = LastikHareketTipler.SOKUM,
                                Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araçtan depoya taşındı.",
                                EkBilgi = "",
                                AksPozisyonID = item[i].AksPozisyonID,
                                Aktif = true,
                                AracID = item[i].AracID,
                                LastikID = item[i].LastikID,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };

                            _aracBakimHareketlerService.Add(aracBakimHareketEkle);

                            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");
                            var lastikBulucu = _lastiklerService.GetByID(item[i].LastikID);
                            lastikBulucu.LastikKonumID = hurdaKonumTipBulucu.LastikKonumID;
                            lastikBulucu.AracID = 0;
                            _lastiklerService.Update(lastikBulucu);

                            string hareketIslem = LastikHareketTipler.ARACTAN_DEPOYA;
                            string hareketIslemDetay = "Araç'tan Depo'ya taşındı.";

                            var lastikHareketEkle = new LastikHareketler
                            {
                                Tarih = item[i].ServisTarihi,
                                Aciklama = hareketIslemDetay,
                                AracKilometre = aracKilometreCopy,
                                AracID = item[i].AracID, // Bu ID'li araçtan depoya aktarılmış olduğunu ifade eder.
                                Basinc = lastikSonHareketBul.Basinc,
                                BasincAlinamadi = lastikSonHareketBul.BasincAlinamadi,
                                DisDerinligiJSON = lastikSonHareketBul.DisDerinligiJSON,
                                GuvenliDisSeviyesi = lastikSonHareketBul.GuvenliDisSeviyesi,
                                LastikID = lastikBulucu.LastikID,
                                LastikKilometre = lastikBulucu.LastikKilometre,
                                LastikMarkaID = lastikBulucu.LastikMarkaID,
                                LastikPozisyonID = aracBakimHareketEkle.AksPozisyonID,
                                LastikTipID = lastikBulucu.LastikTipID,
                                LastikKonumID = lastikBulucu.LastikKonumID,
                                Plaka = aracBulucu.Plaka,
                                EkBilgi = hareketIslemDetay,
                                HareketTip = hareketIslem,
                                Hareket = LastikHareketTipler.ARAC,
                                HareketYonu = LastikHareketTipler.DEPO,
                                YapilanIslem = LastikHareketTipler.SOKUM,
                                Aktif = true,
                                ListeAktiflik = true,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };
                            _lastikHareketlerService.Add(lastikHareketEkle);
                        }
                        else
                        {
                            if (item[i].AksPozisyonID != aracBakimBul.AksPozisyonID)
                            {
                                var oncekiAks = _aksPozisyonService.GetByID(aracBakimBul.AksPozisyonID);
                                var yeniAks = _aksPozisyonService.GetByID(item[i].AksPozisyonID);

                                aracBakimBul.AksPozisyonID = item[i].AksPozisyonID;
                                aracBakimBul.Aktif = true;
                                aracBakimBul.DuzenleyenId = _userJWTInfo.GetInfo().id;
                                aracBakimBul.DuzenlemeTarihi = dt;
                                _aracBakimlarService.Update(aracBakimBul);

                                var aracUstundeKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");
                                var lastikBulucu = _lastiklerService.GetByID(item[i].LastikID);
                                lastikBulucu.AracID = item[i].AracID;
                                lastikBulucu.LastikKonumID = aracUstundeKonumTipBulucu.LastikKonumID;
                                _lastiklerService.Update(lastikBulucu);

                                var aracBulucu = _araclarService.GetByID(item[i].AracID);

                                var aracBakimHareketEkle = new AracBakimHareketler
                                {
                                    AracBakimID = aracBakimBul.AracBakimID,
                                    HareketTip = LastikHareketTipler.ROTASYON,
                                    Hareket = LastikHareketTipler.ARAC,
                                    HareketYonu = LastikHareketTipler.ARAC,
                                    YapilanIslem = LastikHareketTipler.ROTASYON,
                                    Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araçta takılı ve rotasyon yapıldı. " + oncekiAks.Ad + " => " + yeniAks.Ad,
                                    EkBilgi = "",
                                    AksPozisyonID = item[i].AksPozisyonID,
                                    Aktif = true,
                                    AracID = item[i].AracID,
                                    LastikID = item[i].LastikID,
                                    OlusturanId = _userJWTInfo.GetInfo().id,
                                    OlusturmaTarihi = dt,
                                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                                    DuzenlemeTarihi = dt
                                };

                                _aracBakimHareketlerService.Add(aracBakimHareketEkle);

                                string hareketIslem = LastikHareketTipler.ROTASYON;
                                string hareketIslemDetay = "Lastik, " + aracBulucu.Plaka + " plakalı araçta takılı ve rotasyon yapıldı. " + oncekiAks.Ad + " => " + yeniAks.Ad;

                                var lastikHareketEkle = new LastikHareketler
                                {
                                    Tarih = item[i].ServisTarihi,
                                    Aciklama = hareketIslemDetay,
                                    AracKilometre = aracKilometreCopy,
                                    AracID = item[i].AracID, // Bu ID'li araçtan depoya aktarılmış olduğunu ifade eder.
                                    Basinc = lastikSonHareketBul.Basinc,
                                    BasincAlinamadi = lastikSonHareketBul.BasincAlinamadi,
                                    DisDerinligiJSON = lastikSonHareketBul.DisDerinligiJSON,
                                    GuvenliDisSeviyesi = lastikSonHareketBul.GuvenliDisSeviyesi,
                                    LastikID = lastikBulucu.LastikID,
                                    LastikKilometre = lastikBulucu.LastikKilometre,
                                    LastikMarkaID = lastikBulucu.LastikMarkaID,
                                    LastikPozisyonID = item[i].AksPozisyonID,
                                    LastikTipID = lastikBulucu.LastikTipID,
                                    LastikKonumID = lastikBulucu.LastikKonumID,
                                    Plaka = aracBulucu.Plaka,
                                    EkBilgi = hareketIslemDetay,
                                    HareketTip = hareketIslem,
                                    Hareket = LastikHareketTipler.ARAC,
                                    HareketYonu = LastikHareketTipler.ARAC,
                                    YapilanIslem = LastikHareketTipler.ROTASYON,
                                    Aktif = true,
                                    ListeAktiflik = true,
                                    OlusturanId = _userJWTInfo.GetInfo().id,
                                    OlusturmaTarihi = dt,
                                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                                    DuzenlemeTarihi = dt
                                };
                                _lastikHareketlerService.Add(lastikHareketEkle);

                            }
                        }
                    }
                    else
                    {
                        // Eğer lastik depodan bir lastiğe sürüklenip, kayıt edilmeden, depoya ya da hurdalığa tekrar sürüklenirse kayıt gerçekleşmemelidir. Bu if koşul ifadesiyle bunu engellemiş oluyoruz.
                        if (item[i].BulunduguYer != "Hurdalık" && item[i].BulunduguYer != "Depoya Geldi")
                        {
                            int aracKilometreCopy = 0;
                            try
                            {
                                aracKilometreCopy = item[i].AracKilometre;
                            }
                            catch { }
                            var lastikSonHareketBul = _lastikHareketlerService.GetAll(a => a.LastikID == item[i].LastikID && a.Aktif == true).OrderByDescending(a => a.LastikHareketID).FirstOrDefault();
                            // yeni kayıt
                            var aracBakimEkle = new AracBakimlar
                            {
                                AksPozisyonID = item[i].AksPozisyonID,
                                Aktif = true,
                                AracID = item[i].AracID,
                                LastikID = item[i].LastikID,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };

                            _aracBakimlarService.Add(aracBakimEkle);

                            var aracBulucu = _araclarService.GetByID(item[i].AracID);

                            var aracBakimHareketEkle = new AracBakimHareketler
                            {
                                AracBakimID = aracBakimEkle.AracBakimID,
                                HareketTip = LastikHareketTipler.DEPODAN_ARACA,
                                Hareket = LastikHareketTipler.DEPO,
                                HareketYonu = LastikHareketTipler.ARAC,
                                YapilanIslem = LastikHareketTipler.MONTAJ,
                                Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araca takıldı.",
                                EkBilgi = "",
                                AksPozisyonID = item[i].AksPozisyonID,
                                Aktif = true,
                                AracID = item[i].AracID,
                                LastikID = item[i].LastikID,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };

                            _aracBakimHareketlerService.Add(aracBakimHareketEkle);

                            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");
                            var lastikBulucu = _lastiklerService.GetByID(item[i].LastikID);
                            lastikBulucu.AracID = item[i].AracID;
                            lastikBulucu.LastikKonumID = hurdaKonumTipBulucu.LastikKonumID;
                            _lastiklerService.Update(lastikBulucu);

                            string hareketIslem = LastikHareketTipler.DEPODAN_ARACA;
                            string hareketIslemDetay = "Depo'dan Araca Takıldı";

                            var lastikHareketEkle = new LastikHareketler
                            {
                                Tarih = item[i].ServisTarihi,
                                Aciklama = hareketIslemDetay,
                                AracKilometre = aracKilometreCopy,
                                AracID = item[i].AracID,
                                Basinc = lastikSonHareketBul.Basinc,
                                BasincAlinamadi = lastikSonHareketBul.BasincAlinamadi,
                                DisDerinligiJSON = lastikSonHareketBul.DisDerinligiJSON,
                                GuvenliDisSeviyesi = lastikSonHareketBul.GuvenliDisSeviyesi,
                                LastikID = lastikBulucu.LastikID,
                                LastikKilometre = lastikBulucu.LastikKilometre,
                                LastikMarkaID = lastikBulucu.LastikMarkaID,
                                LastikPozisyonID = item[i].AksPozisyonID,
                                LastikTipID = lastikBulucu.LastikTipID,
                                LastikKonumID = lastikBulucu.LastikKonumID,
                                Plaka = aracBulucu.Plaka,
                                EkBilgi = hareketIslemDetay,
                                HareketTip = hareketIslem,
                                Hareket = LastikHareketTipler.DEPO,
                                HareketYonu = LastikHareketTipler.ARAC,
                                YapilanIslem = LastikHareketTipler.MONTAJ,
                                Aktif = true,
                                ListeAktiflik = true,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };
                            _lastikHareketlerService.Add(lastikHareketEkle);
                        }
                    }
                }
            }

            return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
        }

        public class AracBakimModelWithKM
        {
            public AracBakimModel[][] model { get; set; }
            //public int aracKilometre { get; set; }
        }

        // Bir lastiğin, araca hangi tarihte takıldığı bilgisini verir.
        [HttpGet("AracaTakilisTarihi/{lastikID}/{aracID}")]
        public ActionResult AracaTakilisTarihi(int lastikID, int aracID)
        {
            var lastikHareket = _lastikHareketlerService.Get(a => a.LastikID == lastikID && a.AracID == aracID && a.YapilanIslem == LastikHareketTipler.MONTAJ && a.Aktif == true);
            return Ok(new { AracaTakilisTarihi = lastikHareket == null ? "---" : lastikHareket.Tarih.ToString("dd.MM.yyyy") });
        }

        // Araç Bakım ekranında depodan lastik sürüklendiğinde ve karşımıza çıkan ekrana seri no girildiğinde, giriş yapmış kullanıcının o seri no'nun var olup olmadığı ve o kullanıcının gerekli iznini kontrol eder. Duruma göre bir yanıt döndürür.
        [HttpGet("SeriNoErisimDogrula/{seriNo}/{firmaId}")]
        public ActionResult SeriNoErisimDogrula(string seriNo, int firmaId)
        {
            if (string.IsNullOrEmpty(seriNo) || string.IsNullOrEmpty(firmaId.ToString()))
            {
                return Ok(new { Error = "Seri No ya da Firma boş değer olarak geldi." });
            }
            else
            {
                var lastik = _lastiklerService.Get(a => a.SeriNo == seriNo && a.FirmaID == firmaId && a.Aktif == true);
                if (lastik != null)
                {
                    if (lastik.AracID != 0)
                    {
                        return Ok(new { Error = "Bu Seri No'lu lastik bir araca takılı durumdadır." });
                    }
                    var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                    if (lastik.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                    {
                        return Ok(new { Error = "Bu Seri No'lu lastik hurda listesinde gözükmektedir." });
                    }
                    var aracBakimClass = new AracBakimlar
                    {
                        AksPozisyonID = 0,
                        Aktif = true,
                        AracID = lastik.AracID,
                        LastikID = lastik.LastikID,
                        AracBakimID = 0
                    };
                    if (_userJWTInfo.GetInfo().role == Role.Admin) return Ok(new { MessageType = 1, Result = aracBakimClass });
                    else
                    {
                        if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
                        {
                            var yetkiliOlduklariSubeler = new List<Firmalar>();
                            var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                            // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                            yetkiliOlduklariListe.AddRange(_kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma));
                            yetkiliOlduklariListe.Where(a=> a.YetkiTip == Role._Firma).ToList().ForEach(yetkiliItem =>
                            {
                                var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                                yetkiliOlduklariSubeler.AddRange(firmaninAltSubeleri);
                            });

                            if(lastik.OlusturanId == _userJWTInfo.GetInfo().id || yetkiliOlduklariListe.FirstOrDefault(a=> a.IlgiliID == lastik.FirmaID) != null || yetkiliOlduklariSubeler.FirstOrDefault(a=> a.FirmaID == lastik.FirmaID) != null)
                            {
                                return Ok(new { MessageType = 1, Result = aracBakimClass });
                            }
                        }
                        else
                        {
                            if (lastik.OlusturanId == _userJWTInfo.GetInfo().id)
                            {
                                return Ok(new { MessageType = 1, Result = aracBakimClass });
                            }
                        }
                    }

                    return Ok(new { Error = "Bu Seri No'lu lastiğe erişim izniniz bulunmamaktadır." });
                }
                else
                {
                    return Ok(new { Error = "Sistemde firmanın, bu Seri No ile eşleşen lastiği bulunmamaktadır." });
                }
            }
        }

        [HttpGet("AracaBagliAktifLastikler/{aracID}")]
        public ActionResult AracaBagliAktifLastikler(int aracID)
        {
            var aracaBagliAktifLastikler = _lastiklerService.GetAll(a => a.AracID == aracID && a.Aktif == true);
            return Ok(aracaBagliAktifLastikler);
        }

    }
}