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
define(["dojo/_base/declare", "esri/portal/Portal", "esri/portal/PortalQueryParams", "esri/core/watchUtils", "dojo/string",
  "ApplicationBase/ApplicationBase", "esri/identity/IdentityManager", "Application/calcite/js/calcite-web", "dojo/i18n!./nls/resources"
], function (
  declare, Portal, PortalQueryParams, watchUtils, string, ApplicationBase, esriId, calcite, i18n
) {
  return declare(null, {
    constructor: function () {
      this.CSS = {
        loading: "configurable-application--loading"
      };
      this.base = null;
    },
    init: function (base) {
      calcite.init();
      this.setupAuthentication(base.portal);

      var groupInfos = base.results.groupInfos[0];
      var groupItems = base.results.groupItems[0];
      var groupInfoResults = groupInfos.value && groupInfos.value.results;
      var groupItemsResults = groupItems.value && groupItems.value.results;
      var groupInfo = groupItemsResults && groupInfoResults[0];
      if (!groupInfos || !groupItems || !groupInfoResults || !groupItemsResults || !groupInfo) {
        return;
      }
      this.createGallery(groupItemsResults);
      document.body.classList.remove(this.CSS.loading);
    },
    createGallery: function (items) {
      if (items.results) {
        items = items.results;
      }
      var groupNode = document.getElementById("groupContainer");
      var cards = [];
      items.forEach(function (item) {
        cards.push(string.substitute("<div class='card block trailer-1'><div class='card-content'><h4>${title}</h4></div></div>", item));
      });
      groupNode.innerHTML = cards.join(" ");

    },
    queryUserInfo: function (portal) {
      var queryParams = new PortalQueryParams({
        query: "owner:" + portal.user.username,
        num: 5
      });
      portal.queryItems(queryParams).then(this.createGallery);
    },
    setupAuthentication: function (portal) {
      var logInButton = document.getElementById("logIn");
      var logOutButton = document.getElementById("logOut");
      var logInPanel = document.getElementById("logInPanel");
      var logOutPanel = document.getElementById("logOutPanel");
      logOutButton.addEventListener("click", function () {
        esriId.destroyCredentials();
        logOutPanel.classList.add("hide");
        logInPanel.classList.remove("hide");
      });
      watchUtils.watch(portal, "user", function () {
        // When user changes update data 
        logOutPanel.classList.remove("hide");
        logInPanel.classList.add("hide");
        document.getElementById("username").innerHTML = portal.user.username;
        document.getElementById("loggedInName").innerHTML = portal.user.fullName;
        this.queryUserInfo(portal);
      }.bind(this));
      logInButton.addEventListener("click", function () {
        esriId.getCredential(portal.url + "/sharing");
      });
    }
  });
});
