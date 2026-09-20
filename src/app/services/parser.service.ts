import { Injectable } from '@angular/core';

enum TokenType
{
    Number,
    Operation,
    Variable,
    Unknown,
};

@Injectable(
{
    providedIn: 'root'
})

export class Parser
{
    variables: any = [];
    coincidencias: any = [];
    parse(tokens: any, numbers: any, grafo: any)
    {
        for (let i = 0; i < tokens.length; ++i)
        {
            let next = i + 1 < tokens.length ? true : false;
            let nextnext = i + 2 < tokens.length ? true : false;
            if (tokens[i].type == TokenType.Variable)
            {
                if (!this.buscarRepetidos(tokens[i].lex))
                {
                    this.variables.push(tokens[i].lex);
                    if (next)
                    {
                        if (tokens[i+1].type == TokenType.Variable)
                        {
                            grafo.push({vertex1: tokens[i].lex, vertex1type: TokenType.Variable, vertex2: tokens[i+1].lex, vertex2type: TokenType.Variable,arista: '*'});
                        
                        } else if (tokens[i+1].type == TokenType.Operation)
                        {
                            if (tokens[i-1].type == TokenType.Operation)
                            {
                                grafo.push({vertex1: tokens[i].lex, vertex1type: TokenType.Variable, vertex2: tokens[i+1].lex, vertex2type: TokenType.Operation, arista: 0});
                                
                            } else
                            {
                                grafo.push({vertex1: tokens[i+1].lex, vertex1type: TokenType.Operation, vertex2: 0, vertex2type: 0, arista: 0});
                            }
                        }
                    }
                }
            
            } else if (tokens[i].type == TokenType.Number)
            {
                numbers.push(tokens[i].lex);
                if (next)
                {
                    if(tokens[i+1].type == TokenType.Variable)
                    {
                        grafo.push({vertex1: tokens[i].lex, vertex1type: TokenType.Number, vertex2: tokens[i+1].lex, vertex2type: TokenType.Variable, arista: '*'});
                        if (nextnext)
                        {
                            if (tokens[i+2].type == TokenType.Operation)
                            {
                                grafo.push({vertex1: tokens[i+2].lex, vertex1type: TokenType.Operation, vertex2: 0, vertex2type: 0, arista: 0});
                            }
                            
                        }
                    }
                }
            }
        }

        for (let i = 0; i < grafo.length; ++i)
        {
            let next = i + 1 < grafo.length ? true : false;
            let nextnext = i + 2 < grafo.length ? true : false;
                if (grafo[i].vertex1type == TokenType.Number)
                {                    
                   
                        if (grafo[i].vertex2type == TokenType.Variable)
                        {
                            this.coincidencias.push({coeficiente: grafo[i].vertex1, parte_literal: grafo[i].vertex2});
                        }

                } else if (grafo[i].vertex1type == TokenType.Variable)
                {
                    this.coincidencias.push({parte_literal: grafo[i].vertex1});
                }
        }

        console.log(this.variables);
        console.log(this.coincidencias);
        console.log(numbers);
        console.log(grafo);
    }

    returnVariables(): any
    {
        return this.variables;
    }

    buscarRepetidos(lex: string): boolean
    {
        for (let i = 0; i < this.variables.length; ++i)
        {
            if (lex == this.variables[i])
            {
                return true;
            }
        }

        return false;
    }
}