import Web3 from "web3";


const getBlanceBTCNAtive = async (req, res) => {
  try {
    const web3 = new Web3(
      "https://eth-mainnet.g.alchemy.com/v2/6mn2xblL6xvsbFUylnJGBkiaypKd4yl6"
    );
    const { userAddress } = req.body;
    if (!userAddress) {
      return res.status(400).json({
        message: "userAddress est requit",
      });
    }
    const balanceWei = await web3.eth.getBalance(userAddress);
    const balanceEther = web3.utils.fromWei(balanceWei, "ether");
    return res.status(200).json({ solde: balanceEther });
  } catch (error) {
    const errorMessage = `Une erreur est survenue : ${error}`;
    return res.status(500).json({ message: errorMessage });
  }
};

export default getBlanceBTCNAtive;
