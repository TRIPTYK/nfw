// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/toKebabCase.md
export const toKebabCase = (str: string) =>
    str &&
    str
        .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x) => x.toLowerCase())
        .join("-");

// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/toSnakeCase.md
export const toSnakeCase = (str: string) =>
    str &&
    str
        .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x) => x.toLowerCase())
        .join("_");

// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/toCamelCase.md
export const toCamelCase = (str: string) => {
    const s =
        str &&
        str
            .match(
                /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
            )
            .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join("");
    return s.slice(0, 1).toLowerCase() + s.slice(1);
};
