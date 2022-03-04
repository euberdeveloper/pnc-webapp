import Vue from 'vue';
import { UserRole } from '@prebenorwegian/sdk';

import { PluginObject } from 'vue/types/umd';
import { InputValidationRule } from 'vuetify';

const validator = {
    requiredText(name: unknown): InputValidationRule {
        return value => (!!value || value === '0' || value === 0) || `${name} is mandatory`
    },
    username(): InputValidationRule {
        return value => /^[\w.]+$/.test(value) || `Only letters, numbers and dots are allowed`;
    },
    password(): InputValidationRule {
        return (value: string) => {
            if (!value) {
                return false;
            }
            if (value.length < 8) {
                return 'Minimum 8 characters';
            }
            if (value.length > 32) {
                return 'Maximum 32 characters';
            }
            if (!/\d/.test(value)) {
                return 'At least one number';
            }
            if (!/[a-z]/.test(value)) {
                return 'At least one lowercase letter';
            }
            if (!/[A-Z]/.test(value)) {
                return 'At least one uppercase letter';
            }
            if (!/[@$!%*?&]/.test(value)) {
                return 'At least on special character among @$!%*?&';
            }
            if (!/^[A-Za-z\d@$!%*?&]*$/.test(value)) {
                return 'Some unallowed characters have been used';
            }
            return true;
        }
    },
    passwordsMatch(pwd: string): InputValidationRule {
        return value => (!value || value === pwd) || 'The passwords must match';
    },
    userRole(): InputValidationRule {
        return value => (!value || Object.values(UserRole).includes(value)) || `Invalid user role`;
    },
    email(): InputValidationRule {
        return value => (!value || /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value)) || `Invalid email`;
    },
    unique(values: string[]): InputValidationRule {
        return value => (!value || !values.includes(value)) || `This value is already present`;
    },
    max(n: string): InputValidationRule {
        return value => (!value || value.length <= n) || `Maximum length is ${n}`
    },
    min(n: string): InputValidationRule {
        return value => (!value || value.length >= n) || `Minimum length is ${n}`
    },
    lte(n: number): InputValidationRule {
        return value => (value <= n) || `Maximum value is ${n}`
    },
    gte(n: number): InputValidationRule {
        return value => (value >= n) || `Minimum value is ${n}`
    },
    length(n: number): InputValidationRule {
        return value => (!value || value.length === n) || `Length must be exactly ${n}`
    },
    numeric(): InputValidationRule {
        return value => (!value || /^\d+$/.test(value)) || `Only digits are allowed`
    },
    number(): InputValidationRule {
        return value => (!value || !isNaN(+value)) || `You must insert a valid number`
    },
    before(date: Date, dateValue: Date, txt?: string): InputValidationRule {
        return value => { 
            if (!value) {
                return true;
            }

            return (+dateValue <= +date) || (txt || `Date must be before ${date.toLocaleDateString()}`) 
        }
    },
    after(date: Date, dateValue: Date, txt?: string): InputValidationRule {
        return value => { 
            if (!value) {
                return true;
            }

            return (+dateValue >= +date) || (txt || `Date must be after ${date.toLocaleDateString()}`) 
        }
    },
};

export type Validator = typeof validator;


const validatorPlugin: PluginObject<unknown> = {
    install: function (Vue) {
        Vue.prototype.$validator = validator;
    }
}

Vue.use(validatorPlugin);

export default validator;