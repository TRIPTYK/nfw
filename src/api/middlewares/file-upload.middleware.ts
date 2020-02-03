import { BaseMiddleware } from "./base.middleware";
import { injectable, container } from "tsyringe";
import { MulterService, StorageType } from "../services/multer.service";
import { validateFile } from "../validations/document.validation";
import { Request , Response } from "express";

@injectable()
export default class FileUploadMiddleware extends BaseMiddleware {
    public use(req: Request, res: Response, next: (err?: any) => void, args: any = {}) {
        const { type = "single" , fieldName = "document" } = args;

        const multerService = container.resolve(MulterService)
            .makeMulter(StorageType.DISK, "./dist/uploads/documents", validateFile , 50000 );

        if (type === "single") {
            return multerService.single(fieldName)(req, res, next);
        } else {
            return multerService.array(fieldName)(req, res, next);
        }
    }
}
