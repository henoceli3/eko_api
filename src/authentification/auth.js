import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const privateKey = process.env.PRIVATE_KEY || "dvdfbgfnbv";

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  }

  const token = authorizationHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }

    const userUuid = decodedToken.userUuid;
    if (req.body.userUuid && req.body.userUuid !== userUuid) {
      const message = `L'identifiant de l'utilisateur est invalide.`;
      res.status(401).json({ message });
    } else {
      next();
    }
  });
};

export default auth;
