using System;

public enum Direction 
{
    Up = 0, 
    Right = 1,
    Down = 2,
    Left = 3
}

public static class DirectionHelper
{
    public static bool IsOpposite(this Direction dir, Direction other)
    {
        var max = Math.Max((int)dir, (int)other);
        var min = Math.Min((int)dir, (int)other);
        return max - min == 2;
    }
}