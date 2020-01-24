using HFY.Core.DataAccess.EntityFramework;
using HFY.DataAccess.Abstract;
using HFY.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace HFY.DataAccess.Concrete.EntityFramework
{
    public class EfLastikHareketlerDal : EfEntityRepositoryBase<LastikHareketler, HFYContext>, ILastikHareketlerDal
    {
        public int TotalCount(Expression<Func<LastikHareketler, bool>> filter = null)
        {
            using (var context = new HFYContext())
            {
                return context.Set<LastikHareketler>().Count(filter);
            }
        }
    }
}
