using HFY.Core.DataAccess.EntityFramework;
using HFY.DataAccess.Abstract;
using HFY.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace HFY.DataAccess.Concrete.EntityFramework
{
    public class EfKullaniciYetkilerDal:EfEntityRepositoryBase<KullaniciYetkiler,HFYContext>,IKullaniciYetkilerDal
    {
        public List<KullaniciYetkiler> YetkiliOlduklariListesi(int KullaniciID,string Rol)
        {
            using (var context = new HFYContext())
            {
                return context.Set<KullaniciYetkiler>().Where(a=> a.Aktif == true && a.FirmaID == KullaniciID && a.YetkiTip == Rol).ToList();
            }
        }
    }
}
