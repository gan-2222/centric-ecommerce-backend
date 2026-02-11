//src/models/index.js

const sequelize = require("../config/db");

// Import models (MATCH FILENAMES EXACTLY)
const User = require("./user.model")(sequelize);
const Role = require("./role.model")(sequelize);
const UserProfile = require("./userProfile.model")(sequelize);
const Category = require("./category.model")(sequelize);
const Product = require("./product.model")(sequelize);
const Cart = require("./cart.model")(sequelize);
const CartItem = require("./cartItem.model")(sequelize);
const Wishlist = require("./wishlist.model")(sequelize);
const Address = require("./address.model")(sequelize);
const Order = require("./order.model")(sequelize);
const OrderItem = require("./orderItem.model")(sequelize);
const OrderStatus = require("./orderStatus.model")(sequelize);
const OrderItemStatus = require("./orderItemStatus.model")(sequelize);
const Payment = require("./payment.model")(sequelize);
const PaymentStatus = require("./paymentStatus.model")(sequelize);

// ==========================
// USER & ROLE
// ==========================
Role.hasMany(User, { foreignKey: "role_id", as: "users" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

User.hasOne(UserProfile, { foreignKey: "user_id" });
UserProfile.belongsTo(User, { foreignKey: "user_id" });

// ==========================
// CATEGORY & PRODUCT
// ==========================
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

// ==========================
// SELLER (USER) & PRODUCT
// ==========================
User.hasMany(Product, { foreignKey: "seller_id" });
Product.belongsTo(User, { foreignKey: "seller_id" });

// ==========================
// CART & CART ITEMS
// ==========================
User.hasOne(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// ==========================
// WISHLIST
// ==========================
User.hasMany(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Wishlist, { foreignKey: "product_id" });
Wishlist.belongsTo(Product, { foreignKey: "product_id" });

// ==========================
// ADDRESS
// ==========================
User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

// ==========================
// ORDER & ORDER STATUS
// ==========================
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

OrderStatus.hasMany(Order, { foreignKey: "order_status_id" });
Order.belongsTo(OrderStatus, { foreignKey: "order_status_id" });

// ==========================
// ORDER ITEMS
// ==========================
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(OrderItem, { foreignKey: "seller_id" });
OrderItem.belongsTo(User, { foreignKey: "seller_id" });

OrderItemStatus.hasMany(OrderItem, { foreignKey: "order_item_status_id" });
OrderItem.belongsTo(OrderItemStatus, { foreignKey: "order_item_status_id" });

// ==========================
// PAYMENTS
// ==========================
Order.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

PaymentStatus.hasMany(Payment, { foreignKey: "payment_status_id" });
Payment.belongsTo(PaymentStatus, { foreignKey: "payment_status_id" });

// ==========================
// EXPORT (already done, just reminder)
// ==========================
// module.exports = { sequelize, User, Role, ... }


// Export everything
module.exports = {
  sequelize,
  User,
  Role,
  UserProfile,
  Category,
  Product,
  Cart,
  CartItem,
  Wishlist,
  Address,
  Order,
  OrderItem,
  OrderStatus,
  OrderItemStatus,
  Payment,
  PaymentStatus
};

