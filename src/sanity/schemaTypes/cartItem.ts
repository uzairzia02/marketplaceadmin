export default {
    name: 'cartItem',
    title: 'Cart Item',
    type: 'object',
    fields: [
      {
        name: 'key',
        title: 'Key',
        type: 'string',
        hidden: true, // Hide from Studio UI
      },
      {
        name: 'product',
        title: 'Product',
        type: 'reference',
        to: [{ type: 'product' }],
      },
      {
        name: 'quantity',
        title: 'Quantity',
        type: 'number',
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
      },
    ],
  };