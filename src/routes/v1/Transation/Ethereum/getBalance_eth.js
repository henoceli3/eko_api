import Web3 from "web3";
import abi from "../../../../utils/ethersc_Abi.js";
import dotenv from "dotenv";
dotenv.config();

const getBalanceByaddress = async (req, res) => {
  try {
    const { tokenContractAddress, userAddress } = req.body;
    if (!tokenContractAddress || !userAddress) {
      res
        .status(400)
        .json({
          message: "tokenContractAddress et userAddress sont obligatoires",
        });
    }
    const web3 = new Web3(
      "https://eth-mainnet.g.alchemy.com/v2/6mn2xblL6xvsbFUylnJGBkiaypKd4yl6"
    );

    const tokenContractABI = abi;

    const tokenContract = new web3.eth.Contract(
      tokenContractABI,
      tokenContractAddress
    );

    const balance = await tokenContract.methods.balanceOf(userAddress).call();
    res.status(200).json({ balance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Une erreur est survenue : ${error}` });
  }
};

export default getBalanceByaddress;