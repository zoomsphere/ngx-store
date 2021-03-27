import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalStorageService } from './service/local-storage.service';
import { SessionStorageService } from './service/session-storage.service';
import { CookiesStorageService } from './service/cookies-storage.service';
import { SharedStorageService } from './service/shared-storage.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    LocalStorageService,
    SessionStorageService,
    CookiesStorageService,
    SharedStorageService,
  ],
})
export class NgxStoreModule {
  // methods for future use
  public static forRoot(): ModuleWithProviders<NgxStoreModule> {
    return {
      ngModule: NgxStoreModule,
    };
  }

  public static forChild(): typeof NgxStoreModule {
    return NgxStoreModule;
  }
}
