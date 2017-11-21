import Vue from "vue";
import { setInterval } from "timers";
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
    actionType: "login",
    formData: {
      username: "",
      userpassword: "",
      date: howTime()
    },
    currentUser: null,
    newtodo: "",
    todoList: []
  },

  created: function() {
    this.currentUser = this.getUser();
    console.log(this.currentUser)
    this.formData.username = this.currentUser.username;
    this.fetchTodo()
     window.onbeforeunload = () => {
    // let datanew = JSON.stringify(this.newtodo);
    // window.localStorage.setItem("new", datanew);
    // window.localStorage.setItem("mytodo", dataString);
    };
    // let oldnew = window.localStorage.getItem("new");
    // let oldnew1 = JSON.parse(oldnew);
    // let oldDatastring = window.localStorage.getItem("mytodo");
    // let oldData = JSON.parse(oldDatastring);
    // this.todoList = oldData;
    // this.newtodo = oldnew1;
    // this.currentUser = this.getUser();
  },
  methods: {
    fetchTodo:function(){
    if (this.currentUser) {
      var query = new AV.Query("Todolist");
      query.find().then(todos => {
        console.log(todos);
        let Alltodo = todos[0];
        let id = Alltodo.id;
        console.log(Alltodo.username)
         this.formData.username = this.currentUser.username;
        this.todoList = JSON.parse(Alltodo.attributes.content);
        this.todoList.id = id;
        console.log(this.todoList.id);
      }), function(error) {
          //         console.log(cuole)
        };
    }
    },
    Update:function(){
        let dataString = JSON.stringify(this.todoList);
        var todo = AV.Object.createWithoutData("Todolist", this.todoList.id);
        todo.set("content", dataString);
        todo.save().then(()=>{
          console.log("更新成功")
        }
      );
    },

    saveOrUpdate:function(){
      if (this.todoList.id) {
        this.Update()
      } else {
        this.getTodo();
      }
    },

    getTodo: function() {
      let dataString = JSON.stringify(this.todoList);
      var TodoFolder = AV.Object.extend("Todolist");
      var todoFolder = new TodoFolder();
      var acl = new AV.ACL();
      acl.setWriteAccess(AV.User.current(), true);
      acl.setReadAccess(AV.User.current(), true);
      todoFolder.set("content", dataString);
      todoFolder.setACL(acl);
      todoFolder.save().then((todo) =>{
        alert("111111")
        this.todoList.id = todo.id;
        console.log(this.todoList.id);
      }, function(error) {
          console.error(error);
        });
    },

    greet: function() {
      this.todoList.push({
        title: this.newtodo,
        createdAt: howTime(),
        done: false
      });
      this.saveOrUpdate();
      this.newtodo = "";
    },

    removetodo: function() {
      let index = this.todoList.indexOf(this.todo);
      this.todoList.splice(index, 1);
      this.saveOrUpdate();
    },

    signUp: function() {
      var user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.userpassword);
      user.signUp().then((loginedUser) => {
        this.currenrUser = this.getUser();
      },
      function(error) {
        alert("用户名已存在~");
      });
    },

    login: function() {
      var user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.userpassword);
      AV.User
        .logIn(this.formData.username, this.formData.userpassword)
        .then(
          (loginedUser) => {
            // console.log(1);
            this.currentUser = this.getUser();
             this.fetchTodo();
          },
          function(error) {
            alert("用户名不存在或密码错误~");
          }
        );
    },
    loginout: function() {
      window.location.reload();
      AV.User.logOut()
      this.currentUser = null;
    },


    getUser: function() {
      let current = AV.User.current();
      if (current) {
        let { id, createdAt, attributes: { username } } = current;
        return { id, username, createdAt };
      } else {
        return null;
      }
    }
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
