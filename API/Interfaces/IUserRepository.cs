using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser appUser);
        //Use IEnumerable instead of a normal list if you dont want to add or remove data
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberAsync(string username);
        Task<string> GetUserGender(string username);
    }
}