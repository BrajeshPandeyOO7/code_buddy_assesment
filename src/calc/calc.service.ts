import { Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto): number | null {
    const { expression: _expr } = calcBody;
    if (_expr[_expr.length - 1].search(/[*+/-]/) >= 0) return null;

    const isvalid = _expr.match(/([*-+\/]+)/g)?.every(
      (
        i, // check operator invalid operator /*, */, //*, ***/ etc;
      ) => i.length === 1 || (i.length === 2 && (i[1] === '+' || i[1] === '-')),
    );
    if (isvalid != undefined && !isvalid) return null;

    const regex = /((\.\d+)|(\d+(\.\d+)?))|([+*-\/])/g;
    let arr_expr = _expr.match(regex) as string[];
    if (!arr_expr) return null;

    if (arr_expr[0] === '-') {
      // if first element is - operator then combine with second element;
      const [op, ele, ...rest] = arr_expr;
      rest.unshift(op + ele);
      arr_expr = rest;
    }

    if (arr_expr.length === 1) return Number(arr_expr[0]);

    for (let i = 1; i < arr_expr.length - 1; i++) {
      // if operators appear like ["9", "/", "+", "3", "+", "10", "*", "-", "5"]
      // manipulate like ["9", "/", "+3", "+", "10", "*", "-5"]
      if (
        arr_expr[i].search(/[*+/-]/) >= 0 &&
        arr_expr[i + 1].search(/[-+]/g) >= 0
      ) {
        arr_expr.splice(i + 1, 2, `${arr_expr[i + 1]}${arr_expr[i + 2]}`);
      }
    }

    const arth_fun: any = {
      '/': (a: string, b: string) => Number(a) / Number(b),
      '*': (a: string, b: string) => Number(a) * Number(b),
      '+': (a: string, b: string) => Number(a) + Number(b),
      '-': (a: string, b: string) => Number(a) - Number(b),
    };

    const operatorPrecdence: any = {
      '/': 12,
      '*': 12,
      '+': 11,
      '-': 11,
    };

    const eval_by_oper_pre = (
      operator: '/' | '*' | '+' | '-',
      __expr: string[],
      index = 1,
    ): string[] => {
      if (!__expr.includes(operator) || index === __expr.length - 1)
        return __expr;
      if (
        __expr[index] === operator ||
        operatorPrecdence[operator] === operatorPrecdence[__expr[index]]
      ) {
        const first_arg = __expr[index - 1];
        const second_arg = __expr[index + 1];
        const evaluated_response = arth_fun[__expr[index]](
          first_arg,
          second_arg,
        ).toString();
        __expr.splice(index - 1, 3, evaluated_response);
        return eval_by_oper_pre(operator, __expr, 1);
      } else {
        return eval_by_oper_pre(operator, __expr, index + 2);
      }
    };
    const op_prec = ['/', '*', '+', '-'];
    for (const oper of op_prec) {
      arr_expr = eval_by_oper_pre(oper as '/' | '*' | '+' | '-', arr_expr, 1);
    }

    return Number(arr_expr[0]);
  }
}
