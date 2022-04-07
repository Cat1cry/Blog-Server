const express = require('express')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')
const jwt = require('jsonwebtoken');
const app = express()


app.use(express.static(path.join(__dirname, './public')));
app.use(express.json())
mongoose.connect('mongodb://localhost:27017/blog-admin')
app.use(require('cors')())

// 创建文章数据库模型
const Article = mongoose.model('Article', new mongoose.Schema({
  title: {
    type: String
  },
  body: {
    type: String
  },
  time: {
    type: String
  },
  class: {
    type: String
  }
}))

// 创建用户数据库模型
const User = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  }
}))

// 创建留言板数据库模型
const Message = mongoose.model('Message', new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  text: {
    type: String
  },
  time: {
    type: String
  }
}))



const SECRET = 'katoumegumi'


app.get('/api/users', async (req, res) => {
  const list = await User.find()
  res.send(list)
})

// 注册接口
app.post('/api/reg', async (req, res) => {
  const user = await User.create(req.body)
  console.log(user);
})


// 登录接口
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      message: "用户名不存在",
    })
  }
  const isPasswordValid = (user.password == req.body.password)
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    res.status(422).send({
      message: "密码错误",
    })
  }
  const token = jwt.sign({
    id: String(user._id),
  }, SECRET)
  res.send({
    user,
    token: token
  })
})


// 添加留言
app.post('/api/message/add', async (req, res) => {
  const message = await Message.create(req.body)
  res.send(message)
})

// 查询留言
app.get('/api/message/find', async (req, res) => {
  const message = await Message.find()
  res.send(message)
})
// 删除留言
app.delete('/api/message/del/:id', async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id)
  res.send({
    status: true
  })
})

app.get('/', async (req, res) => {
  res.send('index')
})

// 新增文章
app.post('/api/articles', async (req, res) => {
  const article = await Article.create(req.body)
  res.send(article)
})

// 文章列表
app.get('/api/articles', async (req, res) => {
  const articles = await Article.find()
  res.send(articles)
})

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.send({
    status: true
  })
})

// 文章搜索
app.get('/api/articles/search/:search', async (req, res) => {
  const article = await Article.find({
    $or: [{
        title: {
          $regex: req.params.search
        }
      },
      {
        body: {
          $regex: req.params.search
        }
      }
    ]
  })
  res.send(article)
})
// 文章分类
app.get('/api/articles/class/:search', async (req, res) => {
  const article = await Article.find({
    $or: [{
      class: {
        $regex: req.params.search
      }
    }]
  })
  res.send(article)
})

// 文章详情
app.get('/api/articles/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.send(article)
})

// 修改文章
app.put('/api/articles/:id', async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body)
  res.send(article)
})




// Markdown图片添加

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './public/resource'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
}).single('imgFile');


app.post('/api/upload_images', function (req, res) {
  upload(req, res, function (err) {
    console.log('-----------------开始上传------------------');
    if (err) {
      console.log(err);
      res.writeHead(404);
      res.end(err.message);
      return
    }
    let url = 'http://' + req.headers.host + '/resource/' + req.file.originalname
    res.writeHead(200);
    res.end(JSON.stringify({
      'url': url
    }));
    console.log('-----------------上传完成------------------');
    console.log('-----------------文件信息: ');
    console.log(req.file ? req.file : '文件错误');
  })
})





app.listen(3001, () => {
  console.log('http://localhost:3001');
})