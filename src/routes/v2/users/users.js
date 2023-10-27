import { matchedData } from "express-validator";
import { models } from "../../../db/sequelize.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class Users {
  /**
   * Creates a new user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object.
   */
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
      const user = await models.utilisatueur.findOne({
        where: { uuid },
      });
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
            id: user.id,
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

  async updateUserNameAndPrenom(req, res) {
    try {
      const { uuid, nom, prenom } = matchedData(req);
      const updatedUser = await models.utilisatueur.update(
        { nom: nom, prenom: prenom },
        {
          where: { uuid: uuid, line_state: 0 },
        }
      );
      const message =
        "Le nom et le prenom de l'utilisateur on bien été mis à jour";
      return res.status(200).json({ message, uuid: updatedUser.uuid });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async deleteUserByUuid(req, res) {
    try {
      const { uuid, mdp } = matchedData(req);
      const user = await models.utilisatueur.findOne({
        where: { uuid: uuid, line_state: 0 },
      });
      if (!user) {
        const message = "Cet utilisateur n'existe pas";
        return res.status(404).json({ message });
      }
      await bcrypt.compare(mdp, user.mdp).then(async (isPasswordValid) => {
        if (!isPasswordValid) {
          const message = "Mot de passe invalide";
          return res.status(404).json({ message });
        }
        const deletedUser = await models.utilisatueur.update(
          { line_state: 1 },
          {
            where: { uuid: uuid },
          }
        );
        const message = "Votre compte a été supprimé";
        return res.status(200).json({ message, uuid: deletedUser.uuid });
      });
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
        res.status(200).json({ message, uuid: user.uuid, token });
      });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.STMP_HOST || "smtp.gmail.com",
        port: process.env.STMP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.STMP_USER || "helitako16@gmail",
          pass: process.env.STMP_PASS || "eorqyfllrrmidyxo",
        },
      });
      const user = await models.utilisatueur.findOne({
        where: { email: email },
      });
      if (!user) {
        res.status(400).json({ message: "Utilisateur introuvable" });
        return;
      }
      const resetToken = jwt.sign(
        { email },
        process.env.PRIVATE_KEY || "dvdfbgfnbv",
        { expiresIn: "24h" }
      );
      user.resetToken = resetToken;
      await user.save();
      const resetLink = `http://localhost:${process.env.PORT}/components/authentication/reset-password/?token=${resetToken}`;
      const mailOptions = {
        from: "Eko Wallet <helitako16@gmail.com>",
        to: email,
        subject: "Réinitialisation du mot de passe",
        text: `ouvrez l'adresse suivante pour changer votre mot de passe: ${resetLink}`,
      };
      await transporter.sendMail(mailOptions);

      const message = "Email de réinitialisation envoyé avec succes";
      res.status(200).json({ message });
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }
}

const users = new Users();
export default users;
