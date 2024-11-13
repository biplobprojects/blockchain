import axios from "axios";

const BASE_URL = "https://bc.gbrservice.com/networks";
const POST_BASE_URL = "https://bc.gbrservice.com";

/*NETWORK APIS*/
// FETCH BLOCKCHAIN NETWORKS
export const fetchBlockChainNetworks = async (parent) => {
  const token = "your-authorization-token";
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };

  try {
    const response = await axios.get(BASE_URL, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching existing networks", error);
    throw error;
  }
};

//Delete Networks
export const deleteNetworks = async (parent, reqBody) => {
  const token = "your-authorization-token"; // Replace with actual token

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent, // Custom header if required by the API
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/delete`, // Assuming DELETE is a POST request on your server
      reqBody, // This is the request body
      { headers } // Headers go here as the third argument
    );
    return response.data; // Assuming the API returns some data on success
  } catch (error) {
    console.error("Error deleting network", error);
    throw error;
  }
};
// Add Network
export const addNetwork = async (parent, formData) => {
  const token = "your-authorization-token";

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
    "content-type": `application/json`,
  };

  try {
    const response = await axios.post(`${BASE_URL}/create`, formData, {
      headers,
    });
    return response.data; // Return the newly added machine data or confirmation
  } catch (error) {
    console.error("Error adding new machine", error);
    throw error;
  }
};

//FETCH NETWORK DETAILS:
export const fetchNetworkDetails = async (parent, networkid) => {
  const token = "your-authorization-token";
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };

  try {
    const response = await axios.get(`${BASE_URL}/${networkid}`, { headers });
    return response.data;
  } catch (err) {
    console.error("error fetching network details", err);
    throw err;
  }
};

/* NODE MANAGEMENT APIS*/
// Get All Nodes
export const getNodesOfNetwork = async (parent, networkid) => {
  const token = "your-authorization-token";

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };
  try {
    const response = await axios.get(`${BASE_URL}/${networkid}/nodes`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("ERROR FETCHING NODES OF A NETWORK", error);
    throw error;
  }
};

// Delete Node
export const deleteNode = async (parent, networkid, ipaddress) => {
  const token = "your-authorization-token"; // Get this from auth context or localStorage
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };

  try {
    const response = await axios.delete(
      `${BASE_URL}/${networkid}/nodes/${ipaddress}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting machine with networkid ${networkid}`, error);
    throw error;
  }
};

//Add Nodes
export const addNodes = async (parent, formData) => {
  const token = "your-authorization-token";

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
    // "content-type": `application/json`,
  };

  try {
    const response = await axios.post(`${BASE_URL}/nodes`, formData, {
      headers,
    });
    return response.data; // Return the newly added machine data or confirmation
  } catch (error) {
    console.error("Error adding new machine", error);
    throw error;
  }
};

/*USER MANAGEMENT APIS*/
// Get All UserAccounts
export const getAllEthereumAccount = async (parent, networkid) => {
  const token = "your-authorization-token";

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };

  try {
    const response = await axios.get(`${BASE_URL}/${networkid}/accounts`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("ERROR FETCHING ALL ETHEREUM ACCOUNT", error);
    throw error;
  }
};

// Create Remote Account
export const createRemoteAccount = async (parent, formData) => {
  const token = "your-authorization-token";

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
    "content-type": `application/json`,
  };

  try {
    const response = await axios.post(
      `${POST_BASE_URL}/accounts/create`,
      formData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating remote account", error);
    throw error;
  }
};

// Create Local Account
export const createLocalAccount = async (parent, formData) => {
  const token = "your-authorization-token";

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
    "content-type": `application/json`,
  };

  try {
    const response = await axios.post(
      `${POST_BASE_URL}/accounts/local`,
      formData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating remote account", error);
    throw error;
  }
};

// Delete Remote Account
export const deleteRemoteAccount = async (parent, requestBody) => {
  const token = "your-authorization-token";
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };

  try {
    const response = await axios.post(
      `${POST_BASE_URL}/accounts/delete`,
      requestBody,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("ERROR DELETING ACCOUNTS::::");
    throw error;
  }
};
