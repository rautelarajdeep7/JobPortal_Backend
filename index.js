import express from 'express';
import cors from 'cors';
import { dbConnect } from './Database/db_connection.js'; // It is used to connect to the database
import { Routes } from './Routes/user_routes.js'
import dotenv from 'dotenv'; // It is used to load environment variables from a .env file into process.env
import cookieParser from 'cookie-parser';

dotenv.config() // It will load the environment variables from the .env file into process.env

const PORT = process.env.PORT || 5000;          // If PORT is not defined in .env file  or the port 3000 is busy, then it will run on port 5000

const app = express();


// DB connection and PORT listening ======================================

(async () => {
    await dbConnect();
    app.listen(PORT, () => {
        console.log("Server running in PORT: ", PORT);
    })
})();


// Middleware ============================================

// Middleware to parse the cookies from the incoming request so that we can see the cookies in the backend.
app.use(cookieParser());     // It is used to parse the cookies from the incoming request and store it in req.cookies in the backend.


// app.use(cors());             // It will allow all origins to access the resource from backend.

app.use(     // It will allow only the mentioned origin to access the resource from backend.
    cors({
        origin: "https://job-portal-rajdeeprautela.vercel.app",    // It will allow requests from only localhost:5173 origin to access the resource from backend.    
        // origin: "*",  means allow all origins to access resource from backend.

        credentials: true,          // It allows the credentials to be shared between the frontend and backend like cookies can be shared between the frontend and backend.

        allowedHeaders: ["Content-Type", "Authorization"],      // It means it will allow creation of only the mentioned headers as the cutom Headers.

        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],      // It allows only these requests from the origin.
    })
)

app.use(express.json({ exteded: true, limit: '100kb' }));  
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://job-portal-rajdeeprautela.vercel.app' // Production frontend
];
// Middlware for Headers ====================================================
app.use((req,res,next)=>{       // Without this middleware, the frontend will not be able to access the headers from the backend.

    const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // It will allow only the mentioned origin to access the resource from backend.
  }
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // It will allow only the mentioned headers to be created as the custom headers.
    res.setHeader('Access-Control-Expose-Headers', 'Authorization'); // It will allow only the mentioned headers to be exposed to the frontend.
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

// Api Routes Middleware ====================================================

app.use('/api', Routes)


// Error Middlware to handle Error which occurs in our controllers.

app.use((err, req, res, next)=>{
    const status_code = err.statusCode || 500;
    const message_code = err.message || "Internal server error";
    console.log(err.message);

    res.status(status_code).json({message : message_code})
})