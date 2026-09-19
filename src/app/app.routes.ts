import { Routes } from '@angular/router';
import { Home } from './home/home.component';
import { Polinomios } from './polinomios/polinomios.component';

export const routes: Routes = 
[
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },

    {
        path: 'inicio',
        component: Home,
        title: 'Inicio - Polinomios Huguini79'
    },

    {
        path: 'polinomios',
        component: Polinomios,
        title: 'Polinomios - Polinomios Huguini79'
    }
];
