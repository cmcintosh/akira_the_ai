import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAgent = () => {
  const [name, setName] = useState('');
  const [machineName, setMachineName] = useState('');
  const [status, setStatus] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('llama3.1:latest');
  const [temp, setTemp] = useState(0.7);
  const [promptTemplate, setPromptTemplate] = useState(-1);
  const [openaiKey, setOpenaiKey] = useState('');
  const [openaiSecret, setOpenaiSecret] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const newAgent = {
      id: 0,
      name,
      machine_name: machineName,
      uid: 1,
      status: status ? 1 : 0,
      created: currentTimestamp,
      updated: currentTimestamp,
      model,
      temp,
      prompt,
      prompt_template: promptTemplate,
      openai_public_key: openaiKey,
      openai_secret_key: openaiSecret,
    };

    try {
      const response = await fetch('http://127.0.0.1:8080/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent),
      });

      if (!response.ok) {
        throw new Error(`Failed to create agent. HTTP Status: ${response.status}`);
      }

      alert('Agent created successfully!');
      navigate('/agents'); // Redirect to agents list
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/agents'); // Redirect to agents list
  };

  return (
    <div className="container">
      <form>
        <div className="row mb-3">
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-success me-2"
              onClick={handleSubmit} // Explicit onClick handler
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
                id="agent-name"
                placeholder="Akira"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Machine-name</label>
              <input
                type="text"
                className="form-control"
                id="agent-machine-name"
                placeholder="akirax"
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Active</label>
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="agent-status"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Prompt Template</label>
              <select
                className="form-select form-control"
                id="agent-prompt-template"
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(Number(e.target.value))}
              >
                <option value={-1}>Custom Prompt</option>
                <option value={1}>Akira 0.01</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label col-sm-2">Prompt</label>
              <textarea
                className="form-control"
                id="agent-prompt"
                rows="3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Model</label>
              <select
                className="form-select form-control"
                id="agent-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="llama3.1:latest">llama3.1</option>
                <option value="gpt-4o:latest">GPT-4o</option>
              </select>
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">Temperature</label>
              <input
                className="form-range"
                id="agent-tempature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">OpenAI Key</label>
              <input
                type="text"
                className="form-control"
                id="agent-openai-key"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">OpenAI Secret</label>
              <input
                type="password"
                className="form-control"
                id="agent-openai-secret"
                value={openaiSecret}
                onChange={(e) => setOpenaiSecret(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAgent;
