import { createApp } from 'vue'
import App from './App.vue'
import {BehaviorSubject} from "rxjs"


const app = createApp(App);
app.config.globalProperties.$eventBus = new BehaviorSubject({}); 

app.mount('#app')
