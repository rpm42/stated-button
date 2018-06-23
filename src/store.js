import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

const state = {
  state: 'init'
}

const mutations = {
  SET_STATE(state, value) {
    Vue.set(state, 'state', value)
  }
}

const actions = {
  setState({ commit }, newState) {
    commit('SET_STATE', newState)
  }
}

export default new Store({
  state,
  mutations,
  actions
})
