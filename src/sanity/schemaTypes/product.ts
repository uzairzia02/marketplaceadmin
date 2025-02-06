const productSchema = {
    name: 'product',
    type: 'document',
    title: 'Product',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Product Name',
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: 'name',
            },
        },
        {
            name: 'description',
            type: 'text',
            title: 'Product Description',
        },
        {
            name: 'price',
            type: 'number',
            title: 'Product Price',
        },
        {
            name: 'category',
            type: 'reference',
            title: 'Category',
            to: [{ type: 'category' }],
        },
        {
            name: 'image',
            type: 'image',
            title: 'Product Image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'stock',
            type: 'number',
            title: 'Product Stock',
        },
    ],
};

export default productSchema;
