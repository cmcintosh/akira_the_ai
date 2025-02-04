from core.Services.Plugins import PluginManager
from quart import request

class RestfulChat:
    """
    Contains the elements needed for setting up a restful api chat.
    """

    def __init__(self, pluginManager):
        """
        Initializes the plugin and registers hooks.
        
        Args:
            pluginManager (PluginManager): Instance of the plugin manager.
        """
        self.pluginManager = pluginManager
        self.on("http_route", self.routes)
        self.on("network_info", self.network_info)
        
    def network_info(self, *args, **kwargs):
       """
        Returns the information about the network we are creating here.
       """
       if args:
          networks = args[0]
          networks["restful_chat"] = {
             "id": "restful_chat",
             "label": "Restful Chat",
             "settings": {
                "secret": {
                   "type": "text",
                   "label": "Secret Key (Optionial)"
                }
             }
          }

    def routes(self, *args, **kwargs):
      """
        Define the api endpoints to handle chat messages.
      """
      if args:  # Ensure at least one argument is passed
        registered_routes = args[0]  # ✅ This is the self.registeredRoutes list
        registered_routes.append({
            "url": "/chat",
            "methods": ["GET"],
            "callback": self.serve_plugin_page
        })

    def handleMessage(self):
       args = request.args
       message = args.get("message")
       agent_id = args.get("agent")
       conversation = args.get("conversation")

       logging.info(f"Message Incoming \n {agent_id} ({conversation}): {message}")


       
