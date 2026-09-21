import { Lexer } from '../services/lexer.service';
import { Parser } from '../services/parser.service';
import { Component, inject, ChangeDetectorRef } from '@angular/core';

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
    temp_esp: any = [];
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

        let buf_temp = "";
        for (let i = 0; i < this.monomios.length; ++i)
        {
            for (let j = 0; j < this.monomios[i].length; ++j)
            {
                let monomio_actual = this.monomios[i].charAt(j);
                if (isNaN(Number(monomio_actual)) && monomio_actual != '+' && monomio_actual != '-' && monomio_actual)
                {
                    if (monomio_actual == '^')
                    {
                        buf_temp += '^';
                        for (let k = j; k < this.monomios[i].length; ++k)
                        {
                            if (!isNaN(Number(this.monomios[i][k])))
                            {
                                buf_temp += this.monomios[i][k];

                            } else
                            {
                                console.log(`He llegado: i = ${i}, j = ${j}, k = ${k}, buf = ${buf_temp}`);
                            }
                        }

                    } else
                    {
                        console.log('Carácter individual: '+ monomio_actual);
                        buf_temp += monomio_actual;
                        console.log('Buffer: '+ buf_temp);
                    }
                
                }
                
                else
                {
                    if (buf_temp != '')
                    {
                        console.log(`He llegado: i = ${i}, j = ${j}, buf = ${buf_temp}`);
                        this.temp_esp.push(buf_temp);
                        buf_temp = "";
                    }
                }

            }
        }

        if (buf_temp != '')
        {
            console.log(`He llegado:, buf = ${buf_temp}`);
            this.temp_esp.push(buf_temp);
            buf_temp = "";
        }

        console.log(this.temp_esp);
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