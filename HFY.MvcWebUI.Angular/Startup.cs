using HFY.Business.Abstract;
using HFY.Business.Concrete;
using HFY.DataAccess.Abstract;
using HFY.DataAccess.Concrete.EntityFramework;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace HankookFiloYonetimi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public class AppSettings
        {
            public string Secret { get; set; }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddDbContext<HFYContext>(x => x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IFirmalarService, FirmalarManager>();
            services.AddScoped<IFirmalarDal, EfFirmalarDal>();
            //
            services.AddScoped<IEbatlarService, EbatlarManager>();
            services.AddScoped<IEbatlarDal, EfEbatlarDal>();
            //
            services.AddScoped<ILastiklerService, LastiklerManager>();
            services.AddScoped<ILastiklerDal, EfLastiklerDal>();
            //
            services.AddScoped<ILastikMarkalarService, LastikMarkalarManager>();
            services.AddScoped<ILastikMarkalarDal, EfLastikMarkalarDal>();
            //
            services.AddScoped<ILastikMarkaDesenlerService, LastikMarkaDesenlerManager>();
            services.AddScoped<ILastikMarkaDesenlerDal, EfLastikMarkaDesenlerDal>();
            //
            services.AddScoped<ILastikMarkaDesenOzelliklerService, LastikMarkaDesenOzelliklerManager>();
            services.AddScoped<ILastikMarkaDesenOzelliklerDal, EfLastikMarkaDesenOzelliklerDal>();
            //
            services.AddScoped<IAksDuzenService, AksDuzenManager>();
            services.AddScoped<IAksDuzenDal, EfAksDuzenDal>();
            //
            services.AddScoped<IAksPozisyonService, AksPozisyonManager>();
            services.AddScoped<IAksPozisyonDal, EfAksPozisyonDal>();
            //
            services.AddScoped<IAracKategorilerService, AracKategorilerManager>();
            services.AddScoped<IAracKategorilerDal, EfAracKategorilerDal>();
            //
            services.AddScoped<IAracMarkalarService, AracMarkalarManager>();
            services.AddScoped<IAracMarkalarDal, EfAracMarkalarDal>();
            //
            services.AddScoped<IAracModellerService, AracModellerManager>();
            services.AddScoped<IAracModellerDal, EfAracModellerDal>();
            //
            services.AddScoped<IYukIndekslerService, YukIndekslerManager>();
            services.AddScoped<IYukIndekslerDal, EfYukIndekslerDal>();
            //
            services.AddScoped<IHizIndekslerService, HizIndekslerManager>();
            services.AddScoped<IHizIndekslerDal, EfHizIndekslerDal>();
            //
            services.AddScoped<ILastikTurlerService, LastikTurlerManager>();
            services.AddScoped<ILastikTurlerDal, EfLastikTurlerDal>();
            //
            services.AddScoped<IAraclarService, AraclarManager>();
            services.AddScoped<IAraclarDal, EfAraclarDal>();
            //
            services.AddScoped<IAracBakimlarService, AracBakimlarManager>();
            services.AddScoped<IAracBakimlarDal, EfAracBakimlarDal>();
            //
            services.AddScoped<IAracBakimHareketlerService, AracBakimHareketlerManager>();
            services.AddScoped<IAracBakimHareketlerDal, EfAracBakimHareketlerDal>();
            //
            services.AddScoped<ILastikTiplerService, LastikTiplerManager>();
            services.AddScoped<ILastikTiplerDal, EfLastikTiplerDal>();
            //
            services.AddScoped<ILastikKonumlarService, LastikKonumlarManager>();
            services.AddScoped<ILastikKonumlarDal, EfLastikKonumlarDal>();
            //
            services.AddScoped<ILastikOlcumlerService, LastikOlcumlerManager>();
            services.AddScoped<ILastikOlcumlerDal, EfLastikOlcumlerDal>();
            //
            services.AddScoped<ILastikHareketlerService, LastikHareketlerManager>();
            services.AddScoped<ILastikHareketlerDal, EfLastikHareketlerDal>();
            //
            services.AddScoped<IHavaFarkTanimlarService, HavaFarkTanimlarManager>();
            services.AddScoped<IHavaFarkTanimlarDal, EfHavaFarkTanimlarDal>();
            //
            services.AddScoped<IParaBirimlerService, ParaBirimlerManager>();
            services.AddScoped<IParaBirimlerDal, EfParaBirimlerDal>();
            //
            services.AddScoped<IKullaniciYetkilerService, KullaniciYetkilerManager>();
            services.AddScoped<IKullaniciYetkilerDal, EfKullaniciYetkilerDal>();
            //

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(scheme =>
            {
                scheme.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                scheme.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = ctx =>
                    {
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = ctx =>
                    {
                        // Console.WriteLine($"Exception : {ctx.Exception.Message}");
                        ctx.NoResult();
                        ctx.Response.StatusCode = 500;
                        ctx.Response.ContentType = "text/plain";
                        ctx.Response.WriteAsync(ctx.Exception.ToString()).Wait();
                        return Task.CompletedTask;
                    },
                    OnChallenge = ctx =>
                    {
                        return Task.CompletedTask;
                    },
                    OnMessageReceived = ctx =>
                    {
                        return Task.CompletedTask;
                    }
                };
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
