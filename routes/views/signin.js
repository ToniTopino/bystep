var keystone = require('keystone'),
	async = require('async');
var flash = require('connect-flash');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'signin';

	view.on('post', function(next) {

		if (!req.body.email || !req.body.password) {
			req.flash('error', { title: 'Ошибка входа', detail: 'Пожалуйста, введите адрес электронной почты и пароль.' });
			return next();
		}

		var onSuccess = function() {
			res.redirect('/');
		}

		var onFail = function() {
			req.flash('error', { title: 'Ошибка входа', detail: 'Введены неверные учетные данные, повторите попытку.' });
			return next();
		}

		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

	});

	view.render('auth/signin');

}
