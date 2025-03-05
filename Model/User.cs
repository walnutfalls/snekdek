using System.Runtime.Serialization;
using MessagePack;

namespace snekdek.Model
{
    [MessagePackObject]
    public class User
    {
        [Key("userId")]
        public string UserId { get; set; }        
        
        [Key("name")]
        public string Name { get; set; }        
        
        [Key("head")]
        public Segment Head { get; set; } = new Segment();        
        
        [Key("state")]
        public UserState State { get; set; } = UserState.Active;        
        
        [Key("direction")]
        public Direction Direction { get; set; }        
        
        [Key("pendingDirection")]
        public Direction PendingDirection { get; set; }        
        
        [Key("score")]
        public int Score { get; set; }


        public void Advance()
        {
            Head.Advance(Direction);
        }

        public void AddSegment()
        {
            Score++;
            var newSeg = Head.AddNewSegment();
        }

        public bool HeadIntersects(User other)
        {
            return HeadIntersectRecurse(other.Head);
        }

        public bool HeadIntersectsNonHead(User other)
        {
            if(other.Head.Next == null) return false;
            return HeadIntersectRecurse(other.Head.Next);
        }

        public bool HeadIntersects(Coord coords)
        {
            return coords.Equals(Head.Coords);
        }

        private bool HeadIntersectRecurse(Segment other)
        {
            if (other.Coords.Equals(Head.Coords)) return true;
            if (other.Next == null) return false;
            return HeadIntersectRecurse(other.Next);
        }
    }

    public enum UserState
    {
        Dead = 0,
        Active = 1,
    }
}
