import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'todos',
        loadComponent: () => import('./components/todos-preview/todos-preview.component').then(m => m.TodosPreviewComponent)
    },
    {
        path: 'todos/:id',
        loadComponent: () => import('./components/todo/todo.component').then(m => m.TodoComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];