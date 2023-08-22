import generateMnemonic from "../../../utils/generateMnemonic.js";


const getSecretPhrase = async (req, res) => {
    try {
        const secretPhrase = await generateMnemonic();
        res.status(200).json({ secretPhrase });
    } catch (error) {
        const message = `Une erreur est survenue : ${error}`;
        res.status(500).json({ message });
    }
}

export default getSecretPhrase;