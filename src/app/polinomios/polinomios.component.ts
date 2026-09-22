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
    resultados: any = [];
    resultado_total = 0;
    resultado_total_listo = false;
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

        this.completar_2_fase = true;
    }

    inc()
    {
        this.cont++;
    }

    Guardar(valor: any, variable: string)
    {
        this.valores.push({numero: valor, variable: variable});
        console.log(this.valores);
    }

    CVN()
    {
        /* 
            TODO: Implementar que se calculen los números elevados al cuadrado
        */
        let mult = 1;
        for (let i = 0; i < this.monomios.length; ++i)
        {
            for (let j = 0; j < this.monomios.length; ++j)
            {
                if (!isNaN(Number(this.monomios[i][j])))
                {
                    console.log(`Esto es un número: ${this.monomios[i][j]}`);
                    mult *= Number(this.monomios[i][j]);
                
                } else if (this.monomios[i][j] == '^')
                {
                    console.log("Potencia detectada");
                    mult = Math.pow(mult, this.monomios[i][j+1]);
                    console.log(`Mult después de la potencia: ${mult}`);
                    if ((j + 2) < this.tokens.length)
                    {
                        break;
                    
                    } else
                    {
                        j += 2;
                    }
                }
                
                else
                {
                    let jj = false;
                    if (this.monomios[i][j] == '-')
                    {
                        jj = true;
                    }
                    console.log(`¡Ojo!, esto no es un número, se supone que es una variable: ${this.monomios[i][j]}`);
                    for (let k = 0; k < this.valores.length; ++k)
                    {
                        if (this.valores[k].variable == this.monomios[i][j])
                        {
                            console.log(`${this.valores[k].variable} sustituido por ${this.valores[k].numero}`);
                            mult *= Number(this.valores[k].numero);
                            console.log(mult);
                        }
                    }

                    if (jj)
                    {
                        mult *= -mult;
                        jj = false;

                    }
                }
            }

            this.resultados.push(mult);
            mult = 1;
        }

        let sum = 0;
        for (let i = 0; i < this.resultados.length; ++i)
        {
            sum += this.resultados[i];
        }

        this.resultado_total = sum;

        sum = 0;

        this.resultado_total_listo = true;

        console.log(this.resultados);
    }
}