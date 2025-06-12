const Product = require('../models/Product');
const { sendSuccess, sendError, getPaginationData } = require('../utils/helpers');

// Get all products (with filters and pagination)
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      skinType, 
      minPrice, 
      maxPrice, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock
    } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (skinType) filter.skinType = { $in: skinType.split(',') };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    const totalItems = await Product.countDocuments(filter);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalPages = Math.ceil(totalItems / parseInt(limit));
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    sendSuccess(res, 'Products retrieved successfully', {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });  } catch (error) {
    console.error('Get all products error:', error);
    sendError(res, 'Server error retrieving products', 500);
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    sendSuccess(res, 'Product retrieved successfully', product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    sendError(res, 'Server error retrieving product', 500);
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, skinType, ingredients, usage } = req.body;
    
    // Handle image URLs from request (uploaded via multer)
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      skinType,
      ingredients,
      usage,
      images
    });

    await product.save();

    sendSuccess(res, 'Product created successfully', product, 201);
  } catch (error) {
    console.error('Create product error:', error);
    sendError(res, 'Server error creating product', 500);
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, category, skinType, ingredients, usage } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (skinType) product.skinType = skinType;
    if (ingredients) product.ingredients = ingredients;
    if (usage) product.usage = usage;
    
    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    sendSuccess(res, 'Product updated successfully', product);
  } catch (error) {
    console.error('Update product error:', error);
    sendError(res, 'Server error updating product', 500);
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    await Product.findByIdAndDelete(id);

    sendSuccess(res, 'Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    sendError(res, 'Server error deleting product', 500);
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    sendSuccess(res, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.error('Get categories error:', error);
    sendError(res, 'Server error retrieving categories', 500);
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    sendSuccess(res, 'Featured products retrieved successfully', products);
  } catch (error) {
    console.error('Get featured products error:', error);
    sendError(res, 'Server error retrieving featured products', 500);
  }
};

// Update product stock (Admin only)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    product.stock = stock;
    await product.save();

    sendSuccess(res, 'Product stock updated successfully', {
      id: product._id,
      title: product.title,
      stock: product.stock
    });
  } catch (error) {
    console.error('Update stock error:', error);
    sendError(res, 'Server error updating stock', 500);
  }
};

// Get product statistics (Admin only)
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    
    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5, $gt: 0 } })
      .select('title stock')
      .sort({ stock: 1 });

    sendSuccess(res, 'Product statistics retrieved successfully', {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      featuredProducts,
      productsByCategory,
      lowStockProducts
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    sendError(res, 'Server error retrieving product statistics', 500);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts,
  updateStock,
  getProductStats
};
