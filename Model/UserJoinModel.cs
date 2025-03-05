using MessagePack;

namespace snekdek.Model
{
    [MessagePackObject]
    public class UserJoin
    {
        [Key("userId")]
        public string UserId { get; set; }

        [Key("name")]
        public string Name { get; set; }
    }
}
