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
    public class AracKategoriController : ControllerBase
    {
        IAracKategorilerService _aracKategorilerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AracKategoriController(IAracKategorilerService aracKategorilerService, IHttpContextAccessor httpContextAccessor)
        {
            _aracKategorilerService = aracKategorilerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult AracKategoriler()
        {
            var aracKategorilers = _aracKategorilerService.GetAll(a => a.Aktif == true).ToList();
            return Ok(aracKategorilers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult AracKategoriler(DataTablesOptions model)
        {
            var aracKategorilers = _aracKategorilerService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) aracKategorilers = aracKategorilers.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = aracKategorilers.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = aracKategorilers.Count, recordsTotal = aracKategorilers.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult AracKategori(int id)
        {
            var value = _aracKategorilerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AracKategoriEkle")]
        public ActionResult AracKategoriEkle(AracKategoriEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _aracKategorilerService.Get(a => (a.Aktif == true) && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var aracKategoriEkle = new AracKategoriler
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
                _aracKategorilerService.Add(aracKategoriEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AracKategoriGuncelle")]
        public ActionResult AracKategoriGuncelle(AracKategoriGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aracKategori = _aracKategorilerService.GetByID(model.AracKategoriID);
                if (aracKategori == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _aracKategorilerService.Get(a => (a.Aktif == true) && (a.AracKategoriID != model.AracKategoriID)
                && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                aracKategori.Ad = model.Ad;
                aracKategori.Sira = model.Sira;
                aracKategori.ListeAktiflik = model.ListeAktiflik;

                aracKategori.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aracKategori.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _aracKategorilerService.Update(aracKategori);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("AracKategoriSil/{id}")]
        public ActionResult AracKategoriSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aracKategori = _aracKategorilerService.GetByID(id);
                if (aracKategori == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                aracKategori.Aktif = false;
                aracKategori.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aracKategori.DuzenlemeTarihi = DateTime.Now;
                _aracKategorilerService.Update(aracKategori);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}
