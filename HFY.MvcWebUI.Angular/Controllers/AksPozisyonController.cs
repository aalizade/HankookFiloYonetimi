using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Business.Abstract;
using HFY.Core.Classes.JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;
using Microsoft.Extensions.Configuration;
using HFY.Core.Models.Firma;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using HFY.Entities.Concrete;

namespace HFY.MvcWebUI.Angular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class AksPozisyonController : ControllerBase
    {
        IAksPozisyonService _aksPozisyonService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AksPozisyonController(IAksPozisyonService aksPozisyonService, IHttpContextAccessor httpContextAccessor)
        {
            _aksPozisyonService = aksPozisyonService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }


        [HttpGet]
        public ActionResult AksPozisyonlar()
        {
            var aksPozisyonlar = _aksPozisyonService.GetAll(a => a.Aktif == true).ToList();
            return Ok(aksPozisyonlar);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult AksPozisyonlar(DataTablesOptions model)
        {
            var aksPozisyons = _aksPozisyonService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) aksPozisyons = aksPozisyons.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = aksPozisyons.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = aksPozisyons.Count, recordsTotal = aksPozisyons.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult AksPozisyon(int id)
        {
            var value = _aksPozisyonService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AksPozisyonEkle")]
        public ActionResult AksPozisyonEkle(AksPozisyonEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _aksPozisyonService.Get(a => (a.Aktif == true) && ( a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli Aks Pozisyon bilgileri kullanın." });
                var aksPozisyonEkle = new AksPozisyon
                {
                    Ad = model.Ad,
                    AksNo = model.AksNo,
                    IcDisId = model.IcDisId,
                    OnArkaId = model.OnArkaId,
                    Pozisyon = model.Pozisyon,
                    Sira = model.Sira,
                    SolSagId = model.SolSagId,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _aksPozisyonService.Add(aksPozisyonEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AksPozisyonGuncelle")]
        public ActionResult AksPozisyonGuncelle(AksPozisyonGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aksPozisyon = _aksPozisyonService.GetByID(model.AksPozisyonID);
                if (aksPozisyon == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _aksPozisyonService.Get(a => (a.Aktif == true) && (a.AksPozisyonID != model.AksPozisyonID)
                && ( a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                aksPozisyon.Ad = model.Ad;
                aksPozisyon.AksNo = model.AksNo;
                aksPozisyon.IcDisId = model.IcDisId;
                aksPozisyon.OnArkaId = model.OnArkaId;
                aksPozisyon.Pozisyon = model.Pozisyon;
                aksPozisyon.Ceker = model.Ceker;
                aksPozisyon.Sira = model.Sira;
                aksPozisyon.SolSagId = model.SolSagId;
                aksPozisyon.ListeAktiflik = model.ListeAktiflik;

                aksPozisyon.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aksPozisyon.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _aksPozisyonService.Update(aksPozisyon);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("AksPozisyonSil/{id}")]
        public ActionResult AksPozisyonSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aksPozisyon = _aksPozisyonService.GetByID(id);
                if (aksPozisyon == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                aksPozisyon.Aktif = false;
                aksPozisyon.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aksPozisyon.DuzenlemeTarihi = DateTime.Now;
                _aksPozisyonService.Update(aksPozisyon);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}