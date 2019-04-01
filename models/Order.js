var keystone = require('keystone');
var Types = keystone.Field.Types;

var Order = new keystone.List('Order');

Order.add({
	customer: { type: Types.Relationship, ref: 'User', many: false, index: true,initial:true },
	products: { type: Types.Relationship, ref: 'Post', many: true, index: true , required: true,initial:true},
});

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'customer, products';
Order.register();
