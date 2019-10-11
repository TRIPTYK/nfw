import * as Multer from "multer";
import {validateFile} from "../api/validations/document.validation";
import {mimeTypes} from "../api/enums/mime-type.enum";


const uploadPath = "./dist/uploads/documents";

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
const set = (destination: string = uploadPath, filesize: number = 1000000, validate = validateFile) => {

    // Define storage destination and filename strategy
    const storage = Multer.diskStorage({
        destination(req: Request, file, next) {
            next(null, destination);
        },
        filename(req: Request, file, next) {
            next(null, `${file.originalname}-${Date.now()}`);
        }
    });

    // Return configured multer instance, with size and file type rejection
    return Multer({
        fileFilter: validate,
        limits: {
            fileSize: filesize // In bytes = 0,95367 Mo
        },
        storage
    });
};

const setMemory =
(   filesize: number = 1000000, filters: string[] = mimeTypes, validate = validateFile) => {
    // Define storage destination and filename strategy
    const storage = Multer.memoryStorage();

    // Return configured multer instance, with size and file type rejection
    return Multer({
        fileFilter: validate,
        limits: {
            fileSize: filesize // In bytes = 0,95367 Mo
        },
        storage
    });

};

export {set, setMemory, uploadPath};
