import { InjectionToken } from '@angular/core';

export let DefaultModalOptionConfig = new InjectionToken<ModalOptions>('default-modal.config');

export interface ModalOptions {
  closeOnEscape?: boolean;
  bodyClass?: string;
  wrapperDefaultClasses?: string;
  wrapperClass?: string;
  animationDuration?: number;
}

export const defaultModalOptions: ModalOptions = {
  closeOnEscape: true,
  bodyClass: 'modal-open',
  wrapperDefaultClasses: 'modal fade-anim',
  wrapperClass: 'in',
  animationDuration: 300
};
