using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HFY.Core.Models
{
    public class FixedHelperModel
    {
        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
        public DateTime DuzenlemeTarihi { get; set; } = DateTime.Now;
    }
}
