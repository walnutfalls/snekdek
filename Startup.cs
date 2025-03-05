using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using snekdek.GameServer;
using snekdek.Utils;

namespace snekdek
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR().AddMessagePackProtocol(options =>
                {
                    options.FormatterResolvers = new List<MessagePack.IFormatterResolver>()
                    {
                        MessagePack.Resolvers.ContractlessStandardResolver.Instance,
                    };
                });
                
            services.AddSingleton<Game, Game>();
            services.AddSingleton<JsonParser, JsonParser>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            app.UseFileServer();
            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<SnekdekHub>("/snekdekHub");
            });
        }
    }
}
