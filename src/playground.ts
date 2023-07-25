import { v } from "./v";

const validator = v(v.never);

let x: unknown = 10;

if (validator(x)) {
  type B = typeof x;
  x;
}
