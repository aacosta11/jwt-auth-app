require('dotenv').config();
import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';

const router: Router = Router();

type AuthCode = {
    [key: string]: string,
    response_type: string,
    client_id: string,
    redirect_uri: string,
    state: string,
}

const refreshTokens: Map<string, string> = new Map();

/* ------------------------------ api endpoint ------------------------------ */
router.get('/api', authenticateAccessToken, function (req: Request, res: Response) {
    // get cookies
    res.send({ message: 'yo' });
});

/* ------------------------- authentication endpoint ------------------------ */
router.get('/auth', function (req: Request, res: Response) {
    // TODO: validate request
    res.sendFile('auth.html', { root: __dirname + '\\src\\' });
});

router.post('/auth', function (req: Request, res: Response) {
    // validate pin
    let pin: string = req.body.pin as string;
    if (pin !== '0000') {
        res.status(401).send({ error: 'Invalid PIN' });
        return res;
    }
    // get params & generate code
    // TODO: validate params
    const authCode: AuthCode = {
        response_type: req.query.response_type as string,
        client_id: req.query.client_id as string,
        redirect_uri: req.query.redirect_uri as string,
        state: req.query.state as string,
    };
    const { state, redirect_uri, response_type, client_id } = authCode;
    // sign code
    let code = jwt.sign(authCode, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' });
    // encode redirect uri for client
    let redirect = encodeURIComponent(redirect_uri);
    res.json({ code, state, redirect_uri: redirect });
});

router.get('/auth/success', function (req: Request, res: Response) {
    // validate code
    let code = req.query.code as string;
    jwt.verify(code, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
        if (err) return res.sendStatus(403); // Forbidden
    })
    // generate refresh token
    const { response_type, client_id, redirect_uri, state } = jwt.decode(code) as AuthCode;
    let refresh_token = jwt.sign({ response_type, client_id, redirect_uri, state }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '1h' });
    // set cookies
    let sessionId = '012345';
    res.cookie('session_id', sessionId);
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    // record refresh token
    refreshTokens.set(sessionId, refresh_token);
    res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
});

/* ------------------------- refresh token endpoint ------------------------- */
router.get('/token', function (req: Request, res: Response) {
    // get refresh token & session id
    const refreshToken = req.cookies.refresh_token;
    const sessionId = req.cookies.session_id;
    // console.log(refreshToken, sessionId)
    // handle errors
    if (refreshToken == null) return res.sendStatus(401); // Unauthorized
    if (sessionId == null) return res.sendStatus(403); // Forbidden
    if (!refreshTokens.has(sessionId)) return res.sendStatus(403); // Forbidden
    if (refreshTokens.get(sessionId) !== refreshToken) return res.sendStatus(403); // Forbidden
    // verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, code: any) => {
        if (err) return res.sendStatus(403); // Forbidden
        // generate new access token
        const { response_type, client_id, redirect_uri, state } = code;
        const accessToken = jwt.sign({ response_type, client_id, redirect_uri, state }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' });
        res.json({ accessToken });
    });
});

/* --------------------------- logout endpoint ----------------------------- */
router.post('/logout', function (req: Request, res: Response) {
    // get session id
    const sessionId = req.cookies['session_id'];
    const refreshToken = req.cookies['refresh_token'];
    // handle errors
    if (sessionId == null) return res.sendStatus(403); // Forbidden
    if (!refreshTokens.has(sessionId)) return res.sendStatus(403); // Forbidden
    if (refreshTokens.get(sessionId) !== refreshToken) return res.sendStatus(403); // Forbidden
    // delete refresh token
    refreshTokens.delete(sessionId);
    // delete cookies
    res.clearCookie('session_id');
    res.clearCookie('refresh_token');

    res.sendStatus(204);
});

/* ------------------------------- middleware ------------------------------- */

function authenticateAccessToken(req: Request, res: Response, next: NextFunction) {
    // get token from auth header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized
    // verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
        if (err) return res.sendStatus(403); // Forbidden
        next();
    });
}

export default router;