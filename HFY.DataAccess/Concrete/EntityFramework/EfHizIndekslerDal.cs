using HFY.Core.DataAccess.EntityFramework;
using HFY.DataAccess.Abstract;
using HFY.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Text;

namespace HFY.DataAccess.Concrete.EntityFramework
{
    public class EfHizIndekslerDal:EfEntityRepositoryBase<HizIndeksler,HFYContext>,IHizIndekslerDal
    {

    }
}
