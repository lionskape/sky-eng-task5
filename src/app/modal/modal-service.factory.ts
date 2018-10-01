import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';

import { ModalService, ModalServiceConfig } from './modal.service';

/**
 * Фабрика для сервиса модальных окон
 * @param { ComponentFactoryResolver } resolver
 * @param { ApplicationRef } applicationRef
 * @param { Injector } injector
 * @param { ModalServiceConfig } options
 * @return { ModalService }
 */
export function ModalServiceFactory(resolver: ComponentFactoryResolver,
                                    applicationRef: ApplicationRef,
                                    injector: Injector,
                                    options: ModalServiceConfig) {
    return new ModalService(resolver, applicationRef, injector, options);
}
