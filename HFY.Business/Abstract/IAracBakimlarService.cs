using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAracBakimlarService
    {
        List<AracBakimlar> GetAll(Expression<Func<AracBakimlar, bool>> filter = null);
        AracBakimlar Get(Expression<Func<AracBakimlar, bool>> filter = null);
        AracBakimlar GetByID(int id);
        void Add(AracBakimlar giris);
        void Update(AracBakimlar giris);
        void Delete(int id);
    }
}
