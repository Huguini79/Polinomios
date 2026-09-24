import { Lexer } from '../services/lexer.service';
import { Parser } from '../services/parser.service';
import { Component, inject, ChangeDetectorRef } from '@angular/core';

enum TokenType {
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

export class Polinomios {
    constructor(private ref: ChangeDetectorRef) { }
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
    Enviar(expresion_algebraica: any) {
        this.numbers = [];
        this.variables = [];
        this.tokens = [];
        this.tokens = this.lexer.tokenize(expresion_algebraica);
        this.compilado = true;
        this.parser.parse(this.tokens, this.numbers, this.grafo);
        this.variables = this.parser.returnVariables();
        this.monomios = this.parser.returnMonomios();
        this.monomios_listos = true;

        this.completar_2_fase = true;
    }

    inc() {
        this.cont++;
    }

    Guardar(valor: any, variable: string) {
        this.valores.push({ numero: valor, variable: variable });
        console.log(this.valores);
    }

    CVN() {
        console.log("TRABAJANDO EN EL VALOR NUMÉRICO........");
        let mult = 1;
        /* Recorrer todos los monomios */
        for (let i = 0; i < this.monomios.length; ++i) {
            let jj = false;
            let num_a_mult = 1;
            /* Recorrer cada carácter del monomio individual dentro de la lista de monomios */
            for (let j = 0; j < this.monomios[i].length; ++j) {
                /* Bucle dedicado a detectar potencias para calcular */
                for (let k = 0; k < this.monomios[i].length; ++k) {
                    if (this.monomios[i][k] == '^') {
                        console.log("Potencia detectada");
                        console.log(`${this.monomios[i][k]}, i = ${i} | j = ${j}, k = ${k}`);
                        let buf_temp = "";
                        for (let l = k; l < this.monomios[i].length; ++l) {
                            if (!isNaN(Number(this.monomios[i][l]))) {
                                buf_temp += this.monomios[i][l];
                            }
                        }
                        mult = Math.pow(Number(this.returnValorDeVariable(this.monomios[i][k - 1])), Number(buf_temp));
                        console.log(`Mult después de la potencia: ${mult}`);
                        if ((k + 2) < this.monomios[i].length) {
                            break;

                        } else {
                            k += 2;
                        }
                    }
                }

                if (!isNaN(Number(this.monomios[i][0]))) {
                    let buf_temp = "";
                    console.log(`Número: ${this.monomios[i][j]}, i = ${i} | j = ${j}`);
                    for (let k = 0; k < this.monomios[i].length; ++k) {
                        if (!isNaN(Number(this.monomios[i][k]))) {
                            buf_temp += this.monomios[i][k];

                        } else {
                            break;
                        }
                    }

                    num_a_mult = Number(buf_temp);
                    buf_temp = "";
                    console.log(num_a_mult);
                    // mult *= Number(this.monomios[i][j]);

                } else {
                    if (!isNaN(Number(this.monomios[i][1]))) {
                        let buf_temp = "";
                        for (let k = 1; k < this.monomios[i].length; ++k) {
                            if (!isNaN(Number(this.monomios[i][k]))) {
                                buf_temp += this.monomios[i][k];

                            } else {
                                break;
                            }
                        }

                        num_a_mult = Number(buf_temp);
                        buf_temp = "";
                        console.log(num_a_mult);

                    } else {
                        console.log(`Variable: ${this.monomios[i][j]}, i = ${i} | j = ${j}`);
                        if (this.monomios[i][0] == '-') {
                            jj = true;
                            if (this.monomios[i][2] != '^') {
                                for (let k = 0; k < this.valores.length; ++k) {
                                    if (this.valores[k].variable == this.monomios[i][j]) {
                                        console.log(`${this.valores[k].variable} sustituido por ${this.valores[k].numero}`);
                                        mult *= Number(this.valores[k].numero);
                                        console.log(mult);
                                        j++;

                                    } else {
                                        num_a_mult = this.monomios[i][j];
                                        break;
                                    }
                                }
                            }

                        } else {
                            if (this.monomios[i][1] != '^') {
                                for (let k = 0; k < this.valores.length; ++k) {
                                    if (this.valores[k].variable == this.monomios[i][j]) {
                                        console.log(`${this.valores[k].variable} sustituido por ${this.valores[k].numero}`);
                                        mult *= Number(this.valores[k].numero);
                                        console.log(mult);
                                        j++;

                                    } else {
                                        num_a_mult = this.monomios[i][j];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                if (this.monomios[i][j + 1] != '^') {
                    if (this.monomios[i][j] == '-') {
                        jj = true;
                    }
                    for (let k = 0; k < this.valores.length; ++k) {
                        if (this.valores[k].variable == this.monomios[i][j + 1]) {
                            console.log(`${this.valores[k].variable} sustituido por ${this.valores[k].numero}`);
                            mult *= Number(this.valores[k].numero);
                            console.log(mult);
                        }
                    }
                }
            }


            if (jj) {
                console.log(`Num a multiplicar: ${num_a_mult}, con mult: ${mult} actual`);
                mult *= num_a_mult;
                console.log(`${mult}`);
                mult = -mult;
                jj = false;

            } else {
                console.log(`Num a multiplicar: ${num_a_mult}`);
                mult *= num_a_mult;
                num_a_mult = 1;
            }

            this.resultados.push(mult);
            console.log(this.resultados);
            mult = 1;
        }

        let sum = 0;
        for (let i = 0; i < this.resultados.length; ++i) {
            sum += this.resultados[i];
        }

        this.resultado_total = sum;

        sum = 0;

        this.resultado_total_listo = true;

        console.log(this.resultados);
    }

    returnValorDeVariable(variable: string): any {
        if (!isNaN(Number(variable))) {
            return variable;
        }
        for (let i = 0; i < this.valores.length; ++i) {
            if (this.valores[i].variable == variable) {
                return this.valores[i].numero;
            }
        }
    }
}