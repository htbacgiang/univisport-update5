import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../../lib/adminAuth';

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

// Helper function to read products from JSON file
const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
};

// Helper function to write products to JSON file
const writeProducts = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products.json:', error);
    return false;
  }
};

const generateRandomReviewCount = () => Math.floor(Math.random() * 21) + 10;

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const { id, category } = req.query;
        let products = readProducts();

        if (id) {
          // Get single product by ID
          const product = products.find(p => p.id === parseInt(id));
          if (!product) {
            return res.status(404).json({ 
              status: 'error', 
              message: 'Sản phẩm không tồn tại' 
            });
          }
          return res.status(200).json({ 
            status: 'success', 
            product 
          });
        }

        if (category) {
          // Filter by category
          products = products.filter(p => p.category === category);
        }

        return res.status(200).json({ 
          status: 'success', 
          products 
        });

      case 'POST':
        if (!(await requireAdmin(req, res))) return;
        const { action } = req.body;
        
        if (action === 'checkSlug') {
          // Check if slug exists
          const { slug, id } = req.body;
          const allProducts = readProducts();
          const existingProduct = allProducts.find(p => p.slug === slug && p.id !== parseInt(id));
          
          return res.status(200).json({ 
            status: existingProduct ? 'error' : 'success',
            exists: !!existingProduct
          });
        }

        // Create new product
        const newProduct = req.body;
        const productsList = readProducts();
        
        // Generate new ID
        const maxId = productsList.length > 0 ? Math.max(...productsList.map(p => p.id)) : 0;
        newProduct.id = maxId + 1;
        
        // Set default values
        newProduct.rating = newProduct.rating ?? 5;
        newProduct.reviewCount = newProduct.reviewCount ?? generateRandomReviewCount();
        newProduct.isNew = newProduct.isNew || false;
        newProduct.isFeatured = newProduct.isFeatured || false;
        
        productsList.push(newProduct);
        
        if (writeProducts(productsList)) {
          return res.status(201).json({ 
            status: 'success', 
            product: newProduct,
            message: 'Sản phẩm đã được thêm thành công' 
          });
        } else {
          return res.status(500).json({ 
            status: 'error', 
            message: 'Không thể lưu sản phẩm' 
          });
        }

      case 'PUT':
        if (!(await requireAdmin(req, res))) return;
        // Update existing product
        const { id: productId } = req.query;
        const updatedProduct = req.body;
        
        if (!productId) {
          return res.status(400).json({ 
            status: 'error', 
            message: 'ID sản phẩm là bắt buộc' 
          });
        }

        const productsUpdate = readProducts();
        const productIndex = productsUpdate.findIndex(p => p.id === parseInt(productId));
        
        if (productIndex === -1) {
          return res.status(404).json({ 
            status: 'error', 
            message: 'Sản phẩm không tồn tại' 
          });
        }

        // Update product
        productsUpdate[productIndex] = { ...productsUpdate[productIndex], ...updatedProduct };
        
        if (writeProducts(productsUpdate)) {
          return res.status(200).json({ 
            status: 'success', 
            product: productsUpdate[productIndex],
            message: 'Sản phẩm đã được cập nhật thành công' 
          });
        } else {
          return res.status(500).json({ 
            status: 'error', 
            message: 'Không thể cập nhật sản phẩm' 
          });
        }

      case 'DELETE':
        if (!(await requireAdmin(req, res))) return;
        // Delete product
        const { id: deleteId } = req.query;
        
        if (!deleteId) {
          return res.status(400).json({ 
            status: 'error', 
            message: 'ID sản phẩm là bắt buộc' 
          });
        }

        const productsDelete = readProducts();
        const filteredProducts = productsDelete.filter(p => p.id !== parseInt(deleteId));
        
        if (filteredProducts.length === productsDelete.length) {
          return res.status(404).json({ 
            status: 'error', 
            message: 'Sản phẩm không tồn tại' 
          });
        }
        
        if (writeProducts(filteredProducts)) {
          return res.status(200).json({ 
            status: 'success', 
            message: 'Sản phẩm đã được xóa thành công' 
          });
        } else {
          return res.status(500).json({ 
            status: 'error', 
            message: 'Không thể xóa sản phẩm' 
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          status: 'error', 
          message: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Lỗi server nội bộ' 
    });
  }
}
