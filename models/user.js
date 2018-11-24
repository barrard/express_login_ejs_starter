
const bcrypt = require('bcryptjs')

var mongoose = require('mongoose')


var user_schema = require('./user_schema.js')

const User = module.exports = mongoose.model('User', user_schema)
User.create_user = create_user
User.compare_password = compare_password
User.get_user_by_email = get_user_by_email
User.get_user_by_id = get_user_by_id




// const methods = {
  async function get_user_by_id (id, cb) {
    await User.findById(id, cb)
  }
  async function get_user_by_email(email) {
    try {
      const query = {
        email: email
      }
      let user = await User.findOne(query)
      return user
    } catch (err) {
      throw err
    }
  }

  async function compare_password(password, hash) {
    try {
      let is_match = await bcrypt.compare(password, hash)
      return is_match
    } catch (err) {
      throw err
    }
  }

  function create_user(new_user) {
    // logger.log('CREATE USER!!')
    return new Promise(async function (resolve, reject) {
      try {
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(new_user.password, salt)
        new_user.password = hash
        let user = await new_user.save()
        resolve(user)
      } catch (err) {
        reject(err)
      }
    });
  }
// }
