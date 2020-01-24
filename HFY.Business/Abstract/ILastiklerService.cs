using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastiklerService
    {
        List<Lastikler> GetAll(Expression<Func<Lastikler, bool>> filter = null);
        Lastikler Get(Expression<Func<Lastikler, bool>> filter = null);
        Lastikler GetByID(int id);
        void Add(Lastikler giris);
        void Update(Lastikler giris);
        void Delete(int id);
    }
}
