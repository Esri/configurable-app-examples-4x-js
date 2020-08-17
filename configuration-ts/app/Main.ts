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

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import i18n = require("dojo/i18n!./nls/resources");

const CSS = {
  loading: "configurable-application--loading"
};

import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  getItemTitle,
  findQuery,
  goToMarker
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

import { init } from "esri/core/watchUtils";
import Accessor = require("esri/core/Accessor");
import { subclass, property } from "esri/core/accessorSupport/decorators";

import { esriWidgetProps } from "ApplicationBase/support/widgetConfigUtils/widgetConfigUtils";
import { getBasemaps, resetBasemapsInToggle } from "ApplicationBase/support/widgetConfigUtils/basemapToggle";
import BasemapToggle = require("esri/widgets/BasemapToggle");

/** 
 * Accessor-based class used to define configuration properties
*/
@subclass("configSettings")
class ConfigSetting extends Accessor {
  /** Turns BasemapToggle widget on/off */
  @property()
  basemapToggle: boolean;
  /** Specifies the view ui position where the BasemapToggle is placed */
  @property()
  basemapTogglePosition: string
  /** Specifies the Id of the Alternate Basemap in the BasemapToggle */
  @property()
  basemapSelector: string;
  /** Specifies the well-known-basemap-id of the Alternate Basemap in the BasemapToggle  */
  @property()
  nextBasemap: string;

  constructor(args) {
    super(args);
  }
}


class ConfigurationExample {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  _configurationSettings: ConfigSetting = new ConfigSetting({
    basemapToggle: true,
    basemapTogglePosition: "top-right",
    basemapSelector: "50974f77fe6940c5b251c9bcb5367d2b",
    nextBasemap: null
  });


  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;
  basemapToggle: __esri.BasemapToggle;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    if (!base) {
      console.error("ApplicationBase is not defined");
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

    const portalItem: __esri.PortalItem = this.base.results.applicationItem
      .value;
    const appProxies =
      portalItem && portalItem.applicationProxies
        ? portalItem.applicationProxies
        : null;

    const viewContainerNode = document.getElementById("viewContainer");
    const defaultViewProperties = getConfigViewProperties(config);

    validWebMapItems.forEach(item => {
      const viewNode = document.createElement("div");
      viewContainerNode.appendChild(viewNode);

      const container = {
        container: viewNode
      };

      const viewProperties = {
        ...defaultViewProperties,
        ...container
      };

      createMapFromItem({ item, appProxies }).then(map =>
        createView({
          ...viewProperties,
          map
        }).then((view: __esri.MapView) => {
          findQuery(find, view).then(() => goToMarker(marker, view));

          const widgetProps: esriWidgetProps = {
            view,
            config: this._configurationSettings,
            portal: this.base.portal
          };

          this._initPropertyWatchers(widgetProps);

          this._setupConfiguationChangesPanel(view);
        })
      );
    });

    document.body.classList.remove(CSS.loading);
  }


  private _initPropertyWatchers(widgetProps: esriWidgetProps) {

    const { view } = widgetProps;

    init(
      this._configurationSettings,
      "basemapToggle, basemapTogglePosition, basemapSelector, nextBasemap",
      async (newValue, oldValue, propertyName) => {
        const { basemapToggle, basemapTogglePosition } = this._configurationSettings;
        const { originalBasemap, nextBasemap } = await getBasemaps(widgetProps);
        // Decide what to do based on the property that changed
        switch (propertyName) {
          case "basemapToggle":
            if (basemapToggle) {
              this.basemapToggle = new BasemapToggle({ view, nextBasemap: nextBasemap });
              view.ui.add(this.basemapToggle, basemapTogglePosition);
            } else {
              resetBasemapsInToggle(this.basemapToggle, originalBasemap, nextBasemap);
              view.ui.remove(this.basemapToggle);
              this.basemapToggle.destroy();
            }
            break;
          case "basemapTogglePosition":
            view.ui.move(this.basemapToggle, basemapTogglePosition);
            break;
          case "basemapSelector":
            resetBasemapsInToggle(this.basemapToggle, originalBasemap, nextBasemap);
            break;
          case "nextBasemap":
            resetBasemapsInToggle(this.basemapToggle, originalBasemap, nextBasemap);
            break;
        }
      }
    );
  }


  private _setupConfiguationChangesPanel(view: __esri.MapView) {

    const changePanel: HTMLDivElement = document.createElement("div");
    changePanel.style.backgroundColor = "white";

    this._createButton(changePanel, "Toggle On/Off", (() => {
      this._configurationSettings.set(
        "basemapToggle",
        !this._configurationSettings.basemapToggle
      );
    }));

    this._createButton(changePanel, "Toggle Position", (() => {
      this._configurationSettings.set(
        "basemapTogglePosition",
        this._configurationSettings.basemapTogglePosition === "top-left" ? "top-right" : "top-left"
      );
    }));

    this._createButton(changePanel, "Toggle Alternate Basemap", (() => {
      this._configurationSettings.set(
        "basemapSelector",
        this._configurationSettings.basemapSelector === "6b556fa231a74a2e8d50be9533352cf3" ? "50974f77fe6940c5b251c9bcb5367d2b" : "6b556fa231a74a2e8d50be9533352cf3"
      );
    }));

    view.ui.add(changePanel, "top-left");
  }


  private _createButton(parentDOM: HTMLElement, btnText: string, clickFunc: any) {
    const btnDiv: HTMLDivElement = document.createElement("div");

    const btn: HTMLButtonElement = document.createElement("button");
    btn.textContent = btnText;
    btn.onclick = clickFunc;
    btn.classList.add("toggleButton");

    btnDiv.appendChild(btn);
    parentDOM.appendChild(btnDiv);
  }

}

export = ConfigurationExample;
