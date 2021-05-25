using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestWebApp.Constants;
using TestWebApp.Data;
using TestWebApp.Data.Models;
using TestWebApp.Models;

namespace TestWebApp.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;       

        public NoteController(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;           
        }

        //[Authorize(Roles ="Admin")] I did not find how to work with JWT token
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Note>>> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (! await _userManager.IsInRoleAsync(user, RoleNames.Admin.ToString()))
            {
                return Forbid();
            }
           
            var query = (from n in _context.Notes.AsNoTracking()
                          join u in _context.Users.AsNoTracking() on n.UserId equals u.Id
                          select new 
                          {
                              noteId =n.NoteId,
                              userId = n.UserId,
                              created = n.Created,
                              name = n.Name,
                              description = n.Description,
                              userName = u.UserName                            
                          });

            return Ok(await query.OrderByDescending(x=>x.created).ToListAsync());           
        }
        
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Note>>> GetByUserId(string userId)
       {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId != currentUserId)
            {
                return Forbid();
            }
           
            return await _context.Notes
                .Where(x=>x.UserId == userId)
                .OrderByDescending(x=>x.Created)
                .ToListAsync();
        }
       
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> GetNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            return Ok(note);
        }       
       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNote(int id, Note note)
        {
            if (id != note.NoteId)
            {
                return BadRequest();
            }
            
            _context.Entry(note).State = EntityState.Modified;          
            await _context.SaveChangesAsync();            

            return Ok();
        }
       
        [HttpPost]
        public async Task<ActionResult<Note>> PostNote(Note note)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            note.Created = DateTime.Now;

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                noteId = note.NoteId,
                userId = note.UserId,
                created = note.Created,
                name = note.Name,
                description = note.Description,
                userName = user.UserName
            });
        }
       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }       
    }
}
