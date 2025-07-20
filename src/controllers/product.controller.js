import Product from '../models/product.model.js';

export const getProducts = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  let filter = {};
  if (query) {
    const [field, value] = query.split(':');
    filter[field] = field === 'status' ? value === 'true' : value;
  }

  let options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
    lean: true
  };

  const result = await Product.paginate(filter, options);

  res.json({
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
  });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  res.render('productDetail', { product });
};
