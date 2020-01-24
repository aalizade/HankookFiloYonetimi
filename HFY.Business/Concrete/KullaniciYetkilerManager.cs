using HFY.Business.Abstract;
using HFY.Core.Classes.JWT;
using HFY.DataAccess.Abstract;
using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Concrete
{
    public class KullaniciYetkilerManager : IKullaniciYetkilerService
    {
        private IKullaniciYetkilerDal _kullaniciYetkilerDal;
        public KullaniciYetkilerManager(IKullaniciYetkilerDal kullaniciYetkilerDal)
        {
            _kullaniciYetkilerDal = kullaniciYetkilerDal;
        }
        public List<KullaniciYetkiler> GetAll(Expression<Func<KullaniciYetkiler, bool>> filter = null)
        {
            return _kullaniciYetkilerDal.GetList(filter);
        }
        public KullaniciYetkiler Get(Expression<Func<KullaniciYetkiler, bool>> filter = null)
        {
            return _kullaniciYetkilerDal.Get(filter);
        }
        public KullaniciYetkiler GetByID(int id)
        {
            return _kullaniciYetkilerDal.Get(a => a.KullaniciYetkiID == id);
        }
        public List<KullaniciYetkiler> YetkiliOlduklariListesi(int KullaniciID, string Rol)
        {
            return _kullaniciYetkilerDal.YetkiliOlduklariListesi(KullaniciID, Rol);
        }
        public void Add(KullaniciYetkiler giris)
        {
            _kullaniciYetkilerDal.Add(giris);
        }
        public void Update(KullaniciYetkiler giris)
        {
            _kullaniciYetkilerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _kullaniciYetkilerDal.Delete(new KullaniciYetkiler() { KullaniciYetkiID = id });
        }


    }
}
