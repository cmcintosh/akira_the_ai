import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
import logging

class MysqlConnection:
    """
    Initialize the MySQL connection by loading environment variables from a .env file.
    
    Attributes:
        host (str): The database host address.
        user (str): The database username.
        password (str): The database password.
        database (str): The name of the database to connect to.
        connection (mysql.connector.connection.MySQLConnection): The established MySQL connection.
    """

    def __init__(self):
        load_dotenv()
        self.host = os.getenv('MYSQL_HOST')
        self.user = os.getenv('MYSQL_USER')
        self.password = os.getenv('MYSQL_PASS')
        self.database = os.getenv('MYSQL_DATABASE')
        self.connection = None
        try:
            self.connect()
        except Error as e:
            logging.error(f"Error connecting to database: {e}")

    def connect(self):
        """
        Establish a connection to the MySQL database.
        
        Raises:
            Error: If an error occurs during the connection process.
        """
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.connection.is_connected():
                logging.info(f"Connected to database: {self.database}")
        except Error as e:
            logging.error(f"Error connecting to database: {e}")
            self.connection = None

    def disconnect(self):
        """
        Close the established MySQL connection.
        
        Raises:
            Error: If an error occurs during the disconnection process.
        """
        if self.connection and self.connection.is_connected():
            self.connection.close()
            logging.info("Database connection closed.")
        else:
            logging.warning("No active database connection to close.")

    def execute_query(self, query, params=None, fetch=False, returnCursor=False, commit=False):
        """
        Execute a MySQL query.
        
        Args:
            query (str): The SQL query to be executed.
            params (list or tuple): A list of parameters to be used in the query. Defaults to None.
            fetch (bool): Whether to fetch the results from the query. Defaults to False.
            returnCursor (bool): Whether to return a cursor object for further query execution. Defaults to False.
        
        Returns:
            The result of the executed query, or a cursor object if returnCursor is True.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        mycursor = self.connection.cursor(dictionary=True)
        mycursor.execute(query, params)
        if commit:
            self.connection.commit()  # ✅ Commit changes to the database
            logging.info("Database changes committed.")
        if fetch:
            logging.info("returning fetchall")
            return mycursor.fetchall()
        elif returnCursor:
            return mycursor

    def select(self, table, conditions=None):
        """
        Execute a SELECT query on the specified table with optional conditions.
        
        Args:
            table (str): The name of the table to be queried.
            conditions (dict or list): A dictionary of conditions in the format {column: value} or a list of columns. Defaults to None.
        
        Returns:
            The result set of the executed SELECT query.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        if conditions is None:
            results = self.execute_query(f"SELECT * FROM {table}", fetch=True)
            return results
        elif isinstance(conditions, dict):
            return self.select(table, conditions=conditions)
        else:
            return self.select(table, conditions={"id": conditions})

    def insert(self, table, data):
        """
        Execute an INSERT query on the specified table with the provided data.
        
        Args:
            table (str): The name of the table to be inserted into.
            data (dict): A dictionary containing the data to be inserted in the format {column: value}.
        
        Returns:
            The ID of the row that was inserted.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["%s"] * len(data))
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        cursor = self.execute_query(query, list(data.values()), returnCursor=True, commit=True)
        rowId = cursor.lastrowid
        cursor.close()
        return rowId

    def update(self, table, data, conditions):
        """
        Execute an UPDATE query on the specified table with the provided data and conditions.
        
        Args:
            table (str): The name of the table to be updated.
            data (dict): A dictionary containing the data to be updated in the format {column: value}.
            conditions (dict or list): A dictionary of conditions in the format {column: value} or a list of columns.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        set_clause = ", ".join([f"{col} = %s" for col in data.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {self.build_condition_string(conditions)}"
        self.execute_query(query, list(data.values()), commit=True)

    def delete(self, table, conditions):
        """
        Execute a DELETE query on the specified table with the provided conditions.
        
        Args:
            table (str): The name of the table to be deleted from.
            conditions (dict or list): A dictionary of conditions in the format {column: value} or a list of columns.
        
        Returns:
            The result set of the executed DELETE query.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        query = f"DELETE FROM {table} WHERE {self.build_condition_string(conditions)}"
        return self.execute_query(query, commit=True)

    def merge(self, table, data, keys):
        """
        Merge new data into the specified table based on the provided keys.
        
        Args:
            table (str): The name of the table to be updated.
            data (dict): A dictionary containing the data to be merged in the format {column: value}.
            keys (list): A list of columns that uniquely identify a row in the table.
        
        Returns:
            The ID of the row that was inserted or updated.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        conditions = {k: data[k] for k in keys}
        existing_row = self.select(table, conditions=conditions)
        if existing_row:
            return self.update(table, data, conditions)
        return self.insert(table, data)

    def build_condition_string(self, conditions):
        """
        Build a condition string from the provided conditions.
        
        Args:
            conditions (dict): A dictionary of conditions in the format {column: value}.
        
        Returns:
            The constructed condition string.
        
        Raises:
            Error: If an error occurs during the building process.
        """
        return " AND ".join([f"{key} = %s" for key in conditions.keys()])

    def schema_install(self, table, columns):
        """
        Install a new schema for the specified table with the provided columns.
        
        Args:
            table (str): The name of the table to be updated.
            columns (list): A list of column definitions.
        
        Raises:
            Error: If an error occurs during the schema installation process.
        """
        self.execute_query(f"CREATE TABLE {table} ({', '.join(columns)})")

    def execute(self, query):
        """
        Execute a SQL query on the database.
        
        Args:
            query (str): The SQL query to be executed.
        
        Raises:
            Error: If an error occurs during the query execution process.
        """
        self.connection.execute(query)