import { trigger, style, animate, transition, query } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* => turnos', [
    query(':enter', [
      style({
        position: 'absolute',
        transform: 'translateY(-100%)',
        width: '100%',
        opacity: 0
      }),
      animate('2s ease-out', style({
        transform: 'translateY(0%)',
        opacity: 1
      }))
    ], { optional: true })
  ])
]);