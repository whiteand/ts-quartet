/* eslint-disable @typescript-eslint/no-empty-object-type */

export type IfAny<T, Any, NotAny> = true extends T
  ? "1" extends T
    ? 1 extends T
      ? {} extends T
        ? (() => void) extends T
          ? null extends T
            ? Any
            : NotAny
          : NotAny
        : NotAny
      : NotAny
    : NotAny
  : NotAny;
