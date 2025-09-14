const router = require('express').Router();
const c = require('../controllers/carts.controller');

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *       404:
 *         description: Carrito no encontrado
 */
router.get('/:cid', c.getCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.delete('/:cid/products/:pid', c.deleteProduct);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Reemplazar todos los productos del carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto
 *                     quantity:
 *                       type: number
 *                       description: Cantidad del producto
 *     responses:
 *       200:
 *         description: Productos del carrito actualizados
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Carrito no encontrado
 */
router.put('/:cid', c.replaceProducts);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Nueva cantidad del producto (debe ser mayor a 0)
 *     responses:
 *       200:
 *         description: Cantidad actualizada correctamente
 *       400:
 *         description: Cantidad inválida
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.put('/:cid/products/:pid', c.updateQuantity);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Vaciar el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito a vaciar
 *     responses:
 *       200:
 *         description: Carrito vaciado correctamente
 *       404:
 *         description: Carrito no encontrado
 */
router.delete('/:cid', c.clearCart);

module.exports = router;
