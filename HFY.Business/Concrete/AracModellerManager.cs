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
    public class AracModellerManager : IAracModellerService
    {
        private IAracModellerDal _aracModellerDal;
        public AracModellerManager(IAracModellerDal aracModellerDal)
        {
            _aracModellerDal = aracModellerDal;
        }
        public List<AracModeller> GetAll(Expression<Func<AracModeller, bool>> filter = null)
        {
            return _aracModellerDal.GetList(filter);
        }
        public AracModeller Get(Expression<Func<AracModeller, bool>> filter = null)
        {
            return _aracModellerDal.Get(filter);
        }
        public AracModeller GetByID(int id)
        {
            return _aracModellerDal.Get(a => a.AracModelID == id);
        }
        public void Add(AracModeller giris)
        {
            _aracModellerDal.Add(giris);
        }
        public void Update(AracModeller giris)
        {
            _aracModellerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aracModellerDal.Delete(new AracModeller() { AracModelID = id });
        }
       
    }
}
