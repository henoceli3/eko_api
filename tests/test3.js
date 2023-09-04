import axios from "axios";

const test = async () => {
  try {
    // Remplacez les valeurs suivantes par les données nécessaires
    const privateKey =
      "0x4e506e2de271f041144f3dfdce3ce0a19ec3117a135234c94b383d1c05e4233a";
    const destinationAddress = "0x42539dCFC0065c6134F2d8b6E9B55a7A6b9cd9f5";
    const amount = "0.01";
    const tokenContractAddress = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce";

    const response = await axios.post(
      "http://localhost:4000/api/v1/sendEth/eth",
      {
        privateKey,
        destinationAddress,
        amount,
        tokenContractAddress,
      }
    );

    console.log("Transaction Hash:", response.data.transactionHash);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la transaction :", error);
  }
};

test();
