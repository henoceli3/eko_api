import bip39 from "bip39";
import { Wallet } from "ethers";
import bitcore from "bitcore-lib";
import generateMnemonic from "./generateMnemonic.js";
import Web3 from "web3";

const generateEthereumWallet = (mnemonic) => {
  const web3 = new Web3(
    "https://eth-mainnet.g.alchemy.com/v2/6mn2xblL6xvsbFUylnJGBkiaypKd4yl6"
  );
  // const ethereumWallet = web3.eth.accounts.create(mnemonic);
  const ethereumWallet = Wallet.fromPhrase(mnemonic); //géneration du portefeuille EThereum a partir de la phrase de sauvegarde

  return {
    publicKey: ethereumWallet.publicKey,
    privateKey: ethereumWallet.privateKey,
    address: ethereumWallet.address,
  };
};

const generateBitcoinWallet = (mnemonic) => {
  // Génération du portefeuille Bitcoin à partir de la phrase de sauvegarde
  const bitcoinMnemonic = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
  const bitcoinRootKey = bitcore.HDPrivateKey.fromSeed(
    bitcore.crypto.Hash.sha256(Buffer.from(bitcoinMnemonic, "hex"))
  );
  const bitcoinDerivedKey = bitcoinRootKey.derive("m/0'/0'/0'/0/0");
  const bitcoinAddress = bitcoinDerivedKey.privateKey.toAddress().toString();
  const bitcoinPrivateKey = bitcoinDerivedKey.privateKey.toString();
  const bitcoinPublicKey = bitcoinDerivedKey.publicKey.toString();

  return {
    publicKey: bitcoinPublicKey,
    privateKey: bitcoinPrivateKey,
    address: bitcoinAddress,
  };
};

const generateWallets = (mnemonic) => {
  const ethereumWallet = generateEthereumWallet(mnemonic);
  const bitcoinWallet = generateBitcoinWallet(mnemonic);

  // Récupération des wallets
  const wallets = [
    {
      id: 1,
      blockchain: "Ethereum",
      publicKey: ethereumWallet.publicKey,
      privateKey: ethereumWallet.privateKey,
      address: ethereumWallet.address,
    },
    {
      id: 2,
      blockchain: "Bitcoin",
      publicKey: bitcoinWallet.publicKey,
      privateKey: bitcoinWallet.privateKey,
      address: bitcoinWallet.address,
    }
  ];
  return wallets; // exportation des wallets
};

// pour le deboguage
// TODO : A surprimer
// const mnemonic = await generateMnemonic();
// console.log({mnemonic}, generateWallets(mnemonic));

export default generateWallets; // exportation de la fonction genereWallets(mnemonic)