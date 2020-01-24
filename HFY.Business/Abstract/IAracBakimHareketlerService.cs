using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAracBakimHareketlerService
    {
        List<AracBakimHareketler> GetAll(Expression<Func<AracBakimHareketler, bool>> filter = null);
        AracBakimHareketler Get(Expression<Func<AracBakimHareketler, bool>> filter = null);
        AracBakimHareketler GetByID(int id);
        void Add(AracBakimHareketler giris);
        void Update(AracBakimHareketler giris);
        void Delete(int id);
    }
}
