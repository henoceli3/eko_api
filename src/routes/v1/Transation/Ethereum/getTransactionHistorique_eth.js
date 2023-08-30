import { Alchemy, Network } from "alchemy-sdk";
const getTransactionHistorique_eth = async (req, res) => {
  try {
    const { userAddress, tokenContractAddress } = req.body;
    if (!userAddress) {
      return res.status(400).json({
        message: "userAddress est requit",
      });
    }
    const config = {
      apiKey: "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6",
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(config);

    const data_from = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: userAddress,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });
    const data_to = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: userAddress,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });

    const historique_from = data_to.transfers.map((transaction) => {
      return {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        asset: transaction.asset,
      };
    });
    const historique_to = data_from.transfers.map((transaction) => {
      return {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        asset: transaction.asset,
      };
    });

    const historique = historique_from.concat(historique_to);

    res.status(200).json(historique);
  } catch (error) {
    const message = `Une erreur est survenue: ${error}`;
    res.status(500).json({ message });
  }
};

export default getTransactionHistorique_eth;
