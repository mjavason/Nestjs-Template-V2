module.exports = {
  apps: [
    {
      name: 'betguard',
      script: 'dist/main.js',
      exec_mode: 'fork',
      instances: 1,
      node_args: '',
    },
  ],
};
