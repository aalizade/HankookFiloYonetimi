using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using HFY.Core.Classes.JWT;
using HFY.Business.Abstract;
using HankookFiloYonetimi.Helpers.DataTablesServerSideHelpers;
using HFY.Entities.Concrete;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin + "," +  Role.IsletmeKullanicisi + "," +  Role.FirmaKullanicisi + "," +  Role.SubeKullanicisi)]
    public class LastikTipController : ControllerBase
    {
        ILastikTiplerService _lastikTiplerService;
        public LastikTipController(ILastikTiplerService lastikTiplerService)
        {
            _lastikTiplerService = lastikTiplerService;
        }

        [HttpGet]
        public ActionResult LastikTipler()
        {
            var lastikTiplers = _lastikTiplerService.GetAll(a => a.Aktif == true).ToList();
            return Ok(lastikTiplers);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public ActionResult LastikTipler([FromBody] DataTablesOptions model)
        {
            var lastikTipler = _lastikTiplerService.GetAll(a => a.Aktif == true).AsQueryable().OrderBy(model.Columns[model.Order[0].Column].Data + " " + model.Order[0].Dir).ToList();
            if (!string.IsNullOrEmpty(model.Search?.Value)) lastikTipler = lastikTipler.Where(a => a.Ad.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1 || a.Kod.IndexOf(model.Search.Value, 0, StringComparison.CurrentCultureIgnoreCase) != -1).ToList();
            var filter = lastikTipler.Skip(model.Start).Take(model.Length).ToList();
            return Ok(new { draw = model.Draw, recordsFiltered = lastikTipler.Count, recordsTotal = lastikTipler.Count, data = filter });
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult LastikTip(int id)
        {
            var value = _lastikTiplerService.GetByID(id);
            if(value == null) return Ok(new {Error = "Data not found."});
            return Ok(value);
        }

    }
}