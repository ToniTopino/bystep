var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var SliderHome = new keystone.List('SliderHome', {
	autokey: { from: 'name', path: 'key', unique: true },
});

SliderHome.add({
	name: { type: String, required: true },
  active: { type: Boolean },
	number: { type: Number },
	image: { type: Types.CloudinaryImage },
  description: { type: Types.Text, wysiwyg: true, height: 200},
  href: { type: String }
});

SliderHome.register();
