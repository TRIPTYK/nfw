import * as Multer from "multer";
import Boom from "@hapi/boom";
import Func = Mocha.Func;
import {validateFile} from "nfw-core";
import {mimeTypes} from "nfw-core";


const uploadPath = './dist/uploads/documents';

/**
 * Set Multer default configuration and file validation
 *
 * @inheritdoc https://www.npmjs.com/package/multer
 *
 * @param destination Directory where file will be uploaded
 * @param filesize Max file size authorized
 * @param filters Array of accepted mime types
 * @param validate
 */
const set = (destination: string = uploadPath, filesize: number = 1000000,validate : Function = validateFile) => {

    // Define storage destination and filename strategy
    let storage = Multer.diskStorage({
        destination: function (req: Request, file, next: Function) {
            next(null, destination);
        },
        filename: function (req: Request, file, next: Function) {
            next(null, file.originalname + '-' + Date.now());
        }
    });

    // Return configured multer instance, with size and file type rejection
    return Multer({
        storage: storage,
        limits: {
            fileSize: filesize // In bytes = 0,95367 Mo
        },
        fileFilter: validate
    });
};

const setMemory = (filesize: number = 1000000, filters: Array<string> = mimeTypes,validate : Function = validateFile) => {

    // Define storage destination and filename strategy
    let storage = Multer.memoryStorage();

    // Return configured multer instance, with size and file type rejection
    return Multer({
        storage: storage,
        limits: {
            fileSize: filesize // In bytes = 0,95367 Mo
        },
        fileFilter: validate
    });

};

export {set, setMemory, uploadPath};
