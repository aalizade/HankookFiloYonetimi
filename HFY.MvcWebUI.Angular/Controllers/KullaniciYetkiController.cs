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
using HFY.Core.Models.KullaniciYetki;

namespace HFY.MvcWebUI.Angular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]
    public class KullaniciYetkiController : ControllerBase
    {
        IKullaniciYetkilerService _kullaniciYetkilerService;
        IFirmalarService _firmalarService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public KullaniciYetkiController(IKullaniciYetkilerService kullaniciYetkilerService, IFirmalarService firmalarService, IHttpContextAccessor httpContextAccessor)
        {
            _kullaniciYetkilerService = kullaniciYetkilerService;
            _firmalarService = firmalarService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpPost]
        public ActionResult KullaniciYetkiler(DataTablesOptions model)
        {
            var kullaniciYetkilers = RolBazliKullaniciYetkiListesi(model.UstID).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            //if (!string.IsNullOrEmpty(model.Search?.Value)) aksDuzens = aksDuzens;
            var filter = kullaniciYetkilers.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = kullaniciYetkilers.Count, recordsTotal = kullaniciYetkilers.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult KullaniciYetki(int id)
        {
            var value = _kullaniciYetkilerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("KullaniciYetkiEkle")]
        public ActionResult KullaniciYetkiEkle(KullaniciYetkiEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _kullaniciYetkilerService.Get(a => (a.Aktif == true) && (a.FirmaID == model.FirmaID && a.YetkiTip == model.YetkiTip && a.IlgiliID == model.IlgiliID));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var kullaniciYetkiEkle = new KullaniciYetkiler
                {
                    FirmaID = model.FirmaID,
                    YetkiTip = model.YetkiTip,
                    IlgiliID = model.IlgiliID,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _kullaniciYetkilerService.Add(kullaniciYetkiEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpGet("KullaniciYetkiSil/{id}")]
        public ActionResult KullaniciYetkiSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var kullaniciYetki = _kullaniciYetkilerService.GetByID(id);
                if (kullaniciYetki == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                kullaniciYetki.Aktif = false;
                kullaniciYetki.DuzenleyenId = _userJWTInfo.GetInfo().id;
                kullaniciYetki.DuzenlemeTarihi = DateTime.Now;
                _kullaniciYetkilerService.Update(kullaniciYetki);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Kullanıcının rolüne uygun bir şekilde kullanıcı yetki listesi döndürür.
        public List<KullaniciYetkiler> RolBazliKullaniciYetkiListesi(int IlgiliID)
        {
            var kullaniciYetkiler = new List<KullaniciYetkiler>();
            var ilgiliKullaniciBulucu = _firmalarService.GetByID(IlgiliID);
            if (ilgiliKullaniciBulucu != null)
            {
                if (ilgiliKullaniciBulucu.Aktif == true)
                {
                    if (_userJWTInfo.GetInfo().role == Role.Admin)
                    {
                        kullaniciYetkiler = _kullaniciYetkilerService.GetAll(a => a.Aktif == true && a.IlgiliID == IlgiliID && a.ListeAktiflik == true && a.YetkiTip == ilgiliKullaniciBulucu.Rol).ToList();
                    }
                    else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
                    {
                        kullaniciYetkiler = _kullaniciYetkilerService.GetAll(a => a.Aktif == true && a.IlgiliID == IlgiliID && a.ListeAktiflik == true && a.YetkiTip == ilgiliKullaniciBulucu.Rol).ToList();
                    }
                    else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi)
                    {
                        kullaniciYetkiler = _kullaniciYetkilerService.GetAll(a => a.Aktif == true && a.IlgiliID == IlgiliID && a.ListeAktiflik == true && a.YetkiTip == ilgiliKullaniciBulucu.Rol).ToList();
                    }
                    else if (_userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
                    {
                        kullaniciYetkiler = _kullaniciYetkilerService.GetAll(a => a.Aktif == true && a.IlgiliID == IlgiliID && a.ListeAktiflik == true && a.YetkiTip == ilgiliKullaniciBulucu.Rol).ToList();
                    }
                }
            }
            kullaniciYetkiler = kullaniciYetkiler.Distinct().ToList();
            return kullaniciYetkiler;
        }
    }
}