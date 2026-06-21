/** @jest-environment node */
const menuController = require('../src/controllers/menuController');
const menuService = require('../src/services/menuService');

jest.mock('../src/services/menuService');

describe('menuController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getMenu', () => {
    it('deve retornar o menu ativo com sucesso', async () => {
      const mockMenu = [{ id: 1, name: 'Biscoito', price: 10 }];
      menuService.fetchActiveMenuItems.mockResolvedValue(mockMenu);

      await menuController.getMenu(req, res, next);

      expect(menuService.fetchActiveMenuItems).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockMenu);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar o next com o erro se fetchActiveMenuItems falhar', async () => {
      const error = new Error('Erro no banco');
      menuService.fetchActiveMenuItems.mockRejectedValue(error);

      await menuController.getMenu(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createMenuItem', () => {
    it('deve criar um novo item e retornar status 201', async () => {
      req.body = { name: 'Novo Biscoito', description: 'Delícia', price: 15, emoji: '🍪' };
      const mockCreatedItem = { id: 2, ...req.body };
      menuService.createMenuItem.mockResolvedValue(mockCreatedItem);

      await menuController.createMenuItem(req, res, next);

      expect(menuService.createMenuItem).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedItem);
    });

    it('deve chamar o next com o erro se createMenuItem falhar', async () => {
      const error = new Error('Erro ao criar');
      menuService.createMenuItem.mockRejectedValue(error);

      await menuController.createMenuItem(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMenuPrice', () => {
    it('deve atualizar o preço de um item com sucesso', async () => {
      req.params = { id: '1' };
      req.body = { newPrice: 20 };
      const mockUpdatedItem = { id: 1, price: 20 };
      menuService.updateMenuPrice.mockResolvedValue(mockUpdatedItem);

      await menuController.updateMenuPrice(req, res, next);

      expect(menuService.updateMenuPrice).toHaveBeenCalledWith(1, 20);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Preço atualizado com sucesso!',
        item: mockUpdatedItem,
      });
    });

    it('deve chamar o next com o erro se updateMenuPrice falhar', async () => {
      const error = new Error('Erro ao atualizar');
      menuService.updateMenuPrice.mockRejectedValue(error);

      await menuController.updateMenuPrice(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteMenuItem', () => {
    it('deve deletar um item com sucesso', async () => {
      req.params = { id: '1' };
      menuService.deleteMenuItem.mockResolvedValue();

      await menuController.deleteMenuItem(req, res, next);

      expect(menuService.deleteMenuItem).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto removido com sucesso!' });
    });

    it('deve chamar o next com o erro se deleteMenuItem falhar', async () => {
      const error = new Error('Erro ao deletar');
      menuService.deleteMenuItem.mockRejectedValue(error);

      await menuController.deleteMenuItem(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});