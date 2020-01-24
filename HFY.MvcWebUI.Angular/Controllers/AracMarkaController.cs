using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HFY.DataAccess.Concrete.EntityFramework;
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
    public class AracMarkaController : ControllerBase
    {
        IAracMarkalarService _aracMarkalarService;
        IAraclarService _araclarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AracMarkaController(IAracMarkalarService aracMarkalarService, IAraclarService araclarService, IHttpContextAccessor httpContextAccessor)
        {
            _aracMarkalarService = aracMarkalarService;
            _araclarService = araclarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult AracMarkalar()
        {
            var aracMarkalars = _aracMarkalarService.GetAll(a => a.Aktif == true).ToList();
            return Ok(aracMarkalars);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult AracMarkalar(DataTablesOptions model)
        {
            var aracMarkalars = _aracMarkalarService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) aracMarkalars = aracMarkalars.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = aracMarkalars.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = aracMarkalars.Count, recordsTotal = aracMarkalars.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult AracMarka(int id)
        {
            var value = _aracMarkalarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AracMarkaEkle")]
        public ActionResult AracMarkaEkle(AracMarkaEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _aracMarkalarService.Get(a => (a.Aktif == true) && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var aracMarkaEkle = new AracMarkalar
                {
                    Ad = model.Ad,
                    Sira = model.Sira,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _aracMarkalarService.Add(aracMarkaEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AracMarkaGuncelle")]
        public ActionResult AracMarkaGuncelle(AracMarkaGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aracMarka = _aracMarkalarService.GetByID(model.AracMarkaID);
                if (aracMarka == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _aracMarkalarService.Get(a => (a.Aktif == true) && (a.AracMarkaID != model.AracMarkaID)
                && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                aracMarka.Ad = model.Ad;
                aracMarka.Sira = model.Sira;
                aracMarka.ListeAktiflik = model.ListeAktiflik;

                aracMarka.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aracMarka.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _aracMarkalarService.Update(aracMarka);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("AracMarkaSil/{id}")]
        public ActionResult AracMarkaSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aracMarka = _aracMarkalarService.GetByID(id);
                if (aracMarka == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var aractaKullanildiMi = _araclarService.Get(a => a.Aktif == true && a.MarkaID == aracMarka.AracMarkaID);
                if (aractaKullanildiMi != null) return Ok(new { Error = "Bu araç markası, bir araç kaydında kullanıldığı için silinemez." });
                aracMarka.Aktif = false;
                aracMarka.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aracMarka.DuzenlemeTarihi = DateTime.Now;
                _aracMarkalarService.Update(aracMarka);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}
