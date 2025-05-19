import CartItem from 'carts/cartItems.model'
import User from 'users/users.model'
import Cart from 'carts/carts.model'
import Order from 'orders/orders.model'
import OrderItem from 'orders/orderItems.model'
import Product from 'products/products.model'

export const setupAssociations = () => {
  Cart.belongsTo(User, { foreignKey: 'userId' })
  User.hasOne(Cart, { foreignKey: 'userId' })
  Cart.hasMany(CartItem, { foreignKey: 'cartId' })
  CartItem.belongsTo(Cart, { foreignKey: 'cartId' })

  Order.hasMany(OrderItem, { foreignKey: 'orderId' })
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' })

  Product.hasMany(OrderItem, { foreignKey: 'productId' })
  OrderItem.belongsTo(Product, { foreignKey: 'productId' })

  Product.hasMany(CartItem, { foreignKey: 'productId' })
  CartItem.belongsTo(Product, { foreignKey: 'productId' })
}
