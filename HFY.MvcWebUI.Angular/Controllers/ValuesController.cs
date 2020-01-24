using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using HFY.Core.Classes.JWT;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Role.Admin)]
    public class ValuesController : ControllerBase
    {

        // GET api/values

        [HttpGet]
        public ActionResult GetValues()
        {
            var principal = HttpContext.User;
            if (principal?.Claims != null)
            {
                foreach (var claim in principal.Claims)
                {
                    string deneme = $"CLAIM TYPE: {claim.Type}; CLAIM VALUE: {claim.Value}";
                }
            }
            string userName = principal?.Claims?.SingleOrDefault(p => p.Type == "userName")?.Value;
            return Ok();
        }

        // GET api/values/5
    }
}
