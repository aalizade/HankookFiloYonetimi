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
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class LastikOlcumController : ControllerBase
    {
        ILastikOlcumlerService _lastikOlcumlerService;
        ILastikHareketlerService _lastikHareketlerService;
        ILastiklerService _lastikService;
        ILastikKonumlarService _lastikKonumlarService;
        IAraclarService _araclarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikOlcumController(ILastikOlcumlerService lastikOlcumlerService, ILastikHareketlerService lastikHareketlerService, ILastiklerService lastikService, ILastikKonumlarService lastikKonumlarService, IAraclarService araclarService, IHttpContextAccessor httpContextAccessor)
        {
            _lastikOlcumlerService = lastikOlcumlerService;
            _lastikHareketlerService = lastikHareketlerService;
            _lastikService = lastikService;
            _lastikKonumlarService = lastikKonumlarService;
            _araclarService = araclarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet("LastikOlcumler/{id}")]
        public ActionResult LastikOlcumler(int id = 0)
        {
            var lastikOlcumlers = _lastikOlcumlerService.GetAll(a => a.LastikID == id && a.Aktif == true).ToList();
            return Ok(lastikOlcumlers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult LastikOlcumler([FromBody] DataTablesOptions model)
        {
            var lastikOlcumler = _lastikOlcumlerService.GetAll(a => a.LastikID == model.UstID && a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikOlcumler = lastikOlcumler.Where(a => a.AracKilometre.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.LastikKilometre.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.Tarih.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList(); ;
            var filter = lastikOlcumler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikOlcumler.Count, recordsTotal = lastikOlcumler.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult LastikOlcum(int id)
        {
            var value = _lastikOlcumlerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("LastikOlcumEkle")]
        public ActionResult LastikOlcumEkle(LastikOlcumEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                // var benzerKayit = _lastikOlcumlerService.Get(a => (a.Aktif == true) && (a.FirmaID == model.FirmaID) && (a.SeriNo == model.SeriNo));
                // if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikBulucu = _lastikService.GetByID(model.LastikID);
                if (lastikBulucu == null) return Ok(new { Error = "Lastik kaydı bulunamadı. Lütfen teknik destek ile iletişime geçin." });

                var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");
                var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                var aracUstundeKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");

                if (aracUstundeKonumTipBulucu.LastikKonumID == model.LastikKonumID)
                {
                    var aracMontaj = _lastikHareketlerService.GetAll(a => a.YapilanIslem == LastikHareketTipler.MONTAJ && a.AracID == model.AracID && a.LastikID == model.LastikID && a.Aktif == true)
                        .OrderBy(a => a.LastikHareketID).FirstOrDefault();
                    if (aracMontaj != null)
                    {
                        model.LastikKilometre = aracMontaj.LastikKilometre + (model.AracKilometre - aracMontaj.AracKilometre);
                        lastikBulucu.LastikKilometre = model.LastikKilometre;
                        _lastikService.Update(lastikBulucu);
                    }
                }

                var lastikOlcumEkle = new LastikOlcumler
                {
                    Tarih = model.Tarih,
                    Aciklama = "",
                    AracKilometre = model.AracKilometre,
                    Basinc = model.Basinc,
                    BasincAlinamadi = model.BasincAlinamadi,
                    DisDerinligiJSON = model.DisDerinligiJSON,
                    GuvenliDisSeviyesi = model.GuvenliDisSeviyesi,
                    LastikID = model.LastikID,
                    AracID = model.AracID,
                    TavsiyeBasinc = model.TavsiyeBasinc,
                    LastikKilometre = model.LastikKilometre,
                    LastikMarkaID = lastikBulucu.LastikMarkaID,
                    LastikPozisyonID = model.LastikPozisyonID,
                    LastikTipID = lastikBulucu.LastikTipID,
                    LastikKonumID = model.LastikKonumID,
                    Plaka = model.Plaka,
                    GozlemJSON = model.GozlemJSON,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };

                _lastikOlcumlerService.Add(lastikOlcumEkle);

                string hareketIslem = "", hareketIslemDetay = "", hareket = "", hareketYonu = "", yapilanIslem = "";


                if (model.LastikKonumID == depoKonumTipBulucu.LastikKonumID)
                {
                    // Eğer Lastik Ölçüm Ekle ekranından, Gözlem seçeneklerinden birisi seçilirse, yapılan işlem "Ölçüm + Gözlem" olur.
                    if (model.GozlemYapildiMi)
                    {
                        hareketIslem = LastikHareketTipler.DEPODAN_DEPOYA_OLCUM_VE_GOZLEM;
                        hareketIslemDetay = "Depo'da ki lastiğe ölçüm + gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.DEPO;
                        hareketYonu = LastikHareketTipler.DEPO;
                        yapilanIslem = LastikHareketTipler.OLCUM_VE_GOZLEM;
                    }
                    else
                    {
                        hareketIslem = LastikHareketTipler.DEPODAN_DEPOYA_OLCUM;
                        hareketIslemDetay = "Depo'da ki lastiğe ölçüm yapıldı.";
                        //
                        hareket = LastikHareketTipler.DEPO;
                        hareketYonu = LastikHareketTipler.DEPO;
                        yapilanIslem = LastikHareketTipler.OLCUM;
                    }
                }
                else if (model.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                {
                    if (model.GozlemYapildiMi)
                    {
                        hareketIslem = LastikHareketTipler.HURDADAN_HURDAYA_OLCUM_VE_GOZLEM;
                        hareketIslemDetay = "Hurda'da ki lastiğe ölçüm + gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.HURDA;
                        hareketYonu = LastikHareketTipler.HURDA;
                        yapilanIslem = LastikHareketTipler.OLCUM_VE_GOZLEM;
                    }
                    else
                    {
                        hareketIslem = LastikHareketTipler.HURDADAN_HURDAYA_OLCUM;
                        hareketIslemDetay = "Hurda'da ki lastiğe ölçüm yapıldı.";
                        //
                        hareket = LastikHareketTipler.HURDA;
                        hareketYonu = LastikHareketTipler.HURDA;
                        yapilanIslem = LastikHareketTipler.OLCUM;
                    }

                }
                else if (model.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID)
                {
                    if (model.GozlemYapildiMi)
                    {
                        hareketIslem = LastikHareketTipler.ARACTAN_ARACA_OLCUM_VE_GOZLEM;
                        hareketIslemDetay = "Araç üstündeki lastiğe ölçüm + gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.ARAC;
                        hareketYonu = LastikHareketTipler.ARAC;
                        yapilanIslem = LastikHareketTipler.OLCUM_VE_GOZLEM;
                    }
                    else
                    {
                        hareketIslem = LastikHareketTipler.ARACTAN_ARACA_OLCUM;
                        hareketIslemDetay = "Araç üstündeki lastiğe ölçüm yapıldı.";
                        //
                        hareket = LastikHareketTipler.ARAC;
                        hareketYonu = LastikHareketTipler.ARAC;
                        yapilanIslem = LastikHareketTipler.OLCUM;
                    }
                }

                // Lastik Hareketi Ekle // Ölçüm
                var lastikHareketEkle = new LastikHareketler
                {
                    Tarih = model.Tarih,
                    Aciklama = hareketIslemDetay,
                    AracKilometre = model.AracKilometre,
                    Basinc = model.Basinc,
                    BasincAlinamadi = model.BasincAlinamadi,
                    DisDerinligiJSON = model.DisDerinligiJSON,
                    GuvenliDisSeviyesi = model.GuvenliDisSeviyesi,
                    LastikID = model.LastikID,
                    LastikKilometre = model.LastikKilometre,
                    LastikMarkaID = lastikBulucu.LastikMarkaID,
                    LastikPozisyonID = model.LastikPozisyonID,
                    LastikTipID = lastikBulucu.LastikTipID,
                    LastikKonumID = model.LastikKonumID,
                    Plaka = model.Plaka,
                    AracID = model.AracID,
                    TavsiyeBasinc = model.TavsiyeBasinc,
                    HareketTip = hareketIslem,
                    Hareket = hareket,
                    HareketYonu = hareketYonu,
                    YapilanIslem = yapilanIslem,
                    EkBilgi = lastikOlcumEkle.LastikOlcumID.ToString(), // Lastik Ölçüm ID'sini Ek Bilgi olarak ekliyoruz. Sebebi ise Lastik İşlem geçmişinden bir ölçüm silinirse, bu aslında LastikHareketler tablosundan silinmiş oluyor bizim bunu hem hareketlerden hemde gerçek ölçüm tablosundan silmemiz gerekir.
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikHareketlerService.Add(lastikHareketEkle);
                //
                return Ok(new { MessageType = 1, LastikOlcumID = lastikOlcumEkle.LastikOlcumID, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Bu Controller'da güncelleme işlemine gerek duyulmamıştır.

        //[HttpPost("LastikOlcumGuncelle")]
        //public ActionResult LastikOlcumGuncelle(LastikGuncelleModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
        //        return Ok(allErrors);
        //    }
        //    if (!_userJWTInfo.UserNullOrEmpty())
        //    {
        //        var lastik = _lastikService.GetByID(model.LastikID);
        //        if (lastik == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
        //        var benzerKayit = _lastikService.Get(a => (a.Aktif == true) && (a.LastikID != model.LastikID)
        //        && (a.SeriNo == model.SeriNo));
        //        if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

        //        lastik.DisSeviyesi = model.DisSeviyesi;
        //        lastik.EbatID = model.EbatID;
        //        lastik.FirmaID = model.FirmaID;
        //        lastik.Fiyat = model.Fiyat;
        //        lastik.LastikKilometre = model.LastikKilometre;
        //        lastik.LastikKonumID = model.LastikKonumID;
        //        lastik.LastikMarkaDesenID = model.LastikMarkaDesenID;
        //        lastik.LastikMarkaID = model.LastikMarkaID;
        //        lastik.LastikTipID = model.LastikTipID;
        //        lastik.LastikTurID = model.LastikTurID;
        //        lastik.SeriNo = model.SeriNo;
        //        lastik.ListeAktiflik = model.ListeAktiflik;

        //        lastik.DuzenleyenId = _userJWTInfo.GetInfo().id;
        //        lastik.DuzenlemeTarihi = model.DuzenlemeTarihi;

        //        _lastikService.Update(lastik);
        //        return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
        //    }
        //    else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        //}

        [HttpGet("LastikOlcumSil/{id}")]
        public ActionResult LastikOlcumSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikOlcum = _lastikOlcumlerService.GetByID(id);
                if (lastikOlcum == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                lastikOlcum.Aktif = false;
                lastikOlcum.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikOlcum.DuzenlemeTarihi = DateTime.Now;
                _lastikOlcumlerService.Update(lastikOlcum);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Bu kısım, lastiğe gözlem yapıldığında kullanılır. Gözlem öncesinde eğer bir lastik ölçümü girilmiş ise, son kayıtla bu birleştirilir.
        // Eğer önceden bir lastik ölçüm işlemi yoksa, yeni bir lastik ölçüm kaydı oluşturulur.
        [HttpPost("LastikOlcumEkleGozlem")]
        public ActionResult LastikOlcumEkleGozlem(LastikOlcumEkleGozlemModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                // var benzerKayit = _lastikOlcumlerService.Get(a => (a.Aktif == true) && (a.FirmaID == model.FirmaID) && (a.SeriNo == model.SeriNo));
                // if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikBulucu = _lastikService.GetByID(model.LastikID);
                if (lastikBulucu == null) return Ok(new { Error = "Lastik kaydı bulunamadı. Lütfen teknik destek ile iletişime geçin." });

                var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");
                var hurdaKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Hurda");
                var aracUstundeKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Araç Üstünde");

                string hareketIslem = "", hareketIslemDetay = "", hareket = "", hareketYonu = "", yapilanIslem = "";

                if (model.LastikOlcumID != 0)
                {
                    if (lastikBulucu.LastikKonumID == depoKonumTipBulucu.LastikKonumID)
                    {

                        hareketIslem = LastikHareketTipler.DEPODAN_DEPOYA_OLCUM_VE_GOZLEM;
                        hareketIslemDetay = "Depo'da ki lastiğe ölçüm + gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.DEPO;
                        hareketYonu = LastikHareketTipler.DEPO;
                        yapilanIslem = LastikHareketTipler.OLCUM_VE_GOZLEM;

                    }
                    else if (lastikBulucu.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                    {

                        hareketIslem = LastikHareketTipler.HURDADAN_HURDAYA_OLCUM_VE_GOZLEM;
                        hareketIslemDetay = "Hurda'da ki lastiğe ölçüm + gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.HURDA;
                        hareketYonu = LastikHareketTipler.HURDA;
                        yapilanIslem = LastikHareketTipler.OLCUM_VE_GOZLEM;


                    }
                    else if (lastikBulucu.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID)
                    {

                        hareketIslem = LastikHareketTipler.ARACTAN_ARACA_OLCUM_VE_GOZLEM;
                        hareketIslemDetay = "Araç üstündeki lastiğe ölçüm + gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.ARAC;
                        hareketYonu = LastikHareketTipler.ARAC;
                        yapilanIslem = LastikHareketTipler.OLCUM_VE_GOZLEM;

                    }

                    var lastikOlcumBulucu = _lastikOlcumlerService.GetByID(model.LastikOlcumID);
                    if (lastikOlcumBulucu != null)
                    {
                        lastikOlcumBulucu.Tarih = model.ServisTarihi;
                        lastikOlcumBulucu.AracKilometre = model.AracKilometre;
                        lastikOlcumBulucu.GozlemJSON = model.GozlemJSON;
                        lastikOlcumBulucu.DuzenleyenId = _userJWTInfo.GetInfo().id;
                        lastikOlcumBulucu.DuzenlemeTarihi = model.DuzenlemeTarihi;
                        lastikOlcumBulucu.Aciklama = hareketIslemDetay;
                        _lastikOlcumlerService.Update(lastikOlcumBulucu);

                        var lastikHareketBulucu = _lastikHareketlerService.Get(a => a.EkBilgi == lastikOlcumBulucu.LastikOlcumID.ToString());
                        if (lastikHareketBulucu != null)
                        {
                            lastikHareketBulucu.Tarih = model.ServisTarihi;
                            lastikHareketBulucu.AracKilometre = model.AracKilometre;
                            lastikHareketBulucu.Aciklama = hareketIslemDetay;
                            lastikHareketBulucu.HareketTip = hareketIslem;
                            lastikHareketBulucu.Hareket = hareket;
                            lastikHareketBulucu.HareketYonu = hareketYonu;
                            lastikHareketBulucu.YapilanIslem = yapilanIslem;
                            lastikHareketBulucu.GozlemJSON = model.GozlemJSON;
                            lastikHareketBulucu.DuzenleyenId = _userJWTInfo.GetInfo().id;
                            lastikHareketBulucu.DuzenlemeTarihi = model.DuzenlemeTarihi;
                            _lastikHareketlerService.Update(lastikHareketBulucu);
                        }
                    }
                }
                else
                {
                    if (lastikBulucu.LastikKonumID == depoKonumTipBulucu.LastikKonumID)
                    {

                        hareketIslem = LastikHareketTipler.DEPODAN_DEPOYA_GOZLEM;
                        hareketIslemDetay = "Depo'da ki lastiğe gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.DEPO;
                        hareketYonu = LastikHareketTipler.DEPO;
                        yapilanIslem = LastikHareketTipler.GOZLEM;

                    }
                    else if (lastikBulucu.LastikKonumID == hurdaKonumTipBulucu.LastikKonumID)
                    {

                        hareketIslem = LastikHareketTipler.HURDADAN_HURDAYA_GOZLEM;
                        hareketIslemDetay = "Hurda'da ki lastiğe gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.HURDA;
                        hareketYonu = LastikHareketTipler.HURDA;
                        yapilanIslem = LastikHareketTipler.GOZLEM;


                    }
                    else if (lastikBulucu.LastikKonumID == aracUstundeKonumTipBulucu.LastikKonumID)
                    {

                        hareketIslem = LastikHareketTipler.ARACTAN_ARACA_GOZLEM;
                        hareketIslemDetay = "Araç üstündeki lastiğe gözlem yapıldı.";
                        //
                        hareket = LastikHareketTipler.ARAC;
                        hareketYonu = LastikHareketTipler.ARAC;
                        yapilanIslem = LastikHareketTipler.GOZLEM;

                    }

                    var aracBulucu = _araclarService.Get(a => a.AracID == model.AracID);

                    var oncekiLastikHareketler = _lastikHareketlerService.GetAll(a => a.LastikID == model.LastikID && a.AracID == model.AracID && a.Aktif == true).OrderByDescending(a => a.LastikHareketID).FirstOrDefault();
                    if (oncekiLastikHareketler != null)
                    {
                        if (model.AracKilometre < oncekiLastikHareketler.AracKilometre)
                        {
                            return Ok(new { Error = "Girdiğiniz araç kilometresi, son araç km'sine eşit ya da daha fazla olmalıdır." });
                        }
                    }
                    else
                    {
                        return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. Bir önceki lastik hareketi bulunamıyor." });
                    }

                    var lastikOlcumEkle = new LastikOlcumler
                    {
                        Tarih = model.ServisTarihi,
                        Aciklama = hareketIslemDetay,
                        AracKilometre = model.AracKilometre,
                        Basinc = 0,
                        BasincAlinamadi = false,
                        DisDerinligiJSON = "",
                        GuvenliDisSeviyesi = 0,
                        LastikID = model.LastikID,
                        AracID = model.AracID,
                        TavsiyeBasinc = 0,
                        LastikKilometre = lastikBulucu.LastikKilometre,
                        LastikMarkaID = lastikBulucu.LastikMarkaID,
                        LastikPozisyonID = model.LastikPozisyonID,
                        LastikTipID = lastikBulucu.LastikTipID,
                        LastikKonumID = lastikBulucu.LastikKonumID,
                        Plaka = aracBulucu == null ? "" : aracBulucu.Plaka,
                        GozlemJSON = model.GozlemJSON,
                        Aktif = true,
                        ListeAktiflik = true,
                        OlusturanId = _userJWTInfo.GetInfo().id,
                        OlusturmaTarihi = model.OlusturmaTarihi,
                        DuzenleyenId = _userJWTInfo.GetInfo().id,
                        DuzenlemeTarihi = model.DuzenlemeTarihi
                    };

                    _lastikOlcumlerService.Add(lastikOlcumEkle);

                    // Lastik Hareketi Ekle // Gözlem
                    var lastikHareketEkle = new LastikHareketler
                    {
                        Tarih = model.ServisTarihi,
                        Aciklama = hareketIslemDetay,
                        AracKilometre = lastikOlcumEkle.AracKilometre,
                        Basinc = lastikOlcumEkle.Basinc,
                        BasincAlinamadi = lastikOlcumEkle.BasincAlinamadi,
                        DisDerinligiJSON = lastikOlcumEkle.DisDerinligiJSON,
                        GuvenliDisSeviyesi = lastikOlcumEkle.GuvenliDisSeviyesi,
                        LastikID = lastikOlcumEkle.LastikID,
                        LastikKilometre = lastikOlcumEkle.LastikKilometre,
                        LastikMarkaID = lastikOlcumEkle.LastikMarkaID,
                        LastikPozisyonID = lastikOlcumEkle.LastikPozisyonID,
                        LastikTipID = lastikOlcumEkle.LastikTipID,
                        LastikKonumID = lastikOlcumEkle.LastikKonumID,
                        Plaka = lastikOlcumEkle.Plaka,
                        AracID = lastikOlcumEkle.AracID,
                        TavsiyeBasinc = lastikOlcumEkle.TavsiyeBasinc,
                        HareketTip = hareketIslem,
                        Hareket = hareket,
                        HareketYonu = hareketYonu,
                        YapilanIslem = yapilanIslem,
                        EkBilgi = lastikOlcumEkle.LastikOlcumID.ToString(), // Lastik Ölçüm ID'sini Ek Bilgi olarak ekliyoruz. Sebebi ise Lastik İşlem geçmişinden bir ölçüm silinirse, bu aslında LastikHareketler tablosundan silinmiş oluyor bizim bunu hem hareketlerden hemde gerçek ölçüm tablosundan silmemiz gerekir.
                        Aktif = true,
                        ListeAktiflik = true,
                        GozlemJSON = lastikOlcumEkle.GozlemJSON,
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
    }
}