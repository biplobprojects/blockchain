import axios from 'axios';

const BASE_URL = 'https://bc.gbrservice.com/machinepool';

export const fetchMachineData = async (parent) => {
  const token = 'your-authorization-token'; // Get this from auth context or localStorage
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };
  try {
    const response = await axios.get(BASE_URL, { headers });

    return response.data;
  } catch (error) {
    console.error('Error fetching machine pool data', error);
    throw error;
  }
};


// Add the deleteMachine function
export const deleteMachine = async (parent,host) => {
  const token = 'your-authorization-token'; // Get this from auth context or localStorage
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,

  };
  
  try {
    const response = await axios.delete(`${BASE_URL}/${host}`, { headers });
    return response.data; // Assuming the API returns some data on success
  } catch (error) {
    console.error(`Error deleting machine with host ${host}`, error);
    throw error;
  }
};



export const addMachine = async (parent, formData) => {
  const token = 'your-authorization-token'; // Get this from auth context or localStorage

  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent, // Add parent as a header if required by API
  };

  try {
    const response = await axios.post(BASE_URL, formData, { headers });
    return response.data; // Return the newly added machine data or confirmation
  } catch (error) {
    console.error('Error adding new machine', error);
    throw error;
  }
};


export const getFreeMachine= async(parent)=>{
  const token = 'your-authorization-token'; // Get this from auth context or localStorage
  const headers = {
    Authorization: `Bearer ${token}`,
    parent: parent,
  };
  try {
    const response = await axios.get(`${BASE_URL}/free`, { headers });

    return response.data;
  } catch (error) {
    console.error('Error fetching machine pool data', error);
    throw error;
  }
}