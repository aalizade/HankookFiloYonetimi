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
    public class LastikMarkalarManager : ILastikMarkalarService
    {
        private ILastikMarkalarDal _lastikMarkalarDal;
        public LastikMarkalarManager(ILastikMarkalarDal lastikMarkalarDal)
        {
            _lastikMarkalarDal = lastikMarkalarDal;
        }
        public List<LastikMarkalar> GetAll(Expression<Func<LastikMarkalar, bool>> filter = null)
        {
            return _lastikMarkalarDal.GetList(filter);
        }
        public LastikMarkalar Get(Expression<Func<LastikMarkalar, bool>> filter = null)
        {
            return _lastikMarkalarDal.Get(filter);
        }
        public LastikMarkalar GetByID(int id)
        {
            return _lastikMarkalarDal.Get(a => a.LastikMarkaID == id);
        }
        public void Add(LastikMarkalar giris)
        {
            _lastikMarkalarDal.Add(giris);
        }
        public void Update(LastikMarkalar giris)
        {
            _lastikMarkalarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikMarkalarDal.Delete(new LastikMarkalar() { LastikMarkaID = id });
        }


    }
}
