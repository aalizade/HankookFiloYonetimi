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
    public class AksDuzenManager : IAksDuzenService
    {
        private IAksDuzenDal _aksDuzenDal;
        public AksDuzenManager(IAksDuzenDal aksDuzenDal)
        {
            _aksDuzenDal = aksDuzenDal;
        }
        public List<AksDuzen> GetAll(Expression<Func<AksDuzen, bool>> filter = null)
        {
            return _aksDuzenDal.GetList(filter);
        }
        public AksDuzen Get(Expression<Func<AksDuzen, bool>> filter = null)
        {
            return _aksDuzenDal.Get(filter);
        }
        public AksDuzen GetByID(int id)
        {
            return _aksDuzenDal.Get(a => a.AksDuzenID == id);
        }
        public void Add(AksDuzen giris)
        {
            _aksDuzenDal.Add(giris);
        }
        public void Update(AksDuzen giris)
        {
            _aksDuzenDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aksDuzenDal.Delete(new AksDuzen() { AksDuzenID = id });
        }
       
    }
}
