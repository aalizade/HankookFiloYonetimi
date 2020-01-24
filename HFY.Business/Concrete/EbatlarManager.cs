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
    public class EbatlarManager : IEbatlarService
    {
        private IEbatlarDal _ebatlarDal;
        public EbatlarManager(IEbatlarDal ebatlarDal)
        {
            _ebatlarDal = ebatlarDal;
        }
        public List<Ebatlar> GetAll(Expression<Func<Ebatlar, bool>> filter = null)
        {
            return _ebatlarDal.GetList(filter);
        }
        public Ebatlar Get(Expression<Func<Ebatlar, bool>> filter = null)
        {
            return _ebatlarDal.Get(filter);
        }
        public Ebatlar GetByID(int id)
        {
            return _ebatlarDal.Get(a => a.EbatID == id);
        }
        public void Add(Ebatlar giris)
        {
            _ebatlarDal.Add(giris);
        }
        public void Update(Ebatlar giris)
        {
            _ebatlarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _ebatlarDal.Delete(new Ebatlar() { EbatID = id });
        }

       
    }
}
