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
    monomios: any = [];
    parse(tokens: any, numbers: any, grafo: any)
    {
        console.log("PARSER TRABAJANDO..........");
        let buf = "";
        let j = 0;
        for (let i = 0; i < tokens.length; ++i)
        {
                if (tokens[i].type != TokenType.Operation && tokens[i].lex != '')
                {
                    buf += tokens[i].lex;
                
                }

                else
                {
                    if (buf != '')
                    {
                        console.log(`Monomio identificado: ${buf}`);
                        this.monomios.push(buf);
                        buf = "";
                        if (tokens[i].lex == '-')
                        {
                            buf += tokens[i].lex;
                        }
                    }
                }

        }

        for (let i = 0; i < tokens.length; ++i)
        {
            if (tokens[i].type == TokenType.Variable)
            {
                if (!this.buscarRepetidos(tokens[i].lex))
                {
                    this.variables.push(tokens[i].lex);
                }
            }
        }
        
        console.log(`Monomio identificado: ${buf}`);
        this.monomios.push(buf);
        buf = "";

        console.log(`Monomios:`);
        console.log(this.monomios);
    }

    returnMonomios(): any
    {
        return this.monomios;
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