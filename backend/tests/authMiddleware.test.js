const { adminAuth } = require('../src/middleware/authMiddleware');

describe('adminAuth middleware', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'secret';
  });

  it('calls next when password is valid', () => {
    const req = { body: { password: 'secret' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 401 when password is missing', () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Senha de administrador incorreta.' });
    expect(next).not.toHaveBeenCalled();
  });
});
