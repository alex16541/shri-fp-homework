/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { allPass, equals, compose, gt, gte, ifElse, length, match, not, prop, tap, andThen, pipe, tryCatch } from 'ramda';
import Api from '../tools/api';

const api = new Api();

/**
 * Я – пример, удали меня
 */
const wait = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const toBinary = async (number) => await api.get('https://api.tech/numbers/base', {from: 10, to: 2, number});


const getAnimal = async (id) => await api.get(`https://animals.tech/${id}`, {});


const square = (v) => Math.pow(v, 2); 
const modThree = (v) => v % 3; 

const isStringValid = allPass([
    compose(
        gte(10),
        prop('length')
    ),
    compose(
        not,
        gt(2),
        prop('length')
    ),
    compose(
        not,
        equals('-'),
        prop('0'),
        String
    ),
    compose(
        equals(1),
        length,
        match(/^[\d.]+$/g)
    )
]);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog);
    const thenLog = andThen(log);

    const preapareString = pipe(
        Math.round,
        log,
        toBinary,
        andThen(prop('result')),
        andThen(prop('length')),
        thenLog,
        andThen(square),
        thenLog,
        andThen(modThree),
        thenLog,
        andThen(getAnimal),
        andThen(prop('result')),
        andThen(handleSuccess),
    );

    const process = compose(
        ifElse(
            isStringValid,
            preapareString,
            () => handleError('ValidationError'),
        ),
        log
    );

    tryCatch(
        process,
        () => handleError('NetworkError')
    )(value);
}

export default processSequence;
