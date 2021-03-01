import React from "react";
import Typography from "@material-ui/core/Typography";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

export const Label: React.FC<{
  gray?: boolean;
}> = ({ gray, children }) => {
  const isGray = pipe(
    gray,
    O.fromNullable,
    O.getOrElse(() => false)
  );

  return (
    <Typography
      variant="subtitle2"
      gutterBottom
      style={{
        textAlign: "left",
        ...(isGray ? { color: "#D7D6D7" } : {})
      }}
    >
      {children}
    </Typography>
  );
};
