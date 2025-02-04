from core.Services.Plugins import PluginManager

class NetworkManager:

  def __init__(self, pluginManager:PluginManager):
    self.pluginManager = pluginManager
    self.avaialableNetworks = {}
    """
      Example Network Info:
        {
          "id": "network_id",
          "label": "Network Example",
          "settings": {
            Various settings for a network:
             "secret_key": {
                "type": "text",
                "label": "Secret Key"
             },
             "keepAlive": {
                "type": "range_int",
                "min_val": 0,
                "max_val": 10,
                "label": "Keep Alive (secs)"
             }
          }
        }
    """

    self.pluginManager.register_hook("network_info") # Used for getting the various settings needed by a network.
    self.pluginManager.register_hook("network_load") # Used for instantiating a network object.
    self.pluginManager.register_hook("network_send_message") # Used for sending messages out to a network.
    self.pluginManager.register_hook("network_recieve_message") # Used for processing incoming messages from a network.

  def getNetworks(self):
    """
      Loads all networks defined by plugins and returns their info.
      this is an object that contains 
    """
    self.pluginManager.invoke_hook("network_info", self.avaialableNetworks)
    return self.avaialableNetworks
  
  