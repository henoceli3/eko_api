import bip39 from "bip39";
import { Wallet } from "ethers";
import bitcore from "bitcore-lib";
import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();

class WalletGenerator {
  constructor(ethereumProviderUrl) {
    this.web3 = new Web3(ethereumProviderUrl);
  }

  generateEthereumWallet(mnemonic) {
    const ethereumWallet = Wallet.fromPhrase(mnemonic);
    return {
      publicKey: ethereumWallet.publicKey,
      privateKey: ethereumWallet.privateKey,
      address: ethereumWallet.address,
    };
  }

  generateBitcoinWallet(mnemonic) {
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
  }

  async generateWallets(mnemonic) {
    const ethereumWallet = this.generateEthereumWallet(mnemonic);
    const bitcoinWallet = this.generateBitcoinWallet(mnemonic);
    return {
      mnemonic: mnemonic,
      bitcoinPublicKey: bitcoinWallet.publicKey,
      bitcoinPrivateKey: bitcoinWallet.privateKey,
      bitcoinAddress: bitcoinWallet.address,
      ethereumPublicKey: ethereumWallet.publicKey,
      ethereumPrivateKey: ethereumWallet.privateKey,
      ethereumAddress: ethereumWallet.address,
    };
  }

  async generateMnemonic(bits) {
    return bip39.generateMnemonic(bits);
  }
}

// Example usage
// const walletGenerator = new WalletGenerator(process.env.ETHEREUM_PROVIDER_URL);
// const mnemonic = await walletGenerator.generateMnemonic(128);
// console.log({ mnemonic }, walletGenerator.generateWallets(mnemonic));

export default WalletGenerator;
