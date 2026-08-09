import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJsonFile, writeJsonFile } from '../dataStore';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

interface AdminJson {
  username: string;
  passwordHash: string;
  jwtSecret: string;
}

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'یوزر نیم اور پاس ورڈ فراہم کریں۔ (Username and password are required)' });
  }

  const adminData = readJsonFile<AdminJson>('admin.json', {
    username: 'jamal',
    passwordHash: '',
    jwtSecret: 'jcs_mayar_secret_token_key_2026_dir_lower'
  });

  if (username !== adminData.username) {
    return res.status(401).json({ success: false, message: 'غلط یوزر نیم یا پاس ورڈ! (Invalid credentials)' });
  }

  // Verify password hash
  const isMatch = await bcrypt.compare(password, adminData.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'غلط یوزر نیم یا پاس ورڈ! (Invalid credentials)' });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { username: adminData.username },
    adminData.jwtSecret || 'jcs_mayar_secret_token_key_2026_dir_lower',
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    message: 'لاگ ان کامیاب ہو گیا۔ (Login successful)',
    token,
    user: {
      username: adminData.username
    }
  });
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * POST /api/admin/change-password
 */
router.post('/change-password', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'تمام فیلڈز پر کرنا لازمی ہے۔ (All password fields required)' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'نیا پاس ورڈ اور ہدف پاس ورڈ یکساں نہیں ہیں! (Passwords do not match)' });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'نیا پاس ورڈ کم از کم 4 حروف پر مشتمل ہونا چاہیے۔ (Minimum 4 characters)' });
  }

  const adminData = readJsonFile<AdminJson>('admin.json', {
    username: 'jamal',
    passwordHash: '',
    jwtSecret: 'jcs_mayar_secret_token_key_2026_dir_lower'
  });

  // Verify current password
  const isCurrentMatch = await bcrypt.compare(currentPassword, adminData.passwordHash);
  if (!isCurrentMatch) {
    return res.status(400).json({ success: false, message: 'موجودہ پاس ورڈ غلط ہے۔ (Current password is incorrect)' });
  }

  // Hash new password
  const newHash = await bcrypt.hash(newPassword, 10);
  const jwtSecret = adminData.jwtSecret || 'jcs_mayar_secret_token_key_2026_dir_lower';

  const updatedAdminData: AdminJson = {
    username: adminData.username,
    passwordHash: newHash,
    jwtSecret
  };

  const saved = writeJsonFile('admin.json', updatedAdminData);

  if (!saved) {
    return res.status(500).json({ success: false, message: 'پاس ورڈ محفوظ کرنے میں ناکامی! (Failed to update password)' });
  }

  // Generate new token
  const newToken = jwt.sign(
    { username: adminData.username },
    jwtSecret,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    message: 'پاس ورڈ کامیابی سے تبدیل ہو گیا ہے۔ (Password updated successfully)',
    token: newToken
  });
});

export default router;
