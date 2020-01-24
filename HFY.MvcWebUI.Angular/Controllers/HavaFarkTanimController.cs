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
using HFY.Core.Models.HavaFarkTanimlar;

namespace HFY.MvcWebUI.Angular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin)]
    public class HavaFarkTanimController : ControllerBase
    {
        IHavaFarkTanimlarService _havaFarkTanimlarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public HavaFarkTanimController(IHavaFarkTanimlarService havaFarkTanimlarService, IHttpContextAccessor httpContextAccessor)
        {
            _havaFarkTanimlarService = havaFarkTanimlarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult HavaFarkTanimlar()
        {
            var havaFarkTanimlars = _havaFarkTanimlarService.GetAll(a => a.Aktif == true).ToList();
            return Ok(havaFarkTanimlars);
        }

        [HttpPost]
        public ActionResult HavaFarkTanimlar(DataTablesOptions model)
        {
            var havaFarkTanimlars = _havaFarkTanimlarService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) havaFarkTanimlars = havaFarkTanimlars.Where(a => a.Tanim.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = havaFarkTanimlars.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = havaFarkTanimlars.Count, recordsTotal = havaFarkTanimlars.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult HavaFarkTanim(int id)
        {
            var value = _havaFarkTanimlarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("HavaFarkTanimEkle")]
        public ActionResult HavaFarkTanimEkle(HavaFarkTanimEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _havaFarkTanimlarService.Get(a => (a.Aktif == true) && (a.Tanim == model.Tanim || a.HavaFarkMinimumYuzde == model.HavaFarkMinimumYuzde || a.HavaFarkMaksimumYuzde == model.HavaFarkMaksimumYuzde));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var havaFarkTanimEkle = new HavaFarkTanimlar
                {
                    Tanim = model.Tanim,
                    HavaFarkMinimumYuzde = model.HavaFarkMinimumYuzde,
                    HavaFarkMaksimumYuzde = model.HavaFarkMaksimumYuzde,
                    Kayip = model.Kayip,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _havaFarkTanimlarService.Add(havaFarkTanimEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpPost("HavaFarkTanimGuncelle")]
        public ActionResult HavaFarkTanimGuncelle(HavaFarkTanimGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var havaFarkTanim = _havaFarkTanimlarService.GetByID(model.HavaFarkID);
                if (havaFarkTanim == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _havaFarkTanimlarService.Get(a => (a.Aktif == true) && (a.HavaFarkID != model.HavaFarkID)
                && (a.Tanim == model.Tanim || a.HavaFarkMinimumYuzde == model.HavaFarkMinimumYuzde || a.HavaFarkMaksimumYuzde == model.HavaFarkMaksimumYuzde));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                havaFarkTanim.Tanim = model.Tanim;
                havaFarkTanim.HavaFarkMinimumYuzde = model.HavaFarkMinimumYuzde;
                havaFarkTanim.HavaFarkMaksimumYuzde = model.HavaFarkMaksimumYuzde;
                havaFarkTanim.Kayip = model.Kayip;
                havaFarkTanim.ListeAktiflik = model.ListeAktiflik;

                havaFarkTanim.DuzenleyenId = _userJWTInfo.GetInfo().id;
                havaFarkTanim.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _havaFarkTanimlarService.Update(havaFarkTanim);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }


        [HttpGet("HavaFarkTanimSil/{id}")]
        public ActionResult HavaFarkTanimSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var havaFarkTanim = _havaFarkTanimlarService.GetByID(id);
                if (havaFarkTanim == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                havaFarkTanim.Aktif = false;
                havaFarkTanim.DuzenleyenId = _userJWTInfo.GetInfo().id;
                havaFarkTanim.DuzenlemeTarihi = DateTime.Now;
                _havaFarkTanimlarService.Update(havaFarkTanim);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}