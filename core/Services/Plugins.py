from core.Services.MySql import MysqlConnection
from pathlib import Path
import importlib.util
import os
import json
import logging

"""
 This provides the Plugin management system for the platform
"""

class PluginManager():

  def __init__(self):
    """
      Initialize the plugin manager.
    """
    self.db = MysqlConnection()
    self.corePluginDirectory = "core/plugins"
    self.customPluginDirectory = "plugins"
    self.available_plugins = {}
    self.refreshPluginList()

    self.plugins = {}
    self.loadPlugins()
    self.hooks = {}
    
  
  def loadPlugins(self):
    """
      We want to load in the plugins and instantiate the
      enabled ones.
    """

    results = self.db.select("plugins")

    for row in results:
      if row["plugin"] in self.plugins:
        if row["status"] == 1:
            self.plugins[row["plugin"]] = self.initializePlugin(self.available_plugins[row["plugin"]]["module"], self.available_plugins[row["plugin"]]["className"])
      else:
         logging.warning(f"Plugin in database, but not in filesystem: {row['plugin']}")

  def initializePlugin(self, module_name, class_name):
    module = importlib.import_module(module_name)
    cls = getattr(module, class_name)
    return cls(self)

  def refreshPluginList(self):
    """
      Rescans the plugins
    """
    self.available_plugins = {}

     # Scan core plugins
    plugins = self.scanPlugins(self.corePluginDirectory)
    for subfolder, plugin_list in plugins.items():  # ✅ Properly loop over key-value pairs
        for plugin in plugin_list:  # ✅ Iterate through the list of plugin dictionaries
            if "id" in plugin:  # ✅ Ensure "id" key exists to avoid KeyError
                if plugin["id"] in self.available_plugins:
                  self.available_plugins[plugin["id"]] = plugin
                else:
                  logging.warning(f"Plugin in database but not in filesystem: {plugin["id"]}")
            else:
              logging.warning(f"Plugin info json not formatted properly.")

    # Scan custom plugins
    plugins = self.scanPlugins(self.customPluginDirectory)
    for subfolder, plugin_list in plugins.items():
        for plugin in plugin_list:
            if "id" in plugin:  # ✅ Ensure "id" key exists to avoid KeyError
                if plugin["id"] in self.available_plugins:
                  self.available_plugins[plugin["id"]] = plugin
                else:
                  logging.warning(f"Plugin in database but not in filesystem: {plugin["id"]}")
            else:
              logging.warning(f"Plugin info json not formatted properly.")

  def scanPlugins(self, base_dir):
    """
      Scan for Core then custom plugins in the file system
    """
    base_path = Path(base_dir)
    info_data = {}
    # Iterate over everything inside core/plugins
    for subfolder in base_path.iterdir():
        # Only process subfolders (directories)
        if subfolder.is_dir():
            # Look for all *.info.json files
            json_files = list(subfolder.glob("*.info.json"))

            if json_files:
                info_data[subfolder.name] = []

            # Load each .info.json file
            for json_file in json_files:
                with json_file.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                    data["module"] = str(subfolder).replace(os.path.sep, ".")
                info_data[subfolder.name].append(data)

    return info_data

  def enablePlugin(self, plugin:str):
    """
      Enable an available plugin
    """
    self.db.merge(table="plugins", data={"plugin": plugin, "status": 1}, keys=["plugin"])
    self.loadPlugins()
  
  def disablePlugin(self, plugin:str):
    """
      Disable an available plugin
    """
    self.db.merge(table="plugins", data={"plugin": plugin, "status": 0}, keys=["plugin"])
    self.loadPlugins()

  def uninstallPlugin(self, plugin:str):
    """
      Disables and then removes a plugin's database tables from the system
    """
    try:
      
      if hasattr(self.plugins[plugin], "uninstall") and callable(getattr(self.plugins[plugin], "uninstall")):
                self.plugins[plugin].uninstall()

      self.disablePlugin(plugin)
    except Exception as e:
       logging.error(f"Error uninstalling plugin {e}")

  def register_hook(self, hook:str):
    """
      Registers a new hook provided by a core system or plugin
    """
    self.hooks[hook] = []

  def on(self, hook:str, callback):
    """
      Registers a callback to be called when a hook is invoked
    """
    if hook not in self.hooks:
      self.hooks[hook] = []
    self.hooks[hook].append(callback)


  def invoke_hook(self, hook:str, *args, **kwargs):
    """
      Invokes all registered callbacks for a hook.
    """
    if hook in self.hooks:
      for callback in self.hooks[hook]:
        callback(*args, **kwargs)
