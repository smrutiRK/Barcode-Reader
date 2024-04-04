import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getEnclosement = async(uid)=>{
  try {
    const response = await axios.get(`${SERVER_URL}/api/encloseditem/all`, {
      params: {
        uid: uid
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getEnclosementStatus = async (uid_no) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/encloseditem/status`, {
      params: {
        uid_no: uid_no
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data.error
  }
}

export const getEnclosureStatus = async (uid) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/shipments/status`, {
      params: {
        uid: uid
      }
    });
 
    return response.data;
  } catch (error) {
    return error.response.data.error
  }
};

export const scanUIDShipment = async (uid) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/shipments/get`, {
      params: {
        uid: uid
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const scanUIDEnclosedItem = async (uid) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/encloseditem/scanuid`, {
      params: {
        uid: uid
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const scanTpnShipment = async (tpn) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/shipments/scantpn`, {
      params: {
        part_number: tpn
      }
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.message);
  }
};

export const scanSrShipment = async (sr) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/shipments/scansr`, {
      params: {
        serial_number: sr
      }
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.message);
  }
};


export const scanTpnEnclosedItem = async (tpn) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/encloseditem/scantpn`, {
        params: {
          tpn_no: tpn
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
export const scanSrEnclosedItem = async (sr) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/encloseditem/scansr`, {
        params: {
          sr_no: sr
        }
      });
      return response.data; 
    } catch (error) {
      throw new Error(error.message);
    }
};

export const createShipment = async (shipmentData) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/shipments/create`, shipmentData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateItems = async (enclosedItemData) => {
  try {
    const response = await axios.put(`${SERVER_URL}/api/encloseditem/update`, enclosedItemData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
