import bip39 from "bip39";
import { Wallet } from "ethers";
import bitcore from "bitcore-lib";

const generateMnemonic = async () => {
  return bip39.generateMnemonic(128);
};

const generateWallets = (mnemonic) => {
  const ethereumWallet = Wallet.fromPhrase(mnemonic);

  // Use Bitcore to derive a Bitcoin address from the same mnemonic
  const bitcoinMnemonic = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
  const bitcoinRootKey = bitcore.HDPrivateKey.fromSeed(
    bitcore.crypto.Hash.sha256(Buffer.from(bitcoinMnemonic, "hex"))
  );
  const bitcoinDerivedKey = bitcoinRootKey.derive("m/0'/0'/0'/0/0");
  const bitcoinAddress = bitcoinDerivedKey.privateKey.toAddress().toString();
  const bitcoinPrivateKey = bitcoinDerivedKey.privateKey.toString();
  const bitcoinPublicKey = bitcoinDerivedKey.publicKey.toString();

  // Return an object containing wallet information for each blockchain
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
      publicKey: bitcoinPublicKey,
      privateKey: bitcoinPrivateKey,
      address: bitcoinAddress,
    },
    {
      id: 3,
      blockchain: "Binance Smart Chain",
    }
  ];
  return wallets;
};

const mnemonic = await generateMnemonic();
console.log(generateWallets(mnemonic));

const createWallet = (app) => {
  app.get("/api/v1/createwallet", async (req, res) => {
    try {
      const mnemonic = await generateMnemonic();
      const wallets = generateWallets(mnemonic);
      res.status(200).json({ mnemonic: mnemonic, wallets: wallets });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message: message });
    }
  });
};

export default createWallet;
