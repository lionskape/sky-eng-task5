import { Component, ComponentFactoryResolver, OnDestroy, ReflectiveInjector, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { ModalComponent } from './modal.component';

/**
 * Подложка для модального окна
 */
@Component({
  styleUrls: ['./modal-wrapper.component.css'],
  selector: 'modal-wrapper',
  template: `
    <div #wrapper [ngClass]="modalClasses" role="dialog">
        <ng-template #viewContainer></ng-template>
    </div>
`
})
export class ModalWrapperComponent implements OnDestroy {

  /**
   * Ссылка на контент внутри контейнера
   */
  @ViewChild('viewContainer', {read: ViewContainerRef}) public viewContainer: ViewContainerRef;

  /**
   * Сссыка на контейнер
   */
  @ViewChild('wrapper') public wrapper;

  /**
   * Классы для добавления анимации и стилей модального окга
   */
  modalClasses = 'modal fade-anim';

  /**
   * Компонент диалогового окна
   * @type {ModalComponent}
   */
  content: ModalComponent<any, any>;

  /**
   * Коллбэк для клика вне модального окна
   */
  clickOutsideCallback: () => void;

  constructor(private resolver: ComponentFactoryResolver) {}

  /**
   * Добавление компонента
   * @param {Type<ModalComponent>} component
   * @return {ModalComponent}
   */
  addComponent<T, T1>(component: Type<ModalComponent<T, T1>>) {
    const factory = this.resolver.resolveComponentFactory(component);
    const injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainer.injector);
    const componentRef = factory.create(injector);
    this.viewContainer.insert(componentRef.hostView);
    this.content =  <ModalComponent<T, T1>> componentRef.instance;
    this.content.wrapper = this.wrapper;
    return this.content;
  }

  /**
   * Конфигурирование клика вне модального окна
   * @param callback
   */
  onClickOutsideModalContent( callback: () => void) {
    this.clickOutsideCallback = callback;
    const containerEl = this.wrapper.nativeElement;
    const contentEl = containerEl.querySelector(':first-child');
    contentEl.addEventListener('click', this.stopEventPropagation);
    containerEl.addEventListener('click', this.clickOutsideCallback, false);
  }

  ngOnDestroy() {
    if (this.clickOutsideCallback) {
      const containerEl = this.wrapper.nativeElement;
      containerEl.querySelector(':first-child').removeEventListener('click', this.stopEventPropagation);
      containerEl.removeEventListener('click', this.clickOutsideCallback, false);
      this.clickOutsideCallback = null;
    }
  }

  /**
   * Отмена нативного события
   * @param event
   */
  private stopEventPropagation(event) {
    event.stopPropagation();
  }
}


