import { Alchemy, Network } from "alchemy-sdk";
const getTransactionHistorique_eth = async (req, res) => {
  try {
    const { userAddress, tokenContractAddress } = req.body;
    if (!userAddress || !tokenContractAddress) {
      return res.status(400).json({
        message: "userAddress and tokenContractAddress are required",
      });
    }
    const config = {
      apiKey: "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6",
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(config);

    const data = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: "0xCE0a675c3622c4f5f128f880038a3C4c72f06aCE",
      toAddress: "0x7Bf6DB9a47170317D6383db03aF6e40B0e187351",
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });

    const historique = data.transfers.map((transaction) => {
      return {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        asset: transaction.asset,
      };
    });

    res.status(200).json(historique);
  } catch (error) {
    const message = `Une erreur est survenue: ${error}`;
    res.status(500).json({ message });
  }
};

export default getTransactionHistorique_eth;
