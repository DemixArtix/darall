import ICategory from "interfaces/ICategory";
import IDish from "interfaces/IDish";
import IListItem from "interfaces/IListItem";

export default {
  namespaced: true,
  state: {
    activeCategory: null as null | number,
    list: [] as IListItem[]
  },
  getters: {
    list: ({list}: any) => list,
  },
  mutations: {
    ADD_CATEGORY(state: any, category: IListItem) {
      category.dishes = [];
      state.list.unshift(category);
    },
    REMOVE_CATEGORY(state: any, id: number) {
      state.list.splice(state.list.findIndex((category: ICategory) => category.id === id), 1)
    },
    ADD_DISH(state: any, dish: IDish) {
      for(let i in state.list) {
        if(state.list[i].id == dish.categoryId) {
          state.list[i].dishes.unshift(dish);
          break
        }
      }
    },
    REMOVE_DISH(state: any, {id, categoryId}: {id: number, categoryId: number} ) {

      for(let i in state.list) {
        if(state.list[i].id == categoryId) {
          for(let j in state.list[i].dishes) {
            if(state.list[i].dishes[j].id == id) {
              state.list[i].dishes.splice(j, 1);
              break
            }
          }
          break
        }
      }

/*      state.categories.forEach((category: IListItem, index: number) => {
        if(category.id != categoryId) return;
        category.dishes.forEach((dish: IDish, dishIndex: number) => {
          if(dish.id != id) return;
          state.categories[index].dishes.splice(dishIndex, 1)
        })
      })*/
    },
    SET_ACTIVE_CATEGORY(state: any, id: number) {
      state.activeCategory = id
    },
    SET_DISHES_LIST(state: any, list: IListItem[]) {
      state.list = list
    },
  },
  actions: {
    async onCreateCategory({ commit, dispatch }: any, form: { title: string }) {
      return await dispatch('api', {
        url: '/categories',
        body: form,
        action: 'post',
        resField: 'body'
      }, {root: true}).then((res: any) => {
        commit('ADD_CATEGORY', res.data.category as ICategory)
        return res.status === 201
      }).catch((err: any) => {
        console.log(err)
        return false
      })
    },
    async onRemoveCategory({ commit, dispatch }: any, id: number ) {
      await dispatch('api', {
        url: '/categories',
        params: {
          id
        },
        action: 'delete',
        resField: 'body'
      }, {root: true}).then((res: any) => {
        commit('REMOVE_CATEGORY', id)
      })
    },
    async setActiveCategory({ commit, dispatch }: any, id: number ) {
      commit('SET_ACTIVE_CATEGORY', id)
    },
    async onAddDish({ commit, dispatch }: any, form: IDish) {
      return await dispatch('api', {
        url: '/dish',
        body: form,
        action: 'post',
        resField: 'body'
      }, {root: true}).then((res: any) => {
        commit('ADD_DISH', res.data.dish as IDish)
        return res.status === 201
      }).catch((err: any) => {
        console.log(err)
        return false
      })
    },
    async onRemoveDish({ commit, dispatch }: any,
                       {id, categoryId}: {id: number, categoryId: number} ) {
      await dispatch('api', {
        url: '/dish',
        params: {
          id
        },
        action: 'delete',
        resField: 'body'
      }, {root: true}).then((res: any) => {
        commit('REMOVE_DISH', {id, categoryId})
      })
    },
    async getDishesList({ dispatch, state, commit }: any) {
      await dispatch('api', {
        url: '/dish',
        action: 'get',
      }, {root: true}).then((res: any) => {
        commit('SET_DISHES_LIST', res.list as IListItem[])
      })
    },
  },
}