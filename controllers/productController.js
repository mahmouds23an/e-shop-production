import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      costPrice,
      category,
      subCategory,
      sizes,
      bestSeller,
      discountedPrice,
      discountStatus,
    } = req.body;

    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product name already taken, please change it",
      });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const newProduct = new productModel({
      name,
      description,
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      discountStatus: discountStatus === "true" ? true : false,
      discountedPrice:
        discountStatus === "true" ? Number(discountedPrice) : null,
      date: Date.now(),
    });
    const product = await newProduct.save();
    return res
      .status(200)
      .json({ success: true, product, message: "Product added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ date: -1 });
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }
    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const imagePublicIds = product.image;
    await Promise.all(
      imagePublicIds.map(async (publicId) => {
        const imageId = publicId.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      })
    );

    await productModel.findByIdAndDelete(req.body.id);
    return res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price) updates.price = Number(req.body.price);
    if (req.body.costPrice) updates.costPrice = Number(req.body.costPrice);
    if (req.body.category) updates.category = req.body.category;
    if (req.body.subCategory) updates.subCategory = req.body.subCategory;
    if (req.body.sizes) {
      updates.sizes = Array.isArray(req.body.sizes)
        ? req.body.sizes
        : JSON.parse(req.body.sizes);
    }
    if (req.body.bestSeller !== undefined)
      updates.bestSeller = req.body.bestSeller;

    // Update discount fields
    if (req.body.discountStatus !== undefined)
      updates.discountStatus = req.body.discountStatus;
    if (req.body.discountedPrice !== undefined)
      updates.discountedPrice = Number(req.body.discountedPrice);

    if (req.files) {
      const images = Object.values(req.files)
        .flat()
        .filter((item) => item !== undefined);
      if (images.length > 0) {
        const imagesUrl = await Promise.all(
          images.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
            });
            return result.secure_url;
          })
        );
        updates.image = imagesUrl;
      }
    }
    const updatedProduct = await productModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  updateProduct,
  singleProduct,
};
