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
    public class YukIndekslerManager : IYukIndekslerService
    {
        private IYukIndekslerDal _yukIndekslerDal;
        public YukIndekslerManager(IYukIndekslerDal yukIndekslerDal)
        {
            _yukIndekslerDal = yukIndekslerDal;
        }
        public List<YukIndeksler> GetAll(Expression<Func<YukIndeksler, bool>> filter = null)
        {
            return _yukIndekslerDal.GetList(filter);
        }
        public YukIndeksler Get(Expression<Func<YukIndeksler, bool>> filter = null)
        {
            return _yukIndekslerDal.Get(filter);
        }
        public YukIndeksler GetByID(int id)
        {
            return _yukIndekslerDal.Get(a => a.YukIndexID == id);
        }
        public void Add(YukIndeksler giris)
        {
            _yukIndekslerDal.Add(giris);
        }
        public void Update(YukIndeksler giris)
        {
            _yukIndekslerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _yukIndekslerDal.Delete(new YukIndeksler() { YukIndexID = id });
        }
       
    }
}
