var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);

	view.on('post', function(next) {

		if (!req.body.email) {
			req.flash('error', { title: 'Ошибка', detail: 'Пожалуйста, введите свой адрес электронной почты.' });
			res.redirect('/');
		}

		User.model.findOne().where('email', req.body.email).exec(function(err, user) {
			if (err) return next(err);
			if (!user) {
				req.flash('error', { title: 'Ошибка', detail: 'Извините, этот адрес электронной почты не зарегистрирован в нашем приложении.' });
				res.redirect('/');
			}

            user.resetPasswordKey = keystone.utils.randomString([16,24]);
            user.save(function(err) {
                if (err) return next(err);
                new keystone.Email({
									templateName: 'email',
									transport: 'mailgun',
								}).send({
										user: user,
                    link: '/resetpassword/' + user.resetPasswordKey,
                    subject: 'Восстановление пароля',
                    to: user.email,
										layout: false,
                    from: {
                        name: 'ByStep',
                        email: 'bystep@bystep.com'
                    }
                }, function(err) {
                    if (err) {
                        console.error(err);
                        req.flash('error', { title: 'Ошибка', detail: 'Ошибка при отправке сброса пароля по электронной почте!' });
                        next();
                    } else {
                        req.flash('success', { detail: 'Мы отправили Вам по электронной почте ссылку для сброса пароля.' });
                        res.redirect('/');
                    }
                });
            });
		});

	});

	view.render('auth/forgotpassword');

}
