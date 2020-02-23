import { BaseMiddleware } from "../../core/middlewares/base.middleware";
import { injectable } from "tsyringe";
import { MulterService, StorageType } from "../services/multer.service";
import { validateFile } from "../validations/document.validation";
import { Request , Response } from "express";

@injectable()
export default class FileUploadMiddleware extends BaseMiddleware {
    constructor(private multer: MulterService) {
        super();
    }

    public use(req: Request, res: Response, next: (err?: any) => void, args: any = {}) {
        const { type = "single" , fieldName = "document" } = args;
        const multerInstance = this.multer.makeMulter(StorageType.DISK, "./dist/uploads/documents", validateFile , 50000 );

        if (type === "single") {
            return multerInstance.single(fieldName)(req, res, next);
        } else {
            return multerInstance.array(fieldName)(req, res, next);
        }
    }
}
