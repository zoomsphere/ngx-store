import { inject, TestBed } from '@angular/core/testing';
import { CookieStorage, LocalStorage, SessionStorage, SharedStorage } from './webstorage';
import { SharedStorageService } from '../service/shared-storage.service';
import { LocalStorageService } from '../service/local-storage.service';
import { SessionStorageService } from '../service/session-storage.service';
import { CookiesStorageService } from '../service/cookies-storage.service';
import { WebstorableArray, WebstorableObject } from '../ngx-store.types';
import { NgxStoreModule } from '../ngx-store.module';
import { OnDestroy } from '@angular/core';

sessionStorage.setItem('ngx_twoDecorators', '128');

class TestClass {
  @LocalStorage() localStorageVariable: string = '';
  @SessionStorage() sessionStorageVariable: number = 42;
  @CookieStorage() cookieStorageVariable: boolean = false;
  @SharedStorage() sharedStorageVariable: any = null;
  @LocalStorage() arrayVariable: Array<number> = [];
  @SessionStorage('customKeyVariable') customKey: WebstorableArray<string> = ['some', 'values'] as any;
  // TODO make it working with {key: 'customObject', prefix: ''}
  @CookieStorage('customObject') customCookie: WebstorableObject = {} as any;

  @SharedStorage() @LocalStorage() arrayOfObjects: Array<any> = [{}, {}, {}];
  @SharedStorage() @SessionStorage() twoDecorators: number = 0;
}

class TestClass2 {
  @LocalStorage() localStorageVariable: string = '';
  @SessionStorage() sessionStorageVariable: number = 0;
  @CookieStorage() cookieStorageVariable: boolean = false;
  @SharedStorage() sharedStorageVariable: any = null;
}

const testClass: TestClass = new TestClass();
let testClass2: TestClass2;

describe('Decorators', () => {
  let localStorageService: LocalStorageService;
  let sessionStorageService: SessionStorageService;
  let cookiesStorageService: CookiesStorageService;
  let sharedStorageService: SharedStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxStoreModule],
    });
  });

  beforeEach(inject([
      LocalStorageService,
      SessionStorageService,
      CookiesStorageService,
      SharedStorageService],
    (
      localStorageServiceInjection: LocalStorageService,
      sessionStorageServiceInjection: SessionStorageService,
      cookiesStorageServiceInjection: CookiesStorageService,
      sharedStorageServiceInjection: SharedStorageService,
    ) => {
      localStorageService = localStorageServiceInjection;
      sessionStorageService = sessionStorageServiceInjection;
      cookiesStorageService = cookiesStorageServiceInjection;
      sharedStorageService = sharedStorageServiceInjection;
    }));

  it('initial data should be as set in TestClass', () => {
    expect(testClass.localStorageVariable).toBe('');
    expect(testClass.sessionStorageVariable).toBe(42);
    expect(testClass.cookieStorageVariable).toBe(false);
    expect(testClass.sharedStorageVariable).toBe(null);
    expect(testClass.twoDecorators).toBe(128);
    expect(testClass.arrayVariable).toEqual([]);
    expect(testClass.customKey).toEqual(['some', 'values']);
    expect(testClass.customCookie).toEqual({} as any);
    expect(testClass.arrayOfObjects.length).toBe(3);
  });

  it('data in services should be equal like in decorators', () => {
    expect(localStorageService.get('localStorageVariable')).toBe('');
    expect(sessionStorageService.get('sessionStorageVariable')).toBe(42);
    expect(cookiesStorageService.get('cookieStorageVariable')).toBe(false);
    expect(sharedStorageService.get('sharedStorageVariable')).toBe(null);
    expect(sharedStorageService.get('twoDecorators')).toBe(128);
    expect(localStorageService.get('arrayVariable')).toEqual([]);
    expect(sessionStorageService.get('customKeyVariable')).toEqual(['some', 'values']);
    expect(cookiesStorageService.get('customObject')).toEqual({});
    expect(sharedStorageService.get('arrayOfObjects').length).toBe(3);
    expect(localStorageService.get('arrayOfObjects').length).toBe(3);
  });

  it('changes in decorators should be reflected in services', () => {
    testClass.localStorageVariable = '43';
    testClass.sessionStorageVariable++;
    testClass.cookieStorageVariable = true;
    testClass.sharedStorageVariable = {};
    testClass.twoDecorators = 43;
    testClass.arrayVariable.push(1);
    testClass.arrayVariable.push(2);
    testClass.arrayVariable.unshift(0);
    testClass.customKey.reverse();
    testClass.customCookie.newProperty = true;
    const anotherProperty = {
      a: 'a',
      b: 'b',
      c: false,
      d: 3,
      e: [3, 4, 5],
    };
    testClass.customCookie.anotherProperty = anotherProperty;
    testClass.customCookie.save();
    testClass.arrayOfObjects.map(object => {
      object.property = true;
    });
    testClass.arrayOfObjects.pop();
    testClass.arrayOfObjects.shift();
    expect(testClass.localStorageVariable).toBe('43');
    expect(testClass.sessionStorageVariable).toBe(43);
    expect(testClass.cookieStorageVariable).toBe(true);
    expect(testClass.sharedStorageVariable).toEqual({});
    expect(testClass.twoDecorators).toBe(43);
    expect(testClass.arrayVariable).toEqual([0, 1, 2]);
    expect(testClass.customKey).toEqual(['values', 'some']);
    expect(testClass.customCookie).toEqual({newProperty: true, anotherProperty} as any);
    expect(testClass.arrayOfObjects).toEqual([{property: true}]);
    expect(localStorageService.get('localStorageVariable')).toBe('43');
    expect(sessionStorageService.get('sessionStorageVariable')).toBe(43);
    expect(cookiesStorageService.get('cookieStorageVariable')).toBe(true);
    expect(sharedStorageService.get('sharedStorageVariable')).toEqual({});
    expect(sharedStorageService.get('twoDecorators')).toBe(43);
    expect(localStorageService.get('arrayVariable')).toEqual([0, 1, 2]);
    expect(sessionStorageService.get('customKeyVariable')).toEqual(['values', 'some']);
    expect(cookiesStorageService.get('customObject')).toEqual({newProperty: true, anotherProperty});
    expect(sharedStorageService.get('arrayOfObjects')).toEqual([{property: true}]);
    expect(localStorageService.get('arrayOfObjects')).toEqual([{property: true}]);
  });

  it('changes in services should be reflected in decorators', () => {
    localStorageService.set('localStorageVariable', '44');
    sessionStorageService.set('sessionStorageVariable', 44);
    cookiesStorageService.remove('cookieStorageVariable');
    sharedStorageService.set('sharedStorageVariable', {a: 4});
    sharedStorageService.set('twoDecorators', 44);
    sessionStorageService.set('customKeyVariable', ['']);
    cookiesStorageService.update('customObject', {anotherProperty: []});
    sharedStorageService.set('arrayOfObjects', []);
    expect(testClass.localStorageVariable).toBe('44');
    expect(testClass.sessionStorageVariable).toBe(44);
    expect(testClass.cookieStorageVariable).toBeUndefined();
    expect(testClass.sharedStorageVariable).toEqual({a: 4});
    expect(testClass.twoDecorators).toBe(44);
    expect(testClass.customKey).toEqual(['']);
    expect(testClass.customCookie).toEqual({newProperty: true, anotherProperty: []} as any);
    expect(testClass.arrayOfObjects).toEqual([]);
    localStorageService.set('arrayOfObjects', [{a: 1}]);
    expect(testClass.arrayOfObjects).toEqual([{a: 1}]);
  });

  it('values should be initially set in another class', () => {
    testClass.localStorageVariable = 'string';
    testClass.sessionStorageVariable = 2018;
    testClass.cookieStorageVariable = true;
    testClass.sharedStorageVariable = {a: 4};
    testClass2 = new TestClass2();
    expect(testClass2.localStorageVariable).toBe('string');
    expect(testClass2.sessionStorageVariable).toBe(2018);
    expect(testClass2.cookieStorageVariable).toBe(true);
    expect(testClass2.sharedStorageVariable).toEqual({a: 4});
  });

  it('changes from one class should be visible in the other one', () => {
    testClass2 = new TestClass2();
    testClass2.localStorageVariable = 'localStorage';
    testClass2.sessionStorageVariable = 911;
    testClass2.cookieStorageVariable = false;
    testClass2.sharedStorageVariable = {b: 5};
    expect(testClass.localStorageVariable).toBe('localStorage');
    expect(testClass.sessionStorageVariable).toBe(911);
    expect(testClass.cookieStorageVariable).toBe(false);
    expect(testClass.sharedStorageVariable).toEqual({b: 5});
  });

  it('migration should work properly', () => {
    class MigrationTest implements OnDestroy {
      @LocalStorage({migrateKey: 'oldKey', key: 'newKey'}) migration = 'migration';
      public ngOnDestroy(): void {}
    }
    const migrationTest = new MigrationTest();
    expect(migrationTest.migration).toBe('migration');
    expect(localStorageService.get('oldKey')).toBe(null);
    expect(localStorageService.get('newKey')).toBe('migration');
    migrationTest.ngOnDestroy();
    localStorageService.set('oldKey', 'migrated');
    class MigratedTest {
      @LocalStorage({migrateKey: 'oldKey', key: 'newKey'}) migration = 'migration';
    }
    expect(new MigratedTest().migration).toBe('migrated');
    expect(localStorageService.get('oldKey')).toBe(null);
    expect(localStorageService.get('newKey')).toBe('migrated');
  });

  afterAll(() => {
    localStorageService.clear('all');
    sessionStorageService.clear('all');
    cookiesStorageService.clear('all');
    sharedStorageService.clear('all');
  });

});
