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
  //Initialize variables for the parameters
  let vitalikAddress = "0xCE0a675c3622c4f5f128f880038a3C4c72f06aCE";
  let usdcContract = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce";

  //Call the method to return the token balances for this address
  let response = await alchemy.core.getTokenBalances(vitalikAddress, [
    usdcContract,
  ]);

  //Logging the response to the console
  console.log(
    response.tokenBalances.map((tokenBalance) =>
      Utils.formatUnits(tokenBalance.tokenBalance, "ether")
    )
  );
};

main();
