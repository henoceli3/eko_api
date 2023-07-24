import bip39 from "bip39";

const generateMnemonic = async () => {
  return bip39.generateMnemonic(128); // géneration de la phrase de sauvegarde avec 128 bits
};

export default generateMnemonic; // exportation de la phrase de sauvegarde
