using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IEbatlarService
    {
        List<Ebatlar> GetAll(Expression<Func<Ebatlar, bool>> filter = null);
        Ebatlar Get(Expression<Func<Ebatlar, bool>> filter = null);
        Ebatlar GetByID(int id);
        void Add(Ebatlar giris);
        void Update(Ebatlar giris);
        void Delete(int id);
    }
}
