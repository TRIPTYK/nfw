import { readdirSync } from "fs";
import { join } from "path";

export function recursiveReadDir(path = "") {
    const entries = readdirSync(join(process.cwd(), path), {
        withFileTypes: true
    });
    const files = entries
        .filter((file) => !file.isDirectory())
        .map((file) => ({ ...file, path: path + file.name }));
    const folders = entries.filter((folder) => folder.isDirectory());

    for (const folder of folders)
        files.push(...recursiveReadDir(`${path}${folder.name}/`));

    return files;
}
