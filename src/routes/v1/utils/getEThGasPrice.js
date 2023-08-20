import dotenv from "dotenv";
import Web3 from "web3";
dotenv.config();

const alchemyKey = process.env.ALCHEMY_API_KEY;
const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`);

/**
 * Estimates the gas price in Gwei and Ether (ETH) and returns the values in the response.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @return {object} The response containing the gas price in Gwei and its equivalent in Ether (ETH).
 */
const estimateGasPrice = async (req, res) => {
  try {
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPriceGwei = web3.utils.fromWei(gasPriceWei, "gwei");
    console.log(`Gas Price in Gwei: ${gasPriceGwei}`);

    // Convert gasPriceGwei back to Wei
    const gasPriceWeiEquivalent = web3.utils.toWei(gasPriceGwei, "gwei");

    // Convert gasPriceWeiEquivalent to Ether (ETH)
    const gasPriceEthEquivalent = web3.utils.fromWei(gasPriceWei, "ether");
    console.log(`Gas Price in Ether: ${gasPriceEthEquivalent} ETH`);

    const message = `Le prix du gas a été recuperé avec succès.`;
    res.status(200).json({
      message: message,
      data: {
        // gasPriceWei: gasPriceWei,
        gasPriceGwei: gasPriceGwei,
        gasPriceEthEquivalent: gasPriceEthEquivalent,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to estimate gas price ${error}` });
  }
};

export default estimateGasPrice;
