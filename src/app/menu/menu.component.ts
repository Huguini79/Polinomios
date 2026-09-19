import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component
({
    selector: 'app-menu',
    imports: [RouterLink],
    templateUrl: 'menu.html',
    styleUrl: '../app.css'
})

export class Menu {}