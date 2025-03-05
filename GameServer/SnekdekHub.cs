using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using snekdek.Model;
using snekdek.Utils;

namespace snekdek.GameServer
{
    public class SnekdekHub : Hub
    {
        private static readonly ConcurrentDictionary<string, User> ClientToUser =
            new ConcurrentDictionary<string, User>();

        private readonly Game _game;        

        public SnekdekHub(Game game)
        {
            _game = game;
        }

        public async Task UserJoinMessage(UserJoin userJoin)
        {
            var user = _game.AddUser(userJoin);
            
            ClientToUser[Context.ConnectionId] = user;            

            await Clients.All.SendAsync(MessageKey.UserJoin, user);
        }

        public void PlayerInputMessage(int dir)
        {
            var user = ClientToUser[Context.ConnectionId];

            if(user.Direction.IsOpposite((Direction)dir)) return;
            
            user.PendingDirection = (Direction) dir;
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var user = ClientToUser[Context.ConnectionId];

            await base.OnDisconnectedAsync(exception);

            ClientToUser.TryRemove(Context.ConnectionId, out user);

            if (user != null) {
                _game.RemoveUser(user);
            }
        }
    }
}