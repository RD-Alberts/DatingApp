using API.Data;
using API.Extensions;
using API.MiddleWare;
using Microsoft.AspNetCore.Hosting.Server.Features;
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
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyHeader().WithOrigins("http://localhost:4200"));

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
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(context);
}
catch(Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error ocurred during migration");
}

#endregion

app.Run();