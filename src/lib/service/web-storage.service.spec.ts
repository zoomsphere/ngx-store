import { inject, TestBed } from '@angular/core/testing';
import { entries, fillWithData } from './web-storage.mock';
import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from './session-storage.service';
import { CookiesStorageService } from './cookies-storage.service';
import { SharedStorageService } from './shared-storage.service';
import { WebStorageService } from './webstorage.service';

// Test common methods of WebStorageService children classes
test(LocalStorageService);
test(SessionStorageService);
test(CookiesStorageService);
test(SharedStorageService);

function test(storageService: typeof WebStorageService): void {
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
      function testSave(key: string): void {
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
        // debugger;
        service.update('object', {property: 8});
        expect(service.get('object')).toEqual({
          property: 8,
          nested: {property: null},
        }, 'non-nested change');
        service.update('object', {nested: {property: true}});
        expect(service.get('object')).toEqual({
          property: 8,
          nested: {property: true},
        }, 'nested change');
      });

      it('should create new object if it does not exists', () => {
        service.update('newObject', {a: 1});
        expect(service.get('newObject')).toEqual({a: 1});
      });

      it('should throw an error when trying to update non-object', () => {
        Object.entries(entries).forEach(([value, key]) => {
          if (typeof value === 'object') {
            return;
          }
          expect(service.update.bind(null, key.toString(), {b: 2})).toThrowError();
        });
      });
    });

    describe('load() builder pattern', () => {
      it('chain should read proper value', () => {
        expect(service.load('object').setPath('nested.property').value).toBe(null);
        expect(service.load('non-existing').setDefaultValue('default').value).toBe('default');
        expect(service.load('object2')
          .setPath('non-existing')
          .setDefaultValue('default')
          .value).toBe('default');
      });
      it('chain should save value', () => {
        expect(service.load('new_key').save('==').value).toBe('==');
        expect(service.load('new_key').setDefaultValue(8).save(undefined).value).toBe(8);
        expect(service.load('object').setPath('nested.new_key').save(123).value).toBe(123);
        const expectedObject = {
          property: 0,
          nested: {
            property: null,
            new_key: 123,
          },
        };
        expect(service.get('object')).toEqual(expectedObject);
        expectedObject.nested.new_key = 125;
        expect(service.load('object')
          .setPath('nested')
          .update({new_key: 125})
          .value).toEqual(expectedObject.nested, 'update');
      });
      it('set and get values should be equal', () => {
        const resource = service.load('object').setDefaultValue(1).setPrefix('pre').setPath('nested');
        expect(resource.defaultValue).toBe(1);
        expect(resource.prefix).toBe('pre');
        expect(resource.path).toBe('nested');
        expect(resource.appendPath('new_key').path).toBe('nested.new_key');
        expect(resource.truncatePath().path).toBe('nested');
        expect(resource.resetPath().path).toBe('');
      });
      it('should change prefix', () => {
        const resource = service.load('prefix_change').save(true).changePrefix('pre_');
        expect(resource.value).toBe(true);
        expect(resource.prefix).toBe('pre_');
        expect(service.get('prefix_change')).toMatch(/null|undefined/);
        expect(service.utility.get('prefix_change', {prefix: 'pre_'})).toBe(true);
      });
    });

    describe('should delete specified data', () => {
      const expectation = /null|undefined/;
      it('from Resource', () => {
        expect(service.load('something_unique').save(true).remove().value).toMatch(expectation);
      });
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
        // tslint:disable-next-line
        expect(service.utility['_storage'].length).toMatch(expectedCount);
      });
    });
    afterAll(() => {
      service.clear('all');
    });
  });
}
