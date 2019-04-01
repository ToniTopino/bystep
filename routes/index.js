var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.all('/', routes.views.index);
	app.all('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.all('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	app.all('/signin', routes.views.signin);
	app.all('/join', routes.views.join);
	app.all('/forgotpassword', routes.views.forgotpassword);
	app.all('/resetpassword/:key', routes.views.resetpassword);
	app.get('/signout', routes.views.signout);
};
