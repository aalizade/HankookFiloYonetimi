using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface IAksPozisyonService
    {
        List<AksPozisyon> GetAll(Expression<Func<AksPozisyon, bool>> filter = null);
        AksPozisyon Get(Expression<Func<AksPozisyon, bool>> filter = null);
        AksPozisyon GetByID(int id);
        void Add(AksPozisyon giris);
        void Update(AksPozisyon giris);
        void Delete(int id);
    }
}
