const db = require('../../models')
const adminService = require('../../services/adminService')
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
   adminService.getRestaurants(req, res, (data) => {
     return res.json(data)
   })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = adminController