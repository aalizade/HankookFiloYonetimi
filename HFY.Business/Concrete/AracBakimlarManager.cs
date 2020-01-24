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
    public class AracBakimlarManager : IAracBakimlarService
    {
        private IAracBakimlarDal _aracBakimlarDal;
        public AracBakimlarManager(IAracBakimlarDal aracBakimlarDal)
        {
            _aracBakimlarDal = aracBakimlarDal;
        }
        public List<AracBakimlar> GetAll(Expression<Func<AracBakimlar, bool>> filter = null)
        {
            return _aracBakimlarDal.GetList(filter);
        }
        public AracBakimlar Get(Expression<Func<AracBakimlar, bool>> filter = null)
        {
            return _aracBakimlarDal.Get(filter);
        }
        public AracBakimlar GetByID(int id)
        {
            return _aracBakimlarDal.Get(a => a.AracBakimID == id);
        }
        public void Add(AracBakimlar giris)
        {
            _aracBakimlarDal.Add(giris);
        }
        public void Update(AracBakimlar giris)
        {
            _aracBakimlarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aracBakimlarDal.Delete(new AracBakimlar() { AracBakimID = id });
        }
       
    }
}
