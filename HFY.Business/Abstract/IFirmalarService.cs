using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IFirmalarService
    {
        List<Firmalar> GetAll(Expression<Func<Firmalar, bool>> filter = null);
        Firmalar Get(Expression<Func<Firmalar, bool>> filter = null);
        Firmalar GetByID(int id);
        Tuple<string,Firmalar> Authorize(string kullaniciAdi,string sifre);
        void Add(Firmalar giris);
        void Update(Firmalar giris);
        void Delete(int id);
    }
}
