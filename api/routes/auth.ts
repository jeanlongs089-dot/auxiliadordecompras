/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  void req
  res.status(410).json({ success: false, error: 'Use a autenticação do aplicativo.' })
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  void req
  res.status(410).json({ success: false, error: 'Use a autenticação do aplicativo.' })
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  void req
  res.status(410).json({ success: false, error: 'Use a autenticação do aplicativo.' })
})

export default router
