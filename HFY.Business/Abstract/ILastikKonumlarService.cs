using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Abstract
{
    public interface ILastikKonumlarService
    {
        List<LastikKonumlar> GetAll(Expression<Func<LastikKonumlar, bool>> filter = null);
        LastikKonumlar Get(Expression<Func<LastikKonumlar, bool>> filter = null);
        LastikKonumlar GetByID(int id);
        void Add(LastikKonumlar giris);
        void Update(LastikKonumlar giris);
        void Delete(int id);
    }
}
