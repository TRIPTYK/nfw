import * as Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import * as Moment from "moment-timezone";
import { Schema } from "express-validator";

export const getSetting: Schema = {
    	id: {
    		in: [
    			'params'
    		],
    		errorMessage: 'Please provide a valid id',
    		isInt: true
    	}
    };
/**
 * Get validation for setting
 */
export const listSetting: Schema = {};
/**
 * Create validation for setting
 */
export const createSetting: Schema = {
    	hours_start_save: {
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
    	minute_start_save: {
    		exists: true,
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
    	hours_end_save: {
    		exists: true,
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
    	minute_end_save: {
    		exists: true,
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
    	interval_save: {
    		exists: true,
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
    	}
    };
/**
 * Replace validation for setting
 */
export const replaceSetting: Schema = {
        ...exports.get,
        ...exports.create
    };
/**
 * Update validation for setting
 */
export const updateSetting: Schema = {
        ...exports.get,
        ...{
        	hours_start_save: {
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
        	minute_start_save: {
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
        	hours_end_save: {
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
        	minute_end_save: {
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
        	interval_save: {
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
        	}
        }
    };
