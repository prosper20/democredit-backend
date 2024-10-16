import path from 'path';
import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: 'Tests (infra)',
  testMatch: ['**/@(src|tests)/**/*.@(infra).*'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {}],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve(__dirname, '../../'),
  }),
  globalSetup: './tests/globalDevEnvTestsSetup.ts',
});