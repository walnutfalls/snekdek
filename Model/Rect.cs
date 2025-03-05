using System;
using System.Collections.Generic;
using System.Linq;
using MessagePack;
using snekdek.Model;

namespace snekdek.Model
{
    [MessagePackObject]
    public class Rect
    {
        [Key("minX")]
        public int MinX { get; private set; }

        [Key("minY")]
        public int MinY { get; private set; }

        [Key("maxX")]
        public int MaxX { get; private set; }

        [Key("maxY")]
        public int MaxY { get; private set; }

        [Key("spanX")]
        public int SpanX => MaxX - MinX;

        [Key("spanY")]
        public int SpanY => MaxY - MinY;

        public Rect(IEnumerable<Coord> coords)
        {
            if (coords == null || coords.Count() == 0) return;

            var first = coords.First();
            MinX = MaxX = first.X;
            MinY = MaxY = first.Y;

            foreach (var c in coords)
            {
                if (c.X < MinX)
                    MinX = c.X;
                if (c.X > MaxX)
                    MaxX = c.X;
                if (c.Y < MinY)
                    MinY = c.Y;
                if (c.Y > MaxY)
                    MaxY = c.Y;
            }
        }

        public Rect(Coord lowerLeft, Coord upperRight)
        {
            MinX = lowerLeft.X;
            MaxX = upperRight.X;
            MinY = upperRight.Y;
            MaxY = lowerLeft.Y;
        }

        public Rect(
            int minX,
            int minY,
            int maxX,
            int maxY)
        {
            MinX = minX;
            MinY = minY;
            MaxX = maxX;
            MaxY = maxY;
        }

        public Coord RandomInnerPoint()
        {
            Random rnd = new Random();
            var x = rnd.Next(MinX, MaxX + 1);
            var y = rnd.Next(MinY, MaxY + 1);
            return new Coord { X = x, Y = y };
        }

        public void ExpandX(int amount)
        {
            MinX -= amount / 2;
            MaxX += amount / 2;
        }

        public void ExpandY(int amount)
        {
            MinY -= amount / 2;
            MaxY += amount / 2;
        }

        public bool Contains(Coord coord)
        {
            return coord.X > MinX && coord.Y > MinY && coord.X < MaxX && coord.Y < MaxY;
        }
    }
}