import { Alchemy, Network } from "alchemy-sdk";

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

console.log(data);
