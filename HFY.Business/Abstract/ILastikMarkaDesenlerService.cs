using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikMarkaDesenlerService
    {
        List<LastikMarkaDesenler> GetAll(Expression<Func<LastikMarkaDesenler, bool>> filter = null);
        LastikMarkaDesenler Get(Expression<Func<LastikMarkaDesenler, bool>> filter = null);
        LastikMarkaDesenler GetByID(int id);
        void Add(LastikMarkaDesenler giris);
        void Update(LastikMarkaDesenler giris);
        void Delete(int id);
    }
}
