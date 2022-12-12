// @/api/user.js
import api from './index';
import Cookies from 'js-cookie'

function processingCookies(cookie: any) {
  const cookieValue = Cookies.get(cookie);
  return cookieValue == 'undefined' || !cookieValue ? null : cookieValue;
}
let accessToken = processingCookies('access_token');
let refreshToken = processingCookies('refresh_token');

const getAccessToken = () => accessToken;
const getRefreshToken = () => refreshToken;

async function accessTokenReq({login, password}: any) {
  // @ts-ignore
  return await api({
    method: 'post',
    url: '/login',
    data: {
      login, password
    },
    skipAuth: true,
  }).then((res: any) => {
    const {data} = res;
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    return data;
  });

}

async function refreshTokenReq() {
  // @ts-ignore
  return await api({
    method: 'get',
    url: '/refresh',
    headers: {
      'x-refresh-token': refreshToken,
    },
    skipAuth: true,
  }).then(async (res: any) => {
    const {data} = res;
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    return data;
  });
}

export { accessTokenReq, refreshTokenReq, getAccessToken, getRefreshToken };