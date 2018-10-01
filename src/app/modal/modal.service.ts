import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, Optional, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalHolderComponent } from './modal-holder.component';
import { ModalComponent } from './modal.component';


export class ModalServiceConfig {
  container: HTMLElement | string = null;
}

@Injectable()
export class ModalService {

  /**
   * Компонент для хранения модальных окон
   * @type {ModalHolderComponent}
   */
  private modalHolderComponent: ModalHolderComponent;

  /**
   * html-конетейнер для модальных окон
   * type {HTMLElement | string}
   */
  private _container;

  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    @Optional() config: ModalServiceConfig) {
      if (config) {
        this.container = config.container as any;
      }
  }

  /**
   * Добавляет модальное окно в контейнер
   * @param {Type<ModalComponent<T, T1>>} component
   * @param {T?} data
   * @return {Observable<T1>}
   */
  addModal<T, T1>(component: Type<ModalComponent<T, T1>>, data?: T): Observable<T1> {
    if (!this.modalHolderComponent) {
      this.modalHolderComponent = this.createModalHolder();
    }
    return this.modalHolderComponent.addModal<T, T1>(component, data);
  }

  /**
   * Получение контейнера, автоматическая генерация если такового нет
   */

  private set container(c) {
    this._container = c;
  }

  private get container(): HTMLElement {
    if (typeof this._container === 'string') {
      this._container = document.getElementById(this._container);
    }

    if (!this._container) {
      const componentRootViewContainer = this.applicationRef['components'][0];
      this.container = (componentRootViewContainer.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    return this._container;
  }

  /**
   * Создает и добавление в дом контейнер длё модальных окон
   * @return {ModalHolderComponent}
   */
  private createModalHolder(): ModalHolderComponent {

    const componentFactory = this.resolver.resolveComponentFactory(ModalHolderComponent);

    const componentRef = componentFactory.create(this.injector);
    const componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.applicationRef.attachView(componentRef.hostView);

    componentRef.onDestroy(() => {
      this.applicationRef.detachView(componentRef.hostView);
    });

    this.container.appendChild(componentRootNode);

    return componentRef.instance;
  }

}
