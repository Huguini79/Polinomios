import { Lexer } from '../services/lexer.service';
import { Parser } from '../services/parser.service';
import { Component, inject, ChangeDetectorRef } from '@angular/core';

@Component
({
    selector: 'app-polinomios',
    templateUrl: 'polinomios.html',
    styleUrl: '../app.css'
})

export class Polinomios 
{
    constructor(private ref: ChangeDetectorRef) {}
    lexer = inject(Lexer);
    parser = inject(Parser);
    compilado = false;
    tokens: any = [];
    numbers: any = [];
    variables: any = [];
    monomios: any = [];
    valores: any = [];
    grafo: any = [];
    monomios_listos = false;
    completar_2_fase = false;
    cont = 0;
    cont_intern = 0;
    Enviar(expresion_algebraica: any)
    {
        this.numbers = [];
        this.variables = [];
        this.tokens = [];
        this.tokens = this.lexer.tokenize(expresion_algebraica);
        this.compilado = true;
        this.parser.parse(this.tokens, this.numbers, this.grafo);
        this.variables = this.parser.returnVariables();
        this.monomios = this.parser.returnMonomios();
        this.monomios_listos = true;
    }

    inc()
    {
        this.cont++;
    }

    Guardar(valor: any, variable: string)
    {
        this.cont_intern++;
        if (this.cont_intern <= this.cont)
        {    
            this.valores.push({numero: valor, variable: variable});
            console.log(this.valores);
        
        } else
        {
            this.completar_2_fase = true;
        }

        console.log(this.cont);
        console.log(this.cont_intern);
    }
}