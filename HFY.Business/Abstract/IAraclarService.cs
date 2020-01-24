using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAraclarService
    {
        List<Araclar> GetAll(Expression<Func<Araclar, bool>> filter = null,int skip = 0,int take=0);
        Araclar Get(Expression<Func<Araclar, bool>> filter = null);
        Araclar GetByID(int id);
        void Add(Araclar giris);
        void Update(Araclar giris);
        void Delete(int id);
    }
}
