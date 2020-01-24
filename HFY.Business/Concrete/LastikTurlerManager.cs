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
    public class LastikTurlerManager : ILastikTurlerService
    {
        private ILastikTurlerDal _lastikTurlerDal;
        public LastikTurlerManager(ILastikTurlerDal lastikTurlerDal)
        {
            _lastikTurlerDal = lastikTurlerDal;
        }
        public List<LastikTurler> GetAll(Expression<Func<LastikTurler, bool>> filter = null)
        {
            return _lastikTurlerDal.GetList(filter);
        }
        public LastikTurler Get(Expression<Func<LastikTurler, bool>> filter = null)
        {
            return _lastikTurlerDal.Get(filter);
        }
        public LastikTurler GetByID(int id)
        {
            return _lastikTurlerDal.Get(a => a.LastikTurID == id);
        }
        public void Add(LastikTurler giris)
        {
            _lastikTurlerDal.Add(giris);
        }
        public void Update(LastikTurler giris)
        {
            _lastikTurlerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikTurlerDal.Delete(new LastikTurler() { LastikTurID = id });
        }
       
    }
}
