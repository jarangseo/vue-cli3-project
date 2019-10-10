import Axios from 'axios'
import { util, utilSpinner } from './util'
import _ from 'lodash'

export const axios = Axios.create({
  baseURL: '/v2',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})

export const axiosAnalytics = Axios.create({
  baseURL: '/v1',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})

export const axiosMap = Axios.create({
  baseURL: '/v2',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
})

axios.interceptors.request.use(config => {
  return config
  // if (util.sessionChecker()) {
  // } else {
  //   util.toastr().error('Your session has been expired.')
  //   throw new Error('After session expiration, request cannot be sent.')
  // }
})

axiosAnalytics.interceptors.request.use(req => {
  if (req.data) {
    const currencyRollback = JSON.stringify(req.data)
      .replace(/\(￦\)/g, '@currency:KRW')
      .replace(/\(￥\)/g, '@currency:JPY')
      .replace(/\(\$\)/g, '@currency:USD')
    req.data = JSON.parse(currencyRollback)
  }
  return req
})

axiosAnalytics.interceptors.response.use(res => {
  let currencyReplaced = JSON.stringify(res)
    .replace(/@currency:KRW/g, '(￦)')
    .replace(/@currency:JPY/g, '(￥)')
    .replace(/@currency:USD/g, '($)')
  return JSON.parse(currencyReplaced)
})

let enterGDCLoginPage = () => {
  let path = window.location.href
  if (path.indexOf('analytics.growthy.game.line.me') > -1) {
    window.location.href = `https://sign.game.line.me/auth/login?redirectUrl=${window.location.href}`
  } else {
    window.location.href = `https://sign.game.line-alpha.me/auth/login?redirectUrl=${window.location.href}`
  }
}
export const http = {
  _axios () {
    return axios
  },
  defaultErrCb (err) {
    if (err.response.status && (err.response.status === 401)) {
      // for gdc login
      enterGDCLoginPage()
      // for console login
      // window.location.href = `http://accounts.game.line-alpha.me/login?redirect_uri=${window.location.href}`
    } else if (err.response.status === 403) {
      enterGDCLoginPage()
    } else if (err.response.status === 500) {
      util.toastr().error('서버에서 처리도중 에러가 발생했습니다.')
    } else {
      util.toastr().error(err.response.data.message)
    }
  },
  oapResponseCb (res, successCb) {
    if (res.data.error) throw new Error(res.data.error.message)
    else successCb(res.data)
  },
  get (url, successCb, errCb = http.defaultErrCb) {
    this._axios().get(url).then(res => http.oapResponseCb(res, successCb)).catch(errCb)
  },
  post (url, body, successCb, errCb = http.defaultErrCb) {
    this._axios().post(url, body).then(res => http.oapResponseCb(res, successCb)).catch(errCb)
  },
  getPromise (url, params = {}) {
    let conf = {
      params: params
    }
    return new Promise((resolve, reject) => {
      this._axios().get(url, conf).then(res => {
        if (res.data.error) {
          util.toastr().error(res.data.error.message)
          if (utilSpinner.spinner) { utilSpinner.spinner.stop() }
          throw new Error(res.data.error.message)
        } else {
          resolve(res)
        }
      }).catch(err => {
        if (err.response.status && (err.response.status === 401)) {
          // for gdc login
          enterGDCLoginPage()
        } else if (err.response.status === 403) {
          enterGDCLoginPage()
        }

        if (reject) {
          reject(err)
        } else {
          http.defaultErrCb(err)
        }
      })
    })
  },
  postPromise (url, body, cancelToken) {
    return new Promise((resolve, reject) => {
      this._axios().post(url, body, cancelToken).then(res => {
        if (res.data.error) {
          util.toastr().error(res.data.error.message)
          if (utilSpinner.spinner) { utilSpinner.spinner.stop() }
          throw Error(res.data.error.message)
        } else {
          resolve(res)
        }
      }).catch(err => {
        if (reject) {
          reject(err)
        } else {
          http.defaultErrCb(err)
        }
      })
    })
  },
  postFormPromise (url, body) {
    return new Promise((resolve, reject) => {
      this._axios().post(url, body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        if (reject) {
          reject(err)
        } else {
          http.defaultErrCb(err)
        }
      })
    })
  },
  putPromise (url, body) {
    return new Promise((resolve, reject) => {
      this._axios().put(url, body).then(res => {
        if (res.data.error) {
          util.toastr().error(res.data.error.message)
          if (utilSpinner.spinner) { utilSpinner.spinner.stop() }
          throw new Error(res.data.error.message)
        } else {
          resolve(res)
        }
      }).catch(err => {
        if (reject) {
          reject(err)
        } else {
          http.defaultErrCb(err)
        }
      })
    })
  },
  deletePromise (url, params) {
    let conf = {
      params: params
    }
    return new Promise((resolve, reject) => {
      this._axios().delete(url, conf).then(res => {
        if (res.data.error) {
          util.toastr().error(res.data.error.message)
          if (utilSpinner.spinner) { utilSpinner.spinner.stop() }
          throw new Error(res.data.error.message)
        } else {
          resolve(res)
        }
      }).catch(err => {
        if (reject) {
          reject(err)
        } else {
          http.defaultErrCb(err)
        }
      })
    })
  }
}

export const httpMap = _.cloneDeep(http)
httpMap._axios = () => {
  return axiosMap
}

export const httpAnalytics = _.cloneDeep(http)
httpAnalytics._axios = () => {
  return axiosAnalytics
}
