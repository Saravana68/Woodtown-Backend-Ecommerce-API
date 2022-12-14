const { StatusCodes } = require('http-status-codes');
const Product = require('../models/product');
const error = require('../errors/index');

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;
	const product = await Product.create(req.body);
	res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findOne({ _id: productId }).populate('reviews');
	if (!product) throw new error.NotFoundError(`product not found with given object id ${productId}`);
	res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findOneAndUpdate({ _id: productId }, req.body, { runValidators: true, new: true });
	if (!product) throw new error.NotFoundError(`Product not found with given productId ${productId}`);

	res.status(StatusCodes.CREATED).json({ product });
};

const deleteProduct = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findOneAndDelete({ _id: productId });
	if (!product) throw new error.NotFoundError(`product not found with given id ${productId}`);
	res.status(StatusCodes.CREATED).json({ msg: 'Product Deleted Successfully!' });
};
const uploadImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError('No File Uploaded');
	}
	const productImage = req.files.image;

	if (!productImage.mimetype.startsWith('image')) {
		throw new CustomError.BadRequestError('Please Upload Image');
	}

	const maxSize = 1024 * 1024;

	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError('Please upload image smaller than 1MB');
	}

	const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
	await productImage.mv(imagePath);
	res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage
};
