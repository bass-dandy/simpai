/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	resolver: 'jest-ts-webcompat-resolver',
	testEnvironment: 'node',
	clearMocks: true,
	setupFilesAfterEnv: ['./jest.setup.ts'],
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	verbose: true,
};
