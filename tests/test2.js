import axios from "axios";

const transaction = {
  sender_address: "0x42539dCFC0065c6134F2d8b6E9B55a7A6b9cd9f5",
  destination_address: "0xCE0a675c3622c4f5f128f880038a3C4c72f06aCE",
  amount: "0.0000000000000001",
  private_key:
    "0xe0c84d4b6665c86a11764df2e16cf2e938787349e40ec0d36a2c42b46b0ebac9",
  gasPriceGwei: "34.112934711",
};

const test = async () => {
  const response = await axios.post(
    "http://localhost:4000/api/v1/testSepolia",
    transaction,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data.data);
};

test();
