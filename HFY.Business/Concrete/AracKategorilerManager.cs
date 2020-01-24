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
    public class AracKategorilerManager : IAracKategorilerService
    {
        private IAracKategorilerDal _aracKategorilerDal;
        public AracKategorilerManager(IAracKategorilerDal aracKategorilerDal)
        {
            _aracKategorilerDal = aracKategorilerDal;
        }
        public List<AracKategoriler> GetAll(Expression<Func<AracKategoriler, bool>> filter = null)
        {
            return _aracKategorilerDal.GetList(filter);
        }
        public AracKategoriler Get(Expression<Func<AracKategoriler, bool>> filter = null)
        {
            return _aracKategorilerDal.Get(filter);
        }
        public AracKategoriler GetByID(int id)
        {
            return _aracKategorilerDal.Get(a => a.AracKategoriID == id);
        }
        public void Add(AracKategoriler giris)
        {
            _aracKategorilerDal.Add(giris);
        }
        public void Update(AracKategoriler giris)
        {
            _aracKategorilerDal.Update(giris);
        }
        public void Delete(int id)
        {
            _aracKategorilerDal.Delete(new AracKategoriler() { AracKategoriID = id });
        }
       
    }
}
