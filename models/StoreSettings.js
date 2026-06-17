const mongoose = require('mongoose')

const StoreSettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'PUJI HOME FOODS'
  },
  email: String,
  phone: String,
  address: String
})

module.exports = mongoose.model(
  'StoreSettings',
  StoreSettingsSchema
)