using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikOlcumlerService
    {
        List<LastikOlcumler> GetAll(Expression<Func<LastikOlcumler, bool>> filter = null);
        LastikOlcumler Get(Expression<Func<LastikOlcumler, bool>> filter = null);
        LastikOlcumler GetByID(int id);
        void Add(LastikOlcumler giris);
        void Update(LastikOlcumler giris);
        void Delete(int id);
    }
}
