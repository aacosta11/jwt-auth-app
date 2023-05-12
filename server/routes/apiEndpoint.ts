import { Request, Response, Router, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import currentSessions from '../currentSessions'
const router: Router = Router()

const DATA = { payload: 'data for authorized personnel only' }

router.get('/api', authenticateRequest, function (req: Request, res: Response) {
    res.send(DATA);
})

function authenticateRequest(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return res.status(403).json({ status: 403, error: 'Unauthorized', message: 'No token provided' }); // unauthorized
    const token = req.headers.authorization!.split(' ')[1];
    if (!token) return res.status(403).json({ status: 403, error: 'Unauthorized', message: 'No token provided' }) // unauthorized
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { sessionId: string, clientId: string };
        if (!currentSessions.has(payload.sessionId)) return res.status(403).json({ error: 'Unauthorized' }); // unauthorized
    } 
    catch (err) {
        return res.status(403).json({ status: 403, error: 'Unauthorized', message: 'Error verifying token' }); // unauthorized
    }
    
    next();
}

export default router