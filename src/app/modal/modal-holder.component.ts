import { Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { Observable } from 'rxjs';

import { ModalOptions, DefaultModalOptionConfig } from './modal-options';
import { ModalWrapperComponent } from './modal-wrapper.component';
import { ModalComponent } from './modal.component';

/**
 * Менеджер контейнера модальных окон, хранит в себе модальные окна
 * inside the viewvontainer
 */
@Component({
  selector: 'modal-holder',
  template: '<ng-template #viewContainer></ng-template>',
})
export class ModalHolderComponent {

  /**
   * Контейнер для вставки модальных окон
   */
  @ViewChild('viewContainer', { read: ViewContainerRef }) public viewContainer: ViewContainerRef;

  /**
   * modal Коллекция наполняемая функциями добавления\удаления модального окна
   * @type {Array<ModalComponent> }
   */
  modals: Array<ModalComponent<any, any>> = [];

  constructor(private resolver: ComponentFactoryResolver,
    @Inject(DefaultModalOptionConfig) private defaultModalOptions: ModalOptions ) { }

  /**
   * Добавление модального окна в общий пул
   * @param {Type<ModalComponent>} component
   * @param {object?} data
   * @return {Observable<*>}
   */
  addModal<T, T1>(component: Type<ModalComponent<T, T1>>, data?: T): Observable<T1> {

    const factory = this.resolver.resolveComponentFactory(ModalWrapperComponent);
    const componentRef = this.viewContainer.createComponent(factory);
    const modalWrapper: ModalWrapperComponent = <ModalWrapperComponent>componentRef.instance;
    const _component: ModalComponent<T, T1> = modalWrapper.addComponent(component);

    _component.options = Object.assign({}, this.defaultModalOptions);

    modalWrapper.modalClasses = _component.options.wrapperDefaultClasses;

    this.modals.push(_component);

    this.wait().then(() => {
      this.toggleWrapperClass(modalWrapper.wrapper, _component.options.wrapperClass);
      this.toggleBodyClass(_component.options.bodyClass);
    });

    _component.onClosing((modal) => this.removeModal(modal));

    this.configureCloseOnClickOutside(modalWrapper);

    _component.mapDataObject(data);

    return _component.setupObserver();
  }

  /**
   * Удаление модального окна
   * @param {ModalComponent} closingModal
   * @returns {Promise<void>}
   */
  removeModal(closingModal: ModalComponent<any, any>): Promise<any> {
    const options = closingModal.options;
    this.toggleWrapperClass(closingModal.wrapper, options.wrapperClass);
    return this.wait(options.animationDuration).then(() => {
      this.removeModalFromArray(closingModal);
      this.toggleBodyClass(options.bodyClass);
    });
  }

  /**
   * Переключает классы body в зависимости от наличия модальных окон
   * @param bodyClass - string to add and remove from body in document
   */
  private toggleBodyClass(bodyClass: string) {
    if (!bodyClass) {
      return;
    }
    const body = document.getElementsByTagName('body')[0];
    const bodyClassItems = bodyClass.split(' ');
    if (!this.modals.length) {
      body.classList.remove(...bodyClassItems);
    } else {
      body.classList.add(...bodyClassItems);
    }
  }

  /**
   * Установим обработчик закрытия модального окна при клике вне этого модального окна
   * @param modalWrapper
   */
  private configureCloseOnClickOutside(modalWrapper: ModalWrapperComponent) {
    modalWrapper.onClickOutsideModalContent(() => {
      modalWrapper.content.close();
    });
  }

  /**
   * Установим обработчик смены  класса контейнера
   * @param modalWrapperEl
   * @param wrapperClass
   */
  private toggleWrapperClass(modalWrapperEl: ElementRef, wrapperClass: string) {
    const wrapperClassList = modalWrapperEl.nativeElement.classList;
    const wrapperClassItems = wrapperClass.split(' ');
    if (wrapperClassList.toString().indexOf(wrapperClass) !== -1) {
      wrapperClassList.remove(...wrapperClassItems);
    } else {
      wrapperClassList.add(...wrapperClassItems);
    }
  }

  /**
   * Хелпер-функция для отложенного исполнения
   * @param ms
   */
  private wait(ms: number = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), ms);
    });
  }

  /**
   * Удаление объекта из коллекции
   * @param {ModalComponent} component
   */
  private removeModalFromArray(component) {
    const index = this.modals.indexOf(component);
    if (index > -1) {
      this.viewContainer.remove(index);
      this.modals.splice(index, 1);
    }
  }

}
