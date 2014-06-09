/**
 * @module bx-api/User
 */
'use strict'

/**
 * 创建用户 API 接口
 * @param {module:bx-api/API~call} bx
 * @returns {module:bx-api/User~API}
 */
function User(bx) {

	/**
	 * @typedef API
	 * @property {module:bx-api/User~login} login
	 */
	return {
		/**
		 * @typedef User
		 * @property {opaque} id
		 * @property {string} name
		 * @property {timestamp} createdTime
		 * @property {string} mobile
		 */

		/**
		 * @typedef LoginParameters
		 * @property {module:bx-api/User~LoginType} type
		 * @property {string} identity
		 * @property {string} password
		 * @property {uint16} [expire = 60] //TODO: 60 or 366?
		 */

		/**
		 * @typedef {string} LoginType ('mobile'|'mobile_code'|'id'|'name')
		 */

		/**
		 * 以特定用户身份登录百姓网
		 *
		 * @typedef {function} login
		 * @param {module:bx-api/User~LoginParameters} parameters
		 * @returns {Promise.<{user: module:bx-api/User~User, token: opaque}, module:bx-api/API~Error>}
		 */
		login: function (parameters) {
			return bx('User.login', parameters)
		}
	}
}

module.exports = User
module.exports.isValidMobile = function isMobile(value) {
	return /^1\d{10}$/.test(value)
}
module.exports.isValidUserId = function isUserId(value) {
	return /^u\d{5,}/.test(value)
}