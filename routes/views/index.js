var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function (req, res) {


	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.query('slider', keystone.list('SliderHome').model.find().sort('number'));
	view.query('banner', keystone.list('Banner').model.find().limit(1));

	view.on('post', function(next) {

		if (!req.body.email || !req.body.passwordUser) {
			req.flash('error', { title: 'Ошибка входа', detail: 'Пожалуйста, введите адрес электронной почты и пароль.' });
			return next();
		}

		var onSuccess = function() {
			res.redirect('#');
		}

		var onFail = function() {
			req.flash('error', { title: 'Ошибка входа', detail: 'Введены неверные учетные данные, повторите попытку.' });
			return next();
		}

		keystone.session.signin({ email: req.body.email, password: req.body.passwordUser }, req, res, onSuccess, onFail);



	});

	// Render the view
	view.render('index');
};
