using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAracModellerService
    {
        List<AracModeller> GetAll(Expression<Func<AracModeller, bool>> filter = null);
        AracModeller Get(Expression<Func<AracModeller, bool>> filter = null);
        AracModeller GetByID(int id);
        void Add(AracModeller giris);
        void Update(AracModeller giris);
        void Delete(int id);
    }
}
