# Import required libraries
import redis  # Redis database client library
from redis.commands.search.query import Query  # Redis search query builder
from datetime import datetime, timedelta  # Date and time utilities
import logging  # Python built-in logging module
from sentence_transformers import SentenceTransformer  # Library for sentence embeddings
import numpy as np  # NumPy library for numerical computations

# Define a class for interacting with the Redis database
class RedisAPI:
    def __init__(self, 
                 redis_host='host.docker.internal',  # Hostname or IP address of the Redis server
                 redis_port=6379,  # Port number of the Redis server
                 redis_password=None,  # Password to access the Redis server (optional)
                 index_name='agent_memory',  # Name of the search index in Redis
                 retention_days=30):  # Number of days to retain entries before pruning
        """
        Initialize a RedisAPI instance.

        Args:
            redis_host (str): Hostname or IP address of the Redis server.
            redis_port (int): Port number of the Redis server.
            redis_password (str): Password to access the Redis server (optional).
            index_name (str): Name of the search index in Redis.
            retention_days (int): Number of days to retain entries before pruning.
        """
        
        # Connect to the Redis database
        self.redis_client = redis.Redis(host=redis_host, port=redis_port, password=redis_password)

        # Store the name of the search index and retention period
        self.index_name = index_name
        self.retention_days = retention_days

        # Load a sentence embedding model for generating vector representations
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

        # Ensure the search index is created in Redis (if not already present)
        self._ensure_index()

    def _ensure_index(self):
        """
        Create or retrieve the search index from Redis.
        
        Creates a new index with fields for username, channel, source, message,
        message_vector, and timestamp if it does not exist. Otherwise, returns
        information about the existing index.
        """
        
        try:
            # Check if the index exists in Redis
            self.redis_client.ft(self.index_name).info()
            
        except redis.exceptions.ResponseError as e:
            # Log a warning and create a new index if it does not exist
            logging.warning("Index does not exist. Creating a new index.")
            try:
                # Create a new search index with the required fields
                self.redis_client.ft(self.index_name).create_index([
                    redis.commands.search.field.TextField('username'),  # Text field for username
                    redis.commands.search.field.TextField('channel'),  # Text field for channel
                    redis.commands.search.field.TextField('source'),  # Text field for source
                    redis.commands.search.field.TextField('message'),  # Text field for message
                    redis.commands.search.field.VectorField('message_vector', 
                                                             "FLAT", {  # Vector field for message representation
                                                                 "TYPE": "FLOAT32",
                                                                 "DIM": 384,  # Dimension of the embedding vector
                                                                 "DISTANCE_METRIC": "COSINE"
                                                             }),
                    redis.commands.search.field.NumericField('timestamp')  # Numeric field for timestamp
                ])
                
                logging.info("Index created successfully.")
            except Exception as e:
                # Log an error if creating the index fails
                logging.error(f"Error creating index: {e}")

    def _generate_vector(self, message):
        """
        Generate a vector representation of a message using the loaded sentence embedding model.
        
        Args:
            message (str): The input message to generate a vector for.
            
        Returns:
            numpy.ndarray: A NumPy array representing the vectorized message.
        """
        
        # Use the sentence embedding model to generate a vector for the message
        return self.model.encode(message)

    def search(self, query):
        """
        Search for messages matching the given query.

        Args:
            query (str): The input query to search for in the index.

        Returns:
            list: A list of matching messages with their respective metadata.
        """
        
        # Convert the query into a Redis search query object
        search_query = Query(query)
        
        try:
            # Perform the search using the generated query and retrieve results
            results = self.redis_client.ft(self.index_name).search(search_query)

            # Extract and return matching messages along with their metadata
            return [
                {
                    'username': doc.username,
                    'source': doc.source,
                    'message': doc.message,
                    'message_vector': doc.message_vector,
                    'datetime': datetime.fromtimestamp(int(doc.timestamp))
                }
                for doc in results.docs
            ]
        except Exception as e:
            # Log an error and return empty list if search fails
            logging.error(f"Error during search: {e}")
            return []

    def prune(self):
        """
        Remove entries from the index that are older than the specified retention period.
        
        Cuts off all timestamps before the current date minus the retention period,
        deletes documents with IDs corresponding to those timestamps, and logs
        completion or failure of pruning operation.
        """

        try:
            # Calculate the cutoff timestamp (current date minus retention period)
            cutoff = int((datetime.now() - timedelta(days=self.retention_days)).timestamp())

            # Create a search query for entries older than the cutoff timestamp
            prune_query_str = f"@timestamp:[0 {cutoff}]"
            prune_query = Query(prune_query_str)

            # Perform the pruning operation by searching for matching documents and deleting them
            results = self.redis_client.ft(self.index_name).search(prune_query)
            
            # Remove each document with ID corresponding to the matched timestamp
            for doc in results.docs:
                self.redis_client.delete(doc.id)

            logging.info("Pruning completed successfully.")
        except Exception as e:
            # Log an error if pruning fails
            logging.error(f"Error during pruning: {e}")

    def history(self, username):
        """
        Retrieve a list of messages sent by the specified user.
        
        Uses Redis search to retrieve documents with a matching 'username' field,
        sorts them chronologically by timestamp, and logs completion or failure
        of operation.

        Args:
            username (str): The username of the sender.

        Returns:
            list: A list of messages with their respective metadata.
        """
        
        try:
            # Create a search query for messages sent by the specified user
            history_query = Query(f"@username:{username}").sort_by('timestamp', asc=True)

            # Perform the search and retrieve results
            results = self.redis_client.ft(self.index_name).search(history_query)

            # Extract and return matching messages along with their metadata
            return [
                {
                    'username': doc.username,
                    'source': doc.source,
                    'message': doc.message,
                    'message_vector': doc.message_vector,
                    'datetime': datetime.fromtimestamp(int(doc.timestamp))
                }
                for doc in results.docs
            ]
        except Exception as e:
            # Log an error and return empty list if history retrieval fails
            logging.error(f"Error retrieving history: {e}")
            return []