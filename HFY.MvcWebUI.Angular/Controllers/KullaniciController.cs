using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HFY.Entities.Concrete;
using Microsoft.AspNetCore.Authorization;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Core.Models.Firma;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HFY.MvcWebUI.Angular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]

    public class KullaniciController : ControllerBase
    {
        IFirmalarService _firmalarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public KullaniciController(IFirmalarService firmalarService, IHttpContextAccessor httpContextAccessor)
        {
            _firmalarService = firmalarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet("Kullanicilar/FirmaID")]
        public ActionResult Kullanicilar(int FirmaID)
        {
            var kullanicilar = RolBazliKullaniciListesi(FirmaID);
            return Ok(kullanicilar);
        }

        [HttpPost]
        public ActionResult Kullanicilar(DataTablesOptions model)
        {
            var kullanicilars = RolBazliKullaniciListesi(model.UstID).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) kullanicilars = kullanicilars.Where(a => a.FirmaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.FirmaKisaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = kullanicilars.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = kullanicilars.Count, recordsTotal = kullanicilars.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult Kullanici(int id)
        {
            var value = _firmalarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        //[Authorize(Roles = Role.Admin)]
        //[HttpPost("KullaniciEkle")]
        //public ActionResult KullaniciEkle(LastikTurEkleModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
        //        return Ok(allErrors);
        //    }
        //    if (!_userJWTInfo.UserNullOrEmpty())
        //    {
        //        var benzerKayit = _lastikTurlerService.Get(a => (a.Aktif == true) && (a.Kod == model.Kod || a.Ad == model.Ad || a.Sira == model.Sira));
        //        if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
        //        var lastikTurEkle = new LastikTurler
        //        {
        //            Ad = model.Ad,
        //            Kod = model.Kod,
        //            Sira = model.Sira,
        //            Aktif = true,
        //            ListeAktiflik = true,
        //            OlusturanId = _userJWTInfo.GetInfo().id,
        //            OlusturmaTarihi = model.OlusturmaTarihi,
        //            DuzenleyenId = _userJWTInfo.GetInfo().id,
        //            DuzenlemeTarihi = model.DuzenlemeTarihi
        //        };
        //        _lastikTurlerService.Add(lastikTurEkle);
        //        return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
        //    }
        //    else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        //}

        //[Authorize(Roles = Role.Admin)]
        //[HttpPost("KullaniciGuncelle")]
        //public ActionResult KullaniciGuncelle(LastikTurGuncelleModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
        //        return Ok(allErrors);
        //    }
        //    if (!_userJWTInfo.UserNullOrEmpty())
        //    {
        //        var lastikTur = _lastikTurlerService.GetByID(model.LastikTurID);
        //        if (lastikTur == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
        //        var benzerKayit = _lastikTurlerService.Get(a => (a.Aktif == true) && (a.LastikTurID != model.LastikTurID)
        //        && (a.Ad == model.Ad || a.Kod == model.Kod || a.Sira == model.Sira));
        //        if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

        //        lastikTur.Ad = model.Ad;
        //        lastikTur.Kod = model.Kod;
        //        lastikTur.Sira = model.Sira;
        //        lastikTur.ListeAktiflik = model.ListeAktiflik;

        //        lastikTur.DuzenleyenId = _userJWTInfo.GetInfo().id;
        //        lastikTur.DuzenlemeTarihi = model.DuzenlemeTarihi;

        //        _lastikTurlerService.Update(lastikTur);
        //        return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
        //    }
        //    else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        //}

        [Authorize(Roles = Role.Admin)]
        [HttpGet("KullaniciSil/{id}")]
        public ActionResult KullaniciSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var kullanici = _firmalarService.GetByID(id);
                if (kullanici == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                kullanici.Aktif = false;
                kullanici.DuzenleyenId = _userJWTInfo.GetInfo().id;
                kullanici.DuzenlemeTarihi = DateTime.Now;
                _firmalarService.Update(kullanici);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Kullanıcının rolüne uygun bir şekilde kullanıcı listesi döndürür.
        public List<Firmalar> RolBazliKullaniciListesi(int FirmaID)
        {
            var firmalar = new List<Firmalar>();
            var firmaBulucu = _firmalarService.GetByID(FirmaID);
            if (firmaBulucu != null)
            {
                string kullaniciTipi = "";
                if (firmaBulucu.Rol == Role._Isletme) kullaniciTipi = Role.IsletmeKullanicisi;
                if (firmaBulucu.Rol == Role._Firma) kullaniciTipi = Role.FirmaKullanicisi;
                if (firmaBulucu.Rol == Role._Sube) kullaniciTipi = Role.SubeKullanicisi;

                if (_userJWTInfo.GetInfo().role == Role.Admin)
                {
                    firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.BagliOlduguID == firmaBulucu.FirmaID && a.Rol == kullaniciTipi).ToList();
                }
                else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi || _userJWTInfo.GetInfo().role == Role.FirmaKullanicisi || _userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
                {
                    var ustFirmaBulucu = _firmalarService.GetByID(_userJWTInfo.GetInfo().id);
                    if (ustFirmaBulucu != null)
                    {
                        if (ustFirmaBulucu.BagliOlduguID == firmaBulucu.FirmaID)
                        {
                            firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.BagliOlduguID == firmaBulucu.FirmaID && a.Rol == kullaniciTipi).ToList();
                        }
                    }
                }
            }
            return firmalar;
        }
    }
}