import jwt from 'jsonwebtoken';

// This middleware is used to check whether the user is authenticated or not. If the user is authenticated then only he/she can access the protected routes.

const userAuth2 = async (req, res, next) => {

    // 1. Below code is used to authroize the user by checking the token stored in the cookies.

    // const token = req.cookies // It will give all the cookies stored in the request..

    const token = req.cookies.MyJWTtoken; // It will give the cookie named MyJWTtoken stored in the request.

    try {

        if (!token) {
            // return res.status(401).json({message: "User is not authenticated or Invalid token."});
            throw new Error("User is not authenticated or Invalid token.")
        }

        // IF token is present then we will verify the token.

        // JWT expired failed occurs in below line which crashes the server.
        const decoded = jwt.verify(token, "12345"); // It will verify the token and decode the token. first argument is the token and second argument is the secret key to decode the token.

        if (!decoded) {
            // return res.status(401).json({message: "Invalid token"});
            throw new Error("Invalid token")
        }

        // console.log("Decoded is : ", decoded);
        req.user = decoded; // It will store the decoded token in the request object.

        next();     // To send the request to the next middleware or route handler.

    }

    catch (err) {
        console.log("Error in user auth middleware: ", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }


    // console.log(token);
}


// For user auth using headers.
const userAuth = async (req, res, next) => {

    // 2. Now we will authenticate the user by checking the token stored in the headers.

    try {
        const token = req.headers["authorization"].split("Bearer ")[1];
        // It will take the Authorization header from the request and split the token from the header on the basis of space 
        // and take the second element of the array which is the token.
        // console.log(token);

        if (!token) {
            return res.status(401).json({ message: "User is not authenticated or Invalid token." });
        }

        const decoded = jwt.verify(token, "12345");

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    }
    catch (err) {
        console.log("Error in user auth middleware: ", err.message);
        return res.status(401).json({ message: "Error authenticating user" });
    }
}

export default userAuth;