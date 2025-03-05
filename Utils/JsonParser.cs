using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace snekdek.Utils
{
    public class JsonParser
    {
        private DefaultContractResolver _contractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy(),
        };

        public  string Serialize<T>(T obj)
        {
            return JsonConvert.SerializeObject(obj, new JsonSerializerSettings
            {
                ContractResolver = _contractResolver,
                Formatting = Formatting.None
            });
        }
    }
}