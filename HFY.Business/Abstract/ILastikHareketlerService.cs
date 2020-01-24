using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikHareketlerService
    {
        List<LastikHareketler> GetAll(Expression<Func<LastikHareketler, bool>> filter = null);
        LastikHareketler Get(Expression<Func<LastikHareketler, bool>> filter = null);
        LastikHareketler GetByID(int id);
        int TotalCount(Expression<Func<LastikHareketler, bool>> filter = null);
        void Add(LastikHareketler giris);
        void Update(LastikHareketler giris);
        void Delete(int id);
    }
}
