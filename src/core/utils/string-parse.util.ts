export const booleanMap = {
    0: false,
    1: true,
    false: false,
    no: false,
    true: true,
    yes: true
};

export function parseBool(string: string): boolean {
    return booleanMap[string] === undefined ? false : booleanMap[string];
}
