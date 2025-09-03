import type { Dispatch, SetStateAction } from 'react'


export type WithUndefined<T, U> = {
  [key in keyof T | keyof U]: key extends keyof T
    ? T[key]
    : undefined
}

export type Override<Base, T> = {
  [key in keyof Base | keyof T]: key extends keyof T
    ? (key extends keyof Base
      ? (Base[key] | T[key])
      : T[key])
    : (key extends keyof Base
      ? Base[key]
      : never)
}

export type Undefined<T> = {
  [key in keyof T]?: undefined
}

export type KeysSubtract<T, U> = {
  [key in keyof T]: key extends keyof U
    ? never
    : key
}

export type UndefinedSubtract<T, U> = {
  [key in KeysSubtract<T, U>[keyof KeysSubtract<T, U>]]?: undefined
}

export type Or<T, U> = (UndefinedSubtract<T, U> & U) |
  (UndefinedSubtract<U, T> & T)

export type HasType<Expect, Got extends Expect> = Got

export type StateTuple<T> = [ T, Dispatch<SetStateAction<T>> ]
