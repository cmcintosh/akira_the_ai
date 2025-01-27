import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents data from the API
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/agents")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setAgents(data.data);
        } else {
          throw new Error("Invalid data format: Expected an object with a 'data' array.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching agents:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateAgent = async (updatedAgent) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/agent/${updatedAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAgent),
      });

      if (!response.ok) {
        throw new Error(`Failed to update agent. HTTP Status: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log("Agent successfully updated:", updatedData);

      // Update local state with the new agent data
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === updatedAgent.id ? { ...agent, ...updatedAgent } : agent
        )
      );
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };

  const handleStatusToggle = (agent) => {
    const updatedAgent = { ...agent, status: agent.status === 1 ? 0 : 1 };
    updateAgent(updatedAgent);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div className="row">
        <div className="d-flex justify-content-end mb-3 pull-right">
          <Link to="/agent/create" className="btn btn-success">Create New Agent</Link>
        </div>
      </div>

      <div className="row">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div className="col-sm-3 col-12 d-flex" key={agent.id}>
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title">{agent.name}</h5>
                </div>
                <div className="card-body">
                  <p><strong>Model:</strong> {agent.model}</p>
                  <p><strong>Machine Name:</strong> {agent.machine_name}</p>
                  <p><strong>Status:</strong> {agent.status === 0 ? "Inactive" : "Active"}</p>
                  <p><strong>Created:</strong> {agent.created}</p>
                  <p><strong>Updated:</strong> {agent.updated}</p>

                  <div className="row">
                    <div className="col-md-4">
                      <Link to={`/agent/${agent.id}/edit`} className="btn btn-warning">
                        Edit
                      </Link>
                    </div>
                    <div className="col-md-8 justify-content-end text-content-end">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={agent.status === 1}
                          onChange={() => handleStatusToggle(agent)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No agents available.</p>
        )}
      </div>
    </div>
  );
};

export default Agents;
