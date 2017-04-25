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

class MapExample {

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
    const { webMapItems } = results;

    const validWebMapItems = webMapItems.map(response => {
      return response.value;
    });

    const firstItem = validWebMapItems[0];

    if (!firstItem) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !config.title ? getItemTitle(firstItem) : "";
    setPageTitle(config.title);

    const viewContainerNode = document.getElementById("viewContainer");
    const defaultViewProperties = getViewProperties(config);

    validWebMapItems.forEach(item => {
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

export default MapExample;
