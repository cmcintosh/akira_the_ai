from Services.MySql import MysqlConnection

class AgentManager:
  
  def __init__(self):
    self.db = MysqlConnection()
    self.db.connect()
    self.agents = []
  
  def load(self, id: int, initialize: bool = False):
    """
    Loads a specific agent by its ID, including related data (Discord, Twitch),
    initializes it if specified, and optionally adds it to the cache.
    Returns a Python dictionary.
    """
    pass

  def load_multiple(self, ids: list[int]):
    """
    Loads multiple agents by provided IDs, or all agents if no IDs are provided.
    """
    pass

  def loadAll(self):
    pass

  def save(self, data: dict):
    """
    Saves or updates an agent's information and associated data to the database.
    """
    pass

