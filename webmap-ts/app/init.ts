require([
  "dojo/text!config/applicationBase.json",
  "dojo/text!config/application.json",
  "ApplicationBase",
  "Application"
], (
  applicationBaseConfig,
  applicationConfig,
  ApplicationBase,
  Application
) => {
  const Main = new Application();
  new ApplicationBase({
    config: applicationConfig,
    settings: applicationBaseConfig
  }).load().then(base => Main.init(base));
});
