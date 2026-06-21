const menuService = require('../services/menuService');

async function getMenu(req, res, next) {
  try {
    const menu = await menuService.fetchActiveMenuItems();
    res.json(menu);
  } catch (error) {
    next(error);
  }
}

async function createMenuItem(req, res, next) {
  try {
    const { name, description, price, emoji } = req.body;
    const item = await menuService.createMenuItem({ name, description, price, emoji });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

async function updateMenuPrice(req, res, next) {
  try {
    const { id } = req.params;
    const { newPrice } = req.body;
    const item = await menuService.updateMenuPrice(Number(id), newPrice);
    res.json({ message: 'Preço atualizado com sucesso!', item });
  } catch (error) {
    next(error);
  }
}

async function deleteMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    await menuService.deleteMenuItem(Number(id));
    res.json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMenu,
  createMenuItem,
  updateMenuPrice,
  deleteMenuItem,
};
