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
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]

    public class LastikTurController : ControllerBase
    {
        ILastikTurlerService _lastikTurlerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikTurController(ILastikTurlerService lastikTurlerService, IHttpContextAccessor httpContextAccessor)
        {
            _lastikTurlerService = lastikTurlerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult LastikTurler()
        {
            var lastikTurlers = _lastikTurlerService.GetAll(a => a.Aktif == true).ToList();
            return Ok(lastikTurlers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult LastikTurler(DataTablesOptions model)
        {
            var lastikTurlers = _lastikTurlerService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikTurlers = lastikTurlers.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 ||a.Kod.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = lastikTurlers.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikTurlers.Count, recordsTotal = lastikTurlers.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult LastikTur(int id)
        {
            var value = _lastikTurlerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikTurEkle")]
        public ActionResult LastikTurEkle(LastikTurEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _lastikTurlerService.Get(a => (a.Aktif == true) && (a.Kod == model.Kod || a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikTurEkle = new LastikTurler
                {
                    Ad = model.Ad,
                    Kod = model.Kod,
                    Sira = model.Sira,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikTurlerService.Add(lastikTurEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikTurGuncelle")]
        public ActionResult LastikTurGuncelle(LastikTurGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikTur = _lastikTurlerService.GetByID(model.LastikTurID);
                if (lastikTur == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _lastikTurlerService.Get(a => (a.Aktif == true) && (a.LastikTurID != model.LastikTurID)
                && (a.Ad == model.Ad || a.Kod == model.Kod || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                lastikTur.Ad = model.Ad;
                lastikTur.Kod = model.Kod;
                lastikTur.Sira = model.Sira;
                lastikTur.ListeAktiflik = model.ListeAktiflik;

                lastikTur.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikTur.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _lastikTurlerService.Update(lastikTur);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("LastikTurSil/{id}")]
        public ActionResult LastikTurSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikTur = _lastikTurlerService.GetByID(id);
                if (lastikTur == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                lastikTur.Aktif = false;
                lastikTur.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikTur.DuzenlemeTarihi = DateTime.Now;
                _lastikTurlerService.Update(lastikTur);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}