"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Split old listing specialities format
 *
 * @param string
 */
const splitListingParts = (string) => {
    let index = string.match(/^([0-9\.]+\.)/);
    let label = string.match(/^[0-9\.]+\.(.*)/);
    return { index, label };
};
exports.splitListingParts = splitListingParts;
