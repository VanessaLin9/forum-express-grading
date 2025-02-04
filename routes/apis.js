const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)

router.get('/admin/categories',  categoryController.getCategories)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)

//後台修改個別餐廳
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)

//後台新增類別
router.post('/admin/categories', categoryController.postCategory)

//後台修改類別
router.put('/admin/categories/:id', categoryController.putCategory)

//管理者刪除分類
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router