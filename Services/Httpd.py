import os
import logging
import mimetypes
from quart import Quart, send_from_directory, abort
from quart_cors import cors
from dotenv import load_dotenv

load_dotenv()

WEB_FOLDER = os.path.abspath("./web/dist")

class WebServer:
    def __init__(self):
        self.httpPort = int(os.getenv("HTTP_PORT", "8080"))  # fallback to 8080 if not set
        self.app = Quart(__name__)
        self.app = cors(self.app, allow_origin="*")
        
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

    def start(self):
        logging.info("Starting HTTPD server")
        # Listen on all interfaces (0.0.0.0) or localhost depending on your needs
        self.app.run(host="0.0.0.0", port=self.httpPort)
