import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';
import { HttpError } from '../middleware/errorHandler.js';

const DEFAULT_CATEGORIES = [
  { name: 'Alimentação', color: '#fd7e14' },
  { name: 'Transporte', color: '#0d6efd' },
  { name: 'Moradia', color: '#6610f2' },
  { name: 'Lazer', color: '#20c997' },
  { name: 'Outros', color: '#6c757d' },
];

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    salary: Number(user.salary),
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, 'Já existe uma conta com este e-mail.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      categories: {
        create: DEFAULT_CATEGORIES,
      },
    },
  });

  const token = signToken(user.id);
  res.status(201).json({ token, user: toPublicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, 'E-mail ou senha inválidos.');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, 'E-mail ou senha inválidos.');
  }

  const token = signToken(user.id);
  res.json({ token, user: toPublicUser(user) });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    throw new HttpError(404, 'Usuário não encontrado.');
  }
  res.json({ user: toPublicUser(user) });
}

export async function updateMe(req, res) {
  const { salary } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { salary },
  });
  res.json({ user: toPublicUser(user) });
}
