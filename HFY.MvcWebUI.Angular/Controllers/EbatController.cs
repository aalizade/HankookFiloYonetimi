using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Entities.Concrete;
using HFY.Core.Models.Ebat;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class EbatController : ControllerBase
    {
        IEbatlarService _ebatlarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public EbatController(IEbatlarService ebatlarService, IHttpContextAccessor httpContextAccessor)
        {
            _ebatlarService = ebatlarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult Ebatlar()
        {
            var ebatlars = _ebatlarService.GetAll(a => a.Aktif == true).ToList();
            return Ok(ebatlars);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult Ebatlar([FromBody] DataTablesOptions model)
        {
            var ebatlar = _ebatlarService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) ebatlar = ebatlar.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = ebatlar.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = ebatlar.Count, recordsTotal = ebatlar.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult Ebat(int id)
        {
            var value = _ebatlarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("EbatEkle")]
        public ActionResult EbatEkle(EbatEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _ebatlarService.Get(a => (a.Aktif == true) && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var ebatEkle = new Ebatlar
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
                _ebatlarService.Add(ebatEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("EbatGuncelle")]
        public ActionResult EbatGuncelle(EbatGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var ebat = _ebatlarService.GetByID(model.EbatID);
                if (ebat == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _ebatlarService.Get(a => (a.Aktif == true) && (a.EbatID != model.EbatID)
                && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                ebat.Ad = model.Ad;
                ebat.Sira = model.Sira;
                ebat.ListeAktiflik = model.ListeAktiflik;

                ebat.DuzenleyenId = _userJWTInfo.GetInfo().id;
                ebat.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _ebatlarService.Update(ebat);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("EbatSil/{id}")]
        public ActionResult EbatSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var ebat = _ebatlarService.GetByID(id);
                if (ebat == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                ebat.Aktif = false;
                ebat.DuzenleyenId = _userJWTInfo.GetInfo().id;
                ebat.DuzenlemeTarihi = DateTime.Now;
                _ebatlarService.Update(ebat);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

    }
}