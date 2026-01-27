import { v2 as cloudi } from "cloudinary";
import env from "dotenv";
env.config()


cloudi.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default cloudi;
