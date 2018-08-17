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

import OAuthInfo = require("esri/identity/OAuthInfo");

import IdentityManager = require("esri/identity/IdentityManager");

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

    const portalItem: any = this.base.results.applicationItem.value;
    const appProxies =
      portalItem && portalItem.appProxies ? portalItem.appProxies : null;

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

      const { basemapUrl, basemapReferenceUrl } = config;

      createMapFromItem({ item, appProxies }).then(map =>
        createView({
          ...viewProperties,
          map
        }).then(view =>
          findQuery(find, view).then(() => goToMarker(marker, view))
        )
      );
    });

    document.body.classList.remove(CSS.loading);

    /*
    everything up to here is exactly the same as the 'webmap-js' sample in this repository
    everything afterward is lifted from our 3.x JSAPI OAuth sample
    https://developers.arcgis.com/javascript/3/jssamples/portal_oauth_popup.html
    */

    // if the url of the community org is known, it can be retrieved from the enterprise org metadata
    if (!config.communityPortalUrl) {
      config.communityPortalUrl =
        "https://" +
        base.portal.get(
          "portalProperties.hub.settings.communityOrg.portalHostname"
        );
    }

    // after a user has logged in, their token can be used to fetch premium content or run analysis that cost credits
    function snagUserInfo(credential: __esri.Credential): void {
      document.getElementById("sign-in").innerHTML =
        '<span class="phone-hide">' + credential.userId + "</span>";
    }

    function delayedOAuth(): void {
      // we need to point folks directly to the Hub Community org during OAuth to ensure that social media logins aren't converted to free public accounts, but rather become new Level 2 users
      const info = new OAuthInfo({
        appId: config.oauthappid,
        portalUrl: config.communityPortalUrl,
        // using a popup maintains application state (requires oauth-callback.html to be in place)
        popup: true
      });

      // override the default behavior of force redirecting to /home/signin.html in scenarios where app is hosted alongside ArcGIS Enterprise or on *.arcgis.com
      (IdentityManager as any).useSignInPage = false;

      IdentityManager.registerOAuthInfos([info]);

      // check to see if a user signed in during a previous visit
      IdentityManager.checkSignInStatus(info.portalUrl + "/sharing").then(
        snagUserInfo
      );

      // generic opportunity to sign in after the application has loaded
      const signInNode = document.getElementById("sign-in");
      signInNode.addEventListener("click", () => {
        IdentityManager.getCredential(info.portalUrl + "/sharing", {
          oAuthPopupConfirmation: false
        }).then(snagUserInfo);
      });

      // give folks an option to sign out
      const signOutNode = document.getElementById("sign-out");
      signOutNode.addEventListener("click", () => {
        IdentityManager.destroyCredentials();
        window.location.reload();
      });
    }

    delayedOAuth();
  }
}

export = MapExample;
