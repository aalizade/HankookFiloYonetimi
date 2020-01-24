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
    public class AracMarkalarManager : IAracMarkalarService
    {
        private IAracMarkalarDal _aracMarkalarDal;
        public AracMarkalarManager(IAracMarkalarDal aracMarkalarDal)
        {
            _aracMarkalarDal = aracMarkalarDal;
        }
        public List<AracMarkalar> GetAll(Expression<Func<AracMarkalar, bool>> filter = null)
        {
            return _aracMarkalarDal.GetList(filter);
        }
        public AracMarkalar Get(Expression<Func<AracMarkalar, bool>> filter = null)
        {
            return _aracMarkalarDal.Get(filter);
        }
        public AracMarkalar GetByID(int id)
        {
            return _aracMarkalarDal.Get(a => a.AracMarkaID == id);
        }
        public void Add(AracMarkalar giris)
        {
            _aracMarkalarDal.Add(giris);
        }
        public void Update(AracMarkalar giris)
        {
            _aracMarkalarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aracMarkalarDal.Delete(new AracMarkalar() { AracMarkaID = id });
        }
       
    }
}
