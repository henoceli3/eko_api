import axios from "axios";

const sendTxObject = async (TxObject) => {
  try {
    const response = await axios.post(
      "https://api.blockcypher.com/v1/bcy/test/txs/new",
      TxObject
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.log("Response data:", error.response.data);
      console.log("Status code:", error.response.status);
      console.log("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      console.log("No response received:", error.request);
    } else {
      // Something else happened while setting up the request
      console.log("Error:", error.message);
    }
  }

};

var newtx = {
  inputs: [{ addresses: ["13KByQ8CUVVMymyZTjXqhoJdKYky2gb3w3"] }],
  outputs: [
    { addresses: ["1LoV9c23nXiZKr195e4t3Mrs6oJU7uCmce"], value: 1 },
  ],
};

sendTxObject(newtx);
