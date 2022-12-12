import Cookies from 'js-cookie'
import Vue from 'vue'
import router from "../../router";
import {
  accessTokenReq,
  refreshTokenReq,
  getAccessToken,
  getRefreshToken
} from 'api/user';

import IUser from "interfaces/IUser";

export default {
  namespaced: true,
  state: {
    auth: {
      auth: null,
      loaded: false
    },
  },
  getters: {
    loaded({auth}: any) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (auth.loaded) {
            resolve(true)
            clearInterval(interval)
          }
        }, 100)
      })
    },
    auth: ({auth}: any) => auth.auth,
  },
  mutations: {

  },
  actions: {
    async init({state, dispatch}: any) {
      if(!Cookies.get('refresh_token')) {
        state.auth.loaded = true;
        state.auth.auth = false;
      } else {
        state.auth.loaded = true;
        state.auth.auth = true;
      }
    },
    async onLogin({ dispatch }: any, body: any) {
      let tokens = await accessTokenReq(body)
      if(tokens) {
        await Cookies.set('access_token', tokens.access_token, {
          expires: 120,
          sameSite: 'Strict',
          secure: location.protocol === 'https:'
        });
        await Cookies.set('refresh_token', tokens.refresh_token, {
          expires: 120,
          sameSite: 'Strict',
          secure: location.protocol === 'https:'
        });
        router.push({name: 'editor'})
      }
    },
    async onRegister({ dispatch }: any, body: IUser) {
      await dispatch('api', {
        url: '/register',
        body,
        resField: 'body',
        action: 'post',
      }, {root: true}).then((res: any) => {
        console.log(res)
        if(res.status === 201) {

          router.push({name: 'login'})
        }
      })
    },
    async authRefresh({ state, commit, dispatch }: any) {
      try {
        const { access_token, refresh_token } = await refreshTokenReq();
        Cookies.set('access_token', access_token, {
          expires: 120,
          sameSite: 'Strict',
          secure: location.protocol === 'https:'
        });
        Cookies.set('refresh_token', refresh_token, {
          expires: 120,
          sameSite: 'Strict',
          secure: location.protocol === 'https:'
        });
        return access_token;
      } catch (e) {
        dispatch('logOut');
        return null
      }
    },
    async logOut({state, state: {auth}}: any) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      state.user = null,
        auth.auth = false;
      await router.push({name: 'auth'})
    },
    async getDishes({state, commit, dispatch}: any) {
      try {
        const { items } = await dispatch('api', {
          url: 'posts',
          action: 'get',
        }, {root: true});
        state.posts = items ? items : [];
        console.log(items)
        return items
      } catch (error) {
        return null;
      }
    },
    async sendDish({state, commit, dispatch}: any, formData: any) {
      try {
        await dispatch('api', {
          url: 'posts',
          action: 'post',
          form: true,
          body: formData
        }, {root: true}).then((res: any) => {
          console.log(res)
        })
      } catch (error) {
        return null;
      }
    },
  }
}