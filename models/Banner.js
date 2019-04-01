var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Banner = new keystone.List('Banner', {
  nocreate: true,
	autokey: { from: 'name', path: 'key', unique: true },
});

Banner.add({
	name: { type: String, required: true },
	image: { type: Types.CloudinaryImage },
  description: { type: Types.Text, wysiwyg: true, height: 200},
  href: { type: String }
});

Banner.register();
