<template>
  <div class="hello">
    <p> ---------- start ------------ </p>
    <p>接收父类传过来的值：{{msg}}</p>
    <p><button @click="send">子传父</button></p>
    <p>----------- end -------------- </p>
  </div>
</template>

<script setup>
import {defineProps,onUnmounted,ref} from "vue"
import {skipWhile} from "rxjs/operators"
onUnmounted(()=>{
  subs.value.forEach((item)=>{
    item.unsubscribe();
  })
})

const msg = ref("");

//在项目中使用
const props = defineProps(["appSubject","rappSubject"]);
const subs = ref([]);

const sub = props.appSubject.pipe(skipWhile(val=>val===null)).subscribe(res=>{
  msg.value = res.msg;
})
subs.value.push(sub);

//子传父
function send(){
  props.rappSubject.next({
    data:"123"
  })
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
