import * as Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import * as Moment from "moment-timezone";
import { Schema } from "express-validator";

export const getComment: Schema = {
    	id: {
    		in: [
    			'params'
    		],
    		errorMessage: 'Please provide a valid id',
    		isInt: true
    	}
    };
/**
 * Get validation for comment
 */
export const listComment: Schema = {};
/**
 * Create validation for comment
 */
export const createComment: Schema = {
    	text: {
    		optional: true,
    		isString: {
    			errorMessage: 'This field must be a string'
    		}
    	}
    };
/**
 * Replace validation for comment
 */
export const replaceComment: Schema = {
        ...exports.get,
        ...exports.create
    };
/**
 * Update validation for comment
 */
export const updateComment: Schema = {
        ...exports.get,
        ...{
        	text: {
        		optional: true,
        		isString: {
        			errorMessage: 'This field must be a string'
        		}
        	}
        }
    };
