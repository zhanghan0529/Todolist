import Vue from "../node_modules/vue/dist/vue";
import { setInterval } from "timers";

var app = new Vue({
  el: "#app",
  data: {
    newtodo: "",
    todoList: []
  },
  created: function() {
    window.onbeforeunload = () => {
      let datanew = JSON.stringify(this.newtodo)
      let dataString = JSON.stringify(this.todoList);
      window.localStorage.setItem("new",datanew);
      window.localStorage.setItem("mytodo", dataString);
    };
    let oldnew = window.localStorage.getItem("new")
    let oldnew1 = JSON.parse(oldnew)
    let oldDatastring = window.localStorage.getItem("mytodo");
    let oldData = JSON.parse(oldDatastring);
    this.todoList = oldData
    this.newtodo = oldnew1
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
    }
  }
});

function howTime(){
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