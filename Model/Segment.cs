using MessagePack;
using Newtonsoft.Json;

namespace snekdek.Model
{

    // NOTE: There are a lot of segments in the game, so the names are minified. 
    [MessagePackObject]
    public class Segment
    {
        public Segment(Segment previous)
        {
            Previous = previous;
        }

        public Segment() {}

        [Key("n")]
        public Segment Next { get; set; }

        [JsonIgnore]
        [IgnoreMember]        
        public Segment Previous { get; set; }

        [Key("c")]
        public Coord Coords { get; set; } = new Coord();

        [Key("i")]
        public bool IsHead => Previous == null;


        public Segment AddNewSegment()
        {
            var cursor = this;

            while (cursor.Next != null)
                cursor = cursor.Next;
            
            cursor.Next = new Segment(cursor);
            cursor.Next.Coords.X = cursor.Coords.X;
            cursor.Next.Coords.Y = cursor.Coords.Y;

            return cursor.Next;
        }

        public void Advance(Direction dir)
        {
            var cursor = this;

            while (cursor.Next != null)
                cursor = cursor.Next;
            
            do
            {
                if (cursor.IsHead)
                    cursor.Coords.AdvanceInDir(dir);
                else
                    cursor.Coords.SetFrom(cursor.Previous.Coords);

                cursor = cursor.Previous;
            } while (cursor != null);
        }
    }
}