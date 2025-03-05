using MessagePack;

namespace snekdek.Model
{
    [MessagePackObject]
    
    public class Food
    {
        [Key("c")]
        public Coord Coords { get; set; }
    }
}