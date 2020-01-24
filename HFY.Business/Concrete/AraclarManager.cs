using HFY.Business.Abstract;
using HFY.Core.Classes.JWT;
using HFY.DataAccess.Abstract;
using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Business.Concrete
{
    public class AraclarManager : IAraclarService
    {
        private IAraclarDal _araclarDal;
        public AraclarManager(IAraclarDal araclarDal)
        {
            _araclarDal = araclarDal;
        }
        public List<Araclar> GetAll(Expression<Func<Araclar, bool>> filter = null, int skip = 0, int take = 0)
        {
            return _araclarDal.GetList(filter,skip,take);
        }
        public Araclar Get(Expression<Func<Araclar, bool>> filter = null)
        {
            return _araclarDal.Get(filter);
        }
        public Araclar GetByID(int id)
        {
            return _araclarDal.Get(a => a.AracID == id);
        }
        public void Add(Araclar giris)
        {
            _araclarDal.Add(giris);
        }
        public void Update(Araclar giris)
        {
            _araclarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _araclarDal.Delete(new Araclar() { AracID = id });
        }
    }
}
