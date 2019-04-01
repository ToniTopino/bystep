var keystone = require('keystone');
var Post = keystone.list('Post');
var PostComment = keystone.list('PostComment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};

	view.query('com', keystone.list('PostComment').model.find());

	// Load the current post
	view.on('init', function (next) {

		var q = Post.model.findOne({
			state: 'published',
			key: locals.filters.post,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.post = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = Post.model.find().where('state', 'published').sort('-publishedDate').populate('author').limit(4);

		q.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});

	});


	// Load comments on the Post
	view.on('init', function (next) {
		PostComment.model.find()
			.where('post', locals.post)
			.where('commentState', 'published')
			.where('author').ne(null)
			.populate('author', 'name photo')
			.sort('-publishedOn')
			.exec(function (err, comments) {
				if (err) return res.err(err);
				if (!comments) return res.notfound('Post comments not found');
				locals.comments = comments;
				next();
			});
	});

	// Create a Comment
	view.on('post', { action: 'comment.create' }, function (next) {

		var newComment = new PostComment.model({
			state: 'published',
			post: locals.post.id,
			author: locals.user.id,
		});

		var updater = newComment.getUpdateHandler(req);

		updater.process(req.body, {
			fields: 'content',
			flashErrors: true,
			logErrors: true,
		}, function (err) {
			if (err) {
				validationErrors = err.errors;
			} else {
				req.flash('success',{ detail: 'Ваш отзыв был успешно добавлен.' });
				return res.redirect('/blog/post/' + locals.post.key + '#comment-id-' + newComment.id);
			}
			next();
		});

	});

	// Delete a Comment
	view.on('get', { remove: 'comment' }, function (next) {

		if (!req.user) {
			req.flash('error', { detail: 'Вы должны войти в систему, чтобы удалить отзыв.' });
			return next();
		}

		PostComment.model.findOne({
				_id: req.query.comment,
				post: locals.post.id,
			})
			.exec(function (err, comment) {
				if (err) {
					if (err.name === 'CastError') {
						req.flash('error', {title: 'Ошибка', detail: 'Отзыв' + req.query.comment + ' невозможно найти.'});
						return next();
					}
					return res.err(err);
				}
				if (!comment) {
					req.flash('error', {title: 'Ошибка', detail: 'Отзыв' + req.query.comment + ' невозможно найти.'});
					return next();
				}
				if (comment.author != req.user.id) {
					req.flash('error', {detail: 'Извините, но Вы должны быть автором отзыва, чтобы удалить его.'});
					return next();
				}
				comment.commentState = 'archived';
				comment.save(function (err) {
					if (err) return res.err(err);
					req.flash('success', {detail: 'Ваш отзыв был удален.'});
					return res.redirect('/blog/post/' + locals.post.key);
				});
			});
	});

	// Render the view
	view.render('post');

}
