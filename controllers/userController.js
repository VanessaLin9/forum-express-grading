const bcrypt = require('bcryptjs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAndCountAll({
        where: { UserId: id },
        attributes: ['RestaurantId'],
        group: ['RestaurantId'],
        include: Restaurant,
        raw: true,
        nest: true
      })
    ])
    .then( data => {
      const [profile, comment] = data
      return res.render('profile', {
        profile: profile.toJSON(),
        commentCount: comment.count.length,
        commentRestaurant: comment.rows
      })
    })
    .catch(error => console.log(error))
  },

  editUser: (req, res) => {
    const id = Number(req.params.id)
    const  getUser = helpers.getUser(req)

    //排除進入別人的編輯頁面
    if (getUser.id !== id) {
      return res.redirect(`/users/${getUser.id}/edit`)
    }
    return User.findByPk(req.params.id)
    .then( user => {
      return res.render('editProfile')
    })
  },

  putUser: (req, res) => {
    const id = Number(req.params.id)
    const getUser = helpers.getUser(req)
    console.log(req.body.name)

    if (getUser.id !== id) {
      return res.redirect(`/users/${getUser.id}/edit`)
    }
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
   
    const {file} = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
      return User.findByPk(id)
      .then( (user) => {
        user.update({
          name: req.body.name,
          image: file ? img.data.link : user.image,
        })
      })
      .then( user => {
        req.flash('success_message', 'user profile was successfully to update')
        res.redirect(`/users/${id}`)
      })
      .catch(error => console.log(error))
      })
    } else {
      return User.findByPk(id)
      .then((user) => {
        user.update({
          name: req.body.name
        })
      })
      .then((user) => {
        req.flash('success_messages', 'user profile was successfully to update')
        res.redirect(`/users/${id}`)
      })
      .catch(error => console.log(error))
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  likeIt: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  disLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },
  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: (req, res) => {
 return Followship.create({
   followerId: req.user.id,
   followingId: req.params.userId
 })
  .then((followship) => {
    return res.redirect('back')
  })
},

removeFollowing: (req, res) => {
 return Followship.findOne({where: {
   followerId: req.user.id,
   followingId: req.params.userId
 }})
   .then((followship) => {
     followship.destroy()
      .then((followship) => {
        return res.redirect('back')
      })
   })
}
}

module.exports = userController