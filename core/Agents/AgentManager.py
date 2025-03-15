from core.Services.MySql import MysqlConnection
from core.Services.Plugins import PluginManager
from core.Agents.Agent import Agent
import logging

class AgentManager:
  
  def __init__(self, pluginManager:PluginManager):
    self.pluginManager = pluginManager
    self.db = MysqlConnection()
    self.db.connect()
    self.agents = {}

    self.loadAll()

  def get(self, id: int):
    
    agent = self.agents.get(int(id))
    if agent is not None:
      return agent
    return self.load(id)  # ✅ Load if not found

  
  def load(self, id: int, initialize: bool = True):
    """
    Loads a specific agent by its ID, including related data (Discord, Twitch),
    initializes it if specified, and optionally adds it to the cache.
    Returns a Python dictionary.
    """
    results = self.db.execute_query(f"SELECT * FROM bots WHERE id = {id}", fetch=True)
    
    for row in results:
          logging.info(f"Load all Results: {row}")
          self.agents[row["id"]] = Agent(
            row["id"],
            row["name"],
            row["machine_name"],
            row["uid"],
            row["status"],
            row["created"],
            row["updated"],
            row["model"],
            row["temp"],
            row["prompt"],
            row["prompt_template"],
            row["openai_public_key"],
            row["openai_secret_key"]
          )
    if id in self.agents:
      return  self.agents.get(int(id))
    else:
      return None

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
    for row in results:
      self.agents[row["id"]] = Agent(
        row["id"],
        row["name"],
        row["machine_name"],
        row["uid"],
        row["status"],
        row["created"],
        row["updated"],
        row["model"],
        row["temp"],
        row["prompt"],
        row["prompt_template"],
        row["openai_public_key"],
        row["openai_secret_key"]
      )

    return self.agents

  def save(self, data: dict):
    """
    Saves or updates an agent's information and associated data to the database.
    """

    if data["id"] is not None:
      logging.info("ID found in data, updating existing agent")
      # Existing agent, so update
      if data["id"] not in self.agents:
        logging.info("Agent was not in local array")
        self.load(data["id"])
        
      return self.agents[data["id"]].save(data)
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