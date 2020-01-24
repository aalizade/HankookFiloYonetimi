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
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]
    public class AracController : ControllerBase
    {
        IAraclarService _araclarService;
        IAracMarkalarService _aracMarkalarService;
        IAracModellerService _aracModellerService;
        IAracKategorilerService _aracKategorilerService;
        IFirmalarService _firmalarService;
        IKullaniciYetkilerService _kullaniciYetkilerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public AracController(IAraclarService araclarService, IFirmalarService firmalarService, IKullaniciYetkilerService kullaniciYetkilerService,
                    IAracMarkalarService aracMarkalarService,
        IAracModellerService aracModellerService,
        IAracKategorilerService aracKategorilerService,
        IHttpContextAccessor httpContextAccessor)
        {
            _araclarService = araclarService;
            _aracMarkalarService = aracMarkalarService;
            _aracModellerService = aracModellerService;
            _aracKategorilerService = aracKategorilerService;
            _firmalarService = firmalarService;
            _kullaniciYetkilerService = kullaniciYetkilerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpPost]
        public ActionResult Araclar(DataTablesOptions model)
        {
            var araclars = RolBazliAracListesi().AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            var sorguAraclar = RolBazliAracListesi().AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();



            if (!string.IsNullOrEmpty(model.Search?.Value)) araclars = araclars.Where(a => a.Plaka.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();

            if (!string.IsNullOrEmpty(model.Search?.Value))
            {
                // firma filter
                var firmalar = _firmalarService.GetAll(a => a.FirmaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                firmalar.ForEach(firmaItem =>
                {
                    var firmaIceriyorMu = sorguAraclar.Where(a => a.FirmaID == firmaItem.FirmaID);
                    if (firmaIceriyorMu.Count() > 0)
                    {
                        araclars.AddRange(firmaIceriyorMu);
                    }
                });

                // araç marka filter
                var aracMarkalar = _aracMarkalarService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                aracMarkalar.ForEach(aracMarkaItem =>
                {
                    var aracMarkaIceriyorMu = sorguAraclar.Where(a => a.MarkaID == aracMarkaItem.AracMarkaID);
                    if (aracMarkaIceriyorMu.Count() > 0)
                    {
                        araclars.AddRange(aracMarkaIceriyorMu);
                    }
                });

                // araç model filter
                var aracModeller = _aracModellerService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                aracModeller.ForEach(aracModelItem =>
                {
                    var aracModelIceriyorMu = sorguAraclar.Where(a => a.ModelID == aracModelItem.AracModelID);
                    if (aracModelIceriyorMu.Count() > 0)
                    {
                        araclars.AddRange(aracModelIceriyorMu);
                    }
                });

                // araç kategori filter
                var aracKategoriler = _aracKategorilerService.GetAll(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 && a.Aktif == true);
                aracKategoriler.ForEach(aracKategoriItem =>
                {
                    sorguAraclar.ForEach(aracItem =>
                    {
                        var aracModelBulucu = _aracModellerService.Get(a => a.AracModelID == aracItem.ModelID && a.AracKategoriID == aracKategoriItem.AracKategoriID);
                        if (aracModelBulucu != null)
                        {
                            var aracKategoriIceriyorMu = sorguAraclar.Where(a => a.ModelID == aracModelBulucu.AracModelID);
                            if (aracKategoriIceriyorMu.Count() > 0)
                            {
                                araclars.AddRange(aracKategoriIceriyorMu);
                            }
                        }
                    });
                });

            }

            araclars = araclars.Distinct().ToList();

            var filter = araclars.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = araclars.Count, recordsTotal = araclars.Count, data = filter });
        }

        [HttpGet("{id}")]
        public ActionResult Arac(int id)
        {
            var value = _araclarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpPost("AracEkle")]
        public ActionResult AracEkle(AracEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var benzerKayit = _araclarService.Get(a => (a.Aktif == true) && (a.Plaka == model.Plaka));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bilgiler girmeyi deneyin." });
                var aracEkle = new Araclar
                {
                    Plaka = model.Plaka.ToUpper(),
                    FirmaID = model.FirmaID,
                    MarkaID = model.MarkaID,
                    ModelID = model.ModelID,
                    Aks1 = model.Aks1,
                    Aks2 = model.Aks2,
                    Aks3 = model.Aks3,
                    Aks4 = model.Aks4,
                    Aktif = true,
                    ListeAktiflik = true,
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _araclarService.Add(aracEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓", Result = new { AracID = aracEkle.AracID } });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpPost("AracGuncelle")]
        public ActionResult AracGuncelle(AracGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var arac = _araclarService.GetByID(model.AracID);
                if (arac == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                var benzerKayit = _araclarService.Get(a => (a.Aktif == true) && (a.AracID != model.AracID)
                && (a.Plaka == model.Plaka));
                if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen bilgiler girmeyi deneyin." });

                arac.Plaka = model.Plaka.ToUpper();
                arac.MarkaID = model.MarkaID;
                arac.ModelID = model.ModelID;
                arac.FirmaID = model.FirmaID;
                arac.Aks1 = model.Aks1;
                arac.Aks2 = model.Aks2;
                arac.Aks3 = model.Aks3;
                arac.Aks4 = model.Aks4;

                arac.ListeAktiflik = model.ListeAktiflik;

                arac.DuzenleyenId = _userJWTInfo.GetInfo().id;
                arac.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _araclarService.Update(arac);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpGet("AracSil/{id}")]
        public ActionResult AracSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var arac = _araclarService.GetByID(id);
                if (arac == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                arac.Aktif = false;
                arac.DuzenleyenId = _userJWTInfo.GetInfo().id;
                arac.DuzenlemeTarihi = DateTime.Now;
                _araclarService.Update(arac);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        // Araç Bakım alanına tıklandığında ve plaka girildiğinde, giriş yapmış kullanıcının o plakaya erişim iznini kontrol eder. Duruma göre bir yanıt döndürür.
        [HttpGet("AracErisimDogrula/{plaka}")]
        public ActionResult AracErisimDogrula(string plaka)
        {
            if (string.IsNullOrEmpty(plaka))
            {
                return Ok(new { Error = "Plaka boş değer olarak geldi." });
            }
            else
            {
                var arac = _araclarService.Get(a => a.Plaka == plaka && a.Aktif == true);
                if (arac != null)
                {
                    if (_userJWTInfo.GetInfo().role == Role.Admin) return Ok(new { MessageType = 1, Result = arac.AracID });
                    else
                    {
                        if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
                        {
                            var yetkiliOlduklariSubeler = new List<Firmalar>();
                            var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                            // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                            yetkiliOlduklariListe.AddRange(_kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma));
                            yetkiliOlduklariListe.Where(a => a.YetkiTip == Role._Firma).ToList().ForEach(yetkiliItem =>
                            {
                                var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                                yetkiliOlduklariSubeler.AddRange(firmaninAltSubeleri);
                            });

                            if (arac.OlusturanId == _userJWTInfo.GetInfo().id || yetkiliOlduklariListe.FirstOrDefault(a => a.IlgiliID == arac.FirmaID) != null || yetkiliOlduklariSubeler.FirstOrDefault(a => a.FirmaID == arac.FirmaID) != null)
                            {
                                return Ok(new { MessageType = 1, Result = arac.AracID });
                            }
                        }
                        else
                        {
                            if (arac.OlusturanId == _userJWTInfo.GetInfo().id)
                            {
                                return Ok(new { MessageType = 1, Result = arac.AracID });
                            }
                        }
                    }
                    return Ok(new { Error = "Bu plakaya erişim izniniz bulunmamaktadır." });
                }
                else
                {
                    return Ok(new { Error = "Sistemde böyle bir plaka bulunmamaktadır." });
                }
            }
        }

        // Kullanıcının rolüne uygun bir şekilde araç listesi döndürür.
        public List<Araclar> RolBazliAracListesi()
        {
            var araclars = new List<Araclar>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                araclars = _araclarService.GetAll(a => a.Aktif == true);
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                araclars = _araclarService.GetAll(a => a.Aktif == true && a.OlusturanId == _userJWTInfo.GetInfo().id);
                //
                var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                yetkiliOlduklariListe.ForEach(yetkiliItem =>
                {
                    araclars.AddRange(_araclarService.GetAll(a => a.Aktif == true && (a.OlusturanId == yetkiliItem.IlgiliID || a.FirmaID == yetkiliItem.IlgiliID)));
                });
                // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma);
                yetkiliOlduklariListe.ForEach(yetkiliItem =>
                {
                    araclars.AddRange(_araclarService.GetAll(a => a.Aktif == true && (a.OlusturanId == yetkiliItem.IlgiliID || a.FirmaID == yetkiliItem.IlgiliID)));
                    var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                    foreach (var item in firmaninAltSubeleri)
                    {
                        araclars.AddRange(_araclarService.GetAll(a => a.Aktif == true && (a.OlusturanId == item.FirmaID || a.FirmaID == item.FirmaID)));
                    }
                });
            }
            else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi || _userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
            {
                araclars = _araclarService.GetAll(a => a.Aktif == true && a.OlusturanId == _userJWTInfo.GetInfo().id);
            }
            araclars = araclars.GroupBy(p => p.AracID).Select(grp => grp.FirstOrDefault()).ToList();
            return araclars;
        }
    }
}