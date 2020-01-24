using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Core.Models.Firma;
using HFY.Entities.Concrete;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," + Role.IsletmeKullanicisi + "," + Role.FirmaKullanicisi + "," + Role.SubeKullanicisi)]
    public class FirmaController : ControllerBase
    {
        IFirmalarService _firmalarService;
        IKullaniciYetkilerService _kullaniciYetkilerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public FirmaController(IFirmalarService firmalarService, IKullaniciYetkilerService kullaniciYetkilerService, IHttpContextAccessor httpContextAccessor)
        {
            _firmalarService = firmalarService;
            _kullaniciYetkilerService = kullaniciYetkilerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult Firmalar()
        {
            var firmalars = RolBazliFirmaListesi();
            return Ok(firmalars);
        }

        [HttpPost]
        public ActionResult Firmalar(DataTablesOptions model)
        {
            var firmalar = RolBazliFirmaListesi("FirmaListesi").Select(a => new { a.FirmaID, a.FirmaAd, a.FirmaKisaAd, a.YetkiliKisi, a.BagliOlduguID, a.VergiTCNo, a.Aktif }).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) firmalar = firmalar.Where(a => a.FirmaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.VergiTCNo.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = firmalar.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = firmalar.Count, recordsTotal = firmalar.Count, data = filter });
        }


        [HttpGet("Isletmeler")]
        public ActionResult Isletmeler()
        {
            var isletmelers = RolBazliIsletmeListesi();
            return Ok(isletmelers);
        }

        [HttpPost("Isletmeler")]
        public ActionResult Isletmeler(DataTablesOptions model)
        {
            var isletmeler = RolBazliIsletmeListesi().Select(a => new { a.FirmaID, a.FirmaAd, a.FirmaKisaAd, a.VergiTCNo, a.Aktif }).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) isletmeler = isletmeler.Where(a => a.FirmaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.VergiTCNo.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = isletmeler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = isletmeler.Count, recordsTotal = isletmeler.Count, data = filter });
        }

        [HttpGet("GetAllActives")]
        public ActionResult GetAllActives()
        {
            var firmalar = RolBazliFirmaListesi();
            return Ok(firmalar);
        }

        [HttpGet("GetAllActivesWithBagliID")]
        public ActionResult GetAllActivesWithBagliID()
        {
            var firmalar = RolBazliFirmaListesiGetAllActivesWithBagliID();
            return Ok(firmalar);
        }

        [HttpPost("Subeler")]
        public ActionResult Subeler(DataTablesOptions model)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var subeler = RolBazliSubeListesi().AsQueryable().Select(a => new { a.FirmaID, a.FirmaAd, a.YetkiliKisi, a.BagliOlduguID, a.FirmaKisaAd, a.VergiTCNo, a.Aktif }).OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
                if (!string.IsNullOrEmpty(model.Search?.Value)) subeler = subeler.Where(a => a.FirmaAd.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.VergiTCNo.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
                var filter = subeler.Skip(model.Start).Take(model.Length).ToList();
                return Ok(new { draw = model.Draw, recordsFiltered = subeler.Count, recordsTotal = subeler.Count, data = filter });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpGet("{id}")]
        public ActionResult Firma(int id)
        {
            var value = _firmalarService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }

        [HttpGet("FirmaHizmetler/{id}")]
        public ActionResult FirmaHizmetler(int id)
        {
            // Firmanın kendisine seçtiği hizmetler
            var value = _firmalarService.GetAll(a => a.FirmaID == id && a.Aktif == true).ToList();
            return Ok(value);
        }

        [HttpGet("FirmaAracGruplar/{id}")]
        public ActionResult FirmaAracGruplar(int id)
        {
            // Firmanın kendisine seçtiği araç grupları
            var value = _firmalarService.GetAll(a => a.FirmaID == id && a.Aktif == true).ToList();
            return Ok(value);
        }

        [HttpPost("FirmaEkle")]
        public ActionResult FirmaEkle(FirmaEkleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                bool isletmeFirmaSube = false;
                if (model.Rol == Role._Isletme || model.Rol == Role._Firma || model.Rol == Role._Sube)
                {
                    var benzerKayit = _firmalarService.Get(a => (a.Aktif == true) && (a.FirmaAd == model.FirmaAd || a.VergiTCNo == model.VergiTCNo));
                    if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bir firma adı ya da vergi numarası kullanın." });
                    isletmeFirmaSube = true;
                }
                else
                {
                    var benzerKayit = _firmalarService.Get(a => (a.Aktif == true) && (a.FirmaAd == model.FirmaAd || a.FirmaKisaAd == model.FirmaKisaAd || a.VergiTCNo == model.VergiTCNo));
                    if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bir firma adı, firma kısa kodu ya da vergi numarası kullanın." });
                }
                var firmaEkle = new Firmalar
                {
                    Adres = model.Adres,
                    BagliOlduguID = model.BagliOlduguID,
                    Eposta = model.Eposta,
                    FaturaAdresi = model.FaturaAdresi,
                    FirmaAd = model.FirmaAd,
                    //FirmaKisaAd = isletmeFirmaSube ? "" : model.FirmaKisaAd,
                    FirmaKisaAd = model.FirmaKisaAd,
                    Sifre = Encrypt.MD5Encrypt(model.Sifre),
                    DisDerinligiSayisi = model.DisDerinligiSayisi,
                    PsiBar = model.PsiBar,
                    Rol = model.Rol,
                    TelefonNumarasi = model.TelefonNumarasi,
                    VergiTCNo = model.VergiTCNo,
                    Aktif = true,
                    ListeAktiflik = true,
                    ParaBirimID = model.ParaBirimID,
                    KayitTarihi = model.KayitTarihi,
                    //
                    KullaniciGorevi = model.KullaniciGorevi,
                    KullaniciKisaKod = model.KullaniciKisaKod,
                    //
                    YetkiliKisi = model.YetkiliKisi,
                    //
                    OlusturanId = _userJWTInfo.GetInfo().id,
                    OlusturmaTarihi = model.OlusturmaTarihi,
                    DuzenleyenId = _userJWTInfo.GetInfo().id,
                    DuzenlemeTarihi = model.DuzenlemeTarihi
                };
                _firmalarService.Add(firmaEkle);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpPost("FirmaGuncelle")]
        public ActionResult FirmaGuncelle(FirmaGuncelleModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Ok(allErrors);
            }
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var firma = _firmalarService.GetByID(model.FirmaID);
                if (firma == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Firma bulunamadı.'" });

                bool isletmeFirmaSube = false;
                if (model.Rol == Role._Isletme || model.Rol == Role._Firma || model.Rol == Role._Sube)
                {
                    var benzerKayit = _firmalarService.Get(a => (a.Aktif == true) && (a.FirmaID != model.FirmaID)
               && (a.FirmaAd == model.FirmaAd || a.VergiTCNo == model.VergiTCNo));
                    if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bir firma adı ya da vergi numarası kullanın." });
                    isletmeFirmaSube = true;
                }
                else
                {
                    var benzerKayit = _firmalarService.Get(a => (a.Aktif == true) && (a.FirmaID != model.FirmaID)
                && (a.FirmaAd == model.FirmaAd || a.FirmaKisaAd == model.FirmaKisaAd || a.VergiTCNo == model.VergiTCNo));
                    if (benzerKayit != null) return Ok(new { Error = "Benzer kayıt bulundu. Lütfen farkli bir firma adı, firma kısa kodu ya da vergi numarası kullanın." });
                }


                firma.Adres = model.Adres;
                firma.BagliOlduguID = model.BagliOlduguID;
                firma.Eposta = model.Eposta;
                firma.FaturaAdresi = model.FaturaAdresi;
                firma.FirmaAd = model.FirmaAd;
                //firma.FirmaKisaAd = isletmeFirmaSube ? "" : model.FirmaKisaAd;
                firma.FirmaKisaAd = model.FirmaKisaAd;
                if (model.Sifre != "" && model.Sifre != null) { firma.Sifre = Encrypt.MD5Encrypt(model.Sifre); }
                firma.PsiBar = model.PsiBar;
                firma.DisDerinligiSayisi = model.DisDerinligiSayisi;
                firma.Rol = model.Rol;
                firma.TelefonNumarasi = model.TelefonNumarasi;
                firma.VergiTCNo = model.VergiTCNo;
                firma.KayitTarihi = model.KayitTarihi;
                firma.ParaBirimID = model.ParaBirimID;
                //
                firma.KullaniciGorevi = model.KullaniciGorevi;
                firma.KullaniciKisaKod = model.KullaniciKisaKod;
                //
                firma.YetkiliKisi = model.YetkiliKisi;
                //
                firma.ListeAktiflik = model.ListeAktiflik;

                firma.DuzenleyenId = _userJWTInfo.GetInfo().id;
                firma.DuzenlemeTarihi = model.DuzenlemeTarihi;

                _firmalarService.Update(firma);

                // Eğer ki işletmenin, firmanın ya da şubenin alt kullanıcıları varsa bazı alanları ortak olmalıdır. Örneğin para birimi gibi, işte bu kodlarla bunun güncellemesini yapıyoruz.
                string kullaniciRolBelirle = "";
                if (firma.Rol == Role._Isletme) { kullaniciRolBelirle = Role.IsletmeKullanicisi; }
                else if (firma.Rol == Role._Firma) { kullaniciRolBelirle = Role.FirmaKullanicisi; }
                else if (firma.Rol == Role._Sube) { kullaniciRolBelirle = Role.SubeKullanicisi; }

                if (kullaniciRolBelirle != "")
                {
                    var firmaninAltKullanicilari = _firmalarService.GetAll(a => a.BagliOlduguID == firma.FirmaID && a.Rol == kullaniciRolBelirle);
                    foreach (var item in firmaninAltKullanicilari)
                    {
                        item.Adres = firma.Adres;
                        item.FaturaAdresi = firma.FaturaAdresi;
                        item.PsiBar = firma.PsiBar;
                        item.ParaBirimID = firma.ParaBirimID;
                        item.DisDerinligiSayisi = firma.DisDerinligiSayisi;
                        _firmalarService.Update(item);
                    }
                }
                //

                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı. ✓" });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }

        [HttpGet("FirmaSil/{id}")]
        public ActionResult FirmaSil(int id = 0)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var firma = _firmalarService.GetByID(id);
                if (firma == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Firma bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                firma.Aktif = false;
                firma.DuzenleyenId = _userJWTInfo.GetInfo().id;
                firma.DuzenlemeTarihi = DateTime.Now;
                _firmalarService.Update(firma);
                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }


        [HttpGet("TumKullanicilar")]
        public ActionResult TumKullanicilar()
        {
            var kullanicilar = _firmalarService.GetAll().Select(a => new { a.FirmaID, a.FirmaAd, a.FirmaKisaAd }).ToList();
            return Ok(kullanicilar);
        }

        [HttpGet("EmsalIsletmeKullanicilar/{FirmaID}")]
        public ActionResult EmsalIsletmeKullanicilar(int FirmaID)
        {
            bool hataVar = false;
            var firmaBulucu = _firmalarService.GetByID(FirmaID);
            var kullanicilar = RolBazliEmsalIsletmeKullanicilariListesi(FirmaID).Where(a => a.FirmaID != _userJWTInfo.GetInfo().id).ToList();
            kullanicilar.ToList().ForEach(item =>
            {
                if (firmaBulucu.Rol == Role._Firma)
                {
                    var yetkiliOlduklariListe = _kullaniciYetkilerService.Get(a => a.FirmaID == item.FirmaID && a.IlgiliID == firmaBulucu.FirmaID && a.Aktif == true && a.YetkiTip == Role._Firma);
                    if (yetkiliOlduklariListe != null)
                    {
                        kullanicilar.Remove(item);
                    }
                }
                else if (firmaBulucu.Rol == Role._Sube)
                {
                    var ustFirmaBulucu = _firmalarService.Get(a => a.FirmaID == firmaBulucu.BagliOlduguID && a.Aktif == true);
                    var yetkiliOlduklariListe = _kullaniciYetkilerService.Get(a => a.FirmaID == item.FirmaID && a.IlgiliID == ustFirmaBulucu.FirmaID && a.Aktif == true && a.YetkiTip == Role._Firma);
                    if (yetkiliOlduklariListe != null)
                    {
                        kullanicilar.Remove(item);
                    }
                    else
                    {
                        yetkiliOlduklariListe = _kullaniciYetkilerService.Get(a => a.FirmaID == item.FirmaID && a.IlgiliID == firmaBulucu.FirmaID && a.Aktif == true && a.YetkiTip == Role._Sube);
                        if (yetkiliOlduklariListe != null)
                        {
                            kullanicilar.Remove(item);
                        }
                    }
                }
                else
                {
                    hataVar = true;
                }
            });
            if (hataVar) return Ok(new { Error = "Data not found." });
            return Ok(kullanicilar);
        }

        // Kullanıcının rolüne uygun bir şekilde firma listesi döndürür.
        public List<Firmalar> RolBazliFirmaListesi(string istekTipi = "Genel")
        {
            var firmalar = new List<Firmalar>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role._Firma).ToList();
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    firmalar.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role._Sube).ToList());
                }
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Firma).ToList();
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    firmalar.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList());
                    var liste = new List<Firmalar>();
                    firmalar.Where(a => a.Rol == Role._Firma).ToList().ForEach(firmaItem =>
                             {
                                 var firmaAltSubeler = _firmalarService.GetAll(a => a.BagliOlduguID == firmaItem.FirmaID && a.Aktif == true && a.Rol == Role._Sube);
                                 liste.AddRange(firmaAltSubeler);
                             });
                    firmalar.AddRange(liste);
                }
            }
            else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Firma).ToList();
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    firmalar.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList());
                }
            }
            else if (_userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList();
            }
            var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma);
            yetkiliOlduklariListe.ForEach(yetkiliItem =>
                        {
                            firmalar.Add(_firmalarService.GetByID(yetkiliItem.IlgiliID));
                            var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                            firmalar.AddRange(firmaninAltSubeleri);
                        });
            if (_userJWTInfo.GetInfo().role != Role.SubeKullanicisi)
            {
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                    yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                    yetkiliOlduklariListe.ForEach(yetkiliItem =>
                    {
                        firmalar.Add(_firmalarService.GetByID(yetkiliItem.IlgiliID));
                    });
                }
                //
                // Firmalar listesinde şubeyide çıkarıyor. Halbuki şube kullanıcısı değilse, yalnızca Şubeler sayfasından görülebilir. Bu kod onu engelliyor.
                if(istekTipi == "FirmaListesi")
                {
                    firmalar = firmalar.Where(p => p.Rol == Role._Firma).ToList();
                }
            }
            firmalar = firmalar.GroupBy(p => p.FirmaID).Select(grp => grp.FirstOrDefault()).ToList();
            return firmalar;
        }

        // Kullanıcının rolüne uygun bir şekilde firma listesi döndürür.
        public List<Firmalar> RolBazliFirmaListesiGetAllActivesWithBagliID(string istekTipi = "Genel")
        {
            var firmalar = new List<Firmalar>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role._Firma).ToList();
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    firmalar.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role._Sube).ToList());
                }
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Firma).ToList();
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    firmalar.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList());
                    var liste = new List<Firmalar>();
                    firmalar.Where(a => a.Rol == Role._Firma).ToList().ForEach(firmaItem =>
                    {
                        var firmaAltSubeler = _firmalarService.GetAll(a => a.BagliOlduguID == firmaItem.FirmaID && a.Aktif == true && a.Rol == Role._Sube);
                        liste.AddRange(firmaAltSubeler);
                    });
                    firmalar.AddRange(liste);
                }
            }
            else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Firma).ToList();
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    firmalar.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList());
                }
            }
            else if (_userJWTInfo.GetInfo().role == Role.SubeKullanicisi)
            {
                firmalar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList();
            }
            var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma);
            yetkiliOlduklariListe.ForEach(yetkiliItem =>
            {
                firmalar.Add(_firmalarService.GetByID(yetkiliItem.IlgiliID));
                var firmaninAltSubeleri = _firmalarService.GetAll(a => a.Aktif == true && a.BagliOlduguID == yetkiliItem.IlgiliID);
                firmalar.AddRange(firmaninAltSubeleri);
            });
            if (_userJWTInfo.GetInfo().role != Role.SubeKullanicisi)
            {
                // Eğer sitede firmalar sayfasındaysa, o sayfada şubelerin çıkmaması için bu yol izlenir.
                if (istekTipi == "Genel")
                {
                    // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
                    yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
                    yetkiliOlduklariListe.ForEach(yetkiliItem =>
                    {
                        firmalar.Add(_firmalarService.GetByID(yetkiliItem.IlgiliID));
                    });
                    //
                }
                // Firmalar listesinde şubeyide çıkarıyor. Halbuki şube kullanıcısı değilse, yalnızca Şubeler sayfasından görülebilir. Bu kod onu engelliyor.
                if (istekTipi == "FirmaListesi")
                {
                    firmalar = firmalar.Where(p => p.Rol == Role._Firma).ToList();
                }
            }
            firmalar = firmalar.GroupBy(p => p.FirmaID).Select(grp => grp.FirstOrDefault()).ToList();
            return firmalar;
        }

        // Kullanıcının rolüne uygun bir şekilde işletme listesi döndürür.
        private List<Firmalar> RolBazliIsletmeListesi()
        {
            var isletmeler = new List<Firmalar>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                isletmeler = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role._Isletme).ToList();
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                var ustFirmaBulucu = _firmalarService.GetByID(_userJWTInfo.GetInfo().id);
                if (ustFirmaBulucu != null) isletmeler = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.FirmaID == ustFirmaBulucu.BagliOlduguID && a.Rol == Role._Isletme).ToList();
            }
            isletmeler = isletmeler.GroupBy(p => p.FirmaID).Select(grp => grp.FirstOrDefault()).ToList();
            return isletmeler;
        }

        // Kullanıcının rolüne uygun bir şekilde şube listesi döndürür.
        private List<Firmalar> RolBazliSubeListesi()
        {
            var subeler = new List<Firmalar>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                subeler = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role._Sube).ToList();
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                var isletmeninFirmalari = _firmalarService.GetAll(a => a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Firma && a.Aktif == true);
                var liste = new List<Firmalar>();
                isletmeninFirmalari.ForEach(item =>
                {
                    liste.AddRange(_firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && (a.OlusturanId == _userJWTInfo.GetInfo().id || a.BagliOlduguID == item.FirmaID) && a.Rol == Role._Sube));
                });
                subeler = liste;
            }
            else if (_userJWTInfo.GetInfo().role == Role.FirmaKullanicisi)
            {
                subeler = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.OlusturanId == _userJWTInfo.GetInfo().id && a.Rol == Role._Sube).ToList();
            }
            var yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Sube);
            yetkiliOlduklariListe.ForEach(yetkiliItem =>
            {
                subeler.Add(_firmalarService.GetByID(yetkiliItem.IlgiliID));
            });
            // Eğer üst firmasına yetkiliyse, firmanın alt şubelerine erişim sağlayabilir.
            yetkiliOlduklariListe = _kullaniciYetkilerService.YetkiliOlduklariListesi(_userJWTInfo.GetInfo().id, Role._Firma);
            yetkiliOlduklariListe.ForEach(yetkiliItem =>
            {
                subeler.AddRange(_firmalarService.GetAll(a => a.BagliOlduguID == yetkiliItem.IlgiliID && a.Aktif == true && a.Rol == Role._Sube));
            });
            //
            subeler = subeler.GroupBy(p => p.FirmaID).Select(grp => grp.FirstOrDefault()).ToList();
            return subeler;
        }

        // Kullanıcının rolüne uygun bir şekilde emsal kullanıcılar listesi döndürür. Örneğin; İşletme kullanıcısı bu fonksiyonu çağırırsa, aynı işletmeye bağlı işletme kullanıcısı olan arkadaşlarını çeker.
        private List<Firmalar> RolBazliEmsalIsletmeKullanicilariListesi(int FirmaID)
        {
            var kullanicilar = new List<Firmalar>();
            if (_userJWTInfo.GetInfo().role == Role.Admin)
            {
                kullanicilar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.Rol == Role.IsletmeKullanicisi).ToList();
            }
            else if (_userJWTInfo.GetInfo().role == Role.IsletmeKullanicisi)
            {
                var ustFirmaBulucu = _firmalarService.GetByID(_userJWTInfo.GetInfo().id);
                if (ustFirmaBulucu != null) kullanicilar = _firmalarService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true && a.BagliOlduguID == ustFirmaBulucu.BagliOlduguID && a.Rol == Role.IsletmeKullanicisi).ToList();
            }
            kullanicilar = kullanicilar.GroupBy(p => p.FirmaID).Select(grp => grp.FirstOrDefault()).ToList();
            return kullanicilar;
        }
    }
}