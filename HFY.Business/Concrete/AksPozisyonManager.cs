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
    public class AksPozisyonManager : IAksPozisyonService
    {
        private IAksPozisyonDal _aksPozisyonDal;
        public AksPozisyonManager(IAksPozisyonDal aksPozisyonDal)
        {
            _aksPozisyonDal = aksPozisyonDal;
        }
        public List<AksPozisyon> GetAll(Expression<Func<AksPozisyon, bool>> filter = null)
        {
            return _aksPozisyonDal.GetList(filter);
        }
        public AksPozisyon Get(Expression<Func<AksPozisyon, bool>> filter = null)
        {
            return _aksPozisyonDal.Get(filter);
        }
        public AksPozisyon GetByID(int id)
        {
            return _aksPozisyonDal.Get(a => a.AksPozisyonID == id);
        }
        public void Add(AksPozisyon giris)
        {
            _aksPozisyonDal.Add(giris);
        }
        public void Update(AksPozisyon giris)
        {
            _aksPozisyonDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aksPozisyonDal.Delete(new AksPozisyon() { AksPozisyonID = id });
        }
       
    }
}
