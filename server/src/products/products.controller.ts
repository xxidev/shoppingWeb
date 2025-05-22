import { Request, Response } from 'express'
import Product from 'products/products.model'
import { Op } from 'sequelize'

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error: any) {
    console.error('[Create Product Error]', error) // 打印完整错误
    res.status(500).json({ error: error.message || 'Failed to create product' }) // 返回详细信息
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString() || ''
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 6
    const offset = (page - 1) * limit

    const where = search
      ? {
          name: {
            [Op.iLike]: `%${search}%`
          }
        }
      : {}

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('[Get Products Error]', error)
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
