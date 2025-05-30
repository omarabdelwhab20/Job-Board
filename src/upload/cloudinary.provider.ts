import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constant';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret: process.env.CLOUDINARY_APISECRET,
    });
  },
};
