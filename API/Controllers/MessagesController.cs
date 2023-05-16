using System.Runtime.InteropServices.ObjectiveC;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.Configuration.Annotations;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;
        
        public MessagesController(IMapper mapper, IUnitOfWork uow)
        {
            _uow = uow;
            _mapper = mapper;
            
        }        

       [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUserName();

            if(username == createMessageDto.RecipientUsername.ToLower()) {
                return BadRequest("You can't send messages to yourself");
            }

            var sender = await _uow.userRepository.GetUserByUsernameAsync(username);
            var recipient = await _uow.userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if(recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            _uow.messageRepository.AddMessage(message);

            if(await _uow.Complete()) return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUser([FromQuery]MessageParams messageParams) 
        {
            messageParams.Username = User.GetUserName();

            var message = await _uow.messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(message.CurrentPage, message.PageSize, message.TotalCount, message.TotalPages));

            return message;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id) 
        {
            var username = User.GetUserName();
            var message = await _uow.messageRepository.GetMessage(id);

            if(message.SenderUsername != username && message.RecipientUsername != username) return Unauthorized();

            if(message.SenderUsername == username) message.SenderDelted = true;

            if(message.RecipientUsername == username) message.RecipientDeleted = true;

            if(message.SenderDelted && message.RecipientDeleted)
            {
                _uow.messageRepository.DeleteMessage(message);
            }

            if(await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting the message");
        }
    }
}