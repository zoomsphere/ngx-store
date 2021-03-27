export const findDescriptor = (proto: any, key: string): PropertyDescriptor | undefined => {
    if (!proto) return undefined;
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (descriptor) {
        return descriptor;
    } else {
        return findDescriptor(Object.getPrototypeOf(proto), key);
    }
};
