import { Request, Response } from 'express'
import Product from 'products/products.model'

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error: any) {
    console.error('[Create Product Error]', error) // 打印完整错误
    res.status(500).json({ error: error.message || 'Failed to create product' }) // 返回详细信息
  }
}

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    await product.update(req.body)
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    await product.destroy()
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
