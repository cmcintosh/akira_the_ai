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
    openai_secret_key: "",
    discord: {
      client_id: "",
      token: "",
      servers: [],
    },
    twitch: {
      app_key: "",
      app_secret: "",
      access_token: "",
      refresh_token: "",
      channels: [],
    },
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

  

  // Handle Adding Twitch Channels
  const [newTwitchChannel, setNewTwitchChannel] = useState(""); // Track new channel input

  const handleAddTwitchChannel = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!newTwitchChannel.trim()) {
      alert("Please enter a channel name.");
      return;
    }

    // Prepare the new channel object
    const newChannel = {
      channel: newTwitchChannel,
      monitor_chat: 1, // Default values
      monitor_stream: 1,
      respond_chat: 1,
      respond_chat_chance: 10,
      respond_stream: 1,
      respond_stream_chance: 10,
      respond_to_mentions_chance: 10,
    };

    // Add the new channel to the agent's Twitch channels
    const updatedAgentData = {
      ...agentData,
      twitch: {
        ...agentData.twitch,
        channels: [...agentData.twitch.channels, newChannel],
      },
    };

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/agent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAgentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update agent. HTTP Status: ${response.status}`);
      }

      const updatedAgent = await response.json();

      // Update the state with the new data
      setAgentData(updatedAgent.agent);
      setNewTwitchChannel(""); // Clear the input field
      navigate(`/agents/${agent_id}`); // Redirect to agents list
    } catch (error) {
      console.error("Error updating agent:", error);
      navigate(`/agents/${agent_id}`); // Redirect to agents list
    }
  };

  // Handle changing twitch channel.
  var currentTwitchChannelIndex = -1;
  const [currentTwitchChannel, setCurrentTwitchChannel] = useState({
    "id": 0,
    "twitch_id": 0,
    "channel": "",
    "monitor_stream": 0,
    "monitor_chat": 0,
    "respond_stream": 0,
    "respond_chat": 0,
    "respond_stream_chance": 0,
    "respond_chat_chance": 0,
    "respond_to_mention_chance": 0
  });

  const handleTwitchChannelSelect = (index) => {
    const selectedChannel = agentData.twitch.channels[index];
  
    if (selectedChannel) {
      currentTwitchChannelIndex = index;
      setCurrentTwitchChannel(selectedChannel);
    }
  };  

  const handleTwitchChannelUpdate = (field, value) => {
    setCurrentTwitchChannel((prevChannel) => {
      const updatedChannel = { ...prevChannel, [field]: value };
  
      // Update the specific channel in agentData.twitch.channels
      setAgentData((prevAgent) => {
        const updatedChannels = prevAgent.twitch.channels.map((channel) =>
          channel.id === updatedChannel.id ? updatedChannel : channel
        );
  
        return {
          ...prevAgent,
          twitch: {
            ...prevAgent.twitch,
            channels: updatedChannels,
          },
        };
      });
  
      return updatedChannel;
    });
  };

  const handleTwitchChannelLeave = async () => {
    console.log(currentTwitchChannel)
    const agent_id = agentData.id
    const response = await fetch(`http://127.0.0.1:8080/api/agent/${agent_id}/twitch/channel/${currentTwitchChannel.id}/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"agent_id": agent_id, "channel": currentTwitchChannel.id}),
    });

    if (!response.ok) {
      throw new Error(`Failed to update agent. HTTP Status: ${response.status}`);
    } else {
      alert(`Left Channel ${currentTwitchChannel.name}`);
      navigate(`/agents/${agent_id}`); // Redirect to agents list
    }

  }
  console.log(agentData);

  const generateDiscordLink = () => {
    return "https://discord.com/api/oauth2/authorize?client_id="
            + agentData.discord.client_id + "&permissions=0&scope=bot%20applications.commands"
  }

  var currentDiscordServerIndex = -1;
  const[currentDiscordServer, setCurrentDiscordServer] = useState({
    "channels": [],
    "guid": "",
    "id": 0,
    "status": 0,
    "name": ""
  })

  const handleDiscordServerSelect = (index) => {
    const selectedServer = agentData.discord.servers[index]
    if (selectedServer) {
      currentDiscordServerIndex = index;
      setCurrentDiscordServer(selectedServer)
    }
  }

  var currentDiscordChannelIndex = -1;
  const[currentDiscordChannel, setCurrentDiscordChannel] = useState({
    "id": 0,
    "server_id": 0,
    "monitor_chat": 0,
    "respond_chat": 0,
    "respond_chat_chance": 0,
    "respond_to_mentions_chance": 100,
    "name": ""
  })
  const handleDiscordChannelSelect = (index) => {
    const selectedChannel = currentDiscordServer.channels[index]
    if (selectedChannel) {
      currentDiscordChannelIndex = index;
      setCurrentDiscordChannel(selectedChannel)
    }
  }

  const handleDiscordChannelUpdate = (field, value) => {
    setCurrentDiscordChannel((prevChannel) => {
      const updatedDiscordChannel = { ...prevChannel, [field]: value };
  
      // Update the specific channel in the current Discord server
      setAgentData((prevAgent) => {
        const updatedServers = prevAgent.discord.servers.map((server, serverIndex) => {
          if (serverIndex === currentDiscordServerIndex) {
            // Update channels only for the selected server
            const updatedChannels = server.channels.map((channel) =>
              channel.id === updatedDiscordChannel.id ? updatedDiscordChannel : channel
            );
            return { ...server, channels: updatedChannels };
          }
          return server;
        });
  
        return {
          ...prevAgent,
          discord: {
            ...prevAgent.discord,
            servers: updatedServers,
          },
        };
      });
  
      return updatedDiscordChannel;
    });
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

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">OpenAI Key</label>
              <input
                type="text"
                className="form-control"
                value={agentData.openai_public_key}
                onChange={(e) => handleChange("openai_public_key", e.target.value)}
              />
            </div>

            <div className="mb-2 input-group">
              <label className="input-group-text col-sm-2">OpenAI Secret</label>
              <input
                type="password"
                className="form-control"
                value={agentData.openai_secret_key}
                onChange={(e) => handleChange("openai_secret_key", e.target.value)}
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
            
            <div class="tab-pane fade show active" id="discord-form" role="tabpanel" aria-labelledby="discord-form-tab">
                <div className="col-md-12 card p-3 mt-2">
                <h3>Discord</h3>

                <div className="card">
                  <h4>Bot Details</h4>
                  <div className="mb-2 input-group">
                        <label className="input-group-text col-md-4">Token</label> 
                        <div className="col-md-2 ps-3 ms-2">
                          
                            <input class="form-control" type="password"
                            value={agentData.discord.token} 
                            onChange={(e) =>
                              handleDiscordChange("token", e.target.value)
                            }
                            />
                          
                        </div>
                  </div>
                
                  <div className="mb-2 input-group">

                    <label className="input-group-text col-md-4">Client Id</label> 
                    <div className="col-md-2 ps-3 ms-2">
                      
                        <input class="form-control" type="password"
                        value={agentData.discord.client_id} 
                        onChange={(e) =>
                          handleDiscordChange("client_id", e.target.value)
                        }
                        />
                      
                    </div>
                  </div>

              
                </div>

                <div className="card">
                  <h4>Server Management</h4> 
                  <div className="row">
                    
                    <div className="col-md-6">  
                      <select size="10" className="form-control" onChange={(e) => handleDiscordServerSelect(e.target.value)}>
                            {agentData.discord.servers.map((server, index) => (
                              <option  key={index} value={index}>
                                {server.name}
                              </option>
                            ))}
                      </select>
                      <small><i>Note: Adding a server requires you to invite it to discord server Use the Invite button below.</i></small>
                      
                      <a target ="_blank" href={ "https://discord.com/api/oauth2/authorize?client_id=" + agentData.discord.client_id + "&permissions=0&scope=bot%20applications.commands" } class="btn btn-success">
                        <span className="pr-3 p3"><i class="bi bi-discord">  </i></span> Invite To Server
                      </a> 
                      <button className="btn btn-danger">Leave Server</button>
                      <div class="row mb-5 mt-3">
                        <div class="col-md-12 input-group">
                        <label className="input-group-text col-sm-2">Server</label> 
                        <input type="text" className="form-control col-sm-6" placeholder=""/>
                        <button className="btn btn-small btn-info">Manage Server</button>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  <div className={ currentDiscordServer.name != "" ? "row" : "row fade" }>
                    <div className="col-md-6">
                      <h5>Channel Management</h5>
                      <div className="mb-2 input-group">
                        <label className="input-group-text col-sm-2">Channel</label> 
                        <input type="text" className="form-control col-sm-6" id="agent-discord-channel-add" 
                        placeholder=""/>
                        <button id="agent-discord-channel-add-action" className="btn btn-small btn-info">Add Channel</button>
                      </div>
                      <select size="5" className="form-control" id="discord-server-channels" onChange={(e) => handleDiscordChannelSelect(e.target.value)}>
                            {currentDiscordServer.channels.map((channel, index) => (
                              <option  key={index} value={index}>
                                {channel.name}
                              </option>
                            ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <h5>Channel Settings</h5>
                      <div className="mb-2 input-group">
                        <label className="input-group-text col-md-4">Monitor Chat</label> 
                        <div className="col-md-2 ps-3 ms-2">
                          <div class=" form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                            checked={currentDiscordChannel.monitor_chat === 1} 
                            onChange={(e) =>
                              handleDiscordChannelUpdate("monitor_chat", e.target.checked ? 1 : 0)
                            }
                            />
                          </div>                    
                        </div>
                      </div>
                      <div className="mb-2 input-group">
                        <label className="input-group-text col-md-4">Chat Response</label> 
                        <div className="col-md-2 ps-3 ms-2">
                          <div class=" form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch"
                            checked={currentDiscordChannel.respond_chat === 1} 
                            onChange={(e) =>
                              handleDiscordChannelUpdate("respond_chat", e.target.checked ? 1 : 0)
                            }/>
                          </div>                    
                        </div>
                        <div className="p-1 col-md-4 offset-md-1">
                          <input type="range" min="0" max="100" step="1" value={currentDiscordChannel.respond_chat_chance} 
                                    onChange={(e) =>
                                      handleDiscordChannelUpdate("respond_chat_chance", parseInt(e.target.value, 10))
                                    }/>
                        </div>
                      </div>
                      <div className="mb-2 input-group">
                        <label className="input-group-text col-md-4">Mention Response</label> 
                        <div className="col-md-2 ps-3 ms-2">
                          <div class=" form-check form-switch">
                            
                          </div>                    
                        </div>
                        <div className="p-1 col-md-4 offset-md-1">
                          <input type="range" min="0" max="100" step="1" value={currentDiscordChannel.respond_to_mentions_chance} 
                                    onChange={(e) =>
                                      handleDiscordChannelUpdate("respond_to_mentions_chance", parseInt(e.target.value, 10))
                                    }/>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <h5>Broadcast to Channel</h5>
                      <div className="input-group col-md-12">
                          <div class="form-control" id="discord-channel-log"></div>
                      </div>
                      <div className="input-group">
                        <select id="discord-chat-channel-broadcast-select" className="form-control">
                          <option value="-1">Select Channel</option>
                        </select>
                        <input type="text" className="form-control" id="discord-chat-broadcast" placeholder=""/>
                        <button id="agent-discord-channel-message-action" className="btn btn-info" type="button">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <div class="tab-pane fade" id="twitch-form" role="tabpanel" aria-labelledby="twitch-form-tab">
              <div className="col-md-12 card p-3 mt-2">
                  <h3>Twitch</h3>
                  
                  <div className="mb-2 input-group">
                    <label className="input-group-text col-sm-2">Authorize</label> 
                    <div className="offset-1 col-sm-10">
                      <button className="btn btn-small btn-info border-start-0">Connect To Twitch</button>
                    </div>
                  </div>

                  <div className="card">
                    <h4>Channel Management</h4>
                    <div className="mb-2 input-group">
                      <label className="input-group-text col-sm-2">Join Channel</label>
                      <input
                        type="text"
                        className="form-control col-sm-6"
                        placeholder="Enter channel name"
                        value={newTwitchChannel} // Track the new channel input
                        onChange={(e) => setNewTwitchChannel(e.target.value)} // Update the state
                      />
                      <button
                        className="btn btn-small btn-info"
                        onClick={(e) => handleAddTwitchChannel(e)}
                      >
                        Add Channel
                      </button>
                    </div>


                    <div className="row">
                        <div className="col-md-6 p-3 border-1">
                          <select size="10" className="form-control"
                            onChange={(e) => handleTwitchChannelSelect(e.target.value)}
                          >
                            {agentData.twitch.channels.map((channel, index) => (
                              <option  key={index} value={index}>
                                {channel.channel}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={ currentTwitchChannel.name != "" ? "col-md-6 p-4 border-1" : "fade" }>

                            <div className="mb-2 input-group">
                              <label className="input-group-text col-md-4">Monitor Chat:</label> 
                              <div className="col-md-2 ps-3 ms-2">
                                <div class=" form-check form-switch">
                                  <input class="form-check-input" type="checkbox" role="switch" 
                                    checked={currentTwitchChannel.monitor_chat === 1} 
                                    onChange={(e) =>
                                      handleTwitchChannelUpdate("monitor_chat", e.target.checked ? 1 : 0)
                                    }
                                  />
                                </div>                    
                              </div>
                            </div>

                            <div className="mb-2 input-group">
                              <label className="input-group-text col-md-4">Monitor Stream</label> 
                              <div className="col-md-2 ps-3 ms-2">
                                <div class=" form-check form-switch">
                                  <input class="form-check-input" type="checkbox" role="switch" checked={currentTwitchChannel.monitor_stream === 1} 
                                    onChange={(e) =>
                                      handleTwitchChannelUpdate("monitor_stream", e.target.checked ? 1 : 0)
                                    }
                                  />
                                </div>                    
                              </div>
                            </div>
                            
                            <div className="mb-2 input-group">
                              <label className="input-group-text col-md-4">Chat Response</label> 
                              <div className="col-md-2 ps-3 ms-2">
                                <div class=" form-check form-switch">
                                  <input class="form-check-input" type="checkbox" role="switch" checked={currentTwitchChannel.respond_chat === 1} 
                                    onChange={(e) =>
                                      handleTwitchChannelUpdate("respond_chat", e.target.checked ? 1 : 0)
                                    }
                                  />
                                </div>                    
                              </div>
                              <div className="p-1 col-md-4 offset-md-1">
                                <input type="range" min="0" max="100" step="1" value={currentTwitchChannel.respond_chat_chance} 
                                    onChange={(e) =>
                                      handleTwitchChannelUpdate("respond_chat_chance", parseInt(e.target.value, 10))
                                    }
                                  />
                              </div>
                            </div>
                            <div className="mb-2 input-group">
                              <label className="input-group-text col-md-4">Stream Response</label> 
                              <div className="col-md-2 ps-3 ms-2">
                                <div class=" form-check form-switch">
                                  <input class="form-check-input" type="checkbox" role="switch" checked={currentTwitchChannel.respond_stream === 1} 
                                    onChange={(e) =>
                                      handleTwitchChannelUpdate("respond_stream", e.target.checked ? 1 : 0)
                                    }
                                  />
                                </div>                    
                              </div>
                              <div className="p-1 col-md-4 offset-md-1">
                                <input id="agent-twitch-channel-response-stream-chance" type="range" min="0" max="100" step="1" value={currentTwitchChannel.respond_stream_chance} 
                                    onChange={(e) =>
                                      handleTwitchChannelUpdate("respond_stream_chance", parseInt(e.target.value, 10))
                                    } />
                              </div>
                            </div>

                            <div className="input-group text-end col-md-12 mt-5">
                                <button id="agent-twitch-channel-leave" className="btn btn-small btn-danger" onClick={handleTwitchChannelLeave}>
                                  Leave Channel
                                </button>
                            </div>

                        </div>
                    </div>

                    <h5>Broadcast to Channel</h5>
                    <div className="input-group col-md-12">
                        <div class="form-control" id="twitch-channel-log"></div>
                    </div>
                    <div class="input-group">
                      <select id="twitch-chat-channel" className="form-control">
                        <option value="-1">Select Channel</option>
                      </select>
                      <input type="text" className="form-control" id="twitch-chat-broadcast" placeholder=""/>
                      <button className="btn btn-info" type="button">
                        Send
                      </button>
                    </div>
                  </div>

                </div>
            </div>

          </div>

          

          

        </div>
      </form>
    </div>
  );
};

export default EditAgent;
