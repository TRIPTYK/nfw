import { BaseMiddleware } from "@triptyk/nfw-core";
import { Request, Response } from "express";
import { autoInjectable, singleton } from "tsyringe";
import { MulterService, StorageType } from "../services/multer.service";
import { validateFile } from "../validations/document.validation";

export type FileUploadMiddlewareArgs = {
    type: "single" | "multiple";
    fieldName: string & "document";
};

@autoInjectable()
@singleton()
export class FileUploadMiddleware extends BaseMiddleware {
    public constructor(private multer: MulterService) {
        super();
    }

    public use(
        req: Request,
        res: Response,
        next: (err?: any) => void,
        args: FileUploadMiddlewareArgs
    ): any {
        const { type = "single", fieldName = "document" } = args;
        const multerInstance = this.multer.makeMulter(
            StorageType.DISK,
            "./dist/uploads/documents",
            validateFile,
            50000
        );

        if (type === "single") {
            return multerInstance.single(fieldName)(req, res, next);
        }
        return multerInstance.array(fieldName)(req, res, next);
    }
}
