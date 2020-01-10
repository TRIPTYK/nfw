import * as Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import * as Moment from "moment-timezone";
import { Schema } from "express-validator";

export const getPost: Schema = {
    	id: {
    		in: [
    			'params'
    		],
    		errorMessage: 'Please provide a valid id',
    		isInt: true
    	}
    };
/**
 * Get validation for post
 */
export const listPost: Schema = {};
/**
 * Create validation for post
 */
export const createPost: Schema = {
    	email: {
    		optional: {
    			options: {
    				nullable: true,
    				checkFalsy: true
    			}
    		},
    		isLength: {
    			errorMessage: 'Maximum length is 255',
    			options: {
    				min: 0,
    				max: 255
    			}
    		},
    		isEmail: {
    			errorMessage: 'Email is not valid'
    		},
    		isString: {
    			errorMessage: 'This field must be a string'
    		}
    	},
    	nacelle: {
    		optional: {
    			options: {
    				nullable: true,
    				checkFalsy: true
    			}
    		},
    		isLength: {
    			errorMessage: 'Maximum length is 255',
    			options: {
    				min: 0,
    				max: 255
    			}
    		},
    		isString: {
    			errorMessage: 'This field must be a string'
    		}
    	},
    	reserv: {
    		optional: true,
    		custom: {
    			errorMessage: 'This field is not a valid date',
    			options: (date) => {
                    return Moment(date, true).isValid()
                }
    		}
    	},
    	place: {
    		optional: {
    			options: {
    				nullable: true,
    				checkFalsy: true
    			}
    		},
    		isLength: {
    			errorMessage: 'Maximum length is 11',
    			options: {
    				min: 0,
    				max: 11
    			}
    		},
    		isInt: {
    			errorMessage: 'This field must be an integer'
    		}
    	},
    	code: {
    		optional: {
    			options: {
    				nullable: true,
    				checkFalsy: true
    			}
    		},
    		isLength: {
    			errorMessage: 'Maximum length is 512',
    			options: {
    				min: 0,
    				max: 512
    			}
    		},
    		isString: {
    			errorMessage: 'This field must be a string'
    		}
    	}
    };
/**
 * Replace validation for post
 */
export const replacePost: Schema = {
        ...exports.get,
        ...exports.create
    };
/**
 * Update validation for post
 */
export const updatePost: Schema = {
        ...exports.get,
        ...{
        	email: {
        		optional: {
        			options: {
        				nullable: true,
        				checkFalsy: true
        			}
        		},
        		isLength: {
        			errorMessage: 'Maximum length is 255',
        			options: {
        				min: 0,
        				max: 255
        			}
        		},
        		isEmail: {
        			errorMessage: 'Email is not valid'
        		},
        		isString: {
        			errorMessage: 'This field must be a string'
        		}
        	},
        	nacelle: {
        		optional: {
        			options: {
        				nullable: true,
        				checkFalsy: true
        			}
        		},
        		isLength: {
        			errorMessage: 'Maximum length is 255',
        			options: {
        				min: 0,
        				max: 255
        			}
        		},
        		isString: {
        			errorMessage: 'This field must be a string'
        		}
        	},
        	reserv: {
        		optional: true,
        		custom: {
        			errorMessage: 'This field is not a valid date',
        			options: (date) => {
                        return Moment(date, true).isValid()
                    }
        		}
        	},
        	place: {
        		optional: {
        			options: {
        				nullable: true,
        				checkFalsy: true
        			}
        		},
        		isLength: {
        			errorMessage: 'Maximum length is 11',
        			options: {
        				min: 0,
        				max: 11
        			}
        		},
        		isInt: {
        			errorMessage: 'This field must be an integer'
        		}
        	},
        	code: {
        		optional: {
        			options: {
        				nullable: true,
        				checkFalsy: true
        			}
        		},
        		isLength: {
        			errorMessage: 'Maximum length is 512',
        			options: {
        				min: 0,
        				max: 512
        			}
        		},
        		isString: {
        			errorMessage: 'This field must be a string'
        		}
        	}
        }
    };
