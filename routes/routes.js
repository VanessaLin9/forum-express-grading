const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const express = require('express');
const router = express.Router();
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')



  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

  //各分頁處理
  router.get('/restaurants', authenticated, restController.getRestaurants)
  router.get('/restaurants/feeds', authenticated, restController.getFeeds)
  router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
  router.get('/users/top', authenticated, userController.getTopUser) //美食達人

  // 連到 /admin 頁面就轉到 /admin/restaurants
  router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  // 管理者新增餐廳
  router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  //管理者瀏覽一筆餐廳
  router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  //管理者編輯一家餐廳
  router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  //管理者刪除一家餐廳
  router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  //管理者查看使用者清單
  router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  //管理者修改使用者權限
  router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  //管理者瀏覽分類
  router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

  //管理者新增編輯分類
  router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  //管理者刪除分類
  router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //前台瀏覽個別餐廳
  router.get('/restaurants/:id', authenticated, restController.getRestaurant)
  router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

  //前台新增刪除最愛
  router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
  router.post('/like/:restaurantId', authenticated, userController.likeIt)
  router.delete('/like/:restaurantId', authenticated, userController.disLike)

  //前台新增餐廳評論
  router.post('/comments', authenticated, commentController.postComment)

  //管理者刪除評論
  router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //個人頁面管理
  router.get('/users/:id', authenticated, userController.getUser)
  router.get('/users/:id/edit', authenticated, userController.editUser)
  router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  //追蹤功能
  router.post('/following/:userId', authenticated, userController.addFollowing)
  router.delete('/following/:userId', authenticated, userController.removeFollowing)


  router.get('/signup', userController.signUpPage)
  router.post('/signup', userController.signUp)

  router.get('/signin', userController.signInPage)
  router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  router.get('/logout', userController.logout)

module.exports = router