import Vue from 'vue'
import Vuex from 'vuex'
import storage from './storage'
import { abilityPlugin, ability as appAbility } from './ability'
import notifications from './notifications'
import articles from './articles'
import http from '../services/http'

Vue.use(Vuex)

export const ability = appAbility

export const store = new Vuex.Store({
  plugins: [
    storage({
      storedKeys: ['token', 'rules'],
      destroyOn: ['destroySession']
    }),
    abilityPlugin
  ],

  modules: {
    notifications,
    articles
  },

  state: {
    token: '',
    rules: [],
    pageTitle: 'CASL + VUE + VUEX + REST API'
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
      http.token = session.token
    },

    destroySession(state) {
      state.token = ''
      state.rules = []
    }
  },

  actions: {
    login({ commit }, details) {
      return http('/session', { method: 'POST', body: JSON.stringify(details) })
        .then(response => commit('createSession', response.body))
    },

    logout({ commit }) {
      commit('destroySession')
    },

    setTitle({ state }, value) {
      state.pageTitle = value
    }
  }
})

http.token = store.state.token
http.onError = response => {
  if (response.status === 403) {
    store.dispatch('notifications/error', response.body.message)
    return true
  }
}
