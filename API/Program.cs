using API.Data;
using API.Entities;
using API.Extensions;
using API.MiddleWare;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

//always needs to do this because client and api run on different localhost (use client localhost)
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200"));

//used this one as a test
//app.UseCors(builder => builder.AllowAnyHeader().AllowAnyHeader().WithOrigins("http://localhost:4200").WithMethods("PUT", "POST", "GET"));

//has to be after cors and before mapcontrollers
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

#region Creates the database on startup if there is no database
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager);
}
catch(Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error ocurred during migration");
}

#endregion

app.Run();