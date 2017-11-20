import Vue from "vue";
import { setInterval } from "timers";
import AV from "leancloud-storage";
var APP_ID = "S1iaURCy2FgNQ1kbgbav6H88-gzGzoHsz";
var APP_KEY = "6SwXnYDoVhaycC2vLBwJNc9D";

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
      date:howTime()
    },
    currentUser:null,
    newtodo: "",
    todoList: []
  },

  created: function() {
    window.onbeforeunload = () => {
      let datanew = JSON.stringify(this.newtodo);
      let dataString = JSON.stringify(this.todoList);
      window.localStorage.setItem("new", datanew);
      window.localStorage.setItem("mytodo", dataString);
    };
    let oldnew = window.localStorage.getItem("new");
    let oldnew1 = JSON.parse(oldnew);
    let oldDatastring = window.localStorage.getItem("mytodo");
    let oldData = JSON.parse(oldDatastring);
    this.todoList = oldData;
    this.newtodo = oldnew1;
     this.currentUser = this.getUser();
  },
  methods: {
    greet: function() {
      this.todoList.push({
        title: this.newtodo,
        createdAt: howTime(),
        done: false
      });
      this.newtodo = "";
    },

    removetodo: function() {
      let index = this.todoList.indexOf(this.todo);
      this.todoList.splice(index, 1);
    },

    signUp: function() {
      var user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.userpassword);
      user.signUp().then(
        (loginedUser)=> {
          this.currenrUser = this.getUser();
        },
        function(error) {
          alert('用户名已存在~');
        }
      );
    },
    login: function() {
      var user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.userpassword);
      AV.User.logIn(this.formData.username, this.formData.userpassword).then(
        (loginedUser) =>{
          console.log(1)
           this.currentUser = this.getUser();
        },        
        function(error) {
          alert('用户名不存在或密码错误~');
        }
      );
    },
    loginout:function(){
      AV.User.logOut();
      this.currentUser =null;
    },
    getUser:function(){
      let current = AV.User.current();
      if(current){
       let  {id,createdAt,attributes: {username}}=current
        return {id,createdAt,attributes: {username}} ;
      }else{
        return null
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
