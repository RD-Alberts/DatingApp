using System.Text;
using API.Data;
using API.Extensions;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}
//always needs to do this because client and api run on different localhost (use client localhost)
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyHeader().WithOrigins("http://localhost:4200"));

//has to be after cors and before mapcontrollers
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();