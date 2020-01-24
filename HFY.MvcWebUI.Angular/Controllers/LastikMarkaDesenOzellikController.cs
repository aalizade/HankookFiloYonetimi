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
using HFY.Core.Models.LastikMarkaDesenOzellik;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]
    public class LastikMarkaDesenOzellikController : ControllerBase
    {
        ILastikMarkaDesenOzelliklerService _lastikMarkaDesenOzelliklerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikMarkaDesenOzellikController(ILastikMarkaDesenOzelliklerService lastikMarkaDesenOzelliklerService, IHttpContextAccessor httpContextAccessor)
        {
            _lastikMarkaDesenOzelliklerService = lastikMarkaDesenOzelliklerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult LastikMarkaDesenOzellikler()
        {
            var lastikMarkaDesenOzelliklers = _lastikMarkaDesenOzelliklerService.GetAll(a => a.Aktif == true).ToList();
            return Ok(lastikMarkaDesenOzelliklers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult LastikMarkaDesenOzellikler([FromBody] DataTablesOptions model)
        {
            var lastikMarkaDesenOzellikler = _lastikMarkaDesenOzelliklerService.GetAll(a => a.Aktif == true && a.LastikMarkaDesenID == model.UstID).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikMarkaDesenOzellikler = lastikMarkaDesenOzellikler.Where(a => a.DisDerinligi.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.KatOrani.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = lastikMarkaDesenOzellikler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikMarkaDesenOzellikler.Count, recordsTotal = lastikMarkaDesenOzellikler.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult LastikMarkaDesenOzellik(int id)
        {
            var value = _lastikMarkaDesenOzelliklerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikMarkaDesenOzellikEkle")]
        public ActionResult LastikMarkaDesenOzellikEkle(LastikMarkaDesenOzellikEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _lastikMarkaDesenOzelliklerService.Get(a => (a.Aktif == true) && (a.LastikMarkaDesenID == model.LastikMarkaDesenID) && ((a.DisDerinligi == model.DisDerinligi && a.KatOrani == model.KatOrani && a.EbatID == model.EbatID))
                || (a.LastikMarkaDesenID == model.LastikMarkaDesenID && a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var lastikMarkaDesenOzellikEkle = new LastikMarkaDesenOzellikler
                {
                    DisDerinligi = model.DisDerinligi,
                    KatOrani = model.KatOrani,
                    LastikMarkaDesenID = model.LastikMarkaDesenID,
                    EbatID = model.EbatID,
                    Sira = model.Sira,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _lastikMarkaDesenOzelliklerService.Add(lastikMarkaDesenOzellikEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("LastikMarkaDesenOzellikGuncelle")]
        public ActionResult LastikMarkaDesenOzellikGuncelle(LastikMarkaDesenOzellikGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikMarkaDesenOzellik = _lastikMarkaDesenOzelliklerService.GetByID(model.LastikMarkaDesenOzellikID);
                if (lastikMarkaDesenOzellik == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _lastikMarkaDesenOzelliklerService.Get(a => (a.Aktif == true) && (a.LastikMarkaDesenID == lastikMarkaDesenOzellik.LastikMarkaDesenID) && (a.LastikMarkaDesenOzellikID != model.LastikMarkaDesenOzellikID)
                && ((a.DisDerinligi == model.DisDerinligi && a.KatOrani == model.KatOrani && a.EbatID == model.EbatID)) || (a.LastikMarkaDesenID == lastikMarkaDesenOzellik.LastikMarkaDesenID && a.LastikMarkaDesenOzellikID != model.LastikMarkaDesenOzellikID && a.Sira == model.Sira));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                lastikMarkaDesenOzellik.DisDerinligi = model.DisDerinligi;
                lastikMarkaDesenOzellik.KatOrani = model.KatOrani;
                lastikMarkaDesenOzellik.EbatID = model.EbatID;
                lastikMarkaDesenOzellik.Sira = model.Sira;
                lastikMarkaDesenOzellik.ListeAktiflik = model.ListeAktiflik;

                lastikMarkaDesenOzellik.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikMarkaDesenOzellik.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _lastikMarkaDesenOzelliklerService.Update(lastikMarkaDesenOzellik);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("LastikMarkaDesenOzellikSil/{id}")]
        public ActionResult LastikMarkaDesenOzellikSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var lastikMarkaDesenOzellik = _lastikMarkaDesenOzelliklerService.GetByID(id);
                if (lastikMarkaDesenOzellik == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                lastikMarkaDesenOzellik.Aktif = false;
                lastikMarkaDesenOzellik.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikMarkaDesenOzellik.DuzenlemeTarihi = DateTime.Now;
                _lastikMarkaDesenOzelliklerService.Update(lastikMarkaDesenOzellik);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Diş Derinliğini lastik ekleme ekranında otomatik getirmek için, lastik marka desen id'sine ve ebat id'sine ihtiyacımız vardır.
        [HttpGet("LastikMarkaDesenOzellikDisDerinligi/{LastikMarkaDesenID}/{EbatID}")]
        public ActionResult LastikMarkaDesenOzellikDisDerinligi(int LastikMarkaDesenID, int EbatID)
        {
            var value = _lastikMarkaDesenOzelliklerService.Get(a => a.LastikMarkaDesenID == LastikMarkaDesenID && a.EbatID == EbatID && a.Aktif == true && a.ListeAktiflik == true);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }
    }
}