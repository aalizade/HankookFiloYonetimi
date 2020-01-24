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
    [Authorize(Roles = Role.Admin)]
    public class YukIndeksController : ControllerBase
    {
        IYukIndekslerService _yukIndekslerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public YukIndeksController(IYukIndekslerService yukIndekslerService, IHttpContextAccessor httpContextAccessor)
        {
            _yukIndekslerService = yukIndekslerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpPost]
        public ActionResult YukIndeksler(DataTablesOptions model)
        {
            var yukIndekslers = _yukIndekslerService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) yukIndekslers = yukIndekslers.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 ||a.Kod.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = yukIndekslers.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = yukIndekslers.Count, recordsTotal = yukIndekslers.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult YukIndeks(int id)
        {
            var value = _yukIndekslerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("YukIndeksEkle")]
        public ActionResult YukIndeksEkle(YukIndeksEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _yukIndekslerService.Get(a => (a.Aktif == true) && (a.Kod == model.Kod || a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var yukIndeksEkle = new YukIndeksler
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
                _yukIndekslerService.Add(yukIndeksEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpPost("YukIndeksGuncelle")]
        public ActionResult YukIndeksGuncelle(YukIndeksGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var yukIndeks = _yukIndekslerService.GetByID(model.YukIndexID);
                if (yukIndeks == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _yukIndekslerService.Get(a => (a.Aktif == true) && (a.YukIndexID != model.YukIndexID)
                && (a.Ad == model.Ad || a.Kod == model.Kod || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                yukIndeks.Ad = model.Ad;
                yukIndeks.Kod = model.Kod;
                yukIndeks.Sira = model.Sira;
                yukIndeks.ListeAktiflik = model.ListeAktiflik;

                yukIndeks.DuzenleyenId = _userJWTInfo.GetInfo().id;
                yukIndeks.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _yukIndekslerService.Update(yukIndeks);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }


        [HttpGet("YukIndeksSil/{id}")]
        public ActionResult YukIndeksSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var yukIndeks = _yukIndekslerService.GetByID(id);
                if (yukIndeks == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                yukIndeks.Aktif = false;
                yukIndeks.DuzenleyenId = _userJWTInfo.GetInfo().id;
                yukIndeks.DuzenlemeTarihi = DateTime.Now;
                _yukIndekslerService.Update(yukIndeks);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}