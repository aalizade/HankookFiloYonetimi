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
    public class LastikMarkaDesenOzelliklerManager : ILastikMarkaDesenOzelliklerService
    {
        private ILastikMarkaDesenOzelliklerDal _lastikMarkaDesenOzelliklerDal;
        public LastikMarkaDesenOzelliklerManager(ILastikMarkaDesenOzelliklerDal lastikMarkaDesenOzelliklerDal)
        {
            _lastikMarkaDesenOzelliklerDal = lastikMarkaDesenOzelliklerDal;
        }
        public List<LastikMarkaDesenOzellikler> GetAll(Expression<Func<LastikMarkaDesenOzellikler, bool>> filter = null)
        {
            return _lastikMarkaDesenOzelliklerDal.GetList(filter);
        }
        public LastikMarkaDesenOzellikler Get(Expression<Func<LastikMarkaDesenOzellikler, bool>> filter = null)
        {
            return _lastikMarkaDesenOzelliklerDal.Get(filter);
        }
        public LastikMarkaDesenOzellikler GetByID(int id)
        {
            return _lastikMarkaDesenOzelliklerDal.Get(a => a.LastikMarkaDesenOzellikID == id);
        }
        public void Add(LastikMarkaDesenOzellikler giris)
        {
            _lastikMarkaDesenOzelliklerDal.Add(giris);
        }
        public void Update(LastikMarkaDesenOzellikler giris)
        {
            _lastikMarkaDesenOzelliklerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikMarkaDesenOzelliklerDal.Delete(new LastikMarkaDesenOzellikler() { LastikMarkaDesenOzellikID = id });
        }

    }
}
