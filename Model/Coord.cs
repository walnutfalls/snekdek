using System;
using MessagePack;

namespace snekdek.Model
{
    [MessagePackObject]
    public class Coord : IEquatable<Coord>
    {
        [Key("x")]
        public int X { get; set; }

        [Key("y")]
        public int Y { get; set; }

        public Coord() { }
        public Coord(int x, int y)
        {
            X = x;
            Y = y;
        }

        public bool Equals(Coord other)
        {
            return X == other.X && Y == other.Y;
        }

        public void SetFrom(Coord other)
        {
            X = other.X;
            Y = other.Y;
        }

        public void AdvanceInDir(Direction dir)
        {
            switch (dir)
            {
                case Direction.Up:
                    Y--;
                    break;
                case Direction.Right:
                    X++;
                    break;
                case Direction.Down:
                    Y++;
                    break;
                case Direction.Left:
                    X--;
                    break;
            }
        }
    }
}