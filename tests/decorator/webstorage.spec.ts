import { async, inject, TestBed } from '@angular/core/testing';
import { WebStorageModule } from '../../src/ngx-store';
import { CookieStorage, LocalStorage, SessionStorage, SharedStorage } from '../../src/decorator/webstorage';
import {
    CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService,
    WebStorageService
} from '../../src/service';

sessionStorage.setItem('ngx_twoDecorators', '128');
class TestClass {
    @LocalStorage() localStorageVariable: string = '';
    @SessionStorage() sessionStorageVariable: number = 42;
    @CookieStorage() cookieStorageVariable: boolean = false;
    @SharedStorage() sharedStorageVariable: any = null;

    @SharedStorage() @SessionStorage() twoDecorators: number = 0;
}
class TestClass2 {
    @LocalStorage() localStorageVariable: string = '';
    @SessionStorage() sessionStorageVariable: number = 0;
    @CookieStorage() cookieStorageVariable: boolean = false;
    @SharedStorage() sharedStorageVariable: any = null;
}
const testClass = new TestClass();
let testClass2: TestClass2;

describe('Decorators', () => {
    let localStorageService: LocalStorageService;
    let sessionStorageService: SessionStorageService;
    let cookiesStorageService: CookiesStorageService;
    let sharedStorageService: SharedStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WebStorageModule],
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
    });

    it('data in services should be equal like in decorators', () => {
        expect(localStorageService.get('localStorageVariable')).toBe('');
        expect(sessionStorageService.get('sessionStorageVariable')).toBe(42);
        expect(cookiesStorageService.get('cookieStorageVariable')).toBe(false);
        expect(sharedStorageService.get('sharedStorageVariable')).toBe(null);
        // expect(sharedStorageService.get('twoDecorators')).toBe(128);
    });

    it('changes in decorators should be reflected in services', () => {
        testClass.localStorageVariable = '43';
        testClass.sessionStorageVariable++;
        testClass.cookieStorageVariable = true;
        testClass.sharedStorageVariable = {};
        expect(testClass.localStorageVariable).toBe('43');
        expect(testClass.sessionStorageVariable).toBe(43);
        expect(testClass.cookieStorageVariable).toBe(true);
        expect(testClass.sharedStorageVariable).toEqual({});
        // expect(testClass.twoDecorators).toBe(43);
        expect(localStorageService.get('localStorageVariable')).toBe('43');
        expect(sessionStorageService.get('sessionStorageVariable')).toBe(43);
        expect(cookiesStorageService.get('cookieStorageVariable')).toBe(true);
        expect(sharedStorageService.get('sharedStorageVariable')).toEqual({});
        // expect(sharedStorageService.get('twoDecorators')).toBe(43);
    });

    it('changes in services should be reflected in decorators', () => {
        localStorageService.set('localStorageVariable', '44');
        sessionStorageService.set('sessionStorageVariable', 44);
        cookiesStorageService.remove('cookieStorageVariable');
        sharedStorageService.set('sharedStorageVariable', {a: 4});
        expect(testClass.localStorageVariable).toBe('44');
        expect(testClass.sessionStorageVariable).toBe(44);
        expect(testClass.cookieStorageVariable).toBeUndefined();
        expect(testClass.sharedStorageVariable).toEqual({a: 4});
        // expect(testClass.twoDecorators).toBe(44);
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

    afterAll(() => {
        localStorageService.clear();
        sessionStorageService.clear();
        cookiesStorageService.clear();
        sharedStorageService.clear();
    });

});
