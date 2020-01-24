using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikMarkalarService
    {
        List<LastikMarkalar> GetAll(Expression<Func<LastikMarkalar, bool>> filter = null);
        LastikMarkalar Get(Expression<Func<LastikMarkalar, bool>> filter = null);
        LastikMarkalar GetByID(int id);
        void Add(LastikMarkalar giris);
        void Update(LastikMarkalar giris);
        void Delete(int id);
    }
}
