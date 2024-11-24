import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const upDownAnimation = trigger('upDownAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('2s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('1s ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
  ])
]);
