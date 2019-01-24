import * as Multer from "multer";
import * as Boom from "boom";
import { mimeTypes } from "./../api/enums/mime-type.enum";

/**
 * Set Multer default configuration and file validation
 * 
 * @inheritdoc https://www.npmjs.com/package/multer
 * 
 * @param destination Directory where file will be uploaded
 * @param filesize Max file size authorized
 * @param filters Array of accepted mime types
 */
const set = (destination: String = './uploads/documents', filesize: Number = 1000000, filters: Array<String> = mimeTypes ) => {

  // Define storage destination and filename strategy
  let storage = Multer.diskStorage({
    destination: function (req: Request, file, next: Function) {
      next(null, destination)
    },
    filename: function (req: Request, file, next: Function) {
      next(null, file.originalname + '-' + Date.now())
    }
  });

  // Return configured multer instance, with size and file type rejection
  return Multer({ 
    storage : storage, 
    limits : {
      fileSize: filesize // In bytes = 0,95367 Mo
    },
    fileFilter: function(req: Request, file, next: Function) { 
      try {
        if(filters.filter( mime => file.mimetype === mime ).length > 0) {
          return next(null, true);
        }  
        return next( Boom.unsupportedMediaType('File mimetype not supported'), false );
      }
      catch(e) { next(Boom.expectationFailed(e.message) ); }
    } 
  });

};

export { set };
