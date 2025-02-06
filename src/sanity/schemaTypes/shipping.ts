
    
export default {
    name: 'shipping',
    title: 'Shipping Details',
    type: 'document',
    fields: [
      { name: 'contactNumber', title: 'Contact Number', type: 'string' },
      { name: 'firstName', title: 'First Name', type: 'string' },
      { name: 'lastName', title: 'Last Name', type: 'string' },
      { name: 'email', title: 'Email Address', type: 'string' },
      { name: 'address', title: 'Address', type: 'string' },
      { name: 'city', title: 'City', type: 'string' },
      { name: 'province', title: 'Province', type: 'string' },
      { name: 'postalCode', title: 'Postal Code', type: 'string' },
      { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
      { name: 'grandTotal', title: 'Grand Total', type: 'number' },
     
      {
        name: 'orderDate',
        title: 'Order Date',
        type: 'datetime',
        options: {
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm',
          calendarTodayLabel: 'Today'
        }
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'Shipped', value: 'shipped' },
            { title: 'Delivered', value: 'delivered' }
          ]
        }
      },
      {
        name: 'cartItems',
        title: 'Cart Items',
        type: 'array',
        of: [{ type: 'cartItem' }], 
      }
      
    ],
    preview: {
      select: {
        id: '_id',
        contact: 'contactNumber',
        total: 'grandTotal'
      },
      prepare(selection: { id: any; contact: any; total: any; }) {
        return {
          title: `Order # ${selection.id}`,
          subtitle: `${selection.contact} - $${selection.total}`
        }
      }
    }
    
  };
  