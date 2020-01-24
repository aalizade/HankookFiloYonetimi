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
using HFY.Core.Models.Lastik;
using HFY.Core.Entities;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class LastikHareketController : ControllerBase
    {
        ILastikHareketlerService _lastikHareketlerService;
        ILastikOlcumlerService _lastikOlcumlerService;
        ILastikKonumlarService _lastikKonumlarService;
        ILastiklerService _lastiklerService;
        IAraclarService _araclarService;
        IAracBakimlarService _aracBakimlarService;
        IAracBakimHareketlerService _aracBakimHareketlerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public LastikHareketController(ILastikHareketlerService lastikHareketlerService, ILastikOlcumlerService lastikOlcumlerService, ILastikKonumlarService lastikKonumlarService, ILastiklerService lastiklerService,
          IAraclarService araclarService,  IAracBakimlarService aracBakimlarService, IAracBakimHareketlerService aracBakimHareketlerService,
            IHttpContextAccessor httpContextAccessor)
        {
            _lastikHareketlerService = lastikHareketlerService;
            _lastikOlcumlerService = lastikOlcumlerService;
            _lastikKonumlarService = lastikKonumlarService;
            _lastiklerService = lastiklerService;

            _araclarService = araclarService;
            _aracBakimlarService = aracBakimlarService;
            _aracBakimHareketlerService = aracBakimHareketlerService;

            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet("LastikHareketler/{lastikId}")]
        public ActionResult LastikHareketler(int lastikId = 0)
        {
            var lastikHareketlers = _lastikHareketlerService.GetAll(a => a.LastikID == lastikId && a.Aktif == true).ToList();
            return Ok(lastikHareketlers);
        }

        [HttpPost]
        public ActionResult LastikHareketler([FromBody] DataTablesOptions model)
        {
            var lastikHareketler = _lastikHareketlerService.GetAll(a => a.LastikID == model.UstID && a.Aktif == true).AsQueryable()
               // .OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir)
                .ToList();
           // if (!string.IsNullOrEmpty(model.Search?.Value)) lastikHareketler = lastikHareketler.Where(a => a.AracKilometre.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.LastikKilometre.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.Tarih.ToString().IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList(); ;
            var filter = lastikHareketler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikHareketler.Count, recordsTotal = lastikHareketler.Count, data = filter });
        }

        [HttpGet("TotalCount/{lastikID}")]
        public ActionResult TotalCount(int lastikID)
        {
            int totalCount = _lastikHareketlerService.TotalCount(a => a.LastikID == lastikID && a.Aktif == true);
            return Ok(new { TotalCount = totalCount });
        }

        [HttpGet("LastikHareketlerWithArac/{lastikID}/{aracID}")]
        public ActionResult LastikHareketlerWithArac(int lastikID,int aracID)
        {
            var lastikHareketlersWithArac = _lastikHareketlerService.GetAll(a => a.LastikID == lastikID && a.AracID == aracID && a.Aktif == true).ToList();
            return Ok(lastikHareketlersWithArac);
        }

        [HttpGet("LastikHareketSil/{id}/{oncekiId}/{yapilanIslem}")]
        public ActionResult LastikHareketSil(int id = 0, int oncekiId = 0, string yapilanIslem = "")
        {
            if (yapilanIslem == "OlcumGozlem") yapilanIslem = "Ölçüm + Gözlem";
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                var dt = DateTime.Now;
                var lastikHareket = _lastikHareketlerService.GetByID(id);
                if (lastikHareket == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kayıt bulunamadı.'" });
                //if (firma == 0) BURASI PROGRAMLANACAK. BAĞLI KAYITLAR.
                //{
                //    var altHizmetKategoriler = await _context.HizmetKategorilers.FirstOrDefaultAsync(a => a.BagliOlduguHizmetID == id && a.Aktif == true);
                //    if (altHizmetKategoriler != null) return Ok(new { Error = "Alt kategorisi olan bir kayıt silinemez." });
                //}
                if (lastikHareket.YapilanIslem == LastikHareketTipler.OLCUM || lastikHareket.YapilanIslem == LastikHareketTipler.GOZLEM || lastikHareket.YapilanIslem == LastikHareketTipler.OLCUM_VE_GOZLEM)
                {
                    var lastikOlcumBulucu = _lastikOlcumlerService.GetByID(Convert.ToInt32(lastikHareket.EkBilgi.Trim()));
                    if (lastikOlcumBulucu != null)
                    {
                        lastikOlcumBulucu.Aktif = false;
                        lastikOlcumBulucu.DuzenlemeTarihi = dt;
                        lastikOlcumBulucu.DuzenleyenId = _userJWTInfo.GetInfo().id;
                        _lastikOlcumlerService.Update(lastikOlcumBulucu);
                    }
                }
                if ((yapilanIslem == LastikHareketTipler.MONTAJ || yapilanIslem == LastikHareketTipler.ROTASYON) && oncekiId != 0)
                {
                    var oncekiKayitBulucu = _lastikHareketlerService.GetByID(oncekiId);
                    if (oncekiKayitBulucu.YapilanIslem == LastikHareketTipler.OLCUM || oncekiKayitBulucu.YapilanIslem == LastikHareketTipler.OLCUM_VE_GOZLEM || oncekiKayitBulucu.YapilanIslem == LastikHareketTipler.GOZLEM)
                    {
                        var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");

                        var lastikBulucu = _lastiklerService.GetByID(lastikHareket.LastikID);

                        var aracBakimBul = _aracBakimlarService.Get(a => a.AracID == lastikHareket.AracID && a.LastikID == lastikHareket.LastikID && a.Aktif == true);
                        if (aracBakimBul == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. Araç Bakım'da lastik bulunamıyor." });
                        else
                        {
                            lastikBulucu.LastikKonumID = depoKonumTipBulucu.LastikKonumID;
                            lastikBulucu.AracID = 0;
                            lastikBulucu.LastikKilometre = oncekiKayitBulucu.LastikKilometre;
                            lastikBulucu.DuzenlemeTarihi = dt;
                            lastikBulucu.DuzenleyenId = _userJWTInfo.GetInfo().id;
                            _lastiklerService.Update(lastikBulucu);


                            aracBakimBul.Aktif = false;
                            _aracBakimlarService.Update(aracBakimBul);

                            var aracBulucu = _araclarService.GetByID(aracBakimBul.AracID);

                            var aracBakimHareketEkle = new AracBakimHareketler
                            {
                                AracBakimID = aracBakimBul.AracBakimID,
                                HareketTip = LastikHareketTipler.DEPO_GIRIS,
                                Hareket = LastikHareketTipler.DEPO,
                                HareketYonu = LastikHareketTipler.DEPO,
                                YapilanIslem = LastikHareketTipler.KAYIT,
                                Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araçtan depoya taşındı.",
                                EkBilgi = "",
                                AksPozisyonID = 0,
                                Aktif = true,
                                AracID = aracBakimBul.AracID,
                                LastikID = aracBakimBul.LastikID,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };

                            _aracBakimHareketlerService.Add(aracBakimHareketEkle);


                            var lastikHareketEkle = new LastikHareketler
                            {
                                Tarih = oncekiKayitBulucu.Tarih,
                                Aciklama = "Kayıt Girildi | " + yapilanIslem + " sebebiyle depoya taşındı.",
                                AracKilometre = 0,
                                Basinc = oncekiKayitBulucu.Basinc,
                                BasincAlinamadi = oncekiKayitBulucu.BasincAlinamadi,
                                TavsiyeBasinc = (oncekiKayitBulucu.HareketYonu == LastikHareketTipler.ARAC) ? lastikHareket.TavsiyeBasinc = oncekiKayitBulucu.TavsiyeBasinc : Convert.ToByte(0),
                                AracID = 0,
                                DisDerinligiJSON = "",
                                GuvenliDisSeviyesi = oncekiKayitBulucu.GuvenliDisSeviyesi,
                                LastikID = oncekiKayitBulucu.LastikID,
                                LastikKilometre = oncekiKayitBulucu.LastikKilometre,
                                LastikMarkaID = oncekiKayitBulucu.LastikMarkaID,
                                LastikPozisyonID = 0,
                                LastikTipID = oncekiKayitBulucu.LastikTipID,
                                LastikKonumID = depoKonumTipBulucu.LastikKonumID,
                                Plaka = "",
                                EkBilgi = "",
                                HareketTip = LastikHareketTipler.DEPO_GIRIS,
                                Hareket = LastikHareketTipler.DEPO,
                                HareketYonu = LastikHareketTipler.DEPO,
                                YapilanIslem = LastikHareketTipler.KAYIT,
                                Aktif = true,
                                ListeAktiflik = true,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };
                            _lastikHareketlerService.Add(lastikHareketEkle);
                        }



                    }
                    else
                    {
                        var aracBakimBul = _aracBakimlarService.Get(a => a.AracID == lastikHareket.AracID && a.LastikID == lastikHareket.LastikID && a.Aktif == true);
                        if (aracBakimBul == null) return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. Araç Bakım'da lastik bulunamıyor." });
                        else
                        {
                            var depoKonumTipBulucu = _lastikKonumlarService.Get(a => a.Ad == "Depo");

                            var lastikBulucu = _lastiklerService.GetByID(lastikHareket.LastikID);

                            lastikBulucu.LastikKonumID = depoKonumTipBulucu.LastikKonumID;
                            lastikBulucu.AracID = 0;
                            lastikBulucu.LastikKilometre = oncekiKayitBulucu.LastikKilometre;
                            lastikBulucu.DisSeviyesi = oncekiKayitBulucu.GuvenliDisSeviyesi;
                            lastikBulucu.DuzenlemeTarihi = dt;
                            lastikBulucu.DuzenleyenId = _userJWTInfo.GetInfo().id;
                            _lastiklerService.Update(lastikBulucu);

                            aracBakimBul.Aktif = false;
                            _aracBakimlarService.Update(aracBakimBul);

                            var aracBulucu = _araclarService.GetByID(aracBakimBul.AracID);

                            var aracBakimHareketEkle = new AracBakimHareketler
                            {
                                AracBakimID = aracBakimBul.AracBakimID,
                                HareketTip = LastikHareketTipler.DEPO_GIRIS,
                                Hareket = LastikHareketTipler.DEPO,
                                HareketYonu = LastikHareketTipler.DEPO,
                                YapilanIslem = LastikHareketTipler.KAYIT,
                                Aciklama = "Lastik, " + aracBulucu.Plaka + " plakalı araçtan depoya taşındı.",
                                EkBilgi = "",
                                AksPozisyonID = 0,
                                Aktif = true,
                                AracID = aracBakimBul.AracID,
                                LastikID = aracBakimBul.LastikID,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };

                            _aracBakimHareketlerService.Add(aracBakimHareketEkle);

                            var lastikHareketEkle = new LastikHareketler
                            {
                                Tarih = oncekiKayitBulucu.Tarih,
                                Aciklama = "Kayıt Girildi | " + yapilanIslem + " sebebiyle depoya taşındı.",
                                AracKilometre = 0,
                                Basinc = 0,
                                BasincAlinamadi = false,
                                TavsiyeBasinc = 0,
                                AracID = 0,
                                DisDerinligiJSON = "",
                                GuvenliDisSeviyesi = oncekiKayitBulucu.GuvenliDisSeviyesi,
                                LastikID = oncekiKayitBulucu.LastikID,
                                LastikKilometre = oncekiKayitBulucu.LastikKilometre,
                                LastikMarkaID = oncekiKayitBulucu.LastikMarkaID,
                                LastikPozisyonID = 0,
                                LastikTipID = oncekiKayitBulucu.LastikTipID,
                                LastikKonumID = depoKonumTipBulucu.LastikKonumID,
                                Plaka = "",
                                EkBilgi = "",
                                HareketTip = LastikHareketTipler.DEPO_GIRIS,
                                Hareket = LastikHareketTipler.DEPO,
                                HareketYonu = LastikHareketTipler.DEPO,
                                YapilanIslem = LastikHareketTipler.KAYIT,
                                Aktif = true,
                                ListeAktiflik = true,
                                OlusturanId = _userJWTInfo.GetInfo().id,
                                OlusturmaTarihi = dt,
                                DuzenleyenId = _userJWTInfo.GetInfo().id,
                                DuzenlemeTarihi = dt
                            };
                            _lastikHareketlerService.Add(lastikHareketEkle);
                        }
                    }
                }
                lastikHareket.Aktif = false;
                lastikHareket.DuzenleyenId = _userJWTInfo.GetInfo().id;
                lastikHareket.DuzenlemeTarihi = DateTime.Now;
                _lastikHareketlerService.Update(lastikHareket);


                return Ok(new { MessageType = 1, Message = "İşlem başarıyla tamamlandı." });
            }
            else return Ok(new { Error = "Lütfen teknik destek ile iletişime geçiniz. 'Kullanıcı bilgileri session sorunu.'" });
        }
    }
}