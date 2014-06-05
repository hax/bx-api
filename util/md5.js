'use strict'

var hash = require('crypto').createHash

module.exports = function md5(data) {
	var shasum = hash('md5')
	shasum.update(data)
	return shasum.digest('hex')
}
