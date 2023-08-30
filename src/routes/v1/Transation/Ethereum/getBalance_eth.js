import Web3 from "web3";
import abi from "../../../../utils/ethersc_Abi.js";
import dotenv from "dotenv";
dotenv.config();

const web3 = new Web3(
  "https://eth-mainnet.g.alchemy.com/v2/6mn2xblL6xvsbFUylnJGBkiaypKd4yl6"
);
const getBalanceByaddress = async (req, res) => {
  try {
    const { tokenContractAddress, userAddress } = req.body;
    if (!tokenContractAddress || !userAddress) {
      return res.status(400).json({
        message: "tokenContractAddress and userAddress are required",
      });
    }
    const tokenContractABI = abi;

    const tokenContract = new web3.eth.Contract(
      tokenContractABI,
      tokenContractAddress
    );

    const balance = await tokenContract.methods.balanceOf(userAddress).call();

    // Convert BigInt balance to a string before sending in the response
    const balanceString = balance.toString();

    return res.status(200).json({ solde: balanceString });
  } catch (error) {
    const errorMessage = `Une erreur est survenue : ${error}`;
    return res.status(500).json({ message: errorMessage });
  }
};

export default getBalanceByaddress;
