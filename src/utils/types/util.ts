export type PropsOfType<T extends object, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type StringPropOf<T extends object> = PropsOfType<T, string>;
export type NullableStringPropOf<T extends object> = PropsOfType<
  T,
  string | null | undefined
>;

export interface TypeCheckFunction<T> {
  (value: unknown): value is T;
}

/** an object with the value and setter from a React.useState hook */
export type WithStateHook<Name extends string, T> = Record<Name, T> &
  Record<`set${Capitalize<Name>}`, React.Dispatch<React.SetStateAction<T>>>;

/**
 * Same idea as WithStateHook, except the setter only accepts a new value, not a setter function
 * @see WithStateHook
 */
export type ValueAndSetter<Name extends string, T> = Record<Name, T> &
  Record<`set${Capitalize<Name>}`, (value: T) => void>;

/** Combines T and O, but for any common properties, the types from O are used */
export type WithOverrides<T, O> = DistributiveOmit<T, keyof O> & O;

// copied from @fluentui/react-utilities
/**
 * Helper type that works similar to Omit,
 * but when modifying a union type it will distribute the omission to all the union members.
 *
 * See [distributive conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types) for more information
 */
export type DistributiveOmit<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends keyof T | keyof any,
> = T extends unknown ? Omit<T, K> : T;
export type DistributivePick<T, K extends keyof T> = T extends unknown
  ? Pick<T, K>
  : T;
export type DistributiveIntersect<T, U> = T extends unknown
  ? U extends unknown
    ? T & U
    : never
  : never;

export type NonNullableProps<T, Keys extends keyof T = keyof T> = Omit<
  T,
  Keys
> & {
  [K in Keys]-?: NonNullable<Required<T>[K]>;
};

export type WithKeysRequired<T, Keys extends keyof T> = {
  [K in Keys]-?: Required<T>[K];
} & Omit<T, Keys>;

export type PartiallyRequired<T, Keys extends keyof T> = {
  [K in Keys]-?: Required<T>[K];
} & {
  [K in Exclude<keyof T, Keys>]?: T[K];
};

export type AtLeastOneRequired<
  T extends Record<string, unknown>,
  Keys extends keyof T = keyof T,
> = {
  [K in Keys]: PartiallyRequired<T, K>;
}[Keys];

export type ExclusivelyOneRequired<T extends Record<string, unknown>> = {
  [K in keyof T]: Record<K, Required<T>[K]> & {
    [J in Exclude<keyof T, K>]?: never;
  };
}[keyof T];
