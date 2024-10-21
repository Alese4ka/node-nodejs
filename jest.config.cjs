module.exports = {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest', 
  },
  extensionsToTreatAsEsm: ['.ts'], 
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', 
  }
};