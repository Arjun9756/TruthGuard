const jwt = require('jsonwebtoken')

const TokenVerify = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required. No token provided.",
                status: false,
                code: "NO_TOKEN"
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Invalid token format. Use 'Bearer [token]'",
                status: false,
                code: "INVALID_FORMAT"
            });
        }

        try {
            const tokenData = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { ...tokenData, token };  // Include the token for convenience
            next();
        } catch (jwtError) {
            // Handle specific JWT verification errors
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Token has expired. Please login again.",
                    status: false,
                    code: "TOKEN_EXPIRED"
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: "Invalid token. Please login again.",
                    status: false,
                    code: "INVALID_TOKEN"
                });
            } else {
                // For other JWT errors
                return res.status(401).json({
                    message: "Authentication failed",
                    error: jwtError.message,
                    status: false,
                    code: "AUTH_FAILED"
                });
            }
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            message: "Server error during authentication",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            status: false,
            code: "SERVER_ERROR"
        });
    }
}

module.exports = TokenVerify