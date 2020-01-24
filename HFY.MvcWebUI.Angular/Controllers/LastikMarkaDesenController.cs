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
using HFY.Core.Models.LastikMarkaDesen;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class LastikMarkaDesenController : ControllerBase
    {
        ILastikMarkaDesenlerService _lastikMarkaDesenlerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikMarkaDesenController(ILastikMarkaDesenlerService lastikMarkaDesenlerService, IHttpContextAccessor httpContextAccessor)
        {
            _lastikMarkaDesenlerService = lastikMarkaDesenlerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult LastikMarkaDesenler()
        {
            var lastikMarkaDesenlers = _lastikMarkaDesenlerService.GetAll(a => a.Aktif == true).ToList();
            return Ok(lastikMarkaDesenlers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult LastikMarkaDesenler([FromBody] DataTablesOptions model)
        {
            var lastikMarkaDesenler = _lastikMarkaDesenlerService.GetAll(a => a.Aktif == true && a.LastikMarkaID == model.UstID).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikMarkaDesenler = lastikMarkaDesenler.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = lastikMarkaDesenler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikMarkaDesenler.Count, recordsTotal = lastikMarkaDesenler.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult LastikMarka(int id)
        {
            var value = _lastikMarkaDesenlerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikMarkaDesenEkle")]
        public ActionResult LastikMarkaDesenEkle(LastikMarkaDesenEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _lastikMarkaDesenlerService.Get(a => (a.Aktif == true) && (a.LastikMarkaID == model.LastikMarkaID) && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikMarkaDesenEkle = new LastikMarkaDesenler
                {
                    Ad = model.Ad,
                    LastikMarkaID = model.LastikMarkaID,
                    Sira = model.Sira,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikMarkaDesenlerService.Add(lastikMarkaDesenEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikMarkaDesenGuncelle")]
        public ActionResult LastikMarkaDesenGuncelle(LastikMarkaDesenGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikMarkaDesen = _lastikMarkaDesenlerService.GetByID(model.LastikMarkaDesenID);
                if (lastikMarkaDesen == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _lastikMarkaDesenlerService.Get(a => (a.Aktif == true) && (a.LastikMarkaID == lastikMarkaDesen.LastikMarkaID) && (a.LastikMarkaDesenID != model.LastikMarkaDesenID)
                && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                lastikMarkaDesen.Ad = model.Ad;
                lastikMarkaDesen.Sira = model.Sira;
                lastikMarkaDesen.ListeAktiflik = model.ListeAktiflik;

                lastikMarkaDesen.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikMarkaDesen.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _lastikMarkaDesenlerService.Update(lastikMarkaDesen);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("LastikMarkaDesenSil/{id}")]
        public ActionResult LastikMarkaDesenSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikMarkaDesen = _lastikMarkaDesenlerService.GetByID(id);
                if (lastikMarkaDesen == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                lastikMarkaDesen.Aktif = false;
                lastikMarkaDesen.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikMarkaDesen.DuzenlemeTarihi = DateTime.Now;
                _lastikMarkaDesenlerService.Update(lastikMarkaDesen);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}