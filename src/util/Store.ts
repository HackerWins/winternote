export const GETTER_PREFIX: string = '*/';
export const ACTION_PREFIX: string = '/';

export function GETTER (str: string) {
    return GETTER_PREFIX + str ;
}

export function ACTION (str: string) {
    return ACTION_PREFIX + str ;
}
