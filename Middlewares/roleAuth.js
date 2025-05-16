// This middlware is sued to check if the user has a specific role or not. If the user has the specific role then only he/she can access the protected routes.

const roleAuth = (route_role) => {
    // We created a function which takes the role as an argument and returns a middleware function because we want to pass the 
    // role as an argument to the middleware function, which is not possible in the middleware function because middleware takes 
    // only req, res, next as arguments and nothing else.
    // So, we created a function which takes the role as an argument and created a middleware function inside it so that 
    // it can access the role from the parent function.

    return (req, res, next) => {

        try {
            const { role } = req.user; // It will take the role from the user object stored in the request object.
            /* Prints allowed roles for the route 
            route_role.forEach(element => {
                console.log(element);
            });
            */

            if (!role || !route_role.includes(role)) {
                throw new Error("User is not authorized to access this route.");
            }
            next();

        }
        catch (error) {
            console.log(error.message);
            // throw new Error("User is not authorized to access this route");
            res.status(401).json({ message: error.message });
        }

    }
}

export default roleAuth;