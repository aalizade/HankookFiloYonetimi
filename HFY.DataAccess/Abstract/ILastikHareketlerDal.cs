using HFY.Core.DataAccess;
using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace HFY.DataAccess.Abstract
{
    public interface ILastikHareketlerDal:IEntityRepository<LastikHareketler>
    {
        //Custom Operations
        int TotalCount(Expression<Func<LastikHareketler, bool>> filter = null);
    }
}
