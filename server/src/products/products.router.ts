import express from 'express'
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from 'products/products.controller'
import Product from 'products/products.model'

const router = express.Router()

router.post('/', createProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
