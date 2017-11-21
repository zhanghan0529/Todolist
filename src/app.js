import Vue from "vue";
import AV from "leancloud-storage";
var APP_ID = "CC0a4InFWTatKF6PoPgm5hsW-gzGzoHsz";
var APP_KEY = "lE5Pic3Gl2DNqfUQwqXiCd4X";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var app = new Vue({
  el: "#app",
  data: {
    current2: 0,
    actionType: true,
    formData: {
      username: "",
      password: "",
      date: howTime()
    },
    currentUser: null,
    newtodo: "",
    todoList: []
  },

  created: function() {
    this.currentUser = this.getUser();
    this.formData.username = this.currentUser.username;
    this.renderTodo();
  },
  methods: {
    clogin: function() {
      this.actionType = true;
      this.current2 = 0;
    },
    csignUp: function() {
      this.actionType = false;
      this.current2 = 1;
    },
    login: function() {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      AV.User
        .logIn(this.formData.username, this.formData.password)
        .then(
          loginedUser => {
            this.currentUser = this.getUser();
            this.renderTodo();
            console.log(1);
          },
          function(error) {
            alert("账号或者密码错误~");
          }
        );
    }, //用户登陆
    signUp: function() {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then(
        loginedUser => {
          alert("注册成功~");
          // this.currentUser = this.getUser();
        },
        error => {
          alert("用户名已存在~");
        }
      );
    }, //用户注册
    getUser: function() {
      let current = AV.User.current();
      if (current) {
        let { id, createdAt, attributes: { username } } = current;
        return { id, username, createdAt };
      } else {
        return null;
      }
    }, //获取登录成功用户信息
    loginout: function() {
      window.location.reload();
      AV.User.logOut();
      this.currentUser = null;
    }, //登出
    addTodo: function() {
      if (this.newtodo == "") {
        alert("请输入待办事项");
      } else {
        this.todoList.push({
          title: this.newtodo,
          createdAt: howTime(),
          done: false
        });
        this.saveOrUpdate();
        this.newtodo = "";
      }
    }, //添加事件
    removeTodo: function() {
      let index = this.todoList.indexOf(this.todo);
      this.todoList.splice(index, 1);
      this.saveOrUpdate();
    }, //删除事件
    saveTodo: function() {
      let dataString = JSON.stringify(this.todoList);
      var TodoFolder = AV.Object.extend("Todolist");
      var todoFolder = new TodoFolder();
      var acl = new AV.ACL();
      acl.setWriteAccess(AV.User.current(), true); //设置用户权限
      acl.setReadAccess(AV.User.current(), true);
      todoFolder.set("content", dataString);
      todoFolder.setACL(acl);
      todoFolder.save().then(todo => {
        this.todoList.id = todo.id;
        console.log(this.todoList.id);
      });
    }, //用户存储事件
    upDate: function() {
      let dataString = JSON.stringify(this.todoList);
      var todo = AV.Object.createWithoutData("Todolist", this.todoList.id);
      todo.set("content", dataString);
      todo.save().then(() => {
        console.log("更新成功");
      });
    }, //用户更新列表
    saveOrUpdate: function() {
      if (this.todoList.id) {
        this.upDate();
      } else {
        this.saveTodo();
      }
    }, //判断用户储存列表是否存在，存在则更新
    renderTodo: function() {
      if (this.currentUser) {
        var query = new AV.Query("Todolist");
        query.find().then(todos => {
          let Alltodo = todos[0];
          let id = Alltodo.id;
          this.todoList = JSON.parse(Alltodo.attributes.content);
          this.todoList.id = id;
        }),
          function(error) {
            console.log(cuole);
          };
      }
    }//用户登陆后，获取该用户的事件列表
  }
});

function howTime() {
  let date = new Date();
  // let day = date.getDate(),
  //  month = date.getMonth(),
  //  hours = date.getHours(),
  //  min = date.getMinutes(),
  //  years = date.getFullYear();
  var mytime = date.toLocaleTimeString(); //获取当前时间
  return date.toLocaleString();
  // years+"/"+month+'/'+day+'/'+hours+':'+min;
}
