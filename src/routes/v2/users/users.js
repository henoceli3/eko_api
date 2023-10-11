import { matchedData } from "express-validator";
import { models } from "../../../db/sequelize.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

class Users {
  async createUser(req, res) {
    try {
      const { nom, prenom, email } = matchedData(req);
      let { mdp } = matchedData(req);
      const hash = await bcrypt.hash(mdp, 10);
      mdp = hash;
      const newUser = await models.utilisatueur.create({
        uuid: uuidv4(),
        nom,
        prenom,
        email,
        mdp,
        created_at: new Date().toISOString(),
        line_state: 0,
      });
      return res.status(200).json(`Utilisateur ${newUser.id} a bien été créé`);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = matchedData(req);
      const user = await models.utilisatueur.findByPk(id);
      return res.status(200).json(user);
    } catch (error) {
      const message = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message });
    }
  }

  async geAlltUsers(req, res) {
    try {
      const users = await models.utilisatueur.findAll();
      return res.status(200).json(users);
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
        where: { mdp, email },
      });
      return res.status(200).json(user);
    } catch (error) {}
  }
}

const users = new Users();
export default users;