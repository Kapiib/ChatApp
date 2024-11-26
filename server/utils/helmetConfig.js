const helmet = require ("helmet");

// Content Security Police (CSP)
const helmetOptions = {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"], // Allow content to be loaded only from the same origin
                scriptSrc: ["'self'",],
                styleSrc: ["'self'"],
                imgSrc: ["'self'"], 
                connectSrc: ["'self'"], 
                fonsSrc: ["'self'"],
                objectSrc: ["'none'"], // Disallow <object> tags to mitigate vulnerabilities like Flash

                // UpgradeInsecureRequests: [], automatically upgrade any HTTP requests to HTTPS (Is not using HTTPS thats why dont need it)
            }
        },
        crossOriginEmbedderPolicy: true, // Prevents sharing from untrusted sources using Cross-Origin Embedder Policy (COEP)
        xssFilter: true, // Prevents basic Cross-Site Scripting (XSS)
        frameguard: { action: "sameorigin" }, // Prevents clickjacking
        referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Only use when involved in sensitive data or external requests
        hidePoweredBy: true // Hides the X-powered-by header for a tiny bit of security, it is often express

        // hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Uncomment only in production with HTTPS
    };

module.exports = helmet(helmetOptions);