from core.Services.MySql import MysqlConnection
from core.Agents.Agent import Agent

class AgentManager:
  
  def __init__(self):
    self.db = MysqlConnection()
    self.db.connect()
    self.agents = {}
  
  def load(self, id: int, initialize: bool = True):
    """
    Loads a specific agent by its ID, including related data (Discord, Twitch),
    initializes it if specified, and optionally adds it to the cache.
    Returns a Python dictionary.
    """

    agent = Agent(id)
    self.agents[id] = agent
    return agent

  def load_multiple(self, ids: list[int]):
    """
    Loads multiple agents by provided IDs, or all agents if no IDs are provided.
    """
    agents = []
    for id in ids:
      if id not in self.agents:
        self.agents[id] = Agent(id)
      agents.append(self.agents[id])

    return agents

  def loadAll(self):
    results = self.db.select(table="bots")
    agents = []
    for id in results:
      if id not in self.agents:
        self.agents[id] = Agent(id)

    return self.agents

  def save(self, data: dict):
    """
    Saves or updates an agent's information and associated data to the database.
    """

    if data["id"] is not None:
      # Existing agent, so update
      if data["id"] not in self.agents:
        self.load(data["id"])
        self.agents[data["id"]].save(data)
        return self.agents[data["id"]]
    else:
      # Creation of a new agent.
      id = self.db.insert("bots", data)
      self.agents[id] = Agent(id)
      return self.agents[id]

  def delete(self, id:int):
      self.agents[id].delete()
      self.agents[id] = None

  def start(self):
    pass

  def keepAlive(self):
    for agent in self.agents:
      if agent.status == 1:
        agent.keepAlive()