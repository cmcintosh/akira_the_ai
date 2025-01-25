import importlib.util
import os
import NetworkEvent

class Connecta:
    def __init__(self):
        self.available_drivers = {}  # Dictionary of available driver classes for each platform
        self.networks = {}  # Dictionary of instantiated drivers (one per network)
        self.platform_config = {}  # configuration for each platform (e.g., allowed attachment types)
        self.events = {
            "on_message": NetworkEvent(),
            "on_error": NetworkEvent()
        }
        self.current_driver_config = None

    def register_driver(self, driver_path: str):
        """Registers a driver class from a Python file."""
        spec = importlib.util.spec_from_file_location("driver", driver_path)
        if spec:
            driver_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(driver_module)

            # Assume the driver class is named "DriverClass" (you can adjust this as needed)
            driver_class = getattr(driver_module, "DriverClass")

            self.available_drivers[driver_path] = driver_class
            return True
        else:
            print(f"Error loading driver from {driver_path}")
            return False
        
    def enable_platform(self, platform_name: str, args: dict):
        """Enables a network by instantiating the corresponding driver."""
        if self.available_drivers:
            driver_class = self.available_drivers.get(platform_name)
            if driver_class:
                driver_instance = driver_class(self)
                driver_instance.config(args)
                self.networks[platform_name] = driver_instance
                return True
            else:
                print(f"Error: Driver not found for {platform_name}")
        else:
            print("No drivers registered")

    def receive_message(self, platform_name, message_data):
        """Processes incoming messages from a given platform."""
        driver_class = self.drivers.get(platform_name)
        if driver_class:
            return driver_class.receive_message(message_data)
        else:
            raise ValueError(f"Unsupported platform: {platform_name}")

    def send_message(self, platform_name, message_data):
        """Sends outgoing messages to a given platform."""
        driver_class = self.drivers.get(platform_name)
        if driver_class:
            return driver_class.send_message(message_data)
        else:
            raise ValueError(f"Unsupported platform: {platform_name}")

    def on_message_received(self, message_data):
        # Handle incoming messages here
        pass

    def register_event_listener(self, eventType:str, listener):
        self.events[eventType].register(listener)

    def notify_event(self, eventType:str, *args, **kwargs):
        self.events[eventType].notify(*args, **kwargs)

class DriverClass:
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
        self.connecta.on_message_received(message_data=message_data)

    def send_message(self, message_data):
        """Implementation of sending a message for this driver class."""
        # platform-specific implementation
        pass

    def get_allowed_attachment_types(self):
        """Returns the list of allowed attachment types for this driver class."""
        return None