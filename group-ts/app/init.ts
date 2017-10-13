import applicationBaseConfig = require("dojo/text!config/applicationBase.json");
import applicationConfig = require("dojo/text!config/application.json");

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import Application from "./Main";

const Main = new Application();
new ApplicationBase({
  config: applicationConfig,
  settings: applicationBaseConfig
}).load().then(base => Main.init(base));
