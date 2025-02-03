class ExamplePlugin:
    """
    Example plugin that demonstrates how to extend the PluginManager system.
    """

    def __init__(self, pluginManager):
        """
        Initializes the plugin and registers hooks.
        
        Args:
            pluginManager (PluginManager): Instance of the plugin manager.
        """
        self.pluginManager = pluginManager

        # ✅ Register a new hook that other plugins can use
        self.pluginManager.register_hook("hello_world")

        # ✅ Register a handler for a hook
        self.pluginManager.on("hello_world", self.say_hi)

    def say_hi(self, *args, **kwargs):
        """
        Example callback that reacts when the 'hello_world' hook is invoked.
        """
        print("HELLO WORLD")

    def invoke_trigger(self):
        """
        Example of how a plugin can trigger a hook, causing all registered callbacks to execute.
        """
        self.pluginManager.invoke_hook("hello_world")

    def uninstall(self):
        """
        Defines the uninstall method that the PluginManager will call when uninstalling this plugin.
        """
        print("Uninstalling ExamplePlugin...")
        # Perform cleanup if necessary
