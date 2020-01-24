using HFY.Core.Classes.JWT;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace HFY.Core.Classes.JWT
{
    public class UserJWTInfo
    {
        private IHttpContextAccessor _httpContextAccessor;
        public UserJWTInfo(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public UserInfo GetInfo()
        {
            var principal = _httpContextAccessor.HttpContext.User;
            UserInfo userInfo = new UserInfo();
            if (principal?.Claims != null)
            {
                foreach (var claim in principal.Claims)
                {
                    if (claim.Type == "id")
                    {
                        userInfo.id = Convert.ToInt32(claim.Value);
                    }
                    else if (claim.Type == "userName")
                    {
                        userInfo.userName = claim.Value;
                    }
                    else if (claim.Type.Contains("role"))
                    {
                        userInfo.role = claim.Value;
                    }
                    else if (claim.Type.Contains("emailaddress"))
                    {
                        userInfo.email = claim.Value;
                    }
                }
            }
            //string userName = principal?.Claims?.SingleOrDefault(p => p.Type == "userName")?.Value;
            return userInfo;
        }
        public bool UserNullOrEmpty()
        {
            string id = "";
            try
            {
                var principal = _httpContextAccessor.HttpContext.User;
                if (principal?.Claims != null)
                {
                    foreach (var claim in principal.Claims)
                    {
                        if (claim.Type == "id")
                        {
                            id = claim.Value;
                        }
                    }
                }
            }
            catch { }
            return id == "" ? true : false;
        }
    }
}
