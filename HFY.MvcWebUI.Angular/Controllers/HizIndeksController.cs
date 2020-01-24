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
    public class HizIndeksController : ControllerBase
    {
        IHizIndekslerService _hizIndekslerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public HizIndeksController(IHizIndekslerService hizIndekslerService, IHttpContextAccessor httpContextAccessor)
        {
            _hizIndekslerService = hizIndekslerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpPost]
        public ActionResult HizIndeksler(DataTablesOptions model)
        {
            var hizIndekslers = _hizIndekslerService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) hizIndekslers = hizIndekslers.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 ||a.Kod.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = hizIndekslers.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = hizIndekslers.Count, recordsTotal = hizIndekslers.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult HizIndeks(int id)
        {
            var value = _hizIndekslerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("HizIndeksEkle")]
        public ActionResult HizIndeksEkle(HizIndeksEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _hizIndekslerService.Get(a => (a.Aktif == true) && (a.Kod == model.Kod || a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var hizIndeksEkle = new HizIndeksler
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
                _hizIndekslerService.Add(hizIndeksEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpPost("HizIndeksGuncelle")]
        public ActionResult HizIndeksGuncelle(HizIndeksGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var hizIndeks = _hizIndekslerService.GetByID(model.HizIndexID);
                if (hizIndeks == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _hizIndekslerService.Get(a => (a.Aktif == true) && (a.HizIndexID != model.HizIndexID)
                && (a.Ad == model.Ad || a.Kod == model.Kod || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                hizIndeks.Ad = model.Ad;
                hizIndeks.Kod = model.Kod;
                hizIndeks.Sira = model.Sira;
                hizIndeks.ListeAktiflik = model.ListeAktiflik;

                hizIndeks.DuzenleyenId = _userJWTInfo.GetInfo().id;
                hizIndeks.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _hizIndekslerService.Update(hizIndeks);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }


        [HttpGet("HizIndeksSil/{id}")]
        public ActionResult HizIndeksSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var hizIndeks = _hizIndekslerService.GetByID(id);
                if (hizIndeks == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                hizIndeks.Aktif = false;
                hizIndeks.DuzenleyenId = _userJWTInfo.GetInfo().id;
                hizIndeks.DuzenlemeTarihi = DateTime.Now;
                _hizIndekslerService.Update(hizIndeks);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}