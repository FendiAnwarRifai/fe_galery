import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    createAlbums (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_BASE_URL}/albums/create`, payload)
          .then(res => {
            const result = res
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  modules: {
  }
})
