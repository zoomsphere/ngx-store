import { inject, TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../../ngx-store';
import {
    CookiesStorageService, SessionStorageService, SharedStorageService,
    WebStorageService
} from '../../src/service';
import { entries, fillWithData } from './web-storage.utils';

// Test common methods of WebStorageService children classes
test(LocalStorageService);
test(SessionStorageService);
test(CookiesStorageService);
test(SharedStorageService);

function test(storageService: typeof WebStorageService) {
    describe(storageService.name, () => {
        let service: WebStorageService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [storageService],
            });
        });

        beforeEach(inject([storageService], (serviceInjection: typeof storageService) => {
            service = (serviceInjection as any as WebStorageService);
            fillWithData(service);
        }));

        describe('should set and save value', () => {
            function testSave(key) {
                it(key, () => {
                    expect(service.get(key)).toEqual(entries[key]);
                    expect(service.utility.get(key)).toEqual(entries[key]);
                });
            }
            Object.entries(entries).forEach(([key, value]) => {
                testSave(key);
            });
        });

        describe('#update() method', () => {
            it('should merge changes with saved object', () => {
                service.update('object', { property: 8 });
                expect(service.get('object')).toEqual({
                    property: 8,
                    nested: { property: null },
                }, 'non-nested change');
                service.update('object', { nested: { property: true }});
                expect(service.get('object')).toEqual({
                    property: 8,
                    nested: { property: true },
                }, 'nested change');
            });

            it('should create new object if it does not exists', () => {
                service.update('newObject', {a: 1});
                expect(service.get('newObject')).toEqual({a: 1});
            });

            it('should throw an error when trying to update non-object', () => {
                Object.entries(entries).forEach(([value, key]) => {
                    if (typeof value === 'object') return;
                    expect(service.update.bind(null, key.toString(), {b: 2})).toThrowError();
                });
            });
        });

        describe('should delete specified data', () => {
        describe('load() builder pattern', () => {
            it('chain should read proper value', () => {
                expect(service.load('object').path('nested.property').value).toBe(null);
                expect(service.load('non-existing').defaultValue('default').value).toBe('default');
                expect(service.load('object').path('non-existing').defaultValue('default').value).toBe('default');
            });
            it('chain should save value', () => {
                expect(service.load('new_key').save('==').value).toBe('==');
                expect(service.load('new_key').defaultValue(8).save(undefined).value).toBe(8);
                expect(service.load('object').path('new_key').save(123).value).toBe(123);
                expect(service.get('object')).toEqual({
                    property: 0,
                    nested: {
                        property: null,
                    },
                    new_key: 123,
                });
            });
        });

            const expectation = /null|undefined/;
            it('by key', () => {
                Object.entries(entries).forEach(([key, value]) => {
                    service.remove(key);
                    expect(service.get(key)).toMatch(expectation);
                });
            });

            it('by prefix', () => {
                service.clear('prefix');
                Object.entries(entries).forEach(([key, value]) => {
                    expect(service.get(key)).toMatch(expectation);
                });
            });

            it('all', () => {
                let expectedCount: RegExp;
                switch (service.constructor) {
                    case LocalStorageService:
                        // NGX-STORE_prefix will remain
                        expectedCount = /1/;
                        break;
                    case CookiesStorageService:
                        // HTTP-only cookies cannot be removed by JS
                        // so any entries count is expected
                        expectedCount = /[0-9]+/;
                        break;
                    default:
                        expectedCount = /0/;
                }
                service.clear('all');
                expect(service.utility['_storage'].length).toMatch(expectedCount);
            });
        });
    });
}
