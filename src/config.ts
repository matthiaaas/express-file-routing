const config = {
  VALID_FILE_EXTENSIONS: [".ts", ".js", ".mjs"],
  INVALID_NAME_SUFFIXES: [".d.ts"],
  IGNORE_PREFIX_CHAR: "_",
  DEFAULT_METHOD_EXPORTS: [
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "head",
    "connect",
    "options",
    "trace"
  ]
}

export default config
