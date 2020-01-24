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
    public class AksDuzenController : ControllerBase
    {
        IAksDuzenService _aksDuzenService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AksDuzenController(IAksDuzenService aksDuzenService, IHttpContextAccessor httpContextAccessor)
        {
            _aksDuzenService = aksDuzenService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult AksDuzenler(DataTablesOptions model)
        {
            var aksDuzens = _aksDuzenService.GetAll(a => a.Aktif == true && a.AracKategoriID == model.UstID).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            //if (!string.IsNullOrEmpty(model.Search?.Value)) aksDuzens = aksDuzens;
            var filter = aksDuzens.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = aksDuzens.Count, recordsTotal = aksDuzens.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult AksDuzen(int id)
        {
            var value = _aksDuzenService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AksDuzenEkle")]
        public ActionResult AksDuzenEkle(AksDuzenEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _aksDuzenService.Get(a => (a.Aktif == true) && (a.AracKategoriID == model.AracKategoriID && a.AksPozisyonID == model.AksPozisyonID));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var aksDuzenEkle = new AksDuzen
                {
                    AracKategoriID = model.AracKategoriID,
                    AksPozisyonID = model.AksPozisyonID,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _aksDuzenService.Add(aksDuzenEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AksDuzenGuncelle")]
        public ActionResult AksDuzenGuncelle(AksDuzenGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aksDuzen = _aksDuzenService.GetByID(model.AksDuzenID);
                if (aksDuzen == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _aksDuzenService.Get(a => (a.Aktif == true) && (a.AksDuzenID != model.AksDuzenID)
                && (a.AracKategoriID == model.AracKategoriID && a.AksPozisyonID == model.AksPozisyonID));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                aksDuzen.AracKategoriID = model.AracKategoriID;
                aksDuzen.AksPozisyonID = model.AksPozisyonID;
                aksDuzen.ListeAktiflik = model.ListeAktiflik;

                aksDuzen.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aksDuzen.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _aksDuzenService.Update(aksDuzen);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("AksDuzenSil/{id}")]
        public ActionResult AksDuzenSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aksDuzen = _aksDuzenService.GetByID(id);
                if (aksDuzen == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                aksDuzen.Aktif = false;
                aksDuzen.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aksDuzen.DuzenlemeTarihi = DateTime.Now;
                _aksDuzenService.Update(aksDuzen);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}