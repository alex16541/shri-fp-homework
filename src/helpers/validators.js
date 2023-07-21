/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { props } from "ramda";
import { all, allPass, compose, count, curry, equals, filter, gte, length, not, prop, reduce, tap } from "ramda";

// 1. Красная звезда, зеленый квадрат, все остальные белые.
const getTriangle = prop('triangle');
const getStar = prop('star');
const getCircle = prop('circle');
const getSquare = prop('square');

const isWhite = equals('white');
const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

const isTriangeGreen = compose(
    isGreen(),
    getTriangle
);

const allFiguresColorIs = (isFn, figures) => compose(
    all(isFn),
    toList
)(figures);

const countOfWhite = count(isWhite);
const countOfRed = count(isRed);
const countOfGreen = count(isGreen);
const countOfBlue = count(isBlue);
const countOfOrange = count(isOrange);
const countOfColors = reduce(
    (colors, figure) => {
        const newColors = {
            [figure]: 0,
            ...colors,
        }

        newColors[figure]++;
        
        return newColors
    },
    {}
);

const nEqualColorsExceptWhit = (n, figures) => compose(
    Boolean,
    length,
    filter(x => x >= n),
    toList,
    countOfColors,
    toList
)(figures)

const allEqual = (arr) => arr.every(v => v === arr[0]);

const validateN6 = (colors) => {
    return ( 
        colors.green === 2 &&
        colors.red === 1 && (
            colors.blue === 1 ||
            colors.white === 1 ||
            colors.orange === 1
        )
    ); 
};

const toList = (object) =>  Object.values(object);

export const validateFieldN1 = ({star, square, triangle, circle}) => {
    if (isWhite(triangle) || isWhite(circle)) {
        return false;
    }

    return isRed(star) && isGreen(square);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => gte(countOfGreen(Object.values(figures)), 2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => equals(countOfRed(toList(figures)), countOfBlue(toList(figures)));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({star, square, triangle, circle}) => 
        isBlue(circle) &&
        isRed(star) &&
        isOrange(square)

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => nEqualColorsExceptWhit(3, figures);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (figures) => compose(
    allPass([
        compose(
            validateN6,
            countOfColors,
            toList
        ),
        isTriangeGreen,
    ]),
)(figures);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => allFiguresColorIs(isOrange, figures);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (figures) => allPass([
    compose(
        not,
        isRed,
        getStar,
    ),
    compose(
        not,
        isWhite,
        getStar,
    )
])(figures);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => allFiguresColorIs(isGreen, figures);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (figures) => allPass([
    compose(
        allEqual,
        props(['triangle', 'square']),
    ),
    compose(
        not,
        isRed,
        getTriangle,
    )
])(figures);
