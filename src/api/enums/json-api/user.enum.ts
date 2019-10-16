/**
 * Allowed json API includes
 */
export const userRelations: string[] = [
    "documents",
    "avatar"
];

/**
 * Allowed serialized elements
 */
export const userSerialize: string[] = ["username", "email", "firstname", "lastname", "role", "createdAt", "updatedAt", 'user'];

/**
 * Allowed deserialize elements
 */
export const userDeserialize: string[] = ["username", "email", "firstname", "password", "lastname", "role", 'user'];
