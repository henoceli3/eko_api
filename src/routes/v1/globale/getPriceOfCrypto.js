import axios from "axios";

class Global {
  constructor() {
    this.CryptoCmparApiKey =
      "fa975e9c5a92a7add155777722e7badd01a820b6b14b3e4c575e01f476cec5a8";
  }

  async getPriceOfCrypto(req, res) {
    try {
      const cryptosTable = req.body.cryptosTable;
      const devise = req.body.devise;

      const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptosTable.join(
        ","
      )}&tsyms=${devise}`;
      const response = await axios.get(url);

      const cryptoData = response.data;

      // Créez un tableau d'objets à partir de la réponse de l'API
      const cryptoObjects = Object.keys(cryptoData).map((cryptoSymbol) => ({
        [cryptoSymbol]: cryptoData[cryptoSymbol][devise],
      }));

      return res.status(200).json({ price: cryptoObjects });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      console.log(message);
      res.status(500).json({ message });
    }
  }
}

const global = new Global();
export default global;
