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
    public class LastikHareketlerManager : ILastikHareketlerService
    {
        private ILastikHareketlerDal _lastikHareketlerDal;
        public LastikHareketlerManager(ILastikHareketlerDal lastikHareketlerDal)
        {
            _lastikHareketlerDal = lastikHareketlerDal;
        }
        public List<LastikHareketler> GetAll(Expression<Func<LastikHareketler, bool>> filter = null)
        {
            return _lastikHareketlerDal.GetList(filter);
        }
        public LastikHareketler Get(Expression<Func<LastikHareketler, bool>> filter = null)
        {
            return _lastikHareketlerDal.Get(filter);
        }
        public LastikHareketler GetByID(int id)
        {
            return _lastikHareketlerDal.Get(a => a.LastikHareketID == id);
        }
        public int TotalCount(Expression<Func<LastikHareketler, bool>> filter = null)
        {
            return _lastikHareketlerDal.TotalCount(filter);
        }
        public void Add(LastikHareketler giris)
        {
            _lastikHareketlerDal.Add(giris);
        }
        public void Update(LastikHareketler giris)
        {
            _lastikHareketlerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikHareketlerDal.Delete(new LastikHareketler() { LastikHareketID = id });
        }
    }
}
