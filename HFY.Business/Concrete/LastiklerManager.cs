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
    public class LastiklerManager : ILastiklerService
    {
        private ILastiklerDal _lastiklerDal;
        public LastiklerManager(ILastiklerDal lastiklerDal)
        {
            _lastiklerDal = lastiklerDal;
        }
        public List<Lastikler> GetAll(Expression<Func<Lastikler, bool>> filter = null)
        {
            return _lastiklerDal.GetList(filter);
        }
        public Lastikler Get(Expression<Func<Lastikler, bool>> filter = null)
        {
            return _lastiklerDal.Get(filter);
        }
        public Lastikler GetByID(int id)
        {
            return _lastiklerDal.Get(a => a.LastikID == id);
        }
        public void Add(Lastikler giris)
        {
            _lastiklerDal.Add(giris);
        }
        public void Update(Lastikler giris)
        {
            _lastiklerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastiklerDal.Delete(new Lastikler() { LastikID = id });
        }
       
    }
}
