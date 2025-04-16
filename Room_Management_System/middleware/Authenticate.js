const roles = require('../roles');

const PUBLIC_ROUTES = ['/UsLoginRoute', '/AdLoginRoute','/ForgotPasswordRoute'];

const checkAccess = (req, res, next) => {
    const userRole = req.session.role; // fallback role
    const baseUrl = req.baseUrl;
    const path = req.path;
    // console.log(userRole)
    // Normalize path (remove trailing slash unless it's just "/")
    let fullPath = baseUrl + path;

    if (fullPath.length > 1 && fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1);
    }
    
    if (PUBLIC_ROUTES.includes(fullPath)) {
        return next();
    }

    const accessibleRoutes = roles[userRole] || [];
    // const hasAccess = accessibleRoutes.includes(fullPath);
    const hasAccess = accessibleRoutes.some(route => fullPath.startsWith(route));
    // console.log("accessing: ", fullPath)
    // console.log("Accessible Routes:", accessibleRoutes);
    // console.log("Has Access:", hasAccess);

    if (!hasAccess) {
        console.log("Access Denied for Path:", fullPath);
    
        // Determine the redirection path
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
    
        // Perform a single redirect
        if (redirectPath) {
            return res.redirect(redirectPath);
        }
    }
    
    // ✅ Always call next if allowed
    return next();
};



module.exports = checkAccess;