import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'todos',
        loadComponent: () => import('./components/todos/todos-preview.component').then(m => m.TodosPreviewComponent)
    },
    {
        path: 'todos/:id',
        loadComponent: () => import('./components/todo/todo.component').then(m => m.TodoComponent)
    },
    //   {
    //     path: 'dashboard',
    //     // Tutaj w przyszłości podepniesz komponent ze swoimi notatkami/todo
    //     loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    //   },
    {
        path: '**',
        redirectTo: '' // Proste przekierowanie 404 na stronę główną
    }
];