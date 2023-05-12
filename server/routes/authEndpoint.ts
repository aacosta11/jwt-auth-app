require('dotenv').config();
import { Request, Response, Router } from "express";
import CURRENT_SESSIONS from '../currentSessions';
import jwt from 'jsonwebtoken'

const router: Router = Router();

router.get('/auth', function (req: Request, res: Response) {
    // get query params
    // TODO: validate query params
    const query = req.url.substring(req.url.indexOf('?'));
    const clientId = req.query.client_id as string;
    const redirectUri = req.query.redirect_uri as string;
    // check if there is a redirect_uri
    if (!redirectUri) {
        res.status(400).json({ status: 400, error: 'Bad Request', message: 'Missing redirect_uri' });
        return;
    }
    // check if session_id cookie exists
    const sessionId = req.cookies.session_id;
    const refreshToken = req.cookies.refresh_token;
    if (!sessionId || !refreshToken) {
        res.redirect(`/auth/login${query}`);
        return;
    }
    // check if session_id & refresh_token is valid
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { sessionId: string, clientId: string };
    if (!CURRENT_SESSIONS.has(sessionId) || !CURRENT_SESSIONS.has(payload.sessionId) || sessionId !== payload.sessionId || clientId !== payload.clientId) {
        res.redirect(`/auth/login${query}`);
        return;
    }
    // TODO: handle this better
    // create new access token
    const accessToken = jwt.sign({ sessionId, clientId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '10s' });
    res.redirect(`${redirectUri}?code=${accessToken}`);
})

router.get('/auth/login', function (req: Request, res: Response) {
    res.sendFile('login.html', { root: '.' });
})

router.post('/auth/login', function (req: Request, res: Response) {
    // validate pin from body
    const pin = req.body.pin as string;
    if (pin !== '0000') {
        res.status(403).json({ status: 403, error: 'Forbidden', message: 'Invalid pin' });
        return;
    }
    // if session_id cookie exists, invalidate old session
    const sessionId = req.cookies.session_id;
    if (sessionId) {
        CURRENT_SESSIONS.delete(sessionId);
    }
    // create new session
    const clientId = req.query.client_id as string;
    const session = {
        clientId,
        sessionId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    }
    // create access token and refresh token
    const accessToken = jwt.sign(session, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '10s' });
    const refreshToken = jwt.sign(session, process.env.REFRESH_TOKEN_SECRET as string);
    // add session to CURRENT_SESSIONS
    CURRENT_SESSIONS.set(session.sessionId, refreshToken);
    // set cookies
    res.cookie('session_id', session.sessionId);
    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    res.redirect(`${req.query.redirect_uri}?code=${accessToken}`);
})

router.delete('/auth/logout', function (req: Request, res: Response) {
    // check if session_id cookie exists
    const sessionId = req.cookies.session_id;
    const refreshToken = req.cookies.refresh_token;
    if (!sessionId || !refreshToken) {
        res.status(403).json({ status: 403, error: 'Forbidden', message: 'No valid session was found' });
        return;
    }
    // check if session_id & refresh_token is valid
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { sessionId: string, clientId: string };
    if (!CURRENT_SESSIONS.has(sessionId) || !CURRENT_SESSIONS.has(payload.sessionId) || sessionId !== payload.sessionId) {
        res.status(403).json({ status: 403, error: 'Forbidden', message: 'No valid session was found' });
        return;
    }
    // remove session from CURRENT_SESSIONS
    CURRENT_SESSIONS.delete(sessionId);
    // clear cookies
    res.clearCookie('session_id');
    res.clearCookie('refresh_token');

    res.json({ message: 'logout successful' });
})

export default router;