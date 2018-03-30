import Vue from 'vue'
import Vuex from 'vuex'
import storage from './storage'

Vue.use(Vuex)

const API_URL = 'http://localhost:3000/api'
let COUNTER = 0

function http(url, options) {
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  }).then(response => {
    return response.json().then(body => ({
      body,
      status: response.status
    }))
  }).then(response => {

    if (response.status >= 200 && response.status < 300) {
      return response
    }

    throw new Error(response.body.message || response.body.errors.join('\n'))
  })
}

export default new Vuex.Store({
  plugins: [
    storage({
      storedKeys: ['token', 'rules'],
      destroyOn: ['destroySession']
    })
  ],

  state: {
    token: '',
    rules: [],
    notifications: []
  },

  getters: {
    isLoggedIn(state) {
      return !!state.token
    }
  },

  mutations: {
    createSession(state, session) {
      state.token = session.token
      state.rules = session.rules
    },

    destroySession(state) {
      state.token = ''
      state.rules = []
    },

    addNotification(state, message) {
      state.notifications.push(message)
    },

    removeNotification(state, message) {
      state.notifications = state.notifications.filter(m => m !== message)
    }
  },

  actions: {
    login({ commit }, details) {
      return http(`${API_URL}/session`, { method: 'POST', body: JSON.stringify(details) })
        .then(response => {
          commit('createSession', response.body)
          return response.body
        })
    },

    logout({ commit }) {
      commit('destroySession')
    },

    notify({ commit }, message) {
      commit('addNotification', {
        timeout: 3000,
        type: 'info',
        ...message,
        id: ++COUNTER
      })
    },

    removeNotification({ commit }, message) {
      commit('removeNotification', message)
    },

    getArticles() {
      return http(`${API_URL}/articles`)
        .then(response => response.body.items)
    }
  }
})
