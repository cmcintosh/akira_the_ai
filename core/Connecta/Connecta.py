import importlib.util
import os
from core.Services.MySql import MysqlConnection
from core.Connecta.NetworkDriver import NetworkDriver
from core.Connecta.NetworkEvent import NetworkEvent
from quart import jsonify
import logging

class Connecta:
    """
        This is the backbone of the communications between agents and the outside world.
        We can define/add new types of networks using our plugin system.
    """
    def __init__(self, id:int=None):
        self.id = id
        self.available_drivers = {}  # Dictionary of available driver classes for each platform
        self.network_data = []
        self.networks = {}  # Dictionary of instantiated drivers (one per network)
        self.platform_config = {}  # configuration for each platform (e.g., allowed attachment types)
        self.events = {
            "on_message": NetworkEvent(),
            "on_error": NetworkEvent()
        }
        self.current_driver_config = None
        self.db = MysqlConnection()
        self.db.connect()

    def load(self, id:int):
        """
         Loads the configurations needed for the networks the agent will connect to.
        """
        self.id = id
        query_networks = "SELECT a.* FROM bots__networks a WHERE a.bid = %d"
        results = self.db.select(table="bots__networks", conditions={"id": id})
        self.network_data = results

    def save(self, record):
        self.db.merge(table="bots__networks", data={"id":record.id, "data": record.data, "network": record.network, "status": record.status}, keys=["id"])
        

    def delete(self):
        """
            Deletes all networks associated with this specific bot
        """
        self.db.delete(table="bots__networks", conditions={"id":self.id})

    def register_driver(self, driver_path: str):
        """Registers a driver class from a Python file."""
        spec = importlib.util.spec_from_file_location("driver", driver_path)
        if spec:
            driver_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(driver_module)

            # Assume the driver class is named "NetworkDriver" (you can adjust this as needed)
            driver_class = getattr(driver_module, "NetworkDriver")

            self.available_drivers[driver_path] = driver_class
            return True
        else:
            print(f"Error loading driver from {driver_path}")
            return False
        
    def enable_network(self, platform_name: str, args: dict):
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

    def disable_network(self, network:str):
        self.networks[network]["status"] = 0

    def remove_network(self, network):
        """
            Deletes a specific network for this bot.
        """
        try:
            self.db.delete(table="bots_networks", conditions={"id":self.id, "network": network})
        except Exception as e:
            logging.error(f"Error removing network: {e}")

    def receive_message(self, platform_name, message_data):
        """Processes incoming messages from a given platform."""
        self.notify_event("on_message", {"platform": platform_name, "message": message_data})

    def send_message(self, platform_name, message_data):
        """Sends outgoing messages to a given platform."""
        driver_class = self.drivers.get(platform_name)
        if driver_class:
            return driver_class.send_message(message_data)
        else:
            raise ValueError(f"Unsupported platform: {platform_name}")

    def register_event_listener(self, eventType:str, listener):
        self.events[eventType].register(listener)

    def notify_event(self, eventType:str, *args, **kwargs):
        self.events[eventType].notify(*args, **kwargs)

    def toData(self):
        data = []
        return data

    def toJson(self):
        return jsonify(self.toData())
