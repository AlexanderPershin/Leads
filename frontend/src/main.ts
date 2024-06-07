import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import STable from '@surely-vue/table'
import 'ant-design-vue/dist/reset.css';
import '@surely-vue/table/dist/index.less';
import './style.css'
import App from './App.vue'

createApp(App).use(Antd).use(STable).mount('#app')
