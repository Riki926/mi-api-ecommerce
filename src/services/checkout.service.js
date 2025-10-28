const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const ticketRepository = require('../repositories/ticket.repository');
const { TicketDTO } = require('../dto/ticket.dto');

const generateTicketCode = () => {
  return `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

const purchase = async (userId, userEmail) => {
  const cart = await cartRepository.findByUserId(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const processedItems = [];
  const notProcessed = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = await productRepository.findById(item.product._id);

    if (!product) {
      notProcessed.push({
        productId: item.product._id,
        reason: 'Product not found',
      });
      continue;
    }

    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await productRepository.updateById(product._id, { stock: product.stock });

      totalAmount += product.price * item.quantity;
      processedItems.push(item.product._id.toString());
    } else {
      notProcessed.push({
        productId: item.product._id,
        title: product.title,
        requestedQuantity: item.quantity,
        availableStock: product.stock,
      });
    }
  }

  if (processedItems.length === 0) {
    throw new Error('No items could be processed');
  }

  const ticketCode = generateTicketCode();
  const ticket = await ticketRepository.create({
    code: ticketCode,
    amount: totalAmount,
    purchaser: userEmail,
  });

  cart.items = cart.items.filter(
    (item) => !processedItems.includes(item.product._id.toString())
  );

  await cartRepository.updateById(cart._id, { items: cart.items });

  return {
    ticket: new TicketDTO(ticket),
    notProcessed,
  };
};

module.exports = {
  purchase,
};
