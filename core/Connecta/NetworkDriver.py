from core.Connecta import Connecta

class NetworkDriver:
    def __init__(self, connecta:Connecta):
        self.connecta = connecta

    def config(self, args):
        """Configure the connection, store connection arguments."""
        self.args = args
        pass

    def connect(self):
        """Connection logic"""
        pass

    def receive_message(self, message_data):
        """Implementation of receiving a message for this driver class."""
        self.connecta.receive_message("default_driver", message_data)

    def send_message(self, message_data):
        """Implementation of sending a message for this driver class."""
        # platform-specific implementation
        pass

    def get_allowed_attachment_types(self):
        """Returns the list of allowed attachment types for this driver class."""
        return None