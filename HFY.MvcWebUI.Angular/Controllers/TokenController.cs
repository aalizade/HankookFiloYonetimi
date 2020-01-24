using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HFY.Business.Abstract;
using HFY.Core.Classes.JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HankookFiloYonetimi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous()]
    public class TokenController : ControllerBase
    {
        IFirmalarService _firmaService;
        IConfiguration Configuration;
        IHttpContextAccessor _httpContextAccessor;
        UserJWTInfo _userJWTInfo;
        public TokenController(IFirmalarService firmaService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _firmaService = firmaService;
            Configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _userJWTInfo = new UserJWTInfo(_httpContextAccessor);
        }

        [HttpPost("[action]")]
        public IActionResult GetToken([FromBody]Employee model)
        {
            var firmaFind = _firmaService.Authorize(model.UserName, Encrypt.MD5Encrypt(model.Password));

            if (firmaFind.Item1 == "1")
            {
                string secretSection = Configuration.GetSection("AppSettings").GetSection("Secret").Value;
                string token = GenerateToken.Generate(new TokenDescriptor
                {
                    Claims = new Claim[]
                        {
                        new Claim("id",firmaFind.Item2.FirmaID.ToString()),
                        new Claim("userName", firmaFind.Item2.FirmaKisaAd),
                        new Claim("role", firmaFind.Item2.Rol),
                        new Claim("email", firmaFind.Item2.Eposta),
                        },
                    ExpiresValue = DateTime.UtcNow.AddDays(1),
                    Secret = secretSection
                });

                firmaFind.Item2.SonGirisTarihi = DateTime.Now;
                _firmaService.Update(firmaFind.Item2);

                return new JsonResult(new
                {
                    Token = token,
                    Role = firmaFind.Item2.Rol,
                    UserNameSurname = firmaFind.Item2.FirmaAd,
                    DisDerinligiSayisi = firmaFind.Item2.DisDerinligiSayisi,
                });
            }
            else if (firmaFind.Item1 == "2")
            {
                return new JsonResult(new
                {
                    Token = "",
                    Message = firmaFind.Item2.Rol+" hesabıyla giriş yapmaya çalışıyorsunuz. Lütfen "+firmaFind.Item2.Rol+" kullanıcısı bilgileriyle giriş yapmayı deneyin."
                });
            }
            else if (firmaFind.Item1 == "3")
            {
                return new JsonResult(new
                {
                    Token = "",
                    Message = "Üyeliğiniz pasif durumda gözükmektedir. Lütfen iletişime geçiniz."
                });
            }
            else
            {
                return new JsonResult(new
                {
                    Token = "",
                    Message = "Kullanıcı adı (mail adresi) ya da şifrenizi kontrol edip, tekrar deneyin."
                });
            }
        }

        [Authorize()]
        [HttpGet("[action]/{role}")]
        public IActionResult CheckToken(string role = Role.Admin)
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                if (_userJWTInfo.GetInfo().role == role) return new JsonResult(new { Result = true });
                else return new JsonResult(new { Result = false });
            }
            return new JsonResult(new { Result = false });
        }

        [Authorize()]
        [HttpGet("[action]")]
        public IActionResult GetUserTokenInfo()
        {
            if (!_userJWTInfo.UserNullOrEmpty())
            {
                return new JsonResult(new { Result = _userJWTInfo.GetInfo() });
            }
            return new JsonResult(new { Result = false });
        }

    }
}