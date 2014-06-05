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
		 * @typedef LoginParameters
		 * @property {module:bx-api/User~LoginType} type
		 * @property {string} identity
		 * @property {string} password
		 * @property {uint16} [expire = 366]
		 */

		/**
		 * @typedef {string} LoginType ('mobile'|'mobile_code'|'id'|'name')
		 */

		/**
		 * 以特定用户身份登录百姓网
		 *
		 * @typedef {function} login
		 * @param {module:bx-api/User~LoginParameters} parameters
		 * @returns {Promise.<{user: object, token: opaque}, module:bx-api/API~Error>}
		 */
		login: function (parameters) {
			return bx('User.login', parameters)
		}
	}
}

module.exports = User