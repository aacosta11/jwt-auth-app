require('dotenv').config();

import { Request, Response, Router } from "express";
import CURRENT_SESSIONS from '../currentSessions';
import jwt from 'jsonwebtoken'

const router: Router = Router();

router.get('/token', function (req: Request, res: Response) {
    // check if session_id & refresh_token is valid
    const sessionId = req.cookies.session_id;
    const refreshToken = req.cookies.refresh_token;
    if (!sessionId || !refreshToken) {
        res.status(403).json({ status: 403, error: 'Forbidden', message: 'No session_id or refresh_token cookie' });
        return;
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { sessionId: string, clientId: string };
    if (!CURRENT_SESSIONS.has(sessionId) || !CURRENT_SESSIONS.has(payload.sessionId) || sessionId !== payload.sessionId) {
        res.status(403).json({ status: 403, error: 'Forbidden', message: 'Invalid session_id or refresh_token' });
        return;
    }

    // create new access_token
    const accessToken = jwt.sign({ sessionId, clientId: payload.clientId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' });
    res.json({ accessToken, sessionId });
})

export default router;