/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");

  you may not use this file except in compliance with the License.

  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software

  distributed under the License is distributed on an "AS IS" BASIS,

  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and

  limitations under the License.​
*/

import applicationBaseConfig = require("dojo/text!config/applicationBase.json");
import applicationConfig = require("dojo/text!config/application.json");
import i18n = require("dojo/i18n!./nls/resources");
import ApplicationBase = require("ApplicationBase/ApplicationBase");

import Application = require("./Main");

const Main = new Application();

new ApplicationBase({
  config: applicationConfig,
  settings: applicationBaseConfig
})
  .load()
  .then(base => Main.init(base), (message) => {
    if (message === "identity-manager:not-authorized") {
      document.body.classList.remove("configurable-application--loading");
      document.body.classList.add("app-error");
      document.getElementById("viewContainer").innerHTML = `<h1>${i18n.licenseError.title}</h1><p>${i18n.licenseError.message}</p>`;
    }
  });
