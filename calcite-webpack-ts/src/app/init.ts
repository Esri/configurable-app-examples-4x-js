/*
  Copyright 2019 Esri
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

import ApplicationBase from "./application-base-js/ApplicationBase";
import i18n from "dojo/i18n!../nls/resources";

import applicationConfig from "../config/application.json";
import applicationBaseConfig from "../config/applicationBase.json";
import Application from "./Main";
import { ApplicationBaseSettings } from "./application-base-js/interfaces";

const Main = new Application();

new ApplicationBase({
  config: applicationConfig,
  settings: applicationBaseConfig as ApplicationBaseSettings
})
  .load()
  .then(
    base => Main.init(base),
    message => {
      if (message === "identity-manager:not-authorized") {
        document.body.classList.remove("configurable-application--loading");
        document.body.classList.add("app-error");
        const viewContainer = document.getElementById(
          "viewContainer"
        ) as HTMLElement;
        viewContainer.innerHTML = `<h1>${i18n.licenseError.title}</h1><p>${i18n.licenseError.message}</p>`;
      }
    }
  );
