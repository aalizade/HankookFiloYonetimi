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

    public class AracModelController : ControllerBase
    {
        IAracModellerService _aracModellerService;
        IAraclarService _araclarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AracModelController(IAracModellerService aracModellerService, IAraclarService araclarService, IHttpContextAccessor httpContextAccessor)
        {
            _aracModellerService = aracModellerService;
            _araclarService = araclarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult AracModeller()
        {
            var aracModellers = _aracModellerService.GetAll(a => a.Aktif == true).ToList();
            return Ok(aracModellers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult AracModeller(DataTablesOptions model)
        {
            var aracModellers = _aracModellerService.GetAll(a => a.Aktif == true && a.AracMarkaID == model.UstID).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) aracModellers = aracModellers.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = aracModellers.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = aracModellers.Count, recordsTotal = aracModellers.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult AracModel(int id)
        {
            var value = _aracModellerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AracModelEkle")]
        public ActionResult AracModelEkle(AracModelEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _aracModellerService.Get(a => (a.Aktif == true) && (a.AracMarkaID == model.AracMarkaID) && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var aracModelEkle = new AracModeller
                {
                    AracMarkaID = model.AracMarkaID,
                    AracKategoriID = model.AracKategoriID,
                    Ad = model.Ad,
                    Sira = model.Sira,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _aracModellerService.Add(aracModelEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("AracModelGuncelle")]
        public ActionResult AracModelGuncelle(AracModelGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aracModel = _aracModellerService.GetByID(model.AracModelID);
                if (aracModel == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _aracModellerService.Get(a => (a.Aktif == true) && (a.AracMarkaID == model.AracMarkaID) && (a.AracModelID != model.AracModelID)
                && (a.Ad == model.Ad || a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                aracModel.AracKategoriID = model.AracKategoriID;
                aracModel.Ad = model.Ad;
                aracModel.Sira = model.Sira;
                aracModel.ListeAktiflik = model.ListeAktiflik;

                aracModel.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aracModel.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _aracModellerService.Update(aracModel);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("AracModelSil/{id}")]
        public ActionResult AracModelSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var aracModel = _aracModellerService.GetByID(id);
                if (aracModel == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var aractaKullanildiMi = _araclarService.Get(a => a.Aktif == true && a.ModelID == aracModel.AracModelID);
                if (aractaKullanildiMi != null) return Ok(new { Error = "Bu araç modeli, bir araç kaydında kullanıldığı için silinemez." });
                aracModel.Aktif = false;
                aracModel.DuzenleyenId = _userJWTInfo.GetInfo().id;
                aracModel.DuzenlemeTarihi = DateTime.Now;
                _aracModellerService.Update(aracModel);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Araç modelini kullanan araç kaydı sayısını sorguluyoruz. Bu şekilde araç kategorisinin disabled olup olmayacağını client tarafında kontrol edeceğiz.
        [Authorize(Roles = Role.Admin)]
        [HttpGet("AracModelKullaniliyorMu/{modelID}")]
        public ActionResult AracModelKullaniliyorMu(int modelID)
        {
            var value = _araclarService.Get(a => a.ModelID == modelID && a.Aktif == true);
            if (value == null) return Ok(false); // araç modeli herhangi bir araçta kullanılmamış.
            return Ok(true); // araç modeli en az bir araçta kullanılmış.
        }

    }
}
