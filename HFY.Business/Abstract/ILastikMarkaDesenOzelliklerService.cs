using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikMarkaDesenOzelliklerService
    {
        List<LastikMarkaDesenOzellikler> GetAll(Expression<Func<LastikMarkaDesenOzellikler, bool>> filter = null);
        LastikMarkaDesenOzellikler Get(Expression<Func<LastikMarkaDesenOzellikler, bool>> filter = null);
        LastikMarkaDesenOzellikler GetByID(int id);
        void Add(LastikMarkaDesenOzellikler giris);
        void Update(LastikMarkaDesenOzellikler giris);
        void Delete(int id);
    }
}
