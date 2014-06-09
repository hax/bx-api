/** @module bx-api/API */
'use strict'

var Promise = require('es6-promise').Promise
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

var md5 = require('./util/md5')

var debug = require('debug')('bx')

/**
 * 创建一个百姓网 API 接口
 *
 * @param {string} appId
 * @param {opaque} appSecret
 * @param {url} [baseURL = 'http://www.baixing.com']
 * @returns {module:bx-api/API~call}
 */
function API(appId, appSecret, baseURL) {
	if (!appId || !appSecret)
		throw new Error('Illegal arguments: (appId = ' + appId + ', secret = ' + appSecret + ')')
	if (!baseURL) baseURL = 'http://www.baixing.com'

	/**
	 * @typedef {{error: int16, message: string}} Error
	 */

	/**
	 * 执行指定的 API 命令，返回 promise，指令成功则此 promise 被 fulfill，否则此 promise 被 reject
	 *
	 * @typedef {function} call
	 * @param {string} command
	 * @param {*} [payload]
	 * @param {object} [options]
	 *        {string} options.method ('POST'|'GET')
	 *        {string} options.prefix ('v2'|'mobile')
	 * @returns {Promise.<*, module:bx-api/API~Error>}
	 * @property {module:bx-api/API~bindToken} bindToken
	 */
	function call(command, payload, options) {
		/**
		 * @default
		 */
		if (!options) options = {}
		var method, path
		if (command === 'graph' || command === 'connection') { // legacy
			method = 'GET'
			path = '/api/v2/' + command
		} else {
			method = options.method || 'POST'
			path = '/api/' + (options.prefix || 'v2') + '/' + command + '/'
		}
		var body = payload ? JSON.stringify(payload) : ''

		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest()
			xhr.open(method, baseURL + path)
			xhr.setRequestHeader('Accept', 'application/json')
			if (body) xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.setRequestHeader('BAPI-APP-KEY', appId)
			xhr.setRequestHeader('BAPI-HASH', md5(path + body + appSecret))
			if (options.token) xhr.setRequestHeader('BAPI-USER-TOKEN', options.token)
			xhr.onload = function () {
				var type = this.getResponseHeader('Content-Type'), res
				if (/^application\/(.+\+)?json$/i.test(type)) {
					try {
						res = JSON.parse(this.responseText)
					} catch (e) {
						reject(e + ' -- ' + this.responseText)
						return
					}
					if (this.status >= 200 && this.status < 300) {
						resolve(res.result)
						debug('success', res)
					} else {
						reject(res)
					}
				} else {
					reject(type + ' -- ' + this.responseText)
				}
			}
			xhr.onerror = reject
			xhr.send(body)
			debug(method + ' ' + baseURL + path, body)
		}).catch(function (err) {
			debug('failed', err)
			throw err
		})
	}

	/**
	 * 派生一个百姓网 API 接口，此接口的所有调用均绑定了指定的用户 token
	 * @typedef {function} bindToken
	 * @param {opaque} token
	 * @returns {module:bx-api/API~call}
	 */
	call.bindToken = function (token) {
		return function callWithToken(command, payload) {
			return call(command, payload, {token: token})
		}
	}

	return call
}

module.exports = API