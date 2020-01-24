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
    public class HizIndekslerManager : IHizIndekslerService
    {
        private IHizIndekslerDal _hizIndekslerDal;
        public HizIndekslerManager(IHizIndekslerDal hizIndekslerDal)
        {
            _hizIndekslerDal = hizIndekslerDal;
        }
        public List<HizIndeksler> GetAll(Expression<Func<HizIndeksler, bool>> filter = null)
        {
            return _hizIndekslerDal.GetList(filter);
        }
        public HizIndeksler Get(Expression<Func<HizIndeksler, bool>> filter = null)
        {
            return _hizIndekslerDal.Get(filter);
        }
        public HizIndeksler GetByID(int id)
        {
            return _hizIndekslerDal.Get(a => a.HizIndexID == id);
        }
        public void Add(HizIndeksler giris)
        {
            _hizIndekslerDal.Add(giris);
        }
        public void Update(HizIndeksler giris)
        {
            _hizIndekslerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _hizIndekslerDal.Delete(new HizIndeksler() { HizIndexID = id });
        }
       
    }
}
