module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/out/'],
  reporters: ['default', ['jest-junit', {
      outputDirectory: './build',
      outputName: 'jest-junit.xml',
    }]
  ],
};
