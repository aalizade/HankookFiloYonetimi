using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikTurlerService
    {
        List<LastikTurler> GetAll(Expression<Func<LastikTurler, bool>> filter = null);
        LastikTurler Get(Expression<Func<LastikTurler, bool>> filter = null);
        LastikTurler GetByID(int id);
        void Add(LastikTurler giris);
        void Update(LastikTurler giris);
        void Delete(int id);
    }
}
