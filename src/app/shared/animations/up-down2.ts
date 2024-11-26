import { trigger, style, animate, transition, query } from '@angular/animations';

export const slideZoomInAnimation = trigger('routeAnimations', [
    transition('* => pacientes', [
      query(':enter', [
        style({
          position: 'absolute',
          transform: 'translateY(-100%) scale(0.8)', 
          width: '100%',
          opacity: 0
        }),
        animate('2s ease-out', style({
          transform: 'translateY(0%) scale(1)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ]);