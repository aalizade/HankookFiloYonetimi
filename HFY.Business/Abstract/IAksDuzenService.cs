using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAksDuzenService
    {
        List<AksDuzen> GetAll(Expression<Func<AksDuzen, bool>> filter = null);
        AksDuzen Get(Expression<Func<AksDuzen, bool>> filter = null);
        AksDuzen GetByID(int id);
        void Add(AksDuzen giris);
        void Update(AksDuzen giris);
        void Delete(int id);
    }
}
