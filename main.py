
import logging
import asyncio
from core.Services.Plugins import PluginManager
from core.Agents.AgentManager import AgentManager
from core.Services.Httpd import WebServer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

pluginManager = PluginManager()
agentManager = AgentManager(pluginManager)
server = WebServer(pluginManager, agentManager)

# @TODO: convert how we are doing the networks to using the plugin system
# @TODO: convert how we are doing communication with LLMs to using the plugin system


async def main():
  try:
    while True:    
      logging.info("Keep Alive")
      await asyncio.sleep(30)

  except Exception as e:
    logging.error(f"Error in main process: {str(e)}")


if __name__ == "__main__":
  logging.info("Starting Akira")
  server.start()
  asyncio.run(main())
  logging.info("Shutting Down")
