import { createStore } from 'vuex'
import api from 'api/index'

import user from "./user"
import menu from "./menu"
import editor from "./editor"

export default createStore({
  modules: {
    user,
    menu,
    editor,
  },
  state: {
    inited: false as boolean,
    loader: false as boolean,
  },
  getters: {
    inited: ({inited}) => inited,
    loader: ({loader}) => loader,
  },
  mutations: {
    loader(state, bool) {
      state.loader = bool
    },
  },
  actions: {
    init({ dispatch, state }) {
      dispatch('user/init')
      state.inited = true
    },
    async api({ getters }, { params, url = 'orders', body ,action = 'post', headers, skipAuth = false, resField = 'data'}) {
      const options = {
        method: action,
        url,
        params: {
          ...params
        },
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        skipAuth,
        data: body,
      }

      // @ts-ignore
      return await api(options).then(res => resField === 'body' ? res : res[resField]);
    },
  },

})
