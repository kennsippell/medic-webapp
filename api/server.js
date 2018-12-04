const environment = require('./src/environment'),
  serverChecks = require('@medic/server-checks'),
  logger = require('./src/logger');

process.on('unhandledRejection', reason => {
  logger.error('Unhandled Rejection:');
  logger.error('%o',reason);
});

serverChecks.check(environment.serverUrl).then(() => {
  const app = require('./src/routing'),
    config = require('./src/config'),
    migrations = require('./src/migrations'),
    ddocExtraction = require('./src/ddoc-extraction'),
    translations = require('./src/translations'),
    serverUtils = require('./src/server-utils'),
    apiPort = process.env.API_PORT || 5988;

  const skipStartup = !!process.env.API_SKIP_STARTUP;
  let startupSteps = Promise.resolve();

  if (!skipStartup) {
    startupSteps = startupSteps
      .then(() => logger.info('Extracting ddoc…'))
      .then(ddocExtraction.run)
      .then(() => logger.info('DDoc extraction completed successfully'));
  }

  startupSteps = startupSteps
    .then(() => logger.info('Loading configuration…'))
    .then(config.load)
    .then(() => logger.info('Configuration loaded successfully'))
    .then(config.listen);
  
  if (!skipStartup) {
    startupSteps
      .then(() => logger.info('Merging translations…'))
      .then(translations.run)
      .then(() => logger.info('Translations merged successfully'))

      .then(() => logger.info('Running db migrations…'))
      .then(migrations.run)
      .then(() => logger.info('Database migrations completed successfully'));
  }

  startupSteps
    .catch(err => {
      logger.error('Fatal error initialising medic-api');
      logger.error('%o',err);
      process.exit(1);
    })
    
    .then(() => {
      // Define error-handling middleware last.
      // http://expressjs.com/guide/error-handling.html
      app.use((err, req, res, next) => {
        // jshint ignore:line
        if (res.headersSent) {
          // If we've already started a response (eg streaming), pass on to express to abort it
          // rather than attempt to resend headers for a 5xx response
          return next(err);
        }
        serverUtils.serverError(err, req, res);
      });
    })

    .then(() =>
      app.listen(apiPort, () => {
        logger.info('Medic API listening on port ' + apiPort);
      })
    );
});
