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
    public class LastikTiplerManager : ILastikTiplerService
    {
        private ILastikTiplerDal _lastikTiplerDal;
        public LastikTiplerManager(ILastikTiplerDal lastikTiplerDal)
        {
            _lastikTiplerDal = lastikTiplerDal;
        }
        public List<LastikTipler> GetAll(Expression<Func<LastikTipler, bool>> filter = null)
        {
            return _lastikTiplerDal.GetList(filter);
        }
        public LastikTipler Get(Expression<Func<LastikTipler, bool>> filter = null)
        {
            return _lastikTiplerDal.Get(filter);
        }
        public LastikTipler GetByID(int id)
        {
            return _lastikTiplerDal.Get(a => a.LastikTipID == id);
        }
        public void Add(LastikTipler giris)
        {
            _lastikTiplerDal.Add(giris);
        }
        public void Update(LastikTipler giris)
        {
            _lastikTiplerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikTiplerDal.Delete(new LastikTipler() { LastikTipID = id });
        }
       
    }
}
