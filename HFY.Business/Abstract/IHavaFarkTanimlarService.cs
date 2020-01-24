using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IHavaFarkTanimlarService
    {
        List<HavaFarkTanimlar> GetAll(Expression<Func<HavaFarkTanimlar, bool>> filter = null);
        HavaFarkTanimlar Get(Expression<Func<HavaFarkTanimlar, bool>> filter = null);
        HavaFarkTanimlar GetByID(int id);
        void Add(HavaFarkTanimlar giris);
        void Update(HavaFarkTanimlar giris);
        void Delete(int id);
    }
}
