import {Base64Encode} from "base64-stream"

export const pdfToBase64 = (pdfDoc) => {
    let base64stream = pdfDoc.pipe(new Base64Encode());
    pdfDoc.end();

    let tempFileBase64 = '';

    base64stream.on('data', function (buffer) {
        let part = buffer.toString();
        tempFileBase64 += part;
    });

    return new Promise<string>((resolve, reject) => base64stream.on('end', () => resolve(tempFileBase64)));
};