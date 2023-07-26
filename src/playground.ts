import { v } from "./v";

const validator = v(
  v.arrayOf(
    v.pair({
      key: [0, 1],
      value: v.string,
    })
  )
);

let x: unknown = 10;

if (validator(x)) {
  type B = typeof x;
  x.b;
}
