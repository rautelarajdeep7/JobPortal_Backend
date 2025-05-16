// This is a middleware of multer which is used to upload files to the server. It is used to store the files in the specified directory.
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();


// 1.  Multer Storage CODE: It stores file in Server's Public folder.
/* export const storage = multer.diskStorage({     // diskStorage is a function which takes an object as an argument. It is used to give the destination and filename to the file which we are uploading.
    destination: function (req, file, cb) {     // This function is used to give the destination path to the file which we are uploading.
        cb(null, './Public');     // First argument is error and second argument is the path where the file will be stored. 
        // Currently we are storing in Public folder in our Backend server, later we will upload it to cloudinary or aws.
        // cb is callback and in backend express callbacks run asynchronously because of libuv.
        console.log("destination file details : ", file);
    },
    filename: function (req, file, cb) {        // This function is used to give the file a unique name.
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${Date.now()}_`+file.originalname)
        // cb(null, file.fieldname + '-' + uniqueSuffix)       // first argument is error and second argument is the name of the file.
        // fieldname is the name of the file which we are uploading and uniqueSuffix is the unique name which we are giving to the file.
    }
})
*/

// 2. multer-storage-cloudinary CODE : It stores file in Cloudinary Cloud Storage.

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,     // cloudinary key has value cloudinary which is the cloudinary object which we have created above in line 3.
    params: {
        folder: async (req, file) => {
            const Formats = ['image/jpeg', 'image/png', 'image/jpg'];
            if (Formats.includes(file.mimetype)) {      // If the file is an image then store it in images folder.
                return `${req.params.id}/images`;
            }
            else {
                return `${req.params.id}/resume`;    // If the file is not an image then store it in resume folder.
            }
        },

        format: async (req, file) => {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'];

            if (!allowedFormats.includes(file.mimetype)) {      // If the file is not an image or pdf then throw an error. e.g. if the file is a video then throw an error.
                throw new Error('Only jpg, jpeg, png, gif, pdf format allowed!');
            }
            return file.mimetype.split('/')[1];             // Return the format of the file. e.g. image/jpeg -> ['image', 'jpeg'] -> 'jpeg'
        }, // supports promises as well

        public_id: (req, file) => `${Date.now()}_${file.originalname}`,      // public_id is used to give the file a unique name.
    },
});


// const upload = multer({ storage: storage }) // This line will create an instance of multer and pass the storage object to it.