
from core.Services.MySql import MysqlConnection
from core.Connecta.Connecta import Connecta
from quart import jsonify
import logging
import json

class Agent:

  def __init__(self, id):
    self.db = MysqlConnection()
    self.db.connect()

    self.id = id
    self.name = ""
    self.machine_name = ""
    self.uid = 0,
    self.status = 0
    self.created = 0
    self.updated= 0
    self.model = "llama3.1:latest"
    self.temp = 0.7
    self.prompt=""
    self.prompt_template=-1
    self.openai_public_key=""
    self.openai_secret_key=""
    self.networks = Connecta(id)

  def toData(self):
    data = {
      "id": self.id,
      "name": self.name,
      "machine_name": self.machine_name,
      "uid": self.uid,
      "status": self.status,
      "created": self.created,
      "updated": self.updated,
      "model": self.model,
      "prompt": self.prompt,
      "prompt_template": self.prompt_template,
      "openai_public_key": self.openai_public_key,
      "openai_secret_key": self.openai_secret_key,
      "networks": self.networks.toData()
    }
    return data

  def toJson(self):
    return jsonify(self.toData())



  def load(self):
    results = self.db.select(table="bots", conditions={ "id": self.id })
    
    # this should be a single row here. the ID column is unique serial.
    for row in results:
      self.name = row["name"]
      self.machine_name = row["machine_name"]
      self.status = row["status"]
      self.created = row["created"]
      self.updated = row["updated"]
      self.model = row["model"]
      self.temp = row["temp"]
      self.prompt = row["prompt"]
      self.prompt_template = row["prompt_template"]
      self.openai_public_key = row["openai_public_key"]
      self.openai_secret_key = row["openai_secret_key"]
      break
    
    self.networks.load(self.id)

  def save(self, data):
    query = """UPDATE bots SET name = %s, machine_name = %s, uid = %s, 
               status = %s, created = %s, updated = %s, model = %s, 
               temp = %s, prompt = %s, prompt_template = %s, 
               openai_public_key = %s, openai_private_key = %s WHERE id = %s"""
    queryParams = [
      data["name"], data["machine_name"], data["uid"],
      data["status"], data["created"], data["updated"],
      data["model"], data["temp"], data["prompt"], data["prompt_template"],
      data["openai_public_key"], data["openai_private_key"], self.id
    ]
    try:
      self.db.execute_query(query=query, params=queryParams)
    except Exception as e:
      # Stop processing here on an error like this, return back our status and error so we can pass it to the user
      logging.error(f"Error saving agent data {e}")
      return {"status": 0, "error": e} 

    try:
      # Because of the Connecta abstractions, we should process save on it as well.
      self.networks.save(data)
    except Exception as e:
      # Stop processing here on an error like this, return back our status and error so we can pass it to the user
      logging.error(f"Error saving agent data {e}")
      return {"status": 0, "error": e} 
    
    # Once we are done update the database we should update our agent state
    # @TODO: Has to be a cleaner way for this....
    self.name = data["name"]
    self.machine_name = data["machine_name"]
    self.uid = data["uid"]
    self.status = data["status"]
    self.created = data["created"]
    self.updated = data["updated"]
    self.model = data["model"]
    self.temp = data["temp"]

    # @TODO: in the future this will be more dynamic, but for now KISS
    self.prompt = data["prompt"]
    self.prompt_template = data["prompt_template"]
    self.openai_public_key = data["openai_public_key"]
    self.openai_secret_key = data["openai_private_key"]

    return {"status": 1, "agent": self}

  def delete(self):
    # We need to go through and delete a lot of things

    # Delete settings for the networks
    self.networks.delete()

    # Delete the bot record
    self.db.delete(table="bots", conditions={"id": self.id})

  def keepAlive(self):
    pass
  


