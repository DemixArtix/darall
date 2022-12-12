import IListItem from "interfaces/IListItem";

export default {
  namespaced: true,
  state: {
    menu: [] as IListItem[]
  },
  getters: {
    menu: ({menu}: any) => menu,
  },
  mutations: {
    SET_MENU(state: any, menu: IListItem[]) {
      state.menu = menu
    },
  },
  actions: {
    async getMenu({ dispatch, state, commit }: any) {
      await dispatch('api', {
        url: '/menu',
        action: 'get',
      }, {root: true}).then((res: any) => {
        commit('SET_MENU', res.menu as IListItem[])
      })
    },
  },
}