export default {
  testEnvironment: "node",
  setupFiles: ["./tests/env.setup.js"],
  transform: {},
  setupFilesAfterEnv: ["./tests/setup.js"],
  verbose: true,
  testTimeout: 30000,
};
