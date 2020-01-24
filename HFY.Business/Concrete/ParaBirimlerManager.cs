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
    public class ParaBirimlerManager : IParaBirimlerService
    {
        private IParaBirimlerDal _paraBirimlerDal;
        public ParaBirimlerManager(IParaBirimlerDal paraBirimlerDal)
        {
            _paraBirimlerDal = paraBirimlerDal;
        }
        public List<ParaBirimler> GetAll(Expression<Func<ParaBirimler, bool>> filter = null)
        {
            return _paraBirimlerDal.GetList(filter);
        }
        public ParaBirimler Get(Expression<Func<ParaBirimler, bool>> filter = null)
        {
            return _paraBirimlerDal.Get(filter);
        }
        public ParaBirimler GetByID(int id)
        {
            return _paraBirimlerDal.Get(a => a.ParaBirimID == id);
        }
        public void Add(ParaBirimler giris)
        {
            _paraBirimlerDal.Add(giris);
        }
        public void Update(ParaBirimler giris)
        {
            _paraBirimlerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _paraBirimlerDal.Delete(new ParaBirimler() { ParaBirimID = id });
        }
       
    }
}
