using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IHizIndekslerService
    {
        List<HizIndeksler> GetAll(Expression<Func<HizIndeksler, bool>> filter = null);
        HizIndeksler Get(Expression<Func<HizIndeksler, bool>> filter = null);
        HizIndeksler GetByID(int id);
        void Add(HizIndeksler giris);
        void Update(HizIndeksler giris);
        void Delete(int id);
    }
}
