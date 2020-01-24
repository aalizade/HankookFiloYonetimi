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

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class LastikMarkaController : ControllerBase
    {
        ILastikMarkalarService _lastikMarkalarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikMarkaController(ILastikMarkalarService lastikMarkalarService, IHttpContextAccessor httpContextAccessor)
        {
            _lastikMarkalarService = lastikMarkalarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult LastikMarkalar()
        {
            var lastikMarkalars = _lastikMarkalarService.GetAll(a => a.Aktif == true).ToList();
            return Ok(lastikMarkalars);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult LastikMarkalar([FromBody] DataTablesOptions model)
        {
            var lastikMarkalar = _lastikMarkalarService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikMarkalar = lastikMarkalar.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.Kod.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = lastikMarkalar.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikMarkalar.Count, recordsTotal = lastikMarkalar.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult LastikMarka(int id)
        {
            var value = _lastikMarkalarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikMarkaEkle")]
        public ActionResult LastikMarkaEkle(LastikMarkaEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _lastikMarkalarService.Get(a => (a.Aktif == true) && (a.Ad == model.Ad || a.Kod == model.Kod || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikMarkaEkle = new LastikMarkalar
                {
                    Ad = model.Ad,
                    Kod = model.Kod,
                    KaplamaMarka = model.KaplamaMarka,
                    Sira = model.Sira,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikMarkalarService.Add(lastikMarkaEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikMarkaGuncelle")]
        public ActionResult LastikMarkaGuncelle(LastikMarkaGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikMarka = _lastikMarkalarService.GetByID(model.LastikMarkaID);
                if (lastikMarka == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _lastikMarkalarService.Get(a => (a.Aktif == true) && (a.LastikMarkaID != model.LastikMarkaID)
                && (a.Ad == model.Ad || a.Kod == model.Kod || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                lastikMarka.Ad = model.Ad;
                lastikMarka.Kod = model.Kod;
                lastikMarka.KaplamaMarka = model.KaplamaMarka;
                lastikMarka.Sira = model.Sira;
                lastikMarka.ListeAktiflik = model.ListeAktiflik;

                lastikMarka.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikMarka.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _lastikMarkalarService.Update(lastikMarka);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("LastikMarkaSil/{id}")]
        public ActionResult LastikMarkaSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikMarka = _lastikMarkalarService.GetByID(id);
                if (lastikMarka == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                lastikMarka.Aktif = false;
                lastikMarka.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikMarka.DuzenlemeTarihi = DateTime.Now;
                _lastikMarkalarService.Update(lastikMarka);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}