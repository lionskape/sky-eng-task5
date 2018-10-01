import { ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { ModalOptions } from './modal-options';

export interface OnDestroyLike {
  ngOnDestroy(): void;
  [key: string]: any;
}

/**
 * Абстрактная модель модалки
 * @template T - Модель модального окна
 * @template T1 - Модель результата модального окна
 */
export abstract class  ModalComponent<T, T1> implements OnDestroy {

  /**
   * Обсервер, для возврата значения модалки
   */
  private observer: Observer<T1>;

  /**
   * Результат выполнения окна
   * @type {T1}
   */
  protected result: T1;

  /**
   * Ссылка для вставки модального окна
   */
  wrapper: ElementRef;

  /**
   * Ссылка на текущий настройки компоента
   */
  options: ModalOptions;

  /**
   * Коллбэк закрытия окна
   */
  private closerCallback: (component) => Promise<any>;

  constructor() {}

  /**
   * Прорбрасываем свойства переданного типа в наши собственные, что бы при утиной типизации быть не отличимыми
   * @param {T} data
   */
  mapDataObject(data: T): void {
    data = data || <T>{};
    const keys = Object.keys(data);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      this[key] = data[key];
    }
  }

  /**
   * Установка обсервера модальног оокна
   * @return {Observable<T1>}
   */
  setupObserver(): Observable<T1> {
    return Observable.create((observer) => {
      this.observer = observer;

      this.completeOnDestroy(this);

      // called if observable is unsubscribed to
      return () => {
        this.close();
      };
    });
  }


  /**
   * Установка обработчика закрытия модального окна
   * @param callback
   */
  onClosing(callback: ((component: ModalComponent<any, any>) => Promise<any>)): void {
    this.closerCallback = callback;
  }

  /**
   * Закрытие окна
   */
  close(): Promise<any> {
    return this.closerCallback(this);
  }

  /**
   * Закрытие окна по нажатию на эскейп
   * @param evt
   */
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.close();
  }

  /**
   * Завершает обзервер при уничтожении модального окна
   * @param component
   */
  private completeOnDestroy( component: OnDestroyLike) {
    const ngDestroyOriginal = component.ngOnDestroy;
    component.ngOnDestroy = () => {
      if (ngDestroyOriginal) {
        ngDestroyOriginal.apply(component);
      }
      if (this.observer) {
        this.observer.next(this.result);
        this.observer.complete();
      }
    };
  }

  ngOnDestroy() {}
}
