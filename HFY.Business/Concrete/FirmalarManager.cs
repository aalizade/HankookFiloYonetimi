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
    public class FirmalarManager : IFirmalarService
    {
        private IFirmalarDal _firmalarDal;
        public FirmalarManager(IFirmalarDal firmalarDal)
        {
            _firmalarDal = firmalarDal;
        }
        public Firmalar Get(Expression<Func<Firmalar, bool>> filter = null)
        {
            return _firmalarDal.Get(filter);
        }
        public List<Firmalar> GetAll(Expression<Func<Firmalar, bool>> filter = null)
        {
            return _firmalarDal.GetList(filter);
        }
        public Firmalar GetByID(int id)
        {
            return _firmalarDal.Get(a => a.FirmaID == id);
        }
        public Tuple<string, Firmalar> Authorize(string kullaniciAdi, string sifre)
        {
            var bulucu = _firmalarDal.Get(a => a.FirmaKisaAd == kullaniciAdi && a.Sifre == sifre && a.Aktif == true);
            if (bulucu != null)
            {
                if(bulucu.Rol == Role._Isletme || bulucu.Rol == Role._Firma || bulucu.Rol == Role._Sube) return new Tuple<string, Firmalar>("2", new Firmalar() { Rol = bulucu.Rol });
                if (bulucu.ListeAktiflik == false) return new Tuple<string, Firmalar>("3", new Firmalar());
                else return new Tuple<string, Firmalar>("1", bulucu);
            }
            else return new Tuple<string, Firmalar>("0", new Firmalar());
        }
        public void Add(Firmalar giris)
        {
            _firmalarDal.Add(giris);
        }
        public void Update(Firmalar giris)
        {
            _firmalarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _firmalarDal.Delete(new Firmalar() { FirmaID = id });
        }

       
    }
}
