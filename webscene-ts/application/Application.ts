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

/// <amd-dependency path="dojo/i18n!Application/nls/resources.js" name="i18n" />
declare const i18n: any;

import ApplicationBase from "ApplicationBase/ApplicationBase";

const CSS = {
  loading: "configurable-application--loading"
}

import {
  createMap,
  createView,
  getViewProperties,
  getItemTitle,
  setBasemap,
  setFindLocation,
  setGraphic
} from "ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";

import {
  ApplicationConfig,
  ApplicationBaseSettings
} from "ApplicationBase/interfaces";

class SceneExample {

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    if (!base) {
      console.error("Boilerplate is not defined");
      return;
    }

    setPageLocale(base.locale);
    setPageDirection(base.direction);

    this.base = base;

    const { config, results, settings } = base;
    const { find, marker } = config;
    const { webSceneItems } = results;

    const validWebSceneItems = webSceneItems.map(response => {
      return response.value;
    });

    const firstItem = validWebSceneItems[0];

    if (!firstItem) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !config.title ? getItemTitle(firstItem) : "";
    setPageTitle(config.title);

    const viewContainerNode = document.getElementById("viewContainer");
    const defaultViewProperties = getViewProperties(config);

    validWebSceneItems.forEach(item => {
      const viewNode = document.createElement("div");
      viewContainerNode.appendChild(viewNode);

      const viewProperties = {
        container: viewNode,
        ...defaultViewProperties
      };

      createMap(item)
        .then(map => setBasemap(map, config)
          .then(map => createView(map, viewProperties)
            .then(view => setFindLocation(find, view)
              .then(() => setGraphic(marker, view)))));
    });

    document.body.classList.remove(CSS.loading);
  }

}

export default SceneExample;
