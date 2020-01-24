using HFY.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace HFY.DataAccess.Concrete.EntityFramework
{
    public class HFYContext : DbContext
    {
        //public HFYContext(DbContextOptions<HFYContext> options) : base(options)
        //{ }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer(@"Server=.;Database=HFYDatabase;Trusted_Connection=true");
            optionsBuilder.UseSqlServer(@"Server=81.21.170.146;Database=HFYDatabase;User=sa;Password=gokben123...");
            //optionsBuilder.UseSqlServer(@"Server=.;Database=HFYDatabase;User=sa;Password=gokben123...");
        }
        public DbSet<Firmalar> Firmalars { get; set; }
        public DbSet<Ebatlar> Ebatlars { get; set; }
        public DbSet<Lastikler> Lastiklers { get; set; }
        public DbSet<LastikMarkalar> LastikMarkalars { get; set; }
        public DbSet<LastikMarkaDesenler> LastikMarkaDesenlers { get; set; }
        public DbSet<LastikMarkaDesenOzellikler> LastikMarkaDesenOzelliklers { get; set; }

        public DbSet<AksDuzen> AksDuzens { get; set; }
        public DbSet<AksPozisyon> AksPozisyons { get; set; }
        public DbSet<AracKategoriler> AracKategorilers { get; set; }
        public DbSet<AracMarkalar> AracMarkalars { get; set; }
        public DbSet<AracModeller> AracModellers { get; set; }
        public DbSet<YukIndeksler> YukIndekslers { get; set; }
        public DbSet<HizIndeksler> HizIndekslers { get; set; }
        public DbSet<LastikTipler> LastikTiplers { get; set; }
        public DbSet<LastikTurler> LastikTurlers { get; set; }
        public DbSet<LastikKonumlar> LastikKonumlars { get; set; }
        public DbSet<LastikOlcumler> LastikOlcumlers { get; set; }
        public DbSet<LastikHareketler> LastikHareketlers { get; set; }
        public DbSet<Araclar> Araclars { get; set; }
        public DbSet<AracBakimlar> AracBakimlars { get; set; }
        public DbSet<AracBakimHareketler> AracBakimHareketlers { get; set; }

        public DbSet<HavaFarkTanimlar> HavaFarkTanimlars { get; set; }

        public DbSet<ParaBirimler> ParaBirimlers { get; set; }

        // Bu bir kullanıcının firmaya, şubeye erişim yetkisini belirlemek için üretildi. 
        public DbSet<KullaniciYetkiler> KullaniciYetkilers { get; set; }



    }
}
