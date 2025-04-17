const roles = require('../roles');

const PUBLIC_ROUTES = ['/UsLoginRoute', '/AdLoginRoute','/ForgotPasswordRoute'];

const checkAccess = (req, res, next) => {
    const userRole = req.session.role;
    const baseUrl = req.baseUrl;
    const path = req.path;
    let fullPath = baseUrl + path;
    if (fullPath.length > 1 && fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1);
    }
    if (PUBLIC_ROUTES.includes(fullPath)) {
        return next();
    }
    const accessibleRoutes = roles[userRole] || []; 
    const hasAccess = accessibleRoutes.some(route => fullPath.startsWith(route));

    if (!hasAccess) {
        console.log("Access Denied for Path:", fullPath);
        let redirectPath;
        if (userRole === "admin") {
            redirectPath = "/AdLoginRoute";
        } else if (userRole === "user") {
            redirectPath = "/UsLoginRoute";
        } else if (fullPath.includes("/Ad")) {
            redirectPath = "/AdLoginRoute";
        } else if (fullPath.includes("/Us")) {
            redirectPath = "/UsLoginRoute";
        }
        if (redirectPath) {
            return res.redirect(redirectPath);
        }
    }
    return next();
};



module.exports = checkAccess;