require([
  "dojo/text!config/applicationBase.json",
  "dojo/text!config/application.json",
  "ApplicationBase",
  "Application"
], (
  applicationBaseConfig,
  applicationConfig,
  ApplicationBase,
  Main
) => {
  new ApplicationBase({
    config: applicationConfig,
    settings: applicationBaseConfig
  }).load().then(applicationBase => {
    new Main().init(applicationBase);
  });
});
