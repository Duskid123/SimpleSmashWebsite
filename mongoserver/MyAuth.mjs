import jwt from 'jsonwebtoken';

// Middleware to authenticate and add user information to the request
export async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error('Authorization header is missing.');
        return res.status(401).json({ message: 'Authorization header is required.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error('Token is missing from authorization header.');
        return res.status(401).json({ message: 'Token is missing.' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`User authenticated: ${req.user.userId}`);
        next();
    } catch (error) {
        console.error('Token authentication failed:', error.message);

        if (req.accepts('html')) {
            console.log(1);
            return res.redirect('./public/pages/SignUp.html');
        } else {
            console.log(2);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
    }
}
