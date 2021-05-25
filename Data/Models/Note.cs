using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestWebApp.Data.Models
{
    public class Note
    {
        public int NoteId { get; set; }
        [MaxLength(36)]
        public string UserId { get; set; }
        public DateTime Created { get; set; }       
        [MaxLength(230)]
        public string Name { get; set; }
        [MaxLength(2000)]
        public string Description { get; set; }
    }
}
