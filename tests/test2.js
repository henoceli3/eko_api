// Imports the Alchemy SDK
import { Alchemy, Network, Utils } from "alchemy-sdk";

// Configures the Alchemy SDK
const config = {
  apiKey: "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6", // Replace with your API key
  network: Network.ETH_SEPOLIA, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const main = async () => {
  // This response fetches the balance of the given address in the paramter as of the provided block.
  let response = await alchemy.core.getBalance(
    "0xCE0a675c3622c4f5f128f880038a3C4c72f06aCE",
    "latest"
  );

  //Logging the response to the console
  console.log(Utils.formatUnits(response._hex, "ether"));
};

main();
