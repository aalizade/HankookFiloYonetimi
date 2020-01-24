using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HFY.Entities.Concrete;
using Microsoft.AspNetCore.Authorization;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;

namespace HFY.MvcWebUI.Angular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class ParaBirimController : ControllerBase
    {
        IParaBirimlerService _paraBirimlerService;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public ParaBirimController(IParaBirimlerService paraBirimlerService, IHttpContextAccessor httpContextAccessor)
        {
            _paraBirimlerService = paraBirimlerService;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpGet]
        public ActionResult ParaBirimler()
        {
            var paraBirimlers = _paraBirimlerService.GetAll(a => a.Aktif == true && a.ListeAktiflik == true).ToList();
            return Ok(paraBirimlers);
        }

        [HttpGet("{id}")]
        public ActionResult ParaBirim(int id)
        {
            var value = _paraBirimlerService.GetByID(id);
            if (value == null) return Ok(new { Error = "Data not found." });
            return Ok(value);
        }
    }
}