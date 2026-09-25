import { enableDebugTools } from '@angular/platform-browser';
import { Lexer } from '../services/lexer.service';
import { Parser } from '../services/parser.service';
import { Component, inject, ChangeDetectorRef, numberAttribute } from '@angular/core';

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
    posiciones_encontradas: any = [];
    grafo: any = [];
    temp_esp: any = [];
    monomios_listos = false;
    completar_2_fase = false;
    cont = 0;
    mult = 1;
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
        /* Recorrer todos los monomios */
        for (let i = 0; i < this.monomios.length; ++i) {
            this.mult = 1;
            let jj = false;
            let num_a_mult = 1;
            /* Bucle dedicado a detectar potencias para calcular */
            for (let k = 0; k < this.monomios[i].length; ++k) {
                if (this.monomios[i][k] == '^') {
                    console.log("Potencia detectada");
                    console.log(this.monomios[i][k - 1]);
                    console.log(`Mult antes de potencia: ${this.mult}`);
                    let numero = this.detectarNumero(this.monomios[i], k + 1);
                    console.log(numero);
                    let variable = this.returnValorDeVariable(this.monomios[i][k - 1]);
                    console.log(`Variable: ${variable}`);
                    console.log(Math.pow(variable, numero));
                    this.mult *= Math.pow(variable, numero);
                    this.posiciones_encontradas.push({ variable: this.monomios[i][k - 1], pos: k - 1 });
                    console.log(`Mult después de la potencia: ${this.mult}`);
                    if ((k + 2) < this.monomios[i].length) {
                        break;

                    } else {
                        k += 2;

                        if (isNaN(this.monomios[i][k])) {
                            if (k + 1 < this.monomios[i].length) {
                                if (this.monomios[i][k + 1] == '^') {
                                    let numero = this.detectarNumero(this.monomios[i], k);
                                    this.mult *= Math.pow(Number(this.returnValorDeVariable(this.monomios[i][k - 1])), numero);
                                    this.posiciones_encontradas.push({ variable: this.monomios[i][k - 1], pos: k - 1 });
                                }
                            }
                        }
                    }
                }
            }

            console.log(this.posiciones_encontradas);

            /* Recorrer cada carácter del monomio individual dentro de la lista de monomios */
            if (!isNaN(Number(this.monomios[i][0]))) {
                /* Es así..., entonces voy a guardar todos los números del coeficiente */
                console.log("Es así..., entonces voy a guardar todos los números del coeficiente");
                let numero = this.detectarNumero(this.monomios[i], 0);

                console.log(`Coeficiente: ${numero}`);
                console.log(`ii: ${i}`);
                num_a_mult = numero;
                console.log(`Número a multiplicar: ${num_a_mult}, mult actual = ${this.mult}`);

                /* Ver si hay variables para multiplicar */
                for (let k = 1; k < this.monomios[i].length; ++k) {
                    this.detectarVariables(this.monomios[i][k], this.monomios[i]);
                }

                // let next_term = i + 1 < this.monomios.length ? true : false;

                // if (next_term)
                // {   
                //     i++;

                // } else
                // {
                //     console.log("Soy el único ");
                //     break;
                // }

                // mult *= Number(this.monomios[i][j]);

            } else {
                /* Pues la verdad, a lo mejor es que hay un signo de operación, como una resta o suma, porque el primer carácter no es un número */
                console.log("Pues la verdad, a lo mejor es que hay un signo de operación, como una resta o suma, porque el primer carácter no es un número");
                if (this.monomios[i][0] == '-') {
                    /* Vaya..., todo el rato era una resta, bueno..., vamos a revisar si lo siguiente es un número, y si lo es, lo guardaremos como coeficiente, si no, ya damos por hecho que no tiene coeficiente este término */
                    /* Pero primero, debemos indicar con un flag, que este monomio es negativo :) */
                    console.log("Vaya..., todo el rato era una resta, bueno..., vamos a revisar si lo siguiente es un número, y si lo es, lo guardaremos como coeficiente, si no, ya damos por hecho que no tiene coeficiente este término");
                    jj = true;

                    let numero = this.detectarNumero(this.monomios[i], 1);

                    if (numero != '') {
                        /* Es un número, guardamos coeficiente */
                        console.log("Es un número, guardamos coeficiente");
                        num_a_mult = numero;
                        console.log(`Número a multiplicar: ${num_a_mult}, mult actual = ${this.mult}`);

                        for (let k = num_a_mult.toString().length; k < this.monomios[i].length; ++k) {
                            this.detectarVariables(this.monomios[i][k], this.monomios[i]);
                        }

                    } else {
                        /* Definitivamente, este término no tiene coeficiente */
                        console.log("Definitivamente, este término no tiene coeficiente");
                        num_a_mult = 1;

                        for (let k = 1; k < this.monomios[i].length; ++k) {
                            this.detectarVariables(this.monomios[i][k], this.monomios[i]);
                        }

                    }

                } else if (this.monomios[i][0] == '+') {
                    let numero = this.detectarNumero(this.monomios[i], 1);

                    if (numero != '') {
                        /* Es un número, guardamos coeficiente */
                        num_a_mult = numero;

                    } else {
                        /* Definitivamente, este término no tiene coeficiente */
                        num_a_mult = 1;

                        for (let k = 1; k < this.monomios[i].length; ++k) {
                            this.detectarVariables(this.monomios[i][k], this.monomios[i]);
                        }

                    }


                } else {
                    /* Bueno, no es ningún signo de operación, por lo tanto, es una variable (se supone) */
                    console.log("Bueno, no es ningún signo de operación, por lo tanto, es una variable (se supone)");

                    for (let k = 0; k < this.monomios[i]; ++k) {
                        this.detectarVariables(this.monomios[i][k], this.monomios[i]);
                    }
                }
            }

            if (jj) {
                console.log(`Num a multiplicar: ${num_a_mult}, con mult: ${this.mult} actual`);
                this.mult *= num_a_mult;
                console.log(`${this.mult}`);
                this.mult = -this.mult;
                jj = false;
                num_a_mult = 1;

            } else {
                console.log(`Num a multiplicar: ${num_a_mult}, mult actual = ${this.mult}`);
                this.mult *= num_a_mult;
                num_a_mult = 1;
            }

            this.resultados.push(this.mult);
            console.log(this.resultados);
            this.mult = 1;
            this.posiciones_encontradas.length = 0;
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
            console.log("returnValorDeVariable(): es un número");
            return variable;
        }
        for (let i = 0; i < this.valores.length; ++i) {
            if (this.valores[i].variable == variable) {
                console.log("returnValorDeVariable(): sí coincide la variable");
                console.log(this.valores[i].numero);
                return this.valores[i].numero;
            }
        }
    }

    detectarNumero(monomio: any, start: any): any {
        let buf_temp = "";
        for (let k = start; k < monomio.length; ++k) {
            if (monomio != '' && monomio != ' ') {
                if (!isNaN(Number(monomio[k]))) {
                    buf_temp += Number(monomio[k]);

                } else {
                    break;
                }
            }
        }

        return buf_temp;
    }

    detectarVariables(monomio: any, monomio_completo: any) {
        let cont = 0;
        for (let k = 0; k < this.valores.length; ++k) {
            if (isNaN(Number(monomio))) {
                console.log(`Bien, es una variable ${monomio}..., a revisar`);
                if (this.valores[k].variable == monomio) {
                    console.log(`Probando con ${monomio}`);
                    if (this.posiciones_encontradas.length != 0) {
                        console.log("Vale, previamente se calcularon potencias, vamos a ver qué posiciones tenemos prohibidas");
                        for (let l = 0; l < this.posiciones_encontradas.length; ++l) {
                            if (this.posiciones_encontradas[l].variable == monomio) {
                                this.posiciones_encontradas.pop();
                                console.log(this.posiciones_encontradas);
                                break;

                            } else {
                                cont++;
                                if (cont == this.posiciones_encontradas.length) {
                                    console.log("Aunque se calcularon potencias, esta variable no coincide como una de las potencias calculadas");
                                    console.log(`Coincidencia en la tabla de símbolos ${monomio}, mult actual = ${this.mult}`);
                                    console.log(`${monomio}=${this.valores[k].numero}`);
                                    this.mult *= this.valores[k].numero;
                                    console.log(this.mult);

                                    break;
                                }
                            }
                        }
                        break;

                    } else {
                        console.log("Vale, no hay potencias en este monomio");
                        console.log(`Coincidencia en la tabla de símbolos ${monomio}, mult actual = ${this.mult}`);
                        console.log(`${monomio}=${this.valores[k].numero}`);
                        this.mult *= this.valores[k].numero;
                        console.log(this.mult);
                        break;
                    }

                } else {
                    console.log(`Falló ${monomio}`);
                }

            } else {
                break;
            }
        }
    }
}

// if (!isNaN(Number(this.monomios[i][1]))) {
//     /* */
//     let buf_temp = "";
//     for (let k = 1; k < this.monomios[i].length; ++k) {
//         if (!isNaN(Number(this.monomios[i][k]))) {
//             buf_temp += this.monomios[i][k];

//         } else {
//             break;
//         }
//     }

//     num_a_mult = Number(buf_temp);
//     buf_temp = "";
//     console.log(num_a_mult);