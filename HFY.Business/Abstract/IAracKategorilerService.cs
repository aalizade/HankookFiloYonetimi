using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAracKategorilerService
    {
        List<AracKategoriler> GetAll(Expression<Func<AracKategoriler, bool>> filter = null);
        AracKategoriler Get(Expression<Func<AracKategoriler, bool>> filter = null);
        AracKategoriler GetByID(int id);
        void Add(AracKategoriler giris);
        void Update(AracKategoriler giris);
        void Delete(int id);
    }
}
