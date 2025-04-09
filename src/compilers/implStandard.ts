import { StandardSchemaV1 } from "@standard-schema/spec";
import { CompilationResult } from "../types";

export function implStandard<const T, const E>(
  v: CompilationResult<T, E>,
  explanationsToIssues: (explanation: readonly E[]) => StandardSchemaV1.Issue[]
): StandardSchemaV1<unknown, T> {
  return {
    "~standard": {
      validate: (value) =>
        v(value)
          ? {
              value: value as T,
              issues: undefined,
            }
          : {
              issues: explanationsToIssues(v.explanations),
            },
      vendor: "quartet",
      version: 1,
    },
  };
}
