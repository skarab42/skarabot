const { Umzug, SequelizeStorage } = require("umzug");
const { watch } = require("../config");
const sequelize = require("./index");

function factory(pattern, modelName) {
  return new Umzug({
    context: sequelize.getQueryInterface(),
    migrations: { glob: [pattern, { cwd: __dirname }] },
    storage: new SequelizeStorage({ sequelize, modelName }),
    logger: watch ? console : undefined,
  });
}

const migrations = factory("migrations/*.js", "SequelizeMigrations");
const seeders = factory("seeders/*.js", "SequelizeSeeders")

module.exports = {
  async up() {
    await migrations.up();
    await seeders.up();
  },
};
