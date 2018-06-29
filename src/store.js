import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

const state = {
  input: {
    state: 'INIT',
    data: {}
  }
}

const mutations = {
  SET_STATE(state, value) {
    Vue.set(state, 'button', value)
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
