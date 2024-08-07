type TConfig = {
  readonly ignoreNameParts: readonly string[];
  readonly knownNames: readonly string[];
};

export default {
  ignoreNameParts: [],
  knownNames: [],
} as TConfig;
