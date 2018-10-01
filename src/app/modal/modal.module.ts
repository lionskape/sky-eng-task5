import { CommonModule } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, Injector, ModuleWithProviders, NgModule } from '@angular/core';

import { ModalHolderComponent } from './modal-holder.component';
import { ModalWrapperComponent } from './modal-wrapper.component';
import { ModalService, ModalServiceConfig } from './modal.service';
import { ModalServiceFactory } from './modal-service.factory';
import { defaultModalOptions, DefaultModalOptionConfig } from './modal-options';

@NgModule({
    declarations: [
        ModalHolderComponent,
        ModalWrapperComponent
    ],
    providers: [
        ModalService,
        {
          provide: DefaultModalOptionConfig,
          useValue: defaultModalOptions
        }
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        ModalHolderComponent,
        ModalWrapperComponent
    ]
})
export class ModalModule {
    static forRoot(config: ModalServiceConfig): ModuleWithProviders {
        return {
            ngModule: ModalModule,
            providers: [
                {provide: ModalServiceConfig, useValue: config},
                {
                    provide: ModalService,
                    useFactory: ModalServiceFactory,
                    deps: [ComponentFactoryResolver, ApplicationRef, Injector, ModalServiceConfig]
                }
            ]
        };
    }
}


