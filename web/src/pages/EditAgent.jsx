import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditAgent = () => {
  const { id } = useParams(); // Get the agent ID from the URL
  const navigate = useNavigate();

  // Initialize `agentData` with default empty values
  const [agentData, setAgentData] = useState({
    name: "",
    machine_name: "",
    status: 0,
    prompt: "",
    model: "llama3.1:latest",
    temp: 0.7,
    prompt_template: -1,
    openai_public_key: "",
    openai_secret_key: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the existing agent data to populate the form
    const fetchAgent = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/agent/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch agent. HTTP Status: ${response.status}`);
        }
        const data = await response.json();
        
        setAgentData(data); // Update state with fetched data
      } catch (err) {
        console.error("Error fetching agent:", err);
        setError(err.message);
      }
    };

    fetchAgent();
  }, [id]);

  useEffect(() => {
    const fetchAvailableNetworks = async() => {

    };

    fetchAvailableNetworks();
  })

  const handleChange = (field, value) => {
    setAgentData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedAgent = {
      ...agentData,
      status: agentData.status ? 1 : 0,
    };
  
    try {
      console.log(updatedAgent);

      const response = await fetch(`http://127.0.0.1:8080/api/agent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAgent),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update agent. HTTP Status: ${response.status}`);
      }
  
      alert("Agent updated successfully!");
      navigate("/agents"); // Redirect to agents list
    } catch (error) {
      console.error("Error updating agent:", error);
      alert("Failed to update agent. Please try again.");
    }
  };
  
  const handleCancel = () => {
    navigate("/agents"); // Redirect to agents list
  };

   

  return (
    <div className="container">
      {error && <p className="text-danger">Error: {error}</p>}
      <form>
        <div className="row mb-3">
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-success me-2"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="row">
          
          <div className="col-md-12 card p-3">
            <h3>Profile</h3>
            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Name</label>
              <input
                type="text"
                className="form-control"
                value={agentData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Machine-name</label>
              <input
                type="text"
                className="form-control"
                value={agentData.machine_name}
                onChange={(e) => handleChange("machine_name", e.target.value)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Active</label>
              <input
                className="form-check-input"
                type="checkbox"
                checked={agentData.status === 1}
                onChange={(e) => handleChange("status", e.target.checked ? 1 : 0)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Prompt Template</label>
              <select
                className="form-select form-control"
                value={agentData.prompt_template}
                onChange={(e) => handleChange("prompt_template", Number(e.target.value))}
              >
                <option value={-1}>Custom Prompt</option>
                <option value={1}>Akira 0.01</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label col-sm-2">Prompt</label>
              <textarea
                className="form-control"
                rows="10"
                value={agentData.prompt}
                onChange={(e) => handleChange("prompt", e.target.value)}
              ></textarea>
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Model</label>
              <select
                className="form-select form-control"
                value={agentData.model}
                onChange={(e) => handleChange("model", e.target.value)}
              >
                <option value="llama3.1:latest">llama3.1</option>
                <option value="gpt-4o:latest">GPT-4o</option>
              </select>
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Temperature</label>
              <input
                className="form-range"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={agentData.temp}
                onChange={(e) => handleChange("temp", Number(e.target.value))}
              />
            </div>

          </div>
          <hr className="p4 col-md-12"/>
          <div className="col-md-12 p-4">
            <ul class="nav nav-pills">

              <li class="nav-item">
                <button class="nav-link active" id="discord-form-tab" data-bs-toggle="tab" data-bs-target="#discord-form" type="button" role="tab" aria-controls="discord-form" aria-selected="true">Discord</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" id="twitch-form-tab" data-bs-toggle="tab" data-bs-target="#twitch-form" type="button" role="tab" aria-controls="twitch-form">Twitch</button>
              </li>
              
            </ul>
          </div>

          <div className="tab-content" id="platform-settings-content">

          </div>

        </div>
      </form>
    </div>
  );
};

export default EditAgent;
