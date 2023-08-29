import axios from "axios";
import shortid from "shortid";

const transaction = {
  "sender_address": "0xCE0a675c3622c4f5f128f880038a3C4c72f06aCE",
  "destination_address": "0x7Bf6DB9a47170317D6383db03aF6e40B0e187351",
  "amount": "0.0000000000000001",
  "private_key":
    "0xe0c84d4b6665c86a11764df2e16cf2e938787349e40ec0d36a2c42b46b0ebac9",
  "gasPriceGwei": "34.112934711",
};

function customStringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    // Si la valeur est un BigInt, convertissez-la en chaîne de caractères
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
}

const test = async () => {
  // Utilisation de la fonction de sérialisation personnalisée
  const serializedData = customStringify(transaction);
  // console.log(serializedData);
    const response = await axios.post(
      "https://eko-api.vercel.app/api/v1/testSepolia",
      serializedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.data);
};

test();

