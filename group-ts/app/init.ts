
import applicationBaseConfig = require("dojo/text!config/ApplicationBase.json");

import applicationConfig = require("dojo/text!config/application.json");

import ApplicationBase = require("ApplicationBase");
import Application = require("Application");


new ApplicationBase({
  config: applicationConfig,
  settings: applicationBaseConfig
}).load().then(ApplicationBase => {
  new Application().init(ApplicationBase);
});
