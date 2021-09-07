const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ 
      raw: true,
      nest: true,
      include: [Category] 
    }).then(restaurants => {
      callback( { restaurants: restaurants })
    })
  }
}

module.exports = adminService