using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IYukIndekslerService
    {
        List<YukIndeksler> GetAll(Expression<Func<YukIndeksler, bool>> filter = null);
        YukIndeksler Get(Expression<Func<YukIndeksler, bool>> filter = null);
        YukIndeksler GetByID(int id);
        void Add(YukIndeksler giris);
        void Update(YukIndeksler giris);
        void Delete(int id);
    }
}
