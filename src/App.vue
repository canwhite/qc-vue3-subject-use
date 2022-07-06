<template>
  <HelloWorld  :appSubject="appSubject" :rappSubject="rappSubject"/>
  <p><button @click="sendData">父传子</button> </p>
  <p>接收子类传过来的值:{{test}}</p>
</template>

<script  setup>
import HelloWorld from './components/HelloWorld.vue'
import {BehaviorSubject} from "rxjs"
import {skipWhile} from "rxjs/operators"
import {ref,onUnmounted} from "vue"

onUnmounted(()=>{
  subs.value.forEach((item)=>{
    item.unsubscribe();
  })
  
})
//subject
const appSubject = ref(new BehaviorSubject({}));
const rappSubject = ref(new BehaviorSubject({}));
const subs = ref([]);
const test = ref("");

function  sendData() {
  appSubject.value.next({
    msg:"hello world"
  })
}

//接收子类传过来的值
const sub = rappSubject.value.pipe(skipWhile(val=>val===null)).subscribe(res=>{
  test.value = res.data;
})
subs.value.push(sub);


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
