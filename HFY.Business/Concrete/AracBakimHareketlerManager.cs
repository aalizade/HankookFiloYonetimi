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
    public class AracBakimHareketlerManager : IAracBakimHareketlerService
    {
        private IAracBakimHareketlerDal _aracBakimHareketlerDal;
        public AracBakimHareketlerManager(IAracBakimHareketlerDal aracBakimHareketlerDal)
        {
            _aracBakimHareketlerDal = aracBakimHareketlerDal;
        }
        public List<AracBakimHareketler> GetAll(Expression<Func<AracBakimHareketler, bool>> filter = null)
        {
            return _aracBakimHareketlerDal.GetList(filter);
        }
        public AracBakimHareketler Get(Expression<Func<AracBakimHareketler, bool>> filter = null)
        {
            return _aracBakimHareketlerDal.Get(filter);
        }
        public AracBakimHareketler GetByID(int id)
        {
            return _aracBakimHareketlerDal.Get(a => a.AracBakimHareketID == id);
        }
        public void Add(AracBakimHareketler giris)
        {
            _aracBakimHareketlerDal.Add(giris);
        }
        public void Update(AracBakimHareketler giris)
        {
            _aracBakimHareketlerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aracBakimHareketlerDal.Delete(new AracBakimHareketler() { AracBakimHareketID = id });
        }
       
    }
}
