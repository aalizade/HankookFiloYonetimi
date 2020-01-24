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
    public class LastikKonumlarManager : ILastikKonumlarService
    {
        private ILastikKonumlarDal _lastikKonumlarDal;
        public LastikKonumlarManager(ILastikKonumlarDal lastikKonumlarDal)
        {
            _lastikKonumlarDal = lastikKonumlarDal;
        }
        public List<LastikKonumlar> GetAll(Expression<Func<LastikKonumlar, bool>> filter = null)
        {
            return _lastikKonumlarDal.GetList(filter);
        }
        public LastikKonumlar Get(Expression<Func<LastikKonumlar, bool>> filter = null)
        {
            return _lastikKonumlarDal.Get(filter);
        }
        public LastikKonumlar GetByID(int id)
        {
            return _lastikKonumlarDal.Get(a => a.LastikKonumID == id);
        }
        public void Add(LastikKonumlar giris)
        {
            _lastikKonumlarDal.Add(giris);
        }
        public void Update(LastikKonumlar giris)
        {
            _lastikKonumlarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _lastikKonumlarDal.Delete(new LastikKonumlar() { LastikKonumID = id });
        }
       
    }
}
