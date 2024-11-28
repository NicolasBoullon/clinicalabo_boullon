import { trigger, style, animate, transition, query, keyframes } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  // Animación de deslizamiento para 'turnos'
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
  ]),

  transition('* => bounce', [
    query(':enter', [
      style({
        position: 'absolute',
        transform: 'translateY(-100%)',
        width: '100%',
        opacity: 0
      }),
      animate('1s ease-out', keyframes([
        style({ transform: 'translateY(0%)', opacity: 1, offset: 0.6 }),
        style({ transform: 'translateY(-15%)', offset: 0.75 }),
        style({ transform: 'translateY(0%)', offset: 1.0 })
      ]))
    ], { optional: true })
  ])
]);
