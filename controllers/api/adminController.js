const db = require('../../models')
const adminService = require('../../services/adminService')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {

  getRestaurants: (req, res) => {
   adminService.getRestaurants(req, res, (data) => { return res.json(data) })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => { return res.json(data) })
  },

   postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => { return res.json(data) })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => { return res.json(data) })
  },

    putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => { return res.json(data) })
  },
}
module.exports = adminController