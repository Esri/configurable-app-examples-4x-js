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

define([
  "dojo/_base/declare",
  "ApplicationBase/ApplicationBase",
  "dojo/i18n!./nls/resources",
  "ApplicationBase/support/itemUtils",
  "ApplicationBase/support/domHelper"
], function (
  declare,
  ApplicationBase,
  i18n,
  itemUtils,
  domHelper
) {
  return declare(null, {

    constructor: function () {
      this.CSS = {
        loading: "configurable-application--loading"
      };
      this.base = null;
    },

    init: function (base) {
      if (!base) {
        console.error("ApplicationBase is not defined");
        return;
      }
      domHelper.setPageLocale(base.locale);
      domHelper.setPageDirection(base.direction);

      this.base = base;
      var config = base.config,
        results = base.results;
      var find = config.find,
        marker = config.marker;
      var webMapItems = results.webMapItems;
      var validWebMapItems = webMapItems.map(function (response) {
        return response.value;
      });
      var firstItem = validWebMapItems[0];
      if (!firstItem) {
        console.error("Could not load an item to display");
        return;
      }
      config.title = !config.title ? itemUtils.getItemTitle(firstItem) : null;
      domHelper.setPageTitle(config.title);

      var portalItem = this.base.results.applicationItem.value;
      var appProxies = (portalItem && portalItem.applicationProxies) ? portalItem.applicationProxies : null;
      var viewContainerNode = document.getElementById("viewContainer");
      var defaultViewProperties = itemUtils.getConfigViewProperties(config);
      validWebMapItems.forEach(function (item) {

        var viewNode = document.createElement("div");
        viewContainerNode.appendChild(viewNode);

        var viewProperties = defaultViewProperties;
        viewProperties.container = viewNode;
        itemUtils.createMapFromItem({
            item: item,
            appProxies: appProxies
          })
          .then(function (map) {
            viewProperties.map = map;
            return itemUtils.createView(viewProperties)
              .then(function (view) {
                return itemUtils.findQuery(find, view)
                  .then(function () {
                    return itemUtils.goToMarker(marker, view);
                  });
              });
          });
      });
      document.body.classList.remove(this.CSS.loading);

    }

  });

});
