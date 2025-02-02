
class ExamplePlugin:
  """
    Defines the main class for a plugin to be used with the platform.
  """

  def __init__(self, pluginManager):
    self.pluginManager = pluginManager

    """
      Define your hooks by leveraging the register_hook method
    """

    """
      Register a new hook.
    """
    self.pluginManager.register_hook("hello_world")

    """
      Register a handler for a hook.
    """
    self.pluginManager.on("hello_world", self.SayHi)


    def SayHi(self, *args, **kwargs):
      """
        Example Callback for reacting to a hook.
      """
      print("HELLO WORLD")


    def uninstall(self):
      """
        Example of a uninstall hook for a plugin
      """
    

  