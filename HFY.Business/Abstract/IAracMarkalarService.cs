using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAracMarkalarService
    {
        List<AracMarkalar> GetAll(Expression<Func<AracMarkalar, bool>> filter = null);
        AracMarkalar Get(Expression<Func<AracMarkalar, bool>> filter = null);
        AracMarkalar GetByID(int id);
        void Add(AracMarkalar giris);
        void Update(AracMarkalar giris);
        void Delete(int id);
    }
}
