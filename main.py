
import logging
import asyncio
from Services.Httpd import WebServer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

server = WebServer()

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
