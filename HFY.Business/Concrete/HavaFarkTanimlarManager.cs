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
    public class HavaFarkTanimlarManager : IHavaFarkTanimlarService
    {
        private IHavaFarkTanimlarDal _havaFarkTanimlarDal;
        public HavaFarkTanimlarManager(IHavaFarkTanimlarDal havaFarkTanimlarDal)
        {
            _havaFarkTanimlarDal = havaFarkTanimlarDal;
        }
        public List<HavaFarkTanimlar> GetAll(Expression<Func<HavaFarkTanimlar, bool>> filter = null)
        {
            return _havaFarkTanimlarDal.GetList(filter);
        }
        public HavaFarkTanimlar Get(Expression<Func<HavaFarkTanimlar, bool>> filter = null)
        {
            return _havaFarkTanimlarDal.Get(filter);
        }
        public HavaFarkTanimlar GetByID(int id)
        {
            return _havaFarkTanimlarDal.Get(a => a.HavaFarkID == id);
        }
        public void Add(HavaFarkTanimlar giris)
        {
            _havaFarkTanimlarDal.Add(giris);
        }
        public void Update(HavaFarkTanimlar giris)
        {
            _havaFarkTanimlarDal.Update(giris);
        }
        public void Delete(int id)
        {
            _havaFarkTanimlarDal.Delete(new HavaFarkTanimlar() { HavaFarkID = id });
        }
    }
}
