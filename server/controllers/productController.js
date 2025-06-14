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
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;    const products = await Product.find(filter)
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
    });} catch (error) {
    console.error('Get all products error:', error);
    sendError(res, 'Server error retrieving products', 500);
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;    const product = await Product.findById(id);
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
    const { title, description, price, stock, category, skinType, ingredients, usage, images, brand } = req.body;
    
    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      brand: brand || 'GlowSkin', // Use provided brand or default
      skinType: Array.isArray(skinType) ? skinType : [skinType], // Ensure it's an array
      ingredients: ingredients ? (Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(ing => ing.trim())) : [],
      usage,
      images: images || [] // Use the images array from the request body
    });const savedProduct = await product.save();
    sendSuccess(res, 'Product created successfully', savedProduct, 201);
  } catch (error) {
    console.error('Create product error:', error);
    sendError(res, 'Server error creating product', 500);
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, category, skinType, ingredients, usage, images, brand } = req.body;
    
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
    if (brand) product.brand = brand;
    if (skinType) product.skinType = skinType;
    if (ingredients) product.ingredients = ingredients;
    if (usage) product.usage = usage;
    
    // Handle images - replace with new array if provided
    if (images !== undefined) {
      product.images = images;
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

// Add product review
const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return sendError(res, 'Rating must be between 1 and 5', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return sendError(res, 'You have already reviewed this product', 400);
    }

    // Add new review
    const newReview = {
      user: req.user.id,
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    product.updateRatings();
    
    await product.save();

    // Populate the user info for the response
    await product.populate('reviews.user', 'name');

    sendSuccess(res, 'Review added successfully', {
      review: product.reviews[product.reviews.length - 1],
      ratings: product.ratings
    }, 201);
  } catch (error) {
    console.error('Add review error:', error);
    sendError(res, 'Server error adding review', 500);
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findById(id)
      .populate('reviews.user', 'name')
      .select('reviews ratings');

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    // Paginate reviews
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalReviews = product.reviews.length;
    const totalPages = Math.ceil(totalReviews / parseInt(limit));
    
    const paginatedReviews = product.reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit));

    sendSuccess(res, 'Reviews retrieved successfully', {
      reviews: paginatedReviews,
      ratings: product.ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalReviews,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    sendError(res, 'Server error retrieving reviews', 500);
  }
};

// Update product review
const updateProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    // Update review
    if (rating) review.rating = parseInt(rating);
    if (comment !== undefined) review.comment = comment;

    product.updateRatings();
    await product.save();

    sendSuccess(res, 'Review updated successfully', review);
  } catch (error) {
    console.error('Update review error:', error);
    sendError(res, 'Server error updating review', 500);
  }
};

// Delete product review
const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Access denied', 403);
    }

    // Remove review
    product.reviews.pull(reviewId);
    product.updateRatings();
    await product.save();

    sendSuccess(res, 'Review deleted successfully');
  } catch (error) {
    console.error('Delete review error:', error);
    sendError(res, 'Server error deleting review', 500);
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
  getProductStats,
  addProductReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview
};
