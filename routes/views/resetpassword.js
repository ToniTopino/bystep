var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	view.on('init', function(next) {

		User.model.findOne().where('resetPasswordKey', req.params.key).exec(function(err, userFound) {
			if (err) return next(err);
			if (!userFound) {
				req.flash('error', { title: 'Ошибка сброса пароля', detail: 'Извините, этот ключ сброса пароля недействителен.' });
				return res.redirect('/forgotpassword');
			}
			locals.key =  req.params.key;
			next();
		});

	});

	view.on('post', function(next) {

		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', { title: 'Восстановление пароля', detail: 'Пожалуйста, введите и подтвердите ваш новый пароль.' });
			return res.redirect('/resetpassword/'+req.params.key);
		}

		if (req.body.password != req.body.password_confirm) {
			req.flash('error', { title: 'Восстановление пароля', detail: 'Пожалуйста, убедитесь, что оба пароля совпадают.' });
			return res.redirect('/resetpassword/'+req.params.key);
		}

        User.model.findOne().where('resetPasswordKey', req.body.resetkey).exec(function(err, userFound) {
			if (err) return next(err);
			userFound.password = req.body.password;
           userFound.resetPasswordKey = '';
            userFound.save(function(err) {
                if (err) return next(err);
                req.flash('success', { title: 'Восстановление пароля', detail: 'Ваш пароль был успешно изменен, пожалуйста, войдите в систему.' });
                res.redirect('/');
            });
		});

	});

	view.render('auth/resetpassword');
};
