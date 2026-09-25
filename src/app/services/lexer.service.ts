import { Injectable } from '@angular/core';

// interface Token
// {
//     lex: string;
//     type: TokenType;
// };

enum TokenType {
    Number,
    Operation,
    Variable,
    Potencia,
    Unknown,
};

@Injectable({
    providedIn: 'root'
})

export class Lexer {
    c = '';
    tokens: any = []

    tokenize(code: any): any {
        console.log("LEXER TRABAJANDO......");
        this.tokens = [];
        let buf = "";
        for (let i = 0; i < code.length; ++i) {
            this.c = code[i];

            if (this.c != ' ' && this.c != '') {
                if (!isNaN(Number(this.c))) {
                    buf += this.c;

                } else if (this.c == '+' || this.c == '-' || this.c == '*') {
                    if (buf != "")
                        this.tokens.push({ lex: buf, type: TokenType.Number });
                    this.tokens.push({ lex: this.c, type: TokenType.Operation });
                    buf = "";

                } else if (this.c == '^') {
                    let buf_temp = "^";

                    for (let j = i + 1; j < code.length; ++j) {
                        if (code[j] != '' && code[j] != ' ') {
                            if (!isNaN(Number(code[j]))) {
                                buf_temp += code[j];
                                i++;

                            } else {
                                break;
                            }
                        }
                    }

                    this.tokens.push({ lex: buf_temp, type: TokenType.Potencia });
                }

                else {
                    if (buf != "")
                        this.tokens.push({ lex: buf, type: TokenType.Number });
                    this.tokens.push({ lex: this.c, type: TokenType.Variable });
                    buf = "";
                }
            }
        }

        if (buf != "") {
            this.tokens.push({ lex: buf, type: TokenType.Number });
        }

        return this.tokens;
    }

    TokenTypeToString(type: TokenType): any {
        switch (type) {
            case TokenType.Number: return "Número"; break;
            case TokenType.Variable: return "Variable"; break;
            case TokenType.Operation: return "Operación"; break;
            case TokenType.Potencia: return "Potencia"; break;
            default: return "Desconocido"; break;
        }
    }
}