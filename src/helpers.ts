import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";

export const Colors = {
  LightGrey: "#F5F5F5",
  DarkGrey: "#EFEEEF",
  Error: "#941201",
  DarkBlue: "#447FA2",
  LightBlue: "#9BB4C8"
};

export const parseDataHeaderRowRange = (range: string): number =>
  pipe(
    range.trim().split(""),
    A.last,
    O.map((l) => (isNaN(Number(l)) ? 0 : Number(l))),
    O.getOrElse(() => 0)
  );
