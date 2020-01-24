using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikTiplerService
    {
        List<LastikTipler> GetAll(Expression<Func<LastikTipler, bool>> filter = null);
        LastikTipler Get(Expression<Func<LastikTipler, bool>> filter = null);
        LastikTipler GetByID(int id);
        void Add(LastikTipler giris);
        void Update(LastikTipler giris);
        void Delete(int id);
    }
}
