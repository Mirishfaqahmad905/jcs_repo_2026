import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { readJsonFile } from '../dataStore';

export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
  }

  const token = authHeader.split(' ')[1];
  const adminData = readJsonFile<{ username: string; passwordHash: string; jwtSecret: string }>('admin.json', {
    username: 'jamal',
    passwordHash: '',
    jwtSecret: 'jcs_mayar_secret_token_key_2026_dir_lower'
  });

  try {
    const decoded = jwt.verify(token, adminData.jwtSecret || 'jcs_mayar_secret_token_key_2026_dir_lower') as { username: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
}
