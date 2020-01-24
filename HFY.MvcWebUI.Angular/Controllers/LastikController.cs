using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Core.Models.LastikMarka;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using HFY.Entities.Concrete;
using HFY.Core.Models.Lastik;
using HFY.Core.Entities;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]
    public class LastikController : ControllerBase
    {
        ILastiklerService _lastikService;
        ILastikHareketlerService _lastikHareketlerService;
        ILastikKonumlarService _lastikKonumlarService;
        IAraclarService _araclarService;
        IAracBakimlarService _aracBakimlarService;
        IAracBakimHareketlerService _aracBakimHareketlerService;
        IFirmalarService _firmalarService;
        IKullaniciYetkilerService _kullaniciYetkilerService;
        ILastikMarkalarService _lastikMarkalarService;
        ILastikMarkaDesenlerService _lastikMarkaDesenlerService;
        IEbatlarService _ebatlarService;
        ILastikTiplerService _lastikTiplerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikController(ILastiklerService lastikService, ILastikHareketlerService lastikHareketlerService, ILastikKonumlarService lastikKonumlarService,
            IAraclarService araclarService, IAracBakimlarService aracBakimlarService, IAracBakimHareketlerService aracBakimHareketlerService, IFirmalarService firmalarService, IKullaniciYetkilerService kullaniciYetkilerService,
            ILastikMarkalarService lastikMarkalarService, ILastikMarkaDesenlerService lastikMarkaDesenlerService, IEbatlarService ebatlarService, ILastikTiplerService lastikTiplerService,
        IHttpContextAccessor httpContextAccessor)
        {
            _lastikService = lastikService;
            _lastikHareketlerService = lastikHareketlerService;
            _lastikKonumlarService = lastikKonumlarService;
            _araclarService = araclarService;
            _aracBakimlarService = aracBakimlarService;
            _firmalarService = firmalarService;
            _kullaniciYetkilerService = kullaniciYetkilerService;
            _lastikMarkalarService = lastikMarkalarService;
            _lastikMarkaDesenlerService = lastikMarkaDesenlerService;
            _ebatlarService = ebatlarService;
            _lastikTiplerService = lastikTiplerService;
            _aracBakimHareketlerService = aracBakimHareketlerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult Lastikler()
        {
            var lastiklers = RolBazliLastikListesi().ToList();
            return Ok(lastiklers);
        }

        [HttpPost]
        public ActionResult Lastikler([FromBody] DataTablesOptions model)
        {
            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
            var lastikler = RolBazliLastikListesi().AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            var sorguLastikler = RolBazliLastikListesi().AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();

            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikler = lastikler.Where(a => a.SeriNo.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1
            || a.LastikKilometre.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1
            || a.DisSeviyesi.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();


            if (!string.IsNullOrEmpty(model.Search?.Value))
            {
                // firma filter
                var firmalar = _firmalarService.GetAll(a => a.FirmaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                firmalar.ForEach(firmaItem =>
                {
                    var firmaIceriyorMu = sorguLastikler.Where(a => a.FirmaID == firmaItem.FirmaID);
                    if (firmaIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(firmaIceriyorMu);
                    }
                });

                // lastik marka filter
                var lastikMarkalar = _lastikMarkalarService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                lastikMarkalar.ForEach(lastikMarkaItem =>
                {
                    var lastikMarkaIceriyorMu = sorguLastikler.Where(a => a.LastikMarkaID == lastikMarkaItem.LastikMarkaID);
                    if (lastikMarkaIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(lastikMarkaIceriyorMu);
                    }
                });

                // lastik marka desen filter
                var lastikMarkaDesenler = _lastikMarkaDesenlerService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                lastikMarkaDesenler.ForEach(lastikMarkaDesenItem =>
                {
                    var lastikMarkaDesenIceriyorMu = sorguLastikler.Where(a => a.LastikMarkaDesenID == lastikMarkaDesenItem.LastikMarkaDesenID);
                    if (lastikMarkaDesenIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(lastikMarkaDesenIceriyorMu);
                    }
                });

                // ebat filter
                var ebatlar = _ebatlarService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                ebatlar.ForEach(ebatItem =>
                {
                    var ebatIceriyorMu = sorguLastikler.Where(a => a.EbatID == ebatItem.EbatID);
                    if (ebatIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(ebatIceriyorMu);
                    }
                });

                // lastik tip filter
                var lastikTipler = _lastikTiplerService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                lastikTipler.ForEach(lastikTipItem =>
                {
                    var lastikTipIceriyorMu = sorguLastikler.Where(a => a.LastikTipID == lastikTipItem.LastikTipID);
                    if (lastikTipIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(lastikTipIceriyorMu);
                    }
                });

                // lastik konumlar filter
                var lastikKonumlar = _lastikKonumlarService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                lastikKonumlar.ForEach(lastikKonumItem =>
                {
                    var lastikKonumIceriyorMu = sorguLastikler.Where(a => a.LastikKonumID == lastikKonumItem.LastikKonumID);
                    if (lastikKonumIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(lastikKonumIceriyorMu);
                    }
                });

                // plaka filter
                var araclar = _araclarService.GetAll(a => a.Plaka.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                araclar.ForEach(aracItem =>
                {
                    var aracIceriyorMu = sorguLastikler.Where(a => a.AracID == aracItem.AracID);
                    if (aracIceriyorMu.Count() > 0)
                    {
                        lastikler.AddRange(aracIceriyorMu);
                    }
                });
            }

            lastikler = lastikler.GroupBy(p => p.LastikID).Select(grp => grp.FirstOrDefault()).ToList();

            var filter = lastikler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikler.Count, recordsTotal = lastikler.Count, data = filter });
        }

        [HttpPost("HurdaLastikler")]
        public ActionResult HurdaLastikler([FromBody] DataTablesOptions model)
        {
            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
            var lastikler = RolBazliHurdaLastikListesi().AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            //if (!string.IsNullOrEmpty(model.Search?.Value)) lastikler = lastikler;
            var filter = lastikler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikler.Count, recordsTotal = lastikler.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult Lastik(int id)
        {
            var value = _lastikService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("LastikEkle")]
        public ActionResult LastikEkle(LastikEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _lastikService.Get(a => (a.Aktif == true) && (a.FirmaID == model.FirmaID) && (a.SeriNo == model.SeriNo));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikEkle = new Lastikler
                {
                    DisSeviyesi = model.DisSeviyesi,
                    EbatID = model.EbatID,
                    FirmaID = model.FirmaID,
                    Fiyat = model.Fiyat,
                    LastikKilometre = model.LastikKilometre,
                    LastikKonumID = model.LastikKonumID,
                    LastikMarkaDesenID = model.LastikMarkaDesenID,
                    LastikMarkaID = model.LastikMarkaID,
                    LastikTipID = model.LastikTipID,
                    LastikTurID = model.LastikTurID,
                    SeriNo = model.SeriNo,
                    KayitTarihi = model.KayitTarihi,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikService.Add(lastikEkle);
                // Lastik Hareketi Ekle // Depoya Giriş
                var lastikHareketEkle = new LastikHareketler
                {
                    Tarih = lastikEkle.KayitTarihi,
                    Aciklama = "Kayıt Girildi",
                    AracKilometre = 0,
                    Basinc = 0,
                    BasincAlinamadi = false,
                    DisDerinligiJSON = "",
                    GuvenliDisSeviyesi = model.DisSeviyesi,
                    LastikID = lastikEkle.LastikID,
                    LastikKilometre = model.LastikKilometre,
                    LastikMarkaID = lastikEkle.LastikMarkaID,
                    LastikPozisyonID = 0,
                    LastikTipID = lastikEkle.LastikTipID,
                    LastikKonumID = lastikEkle.LastikKonumID,
                    Plaka = "",
                    EkBilgi = "",
                    HareketTip = LastikHareketTipler.DEPO_GIRIS,
                    Hareket = LastikHareketTipler.DEPO,
                    HareketYonu = LastikHareketTipler.DEPO,
                    YapilanIslem = LastikHareketTipler.KAYIT,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikHareketlerService.Add(lastikHareketEkle);

                var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                if (hurdaKonumTipBulucu != null && model.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                {
                    lastikHareketEkle = new LastikHareketler
                    {
                        Tarih = lastikEkle.KayitTarihi,
                        Aciklama = "Kayıt Hurda Seçildi.",
                        AracKilometre = 0,
                        Basinc = 0,
                        BasincAlinamadi = false,
                        DisDerinligiJSON = "",
                        GuvenliDisSeviyesi = 0,
                        LastikID = lastikEkle.LastikID,
                        LastikKilometre = 0,
                        LastikMarkaID = lastikEkle.LastikMarkaID,
                        LastikPozisyonID = 0,
                        LastikTipID = lastikEkle.LastikTipID,
                        LastikKonumID = hurdaKonumTipBulucu.LastikKonumID,
                        Plaka = "",
                        EkBilgi = "",
                        HareketTip = LastikHareketTipler.DEPODAN_HURDAYA,
                        Hareket = LastikHareketTipler.DEPO,
                        HareketYonu = LastikHareketTipler.HURDA,
                        YapilanIslem = LastikHareketTipler.HURDA,
                        Aktif = true,
                        ListeAktiflik = true,
                        OlusturanId = _userJWTInfo.GetInfo().id,
                        OlusturmaTarihi = model.OlusturmaTarihi,
                        DuzenleyenId = _userJWTInfo.GetInfo().id,
                        DuzenlemeTarihi = model.DuzenlemeTarihi
                    };
                    _lastikHareketlerService.Add(lastikHareketEkle);
                }

                //
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpPost("LastikGuncelle")]
        public ActionResult LastikGuncelle(LastikGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastik = _lastikService.GetByID(model.LastikID);
                if (lastik == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _lastikService.Get(a => (a.Aktif == true) && (a.LastikID != model.LastikID)
                && (a.SeriNo == model.SeriNo));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                string hareketIslem = "", hareketIslemDetay = "", hareket = "", hareketYonu = "", yapilanIslem = "";

                if (model.LastikKonumID != lastik.LastikKonumID)
                {
                    var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");
                    var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                    var aracUstundeKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");

                    if (lastik.LastikKonumID == depoKonumTipBulucu.LastikKonumID && model.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                    {
                        hareketIslem = LastikHareketTipler.DEPODAN_HURDAYA;
                        hareketIslemDetay = "Depo'dan Hurda'ya aktarıldı.";
                        //
                        hareket = LastikHareketTipler.DEPO;
                        hareketYonu = LastikHareketTipler.HURDA;
                        yapilanIslem = LastikHareketTipler.HURDA;
                    }
                    else if (lastik.LastikKonumID == depoKonumTipBulucu.LastikKonumID && model.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID)
                    {
                        hareketIslem = LastikHareketTipler.DEPODAN_ARACA;
                        hareketIslemDetay = "Depo'dan Araç'a aktarıldı.";
                        //
                        hareket = LastikHareketTipler.DEPO;
                        hareketYonu = LastikHareketTipler.ARAC;
                        yapilanIslem = LastikHareketTipler.MONTAJ;
                    }
                    // Hurda'dan depoya geri dönüş yoktur.

                    //else if (lastik.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID && model.LastikKonumID == depoKonumTipBulucu.LastikKonumID)
                    //{
                    //    hareketIslem = LastikHareketTipler.HURDADAN_DEPOYA;
                    //    hareketIslemDetay = "Hurda'dan Depo'ya aktarıldı.";
                    //    //
                    //    hareket = LastikHareketTipler.HURDA;
                    //    hareketYonu = LastikHareketTipler.DEPO;
                    //    yapilanIslem = LastikHareketTipler.HURDA;
                    //}

                    // Hurda'dan araca geri dönüş yoktur.
                    //else if (lastik.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID && model.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID)
                    //{
                    //    hareketIslem = LastikHareketTipler.HURDADAN_ARACA;
                    //    hareketIslemDetay = "Hurda'dan Araç'a aktarıldı.";
                    //    //
                    //    hareket = LastikHareketTipler.HURDA;
                    //    hareketYonu = LastikHareketTipler.ARAC;
                    //    yapilanIslem = LastikHareketTipler.HURDA;
                    //}
                    else if (lastik.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID && model.LastikKonumID == depoKonumTipBulucu.LastikKonumID)
                    {
                        hareketIslem = LastikHareketTipler.ARACTAN_DEPOYA;
                        hareketIslemDetay = "Araç'tan Depo'ya aktarıldı.";
                        //
                        hareket = LastikHareketTipler.ARAC;
                        hareketYonu = LastikHareketTipler.DEPO;
                        yapilanIslem = LastikHareketTipler.SOKUM;
                    }
                    else if (lastik.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID && model.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                    {
                        hareketIslem = LastikHareketTipler.ARACTAN_HURDAYA;
                        hareketIslemDetay = "Araç'tan Hurda'ya aktarıldı.";
                        //
                        hareket = LastikHareketTipler.ARAC;
                        hareketYonu = LastikHareketTipler.HURDA;
                        yapilanIslem = LastikHareketTipler.HURDA;
                    }
                }

                lastik.DisSeviyesi = model.DisSeviyesi;
                lastik.EbatID = model.EbatID;
                lastik.FirmaID = model.FirmaID;
                lastik.Fiyat = model.Fiyat;
                //lastik.LastikKilometre = model.LastikKilometre;
                lastik.LastikKonumID = model.LastikKonumID;
                lastik.LastikMarkaDesenID = model.LastikMarkaDesenID;
                lastik.LastikMarkaID = model.LastikMarkaID;
                lastik.LastikTipID = model.LastikTipID;
                lastik.LastikTurID = model.LastikTurID;
                lastik.SeriNo = model.SeriNo;
                lastik.ListeAktiflik = model.ListeAktiflik;

                lastik.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastik.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _lastikService.Update(lastik);


                if (hareketIslem != "")
                {
                    var lastikHareketEkle = new LastikHareketler
                    {
                        Tarih = model.OlusturmaTarihi,
                        Aciklama = hareketIslemDetay,
                        AracKilometre = 0,
                        AracID = lastik.AracID,
                        Basinc = 0,
                        BasincAlinamadi = false,
                        DisDerinligiJSON = "",
                        GuvenliDisSeviyesi = 0,
                        LastikID = lastik.LastikID,
                        LastikKilometre = 0,
                        LastikMarkaID = lastik.LastikMarkaID,
                        LastikPozisyonID = 0,
                        LastikTipID = lastik.LastikTipID,
                        LastikKonumID = lastik.LastikKonumID,
                        Plaka = "",
                        EkBilgi = "",
                        HareketTip = hareketIslem,
                        Hareket = hareket,
                        HareketYonu = hareketYonu,
                        YapilanIslem = yapilanIslem,
                        Aktif = true,
                        ListeAktiflik = true,
                        OlusturanId = _userJWTInfo.GetInfo().id,
                        OlusturmaTarihi = model.OlusturmaTarihi,
                        DuzenleyenId = _userJWTInfo.GetInfo().id,
                        DuzenlemeTarihi = model.DuzenlemeTarihi
                    };
                    _lastikHareketlerService.Add(lastikHareketEkle);
                }

                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpGet("LastikSil/{id}")]
        public ActionResult LastikSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastik = _lastikService.GetByID(id);
                if (lastik == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                lastik.Aktif = false;
                lastik.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastik.DuzenlemeTarihi = DateTime.Now;
                _lastikService.Update(lastik);

                // Lastiğe bağlı hareket kayıtlarını  da sil. 27.11.2019'da entegre edildi.
                var lastikHareketleri = _lastikHareketlerService.GetAll(a => a.LastikID == lastik.LastikID && a.Aktif == true).ToList();
                foreach (var item in lastikHareketleri)
                {
                    item.Aktif = false;
                    _lastikHareketlerService.Update(item);
                }

                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Lastik kopyalama işlemi

        [HttpPost("LastikKopyala")]
        public ActionResult LastikKopyala(LastikKopyalaModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _lastikService.Get(a => (a.Aktif == true) && (a.SeriNo == model.SeriNo));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");

                // 24.09.2019  itibariyle Kayıt tarihi manuel olarak girilmeye başlanacağı için, ve bizde kopyalanacak olan lastik id'sini bildiğimiz için direkt buradan kayıt tarihi bilgisini çekebiliriz.
                var kopyalananLastik = _lastikService.Get(a => a.LastikID == model.AsilLastikID);

                var lastikEkle = new Lastikler
                {
                    DisSeviyesi = model.DisSeviyesi,
                    EbatID = model.EbatID,
                    FirmaID = model.FirmaID,
                    Fiyat = model.Fiyat,
                    LastikKilometre = model.LastikKilometre,
                    LastikKonumID = depoKonumTipBulucu.LastikKonumID,
                    LastikMarkaDesenID = model.LastikMarkaDesenID,
                    LastikMarkaID = model.LastikMarkaID,
                    LastikTipID = model.LastikTipID,
                    LastikTurID = model.LastikTurID,
                    SeriNo = model.SeriNo,
                    KayitTarihi = model.KayitTarihi,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikService.Add(lastikEkle);

                string hareketIslem = LastikHareketTipler.DEPO_GIRIS;
                string hareketIslemDetay = "Kayıt Girildi. " + model.AsilLastikID + " ID'li lastikten kopyalandı.";

                // Lastik Hareketi Ekle // Depoya Giriş
                var lastikHareketEkle = new LastikHareketler
                {
                    Tarih = lastikEkle.KayitTarihi,
                    Aciklama = hareketIslemDetay,
                    AracKilometre = 0,
                    Basinc = 0,
                    BasincAlinamadi = false,
                    DisDerinligiJSON = "",
                    GuvenliDisSeviyesi = 0,
                    LastikID = lastikEkle.LastikID,
                    LastikKilometre = 0,
                    LastikMarkaID = lastikEkle.LastikMarkaID,
                    LastikPozisyonID = 0,
                    LastikTipID = lastikEkle.LastikTipID,
                    LastikKonumID = lastikEkle.LastikKonumID,
                    Plaka = "",
                    EkBilgi = hareketIslemDetay,
                    HareketTip = hareketIslem,
                    Hareket = LastikHareketTipler.DEPO,
                    HareketYonu = LastikHareketTipler.DEPO,
                    YapilanIslem = LastikHareketTipler.KAYIT,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikHareketlerService.Add(lastikHareketEkle);

                //
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Lastik Bakım alanına tıklandığında ve seri no girildiğinde, giriş yapmış kullanıcının o lastiğe erişim iznini kontrol eder. Duruma göre bir yanıt döndürür.
        [HttpGet("LastikErisimDogrula/{seriNo}")]
        public ActionResult LastikErisimDogrula(string seriNo)
        {
            if (string.IsNullOrEmpty(seriNo))
            {
                return Ok(new { Error = "Seri No boş değer olarak geldi." });
            }
            else
            {
                var lastik = _lastikService.Get(a => a.SeriNo == seriNo && a.Aktif == true);
                if (lastik != null)
                {
                    var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");
                    var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                    var aracUstundeKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");

                    if (lastik.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                    {
                        return Ok(new { Error = "Bu lastik üzerinde işlem yapılamaz. (HURDA)" });
                    }
                    else if (lastik.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID)
                    {
                        // Lastik araç üzerinde araca yönlendirme konusunu sor.
                        if (_userJWTInfo.GetInfo().role == Role.Admin) return Ok(new { MessageType = 2, Result = lastik.AracID });
                        else
                        {
                            if(_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
                            {
                                var yetkiliOlduklariSubeler = new List<Firmalar>();
                                var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                                // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                                yetkiliOlduklariListe.AddRange(_kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma));
                                yetkiliOlduklariListe.Where(a => a.YetkiTip == Role._Firma).ToList().ForEach(yetkiliItem =>
                                {
                                    var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                                    yetkiliOlduklariSubeler.AddRange(firmaninAltSubeleri);
                                });

                                if (lastik.OlusturanId == _userJWTInfo.GetInfo().id || yetkiliOlduklariListe.FirstOrDefault(a => a.IlgiliID == lastik.FirmaID) != null || yetkiliOlduklariSubeler.FirstOrDefault(a => a.FirmaID == lastik.FirmaID) != null)
                                {
                                    return Ok(new { MessageType = 2, Result = lastik.AracID });
                                }
                            }
                            else
                            {
                                if (lastik.OlusturanId == _userJWTInfo.GetInfo().id)
                                {
                                    return Ok(new { MessageType = 2, Result = lastik.AracID });
                                }
                            }
                        }
                        return Ok(new { Error = "Bu lastiğe erişim izniniz bulunmamaktadır." });
                    }
                    else if (lastik.LastikKonumID == depoKonumTipBulucu.LastikKonumID)
                    {
                        // Lastik depoda işleme devam.
                        if (_userJWTInfo.GetInfo().role == Role.Admin) return Ok(new { MessageType = 1, Result = lastik.LastikID });
                        else
                        {
                            if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
                            {
                                var yetkiliOlduklariSubeler = new List<Firmalar>();
                                var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                                // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                                yetkiliOlduklariListe.AddRange(_kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma));
                                yetkiliOlduklariListe.Where(a => a.YetkiTip == Role._Firma).ToList().ForEach(yetkiliItem =>
                                {
                                    var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                                    yetkiliOlduklariSubeler.AddRange(firmaninAltSubeleri);
                                });

                                if (lastik.OlusturanId == _userJWTInfo.GetInfo().id || yetkiliOlduklariListe.FirstOrDefault(a => a.IlgiliID == lastik.FirmaID) != null || yetkiliOlduklariSubeler.FirstOrDefault(a => a.FirmaID == lastik.FirmaID) != null)
                                {
                                    return Ok(new { MessageType = 1, Result = lastik.LastikID });
                                }
                            }
                            else
                            {
                                if (lastik.OlusturanId == _userJWTInfo.GetInfo().id)
                                {
                                    return Ok(new { MessageType = 1, Result = lastik.LastikID });
                                }
                            }
                        }
                        return Ok(new { Error = "Bu lastiğe erişim izniniz bulunmamaktadır." });
                    }
                    else
                    {
                        return Ok(new { Error = "Lütfen teknik destek ile iletişime geçin Lastik konumu bulunamadı." });
                    }
                }
                else
                {
                    return Ok(new { Error = "Sistemde bu seri no'ya sahip lastik bulunmamaktadır." });
                }
            }
        }

        //
        [HttpGet("LastigiHurdayaTasi/{lastikId}")]
        public ActionResult LastigiHurdayaTasi(int lastikId)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                DateTime dt = DateTime.Now;
                var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                var lastikBulucu = _lastikService.GetByID(lastikId);
                lastikBulucu.LastikKonumID = hurdaKonumTipBulucu.LastikKonumID;
                lastikBulucu.AracID = 0;
                _lastikService.Update(lastikBulucu);

                string hareketIslem = LastikHareketTipler.DEPODAN_HURDAYA;
                string hareketIslemDetay = "Depo'dan Hurda'ya aktarıldı.";

                var lastikHareketEkle = new LastikHareketler
                {
                    Tarih = dt,
                    Aciklama = hareketIslemDetay,
                    AracKilometre = 0,
                    AracID = 0,
                    Basinc = 0,
                    BasincAlinamadi = false,
                    DisDerinligiJSON = "",
                    GuvenliDisSeviyesi = 0,
                    LastikID = lastikBulucu.LastikID,
                    LastikKilometre = lastikBulucu.LastikKilometre,
                    LastikMarkaID = lastikBulucu.LastikMarkaID,
                    LastikPozisyonID = 0,
                    LastikTipID = lastikBulucu.LastikTipID,
                    LastikKonumID = lastikBulucu.LastikKonumID,
                    Plaka = "",
                    EkBilgi = hareketIslemDetay,
                    HareketTip = hareketIslem,
                    Hareket = LastikHareketTipler.DEPO,
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
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Eğer lastik rotasyondan kopyalanacaksa burası işlenir. Önce depoya, sonra araca olmak üzere 2 adımda tamamlanır.
        [HttpPost("LastigiRotasyonaKopyala")]
        public ActionResult LastigiRotasyonaKopyala(LastikRotasyonaKopyalaModel model)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                DateTime dt = DateTime.Now;

                var benzerKayit = _lastikService.Get(a => (a.Aktif == true) && (a.SeriNo == model.SeriNo));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });

                // öncelikle lastiğin değerlerini alıyoruz.
                var lastikBulucu = _lastikService.GetByID(model.LastikID);
                var lastikSonHareketBul = _lastikHareketlerService.GetAll(a => a.LastikID == model.LastikID && a.Aktif == true).OrderByDescending(a => a.LastikHareketID).FirstOrDefault();

                if (lastikBulucu == null) return Ok(new { Error = "Asıl Lastik bulunamadı. Lütfen teknik destek ile iletişime geçiniz." });

                int aracID = lastikBulucu.AracID;

                var lastikBulucuCopy = lastikBulucu;

                var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");

                // lastiği bulduktan sonra yeni bir lastik nesnesi oluşturuyoruz.
                var lastikEkle = new Lastikler();
                lastikEkle = lastikBulucuCopy;
                lastikEkle.LastikID = 0;
                lastikEkle.AracID = 0;
                lastikEkle.KayitTarihi = model.Tarih;
                lastikEkle.SeriNo = model.SeriNo;
                lastikEkle.LastikKonumID = depoKonumTipBulucu.LastikKonumID;
                lastikEkle.OlusturanId = _userJWTInfo.GetInfo().id;
                lastikEkle.OlusturmaTarihi = dt;
                lastikEkle.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikEkle.DuzenlemeTarihi = dt;
                _lastikService.Add(lastikEkle);

                string hareketIslem = LastikHareketTipler.DEPO_GIRIS;
                string hareketIslemDetay = model.LastikID + " ID'li lastikten rotasyonla kopyalanarak Depo'ya taşındı.";

                // Depo girişi yapıyoruz.

                var lastikHareketEkle = new LastikHareketler
                {
                    Tarih = lastikEkle.KayitTarihi,
                    Aciklama = hareketIslemDetay,
                    AracKilometre = lastikSonHareketBul.AracKilometre,
                    AracID = 0, // Bu ID'li araçtan depoya aktarılmış olduğunu ifade eder.
                    Basinc = lastikSonHareketBul.Basinc,
                    BasincAlinamadi = lastikSonHareketBul.BasincAlinamadi,
                    DisDerinligiJSON = "", // 09.10.19 itibariyle kopyalandığı lastiğin diş derinliği bilgisini çekmiyoruz. Çünkü lastik yeni olabilir. Diş derinliği, ölçümle ekranında lastiğin diş derinliği olarak algılanacak.
                    GuvenliDisSeviyesi = 0,
                    LastikID = lastikEkle.LastikID,
                    LastikKilometre = lastikEkle.LastikKilometre,
                    LastikMarkaID = lastikEkle.LastikMarkaID,
                    LastikPozisyonID = 0,
                    LastikTipID = lastikEkle.LastikTipID,
                    LastikKonumID = lastikEkle.LastikKonumID,
                    Plaka = lastikSonHareketBul.Plaka,
                    EkBilgi = hareketIslemDetay,
                    HareketTip = hareketIslem,
                    Hareket = LastikHareketTipler.DEPO,
                    HareketYonu = LastikHareketTipler.DEPO,
                    YapilanIslem = LastikHareketTipler.KAYIT,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = dt,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = dt
                };
                _lastikHareketlerService.Add(lastikHareketEkle);

                // Araca montaj yapıyoruz.
                var aracBakimEkle = new AracBakimlar
                {
                    AksPozisyonID = model.LastikPozisyonID,
                    Aktif = true,
                    AracID = aracID,
                    LastikID = lastikEkle.LastikID,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = dt,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = dt
                };

                _aracBakimlarService.Add(aracBakimEkle);

                var aracBulucu = _araclarService.GetByID(aracBakimEkle.AracID);

                var aracBakimHareketEkle = new AracBakimHareketler
                {
                    AracBakimID = aracBakimEkle.AracBakimID,
                    HareketTip = LastikHareketTipler.DEPODAN_ARACA,
                    Hareket = LastikHareketTipler.DEPO,
                    HareketYonu = LastikHareketTipler.ARAC,
                    YapilanIslem = LastikHareketTipler.MONTAJ,
                    Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araca takıldı.",
                    EkBilgi = "",
                    AksPozisyonID = model.LastikPozisyonID,
                    Aktif = true,
                    AracID = aracBakimEkle.AracID,
                    LastikID = aracBakimEkle.LastikID,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = dt,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = dt
                };

                _aracBakimHareketlerService.Add(aracBakimHareketEkle);

                var aracUstundeKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");

                lastikEkle.AracID = aracID;
                lastikEkle.LastikKonumID = aracUstundeKonumTipBulucu.LastikKonumID;
                _lastikService.Update(lastikEkle);

                hareketIslem = LastikHareketTipler.DEPODAN_ARACA;
                hareketIslemDetay = "Depo'dan Araca Takıldı";

                lastikHareketEkle = new LastikHareketler
                {
                    Tarih = model.Tarih,
                    Aciklama = hareketIslemDetay,
                    AracKilometre = lastikSonHareketBul.AracKilometre,
                    AracID = aracID,
                    Basinc = lastikSonHareketBul.Basinc,
                    BasincAlinamadi = lastikSonHareketBul.BasincAlinamadi,
                    DisDerinligiJSON = "", // 09.10.19 itibariyle kopyalandığı lastiğin diş derinliği bilgisini çekmiyoruz. Çünkü lastik yeni olabilir. Diş derinliği, ölçümle ekranında lastiğin diş derinliği olarak algılanacak.
                    GuvenliDisSeviyesi = 0,
                    LastikID = lastikEkle.LastikID,
                    LastikKilometre = lastikEkle.LastikKilometre,
                    LastikMarkaID = lastikEkle.LastikMarkaID,
                    LastikPozisyonID = model.LastikPozisyonID,
                    LastikTipID = lastikEkle.LastikTipID,
                    LastikKonumID = lastikEkle.LastikKonumID,
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


                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Kullanıcının rolüne uygun bir şekilde lastik listesi döndürür.
        public List<Lastikler> RolBazliLastikListesi()
        {
            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
            var lastiklers = new List<Lastikler>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                lastiklers = _lastikService.GetAll(a => a.Aktif == true && a.LastikKonumID != hurdaKonumTipBulucu.LastikKonumID);
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                lastiklers = _lastikService.GetAll(a => a.Aktif == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.LastikKonumID != hurdaKonumTipBulucu.LastikKonumID);
                //
                var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                yetkiliOlduklariListe.ForEach(yetkiliItem =>
                {
                    lastiklers.AddRange(_lastikService.GetAll(a => a.Aktif == true && (a.OlusturanId == yetkiliItem.IlgiliID || a.FirmaID == yetkiliItem.IlgiliID) && a.LastikKonumID != hurdaKonumTipBulucu.LastikKonumID));
                });
                // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma);
                yetkiliOlduklariListe.ForEach(yetkiliItem =>
                {
                    lastiklers.AddRange(_lastikService.GetAll(a => a.Aktif == true && (a.OlusturanId == yetkiliItem.IlgiliID || a.FirmaID == yetkiliItem.IlgiliID) && a.LastikKonumID != hurdaKonumTipBulucu.LastikKonumID));
                    var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                    foreach (var item in firmaninAltSubeleri)
                    {
                        lastiklers.AddRange(_lastikService.GetAll(a => a.Aktif == true && (a.OlusturanId == item.FirmaID || a.FirmaID == item.FirmaID) && a.LastikKonumID != hurdaKonumTipBulucu.LastikKonumID));
                    }
                });
            }
            else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi || _userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
            {
                lastiklers = _lastikService.GetAll(a => a.Aktif == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.LastikKonumID != hurdaKonumTipBulucu.LastikKonumID);
            }
            lastiklers = lastiklers.GroupBy(p => p.LastikID).Select(grp => grp.FirstOrDefault()).ToList();
            return lastiklers;
        }

        // Kullanıcının rolüne uygun bir şekilde hurda lastik listesi döndürür.
        public List<Lastikler> RolBazliHurdaLastikListesi()
        {
            var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
            var lastiklers = new List<Lastikler>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                lastiklers = _lastikService.GetAll(a => a.Aktif == true && a.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID);
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                lastiklers = _lastikService.GetAll(a => a.Aktif == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID);
                //
                var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                yetkiliOlduklariListe.ForEach(yetkiliItem =>
                {
                    lastiklers.AddRange(_lastikService.GetAll(a => a.Aktif == true && (a.OlusturanId == yetkiliItem.IlgiliID || a.FirmaID == yetkiliItem.IlgiliID) && a.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID));
                });
                // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma);
                yetkiliOlduklariListe.ForEach(yetkiliItem =>
                {
                    lastiklers.AddRange(_lastikService.GetAll(a => a.Aktif == true && (a.OlusturanId == yetkiliItem.IlgiliID || a.FirmaID == yetkiliItem.IlgiliID) && a.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID));
                    var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                    foreach (var item in firmaninAltSubeleri)
                    {
                        lastiklers.AddRange(_lastikService.GetAll(a => a.Aktif == true && (a.OlusturanId == item.FirmaID || a.FirmaID == item.FirmaID) && a.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID));
                    }
                });
            }
            else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi || _userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
            {
                lastiklers = _lastikService.GetAll(a => a.Aktif == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID);
            }
            lastiklers = lastiklers.GroupBy(p => p.LastikID).Select(grp => grp.FirstOrDefault()).ToList();
            return lastiklers;
        }
    }
}