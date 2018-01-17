import { WebStorageService } from '../../src/service';

export const entries = {
    true: true,
    false: false,
    number: 42,
    string: '43',
    object: {
        property: 0,
        nested: {
            property: null
        },
    },
    array: [7, 6, 5, 4],
};

export const fillWithData = (service: WebStorageService) => {
    Object.entries(entries).forEach(([key, value]) => service.set(key, value));
};
