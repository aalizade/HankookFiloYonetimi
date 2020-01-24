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
    public class LastikOlcumlerManager : ILastikOlcumlerService
    {
        private ILastikOlcumlerDal _lastikOlcumlerDal;
        public LastikOlcumlerManager(ILastikOlcumlerDal lastikOlcumlerDal)
        {
            _lastikOlcumlerDal = lastikOlcumlerDal;
        }
        public List<LastikOlcumler> GetAll(Expression<Func<LastikOlcumler, bool>> filter = null)
        {
            return _lastikOlcumlerDal.GetList(filter);
        }
        public LastikOlcumler Get(Expression<Func<LastikOlcumler, bool>> filter = null)
        {
            return _lastikOlcumlerDal.Get(filter);
        }
        public LastikOlcumler GetByID(int id)
        {
            return _lastikOlcumlerDal.Get(a => a.LastikOlcumID == id);
        }
        public void Add(LastikOlcumler giris)
        {
            _lastikOlcumlerDal.Add(giris);
        }
        public void Update(LastikOlcumler giris)
        {
            _lastikOlcumlerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikOlcumlerDal.Delete(new LastikOlcumler() { LastikOlcumID = id });
        }
       
    }
}
