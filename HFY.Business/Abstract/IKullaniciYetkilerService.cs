using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IKullaniciYetkilerService
    {
        List<KullaniciYetkiler> GetAll(Expression<Func<KullaniciYetkiler, bool>> filter = null);
        KullaniciYetkiler Get(Expression<Func<KullaniciYetkiler, bool>> filter = null);
        KullaniciYetkiler GetByID(int id);
        List<KullaniciYetkiler> YetkiliOlduklariListesi(int KullaniciID, string Rol);
        void Add(KullaniciYetkiler giris);
        void Update(KullaniciYetkiler giris);
        void Delete(int id);
    }
}
