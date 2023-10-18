import { matchedData } from "express-validator";
import { models } from "../../../db/sequelize.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

class Users {
  async createUser(req, res) {
    try {
      const { nom, prenom, email } = matchedData(req);
      let { mdp } = matchedData(req);
      const existEmail = await models.utilisatueur.findOne({
        where: { email },
      });
      if (existEmail) {
        const message = "Cet email est déjà utilisé";
        return res.status(409).json({ message });
      }
      const hash = await bcrypt.hash(mdp, 10);
      const newUser = await models.utilisatueur.create({
        id: 0,
        uuid: uuidv4(),
        nom: nom,
        prenom: prenom,
        email: email,
        mdp: hash,
        line_state: 0,
      });
      return res.status(200).json(`Utilisateur ${newUser.id} a bien été créé`);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async getUserByUuid(req, res) {
    try {
      const { uuid } = matchedData(req);
      const user = await models.utilisatueur.findByPk(uuid);
      return res.status(200).json({
        uuid: user.uuid,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async geAlltUsers(req, res) {
    try {
      const users = await models.utilisatueur.findAll();
      return res.status(200).json({
        users: users.map((user) => {
          return {
            uuid: user.uuid,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
          };
        }),
      });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async updateUserById(req, res) {
    try {
      const { id } = matchedData(req);
      const { user } = matchedData(req);
      const updatedUser = await models.utilisatueur.update(user, {
        where: { id },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async deleteUserById(req, res) {
    try {
      const { id } = matchedData(req);
      const deletedUser = await models.utilisatueur.destroy({
        where: { id },
      });
      return res.status(200).json(deletedUser);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async login(req, res) {
    try {
      const { mdp, email } = matchedData(req);
      const user = await models.utilisatueur.findOne({
        where: { email: email, line_state: 0 },
      });
      if (!user) {
        res.status(401).json({ message: "Aucun utilsateur trouvé" });
      }
      await bcrypt.compare(mdp, user.mdp).then((isPasswordValid) => {
        if (!isPasswordValid) {
          const message = "Mot de passe invalide";
          return res.status(404).json({ message });
        }
        const token = jwt.sign(
          { userUuid: user.uuid },
          process.env.PRIVATE_KEY || "dvdfbgfnbv",
          { expiresIn: "7d" }
        );
        const message = "Connexion reussie";
        res.status(200).json({ message, uuid: user.uuid, token, isMdpValid });
      });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }
}

const users = new Users();
export default users;
