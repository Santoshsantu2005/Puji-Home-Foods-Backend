const mongoose = require('mongoose')
require('dotenv').config()

const Product = require('./models/Product')

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected!')

  const products = await Product.find()

  for (let p of products) {
    // Extract just the filename from the full URL
    const filename = p.image.split('/images/')[1]
    p.image = `/images/${filename}`
    await p.save()
    console.log(`Fixed: ${p.name} → ${p.image}`)
  }

  console.log('All done!')
  mongoose.disconnect()
}

fixImages()