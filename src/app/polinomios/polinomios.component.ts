import { Lexer } from '../services/lexer.service';
import { Component, inject } from '@angular/core';

enum TokenType
{
    Number,
    Operation,
    Variable,
    Unknown,
};

@Component
({
    selector: 'app-polinomios',
    templateUrl: 'polinomios.html',
    styleUrl: '../app.css'
})

export class Polinomios 
{
    lexer = inject(Lexer);
    compilado = false;
    tokens: any = [];
    numbers: any = [];
    variables: any = [];
    valores: any = [];
    grafo: any = [];
    Enviar(expresion_algebraica: any)
    {
        this.numbers = [];
        this.variables = [];
        this.tokens = this.lexer.tokenize(expresion_algebraica);
        for (let i = 0; i < this.tokens.length; ++i)
        {
            if (this.tokens[i].type == TokenType.Variable)
            {
                if (!this.buscarRepetidos(this.tokens[i].lex))
                {
                    this.variables.push(this.tokens[i].lex);
                }
            
            } else if (this.tokens[i].type == TokenType.Number)
            {
                this.numbers.push(this.tokens[i].lex);
            }
        }
        console.log(this.variables);
        console.log(this.numbers);
        this.compilado = true;
    }

    Guardar(valor: any, variable: string)
    {
        this.valores.push({numero: valor, variable: variable});
        console.log(this.valores);
    }

    buscarRepetidos(lex: string): boolean
    {
        for (let i = 0; i < this.variables.length; ++i)
        {
            if (lex == this.variables[i].lex)
            {
                return true;
            }
        }

        return false;
    }
}
