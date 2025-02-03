import os
import logging
import mimetypes
from quart import Quart, request, jsonify, send_from_directory, abort
from quart_cors import cors
from dotenv import load_dotenv
import json

from core.Services.Plugins import PluginManager
from core.Services.MySql import MysqlConnection
from core.Agents.AgentManager import AgentManager

load_dotenv()

WEB_FOLDER = os.path.abspath("./web/dist")

class RouteDefinition:
    """
        Route Definitions are used to define routes to use in the 
        routing system of the webserver.
    """
    self.url = ""
    self.methods = ["GET"]
    self.callback = None

    def __init__(self, url:str, callback:any, methods:list = ["GET"]):
        self.url = url
        self.callback = callback
        self.methods = methods


class WebServer:
    def __init__(self, pluginManager:PluginManager):
        self.pluginManager = pluginManager
        self.pluginManager.register_hook("http_route")

        self.httpPort = int(os.getenv("HTTP_PORT", "8080"))  # fallback to 8080 if not set
        self.app = Quart(__name__)
        self.app = cors(self.app, allow_origin="*")
        self.mysql = MysqlConnection()

        self.registeredRoutes = []
        self.pluginManager.invoke_hook("http_route", self.registeredRoutes)
        
        # Ensure JS, JSX, etc. are served with correct MIME types
        mimetypes.add_type("text/css", ".css")
        mimetypes.add_type("image/png", ".png")
        mimetypes.add_type("image/jpeg", ".jpg")
        mimetypes.add_type("image/jpeg", ".jpeg")
        mimetypes.add_type("image/svg+xml", ".svg")
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('application/octet-stream', '.jsx')

        self.setup_routes()

    def setup_routes(self):

        @self.app.route('/', methods=['GET'])
        async def serve_index():
            """Serve the index.html for the main React/SPA entry point."""
            index_path = os.path.join(WEB_FOLDER, "index.html")
            if not os.path.isfile(index_path):
                logging.error(f"Could not find {index_path}")
                abort(404)
            return await send_from_directory(WEB_FOLDER, "index.html")

        @self.app.route('/assets/<path:filename>', methods=['GET'])
        async def serve_assets(filename):
            """Serve static assets from the /assets subfolder."""
            assets_folder = os.path.join(WEB_FOLDER, 'assets')
            file_path = os.path.join(assets_folder, filename)

            if os.path.isfile(file_path):
                # Serve the specific file if it exists
                return await send_from_directory(assets_folder, filename)
            else:
                # Fallback to index.html if your React app does client-side routing
                return await send_from_directory(WEB_FOLDER, "index.html")
            
         #
        # Agent API ENDPOINTS
        #
        @self.app.route("/api/agents")
        async def getAgents():
            
            page = int(request.args.get('page', 0))
            limit = int(request.args.get('limit', 10))
            offset = (page - 1) * limit
            
            logging.info("Before results call")
            
            results = self.mysql.select(
                table="bots",
                conditions=None
            )
            if results is None:
                logging.info("No agents in database")
                return jsonify({
                    "page": 0,
                    "limit": limit,
                    "total": 0,
                    "data": []
                })
            logging.info(f"{results}")
            paginated_results = results[offset:offset + limit]
            return jsonify({
                "page": page,
                "limit": limit,
                "total": len(results),
                "data": results
            })

        
        @self.app.route("/api/agent/<id>", methods=['GET'])
        async def getAgent(id):
            data = self.agent_manager.load(id)
            return jsonify(data)

        @self.app.route("/api/agent", methods=['POST'])
        async def createAgent():
            try:
                data = await request.get_json()

                # Uncomment and improve validation if needed
                # if not self.validate_agent_json(data):
                #     return jsonify({"error": "Invalid JSON structure"}), 400

                id = self.agent_manager.save(data)
                if not id:
                    raise ValueError("Failed to save agent data")

                data["id"] = id
                return jsonify({"success": True, "agent": self.serialize_agent(data)}), 201
            except ValueError as ve:
                logging.error(f"Validation error: {ve}")
                return jsonify({"error": str(ve)}), 400
            except Exception as e:
                logging.error(f"Error creating agent: {e}")
                return jsonify({"error": "Internal server error"}), 500

        @self.app.route("/api/agent/<id>", methods=['POST'])
        async def updateAgent(id):
            data = await request.get_json()
            if not self.validate_agent_json(data):
                return jsonify({"error": "Invalid JSON structure"}), 400
            try:
                self.agent_manager.update_agent(data)
                return jsonify({"success": True, "agent": self.serialize_agent(data)}), 201
            except Exception as e:
                logging.error(f"Error creating agent: {e}")
                return jsonify({"error": str(e)}), 500

        @self.app.route("/api/agent/<id>/twitch/channel", methods=["POST"])
        async def add_twitch_channel(id):
            data = await request.get_json()
            try:
                # Add logic to insert the channel into the database
                updated_channels = self.agent_manager.update_agent_fields(id, data)
                return jsonify({"channels": updated_channels}), 200
            except Exception as e:
                return jsonify({"error": str(e)}), 500
            
        
        @self.app.route("/api/agent/<id>/twitch/channel/<channel>/leave", methods=["POST"])
        async def leave_twitch_channel(id, channel):
            data = await request.get_json()
            try:
                status = self.agent_manager.remove_twitch_channel(agent_id=data["agent_id"], channel=data["channel"])
                if status:
                    return jsonify({"success": 1}), 200
                else:
                    return jsonify({"error": "Failed to delete record for twitch channel."}), 500
            except Exception as e:
                return jsonify({"error": str(e)}), 500

        @self.app.route("/api/agent/<id>", methods=['PUT'])
        async def updatePUTAgent(id):
            logging.info("Called PUT method\n\n\n")
            data = await request.get_json()
            logging.info("returned data:")
            logging.info(data)
            try:
                # self.agent_manager.update_agent(data)
                if (data["id"] is not None):
                    del(data["id"])
                self.agent_manager.update_agent_fields(id, data)
                
                logging.info("END CALL\n\n\n\n\n\n")
                return jsonify({"success": True, "agent": data}), 201
            except Exception as e:
                logging.error(e)
                return jsonify({"error": str(e)}), 500

        @self.app.route("/api/agent/<id>/delete", methods=['DELETE'])
        async def deleteAgent(id):
            try:
                self.agent_manager.delete(id)
                return jsonify({"success": True}), 201
            except Exception as e:
                logging.error(e)
                return jsonify({"error": e}), 500

        # Load dynamic routes created by plugins....

    def start(self):
        logging.info("Starting HTTPD server")
        # Listen on all interfaces (0.0.0.0) or localhost depending on your needs
        self.app.run(host="0.0.0.0", port=self.httpPort)
