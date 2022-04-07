# 博客项目后端接口
  
## 使用之前请先 ```npm install``` 安装项目所需依赖

## API本地url: ```http://localhost:3001/api/```

## User API
### user数据库模型:
调用时需要上传两个参数：
```
Username : {
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  }
}
```
### API：

#### 注册：
POST ```http://localhost:3001/api/reg```  接收*username password* 

#### 登录：
POST ```http://localhost:3001/api/login``` 

接受到*username password*后，先根据*username*在数据库中寻找是否有该*username*，如果没有则返回状态码422并返回消息提示**用户名不存在**,如果有该*username*则校验*password*是否正确；不正确返回状态码422并返回消息提示**密码错误**；正确则返回token给前端


***

## 留言板API
### Message数据库模型
```
name: {               留言人ID
    type: String
  },
  email: {            留言人邮箱
    type: String
  },
  text: {             留言内容
    type: String
  },
  time: {             留言时间
    type: String
  }
```

### API

#### 添加留言
POST ```http://localhost:3001/api/message/add```

#### 查询留言
GET ```http://localhost:3001/api/message/find```

#### 删除留言
DELETE ```http://localhost:3001/api/message/del/:id```

*:id* 为占位符，接受前端传过来的要删除留言的id，然后根据id查找留言并删除

## 文章API
### 文章数据库模型
```
  title: {          文章标题
    type: String
  },
  body: {           文章内容
    type: String
  },
  time: {           文章发布时间
    type: String
  },
  class: {          文章类别
    type: String
  }
```

### API
#### 添加文章

POST ```http://localhost:3001/api/articles```

#### 查询所有文章

GET ```http://localhost:3001/api/articles```

#### 删除文章

DELETE ```http://localhost:3001/api/articles/:id```

*:id* 为占位符，接收前端传过来的要删除文章的id，然后根据id查找文章并删除

#### 搜索文章

GET ```http://localhost:3001/api/articles/search/:search```

*:search* 为占位符，接收前端传过来的搜索内容，然后根据搜索内容在*title body*中搜索

#### 文章分类

GET ```http://localhost:3001/api/articles/class/:search```

*:search* 为占位符，接收前端传过来的分类id，然后查找符合该id的文章

#### 文章详情

GET ```http://localhost:3001/api/articles/:id```

*:id* 为占位符，接收前端传过来的文章id，然后查找符合该id的文章

#### 文章修改

PUT ```http://localhost:3001/api/articles/:id```

*:id* 为占位符，接收前端传过来的文章id，然后查找符合该id的文章，并保存在数据库


## Mavon-edit 上传图片接口
### 为Mavon-dit组件中编辑Markdown是上传图片所用接口

#### 文章修改

POST ```http://localhost:3001/api/upload_images```

上传图片到 `/public/resource`目录，上传成功之后将该图片的链接返回到markdown中 (需要设置静态资源目录)



