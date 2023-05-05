using API.DTOs;
using API.Entities;
using API.Helpers;
using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        //predicate is used to detirmine if they want the user the liked or the user doing the liking
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}