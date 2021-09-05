import { IOptions } from './types';
import * as pt from 'path';

export const REQUIRE_MAIN_FILE = pt.dirname(require.main.filename);

export const defaultOptions: IOptions = {
    directory: pt.join(pt.dirname(require.main.filename), "routes"),
    methodExports: [],
    verbose: process.env.NODE_ENV !== 'production',
  }
  