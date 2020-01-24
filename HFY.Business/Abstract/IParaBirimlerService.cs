using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IParaBirimlerService
    {
        List<ParaBirimler> GetAll(Expression<Func<ParaBirimler, bool>> filter = null);
        ParaBirimler Get(Expression<Func<ParaBirimler, bool>> filter = null);
        ParaBirimler GetByID(int id);
        void Add(ParaBirimler giris);
        void Update(ParaBirimler giris);
        void Delete(int id);
    }
}
