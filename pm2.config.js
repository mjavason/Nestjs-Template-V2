module.exports = {
  apps: [
    {
      name: 'startup',
      script: 'dist/main.js',
      exec_mode: 'fork',
      instances: 1,
      node_args: '',
    },
  ],
};
