import { AnyFunction } from "../types/global";

export async function mesure(expression: AnyFunction) {
    const startTime = Date.now();
    await expression();
    return Date.now() - startTime;
}
