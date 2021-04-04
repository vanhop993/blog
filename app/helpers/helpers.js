const bcrypt = require("bcrypt");
const config = require('config');

const hash_password = (password) => {
    const saltRounds = config.get("salt");
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password,salt)
};

const compare_password = (password,hash) => {
    return bcrypt.compareSync(password, hash);
}

module.exports = {hash_password,compare_password}