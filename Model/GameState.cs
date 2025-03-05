using System.Collections.Generic;
using MessagePack;
using snekdek.GameServer;

namespace snekdek.Model
{    
    [MessagePackObject]
    public class GameState
    {
        [Key("users")]
        public List<User> Users { get; set; } = new List<User>();
        
        [Key("allFood")]
        public List<Food> AllFood { get; set; } = new List<Food>();
        
        [Key("gameBounds")]
        public Rect GameBounds { get; set; } = new Rect(
            lowerLeft: new Coord(-50, 50),
            upperRight: new Coord(50, -50)
        );
    }
}