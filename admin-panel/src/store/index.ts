import { createStore } from 'vuex'
import authModule from './modules/auth'

export default createStore({
  modules: {
    auth: authModule
  }
})
