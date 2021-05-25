using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TestWebApp.Constants;
using TestWebApp.Data;
using TestWebApp.Models;

namespace TestWebApp.Controllers
{
    
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;       

        public UserController(UserManager<ApplicationUser> userManager)
        {            
            _userManager = userManager;            
        }

        [Authorize]
        [HttpGet]
        [ActionName("IsCurrentUserAdmin")]
        public async Task<IActionResult> IsCurrentUserAdmin()
        {           
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);      
            var user = await _userManager.FindByIdAsync(userId);

            return  Ok(await _userManager.IsInRoleAsync(user, RoleNames.Admin.ToString()));
        }
    }
}
