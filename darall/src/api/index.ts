import axios from 'axios'
import config from './config'
import store from 'store/index';
import router from 'router/index';
import { getAccessToken, getRefreshToken } from './user';
import { KJUR } from 'jsrsasign';

const api = axios.create({
  baseURL: config.baseURL,
  //withCredentials: true,
  // errors with code status less than 500 are handled at the front
  validateStatus: (status) => status < 500,
});


// запросить валидный аксесс токен
async function requestValidAccessToken() {
  // first we remember the current accessToken from the storage
  let accessToken = getAccessToken();
  let refreshToken = getRefreshToken();
  // bringing the current time to unix timestamp
  const now = Math.floor(Date.now() * 0.001);

  if(accessToken) {
    const {
      // @ts-ignore
      payloadObj: { exp: accessTokenExpires },
    } = KJUR.jws.JWS.parse(accessToken);

    if(!refreshToken) {
      await store.dispatch('user/logOut');
    } else if(now > accessTokenExpires) {
      accessToken = await store.dispatch('user/authRefresh');
    }

    return accessToken;
  }

  return null

}

// processing the request before sending
api.interceptors.request.use(async (config: any) => {
  // if the skipAuth flag is specified, we skip the request further as is
  // this flag is specified for the login and refreshToken methods, they are not supported by tokens

  if (config.skipAuth) {
    return config;
  }

  // // otherwise, we request a valid accessToken
  const accessToken = await requestValidAccessToken();

  // and return the patched config from the tokens in the header
  if(accessToken) {
    return {
      ...config,
      headers: {
        'x-access-token': accessToken
      },
    };
  } else {
    return config
  }

});

// processing the request before processing the response from the server
api.interceptors.response.use(
  // everything gets here that is validated by a successful response status < 500
  (response: any) => {
    const {
      data: { errors },
      config: { skipErrors },
      status,
    } = response;

    // if 401 came, we log out the user
    // if 403 has arrived, we transfer it to the main page in the admin panel
    if (status === 403) {
      //@ts-ignore
      if(router.currentRoute.name !== 'menu') {
        router.push({name: 'menu'})
      }
    } else if (status === 401) {
      store.dispatch('user/logOut');
    } else if (errors && !skipErrors) {
      // showing server errors for the front, if there are no instructions to skip their output
      console.log(errors)
    }

    return response;
  },
  (error) => Promise.reject(error),
);

export default api ;