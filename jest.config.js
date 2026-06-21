module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/backend/tests', '<rootDir>/frontend/tests'],
  collectCoverage: true,
  collectCoverageFrom: ['backend/src/**/*.js', 'frontend/src/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
