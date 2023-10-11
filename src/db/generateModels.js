import { SequelizeAuto } from "sequelize-auto";

const auto = new SequelizeAuto("eko", "root", "", {
  host: "localhost",
  dialect: "mysql",
  directory: "../models",
  additional: {
    timestamps: false,
  },
});

auto.run((err) => {
  // if (err) {
  //   throw err;
  // }
  // console.log(auto.tables);
  // console.log(auto.foreignKeys);
});
