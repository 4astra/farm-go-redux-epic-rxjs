import Toast from 'react-native-root-toast';
import HttpError from 'standard-http-error';

var EventEmitter = require('event-emitter');
const TIMEOUT = 6000;
const errors = new EventEmitter()

/**
 * GET a path relative to API root url.
 * @param {String}  path Relative path to the configured API endpoint
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise} of response body
 */
export async function get(path: string, suppressRedBox?: boolean | true): Promise<any> {
  return bodyOf(request('get', path, null, suppressRedBox))
}

/**
 * POST JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function post(path: string, body: any, suppressRedBox?: boolean | true): Promise<any> {
  return bodyOf(request('post', path, body, suppressRedBox))
}

/**
 * PUT JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function put(path: string, body: any, suppressRedBox?: boolean | true): Promise<any> {
  return bodyOf(request('put', path, body, suppressRedBox))
}

/**
 * DELETE a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function del(path: string, suppressRedBox?: boolean | true): Promise<any> {
  return bodyOf(request('delete', path, null, suppressRedBox))
}

/**
 * Make arbitrary fetch request to a path relative to API root url
 * @param {String} method One of: get|post|put|delete
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 */
export async function request(method: string, path: string, body: any, suppressRedBox?: boolean | true) {
  try {
    const response = await sendRequest(method, path, body)
    return handleResponse(
      path,
      response
    )
  }
  catch (error) {
    if (!suppressRedBox) {
      logError(error, url(path), method)
    }
    throw error
  }
}

/**
 * Takes a relative path and makes it a full URL to API server
 */
export function url(path: string) {
  // const apiRoot = getConfiguration('API_ROOT')
  // return path.indexOf('/') === 0
  //   ? apiRoot + path
  //   : apiRoot + '/' + path
  return path
}

/**
 * Constructs and fires a HTTP request
 */
async function sendRequest(method: string, path: string, body: any) {

  try {
    const endpoint = url(path)
    const headers = getRequestHeaders(body, undefined)
    const options = body
      ? { method, headers, body: JSON.stringify(body) }
      : { method, headers }

    return timeout(fetch(endpoint, options), TIMEOUT)
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * Receives and reads a HTTP response
 */
async function handleResponse(path: string, response: any) {
  try {
    const status = response.status

    // `fetch` promises resolve even if HTTP status indicates failure. Reroute
    // promise flow control to interpret error responses as failures
    if (status >= 400) {
      const message = await getErrorMessageSafely(response)
      const error = new HttpError(status, message)

      // emit events on error channel, one for status-specific errors and other for all errors
      errors.emit(status.toString(), { path, message: error.message })
      errors.emit('*', { path, message: error.message }, status)

      throw error
    }

    // parse response text
    const responseBody = await response.text()
    return {
      status: response.status,
      headers: response.headers,
      body: responseBody ? JSON.parse(responseBody) : null
    }
  } catch (e) {
    throw e
  }
}

function getRequestHeaders(body: any, token: string | undefined) {
  const headers = body
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    : { 'Accept': 'application/json' }

  if (token) {
    return { ...headers, Authorization: token }
  }

  return headers
}

// try to get the best possible error message out of a response
// without throwing errors while parsing
async function getErrorMessageSafely(response: any) {
  try {
    const body = await response.text()
    if (!body) {
      return ''
    }

    // Optimal case is JSON with a defined message property
    const payload = JSON.parse(body)
    if (payload && payload.message) {
      return payload.message
    }

    // Should that fail, return the whole response body as text
    return body

  } catch (e) {
    // Unreadable body, return whatever the server returned
    return response._bodyInit
  }
}

/**
 * Rejects a promise after `ms` number of milliseconds, it is still pending
 */
function timeout(promise: Promise<Response>, ms: number) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise
      .then(response => {
        clearTimeout(timer)
        resolve(response)
      })
      .catch(reject)
  })
}

async function bodyOf(requestPromise: any) {
  try {
    const response = await requestPromise
    return response.body
  } catch (e) {
    throw e
  }
}

/**
 * Make best effort to turn a HTTP error or a runtime exception to meaningful error log message
 */
function logError(error: any, endpoint: string, method: string) {
  if (error.status) {
    const summary = `(${error.status} ${error.statusText}): ${error._bodyInit}`
    console.error(`Api req: ${method.toUpperCase()} ${endpoint} responded with ${summary}`)
  }
  else {
    console.error(`Api req: ${method.toUpperCase()} ${endpoint} failed with message "${error.message}"`)
  }
}
