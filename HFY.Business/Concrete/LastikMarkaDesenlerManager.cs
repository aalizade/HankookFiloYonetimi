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
    public class LastikMarkaDesenlerManager : ILastikMarkaDesenlerService
    {
        private ILastikMarkaDesenlerDal _lastikMarkaDesenlerDal;
        public LastikMarkaDesenlerManager(ILastikMarkaDesenlerDal lastikMarkaDesenlerDal)
        {
            _lastikMarkaDesenlerDal = lastikMarkaDesenlerDal;
        }
        public List<LastikMarkaDesenler> GetAll(Expression<Func<LastikMarkaDesenler, bool>> filter = null)
        {
            return _lastikMarkaDesenlerDal.GetList(filter);
        }
        public LastikMarkaDesenler Get(Expression<Func<LastikMarkaDesenler, bool>> filter = null)
        {
            return _lastikMarkaDesenlerDal.Get(filter);
        }
        public LastikMarkaDesenler GetByID(int id)
        {
            return _lastikMarkaDesenlerDal.Get(a => a.LastikMarkaDesenID == id);
        }
        public void Add(LastikMarkaDesenler giris)
        {
            _lastikMarkaDesenlerDal.Add(giris);
        }
        public void Update(LastikMarkaDesenler giris)
        {
            _lastikMarkaDesenlerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikMarkaDesenlerDal.Delete(new LastikMarkaDesenler() { LastikMarkaDesenID = id });
        }

    }
}
