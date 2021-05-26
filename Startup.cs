using IdentityServer4.AspNetIdentity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestWebApp.Constants;
using TestWebApp.Data;
using TestWebApp.Models;
using TestWebApp.Services;

namespace TestWebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>()
                .AddProfileService<ProfileService>(); 

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddControllersWithViews();
            services.AddRazorPages();
                        
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSwaggerGen(s =>
            {
                s.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Chat API",
                    Description = "Chat API Swagger Surface",
                    Contact = new OpenApiContact
                    {
                        Name = "Admin",
                        Email = "tanytest77@gmail.com",
                        Url = new Uri("https://www.linkedin.com/")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Admin",
                        Url = new Uri("https://github.com/")
                    }

                });

                s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme (Example: 'Bearer 12345abcdef')",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                s.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services, ApplicationDbContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
                context.Database.Migrate();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }            

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                //c.RoutePrefix = string.Empty; https://localhost:44300/swagger/index.html
            });


            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                     spa.UseReactDevelopmentServer(npmScript: "start");
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });

            CreateRoles(services).Wait();           
        }

        private async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var RoleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var UserManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            if (!await RoleManager.RoleExistsAsync(RoleNames.Admin.ToString()))
            {
                await RoleManager.CreateAsync(new IdentityRole(RoleNames.Admin.ToString()));
            }

            if (!await RoleManager.RoleExistsAsync(RoleNames.User.ToString()))
            {
                await RoleManager.CreateAsync(new IdentityRole(RoleNames.User.ToString()));
            }
                       
            var adminUser = await UserManager.FindByEmailAsync(Configuration["AppSettings:FirstAdminEmail"]);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = Configuration["AppSettings:FirstAdminName"],
                    Email = Configuration["AppSettings:FirstAdminEmail"],
                    EmailConfirmed = true
                };

                string userPWD = Configuration["AppSettings:FirstAdminPassword"];

                var newAdmin = await UserManager.CreateAsync(adminUser, userPWD);
                if (newAdmin.Succeeded)
                {                   
                    await UserManager.AddToRoleAsync(adminUser, RoleNames.Admin.ToString());
                }
            }           
        }
    }
}
