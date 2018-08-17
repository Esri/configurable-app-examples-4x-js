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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/identity/OAuthInfo", "esri/identity/IdentityManager"], function (require, exports, itemUtils_1, domHelper_1, OAuthInfo, IdentityManager) {
    "use strict";
    var CSS = {
        loading: "configurable-application--loading"
    };
    var MapExample = /** @class */ (function () {
        function MapExample() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        MapExample.prototype.init = function (base) {
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results, settings = base.settings;
            var find = config.find, marker = config.marker;
            var webMapItems = results.webMapItems;
            var validWebMapItems = webMapItems.map(function (response) {
                return response.value;
            });
            var firstItem = validWebMapItems[0];
            if (!firstItem) {
                console.error("Could not load an item to display");
                return;
            }
            config.title = !config.title ? itemUtils_1.getItemTitle(firstItem) : "";
            domHelper_1.setPageTitle(config.title);
            var portalItem = this.base.results.applicationItem.value;
            var appProxies = portalItem && portalItem.appProxies ? portalItem.appProxies : null;
            var viewContainerNode = document.getElementById("viewContainer");
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            validWebMapItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var container = {
                    container: viewNode
                };
                var viewProperties = __assign({}, defaultViewProperties, container);
                var basemapUrl = config.basemapUrl, basemapReferenceUrl = config.basemapReferenceUrl;
                itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                    return itemUtils_1.createView(__assign({}, viewProperties, { map: map })).then(function (view) {
                        return itemUtils_1.findQuery(find, view).then(function () { return itemUtils_1.goToMarker(marker, view); });
                    });
                });
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
                        base.portal.get("portalProperties.hub.settings.communityOrg.portalHostname");
            }
            // after a user has logged in, their token can be used to fetch premium content or run analysis that cost credits
            function snagUserInfo(credential) {
                document.getElementById("sign-in").innerHTML =
                    '<span class="phone-hide">' + credential.userId + "</span>";
            }
            function delayedOAuth() {
                // we need to point folks directly to the Hub Community org during OAuth to ensure that social media logins aren't converted to free public accounts, but rather become new Level 2 users
                var info = new OAuthInfo({
                    appId: config.oauthappid,
                    portalUrl: config.communityPortalUrl,
                    // using a popup maintains application state (requires oauth-callback.html to be in place)
                    popup: true
                });
                // override the default behavior of force redirecting to /home/signin.html in scenarios where app is hosted alongside ArcGIS Enterprise or on *.arcgis.com
                IdentityManager.useSignInPage = false;
                IdentityManager.registerOAuthInfos([info]);
                // check to see if a user signed in during a previous visit
                IdentityManager.checkSignInStatus(info.portalUrl + "/sharing").then(snagUserInfo);
                // generic opportunity to sign in after the application has loaded
                var signInNode = document.getElementById("sign-in");
                signInNode.addEventListener("click", function () {
                    IdentityManager.getCredential(info.portalUrl + "/sharing", {
                        oAuthPopupConfirmation: false
                    }).then(snagUserInfo);
                });
                // give folks an option to sign out
                var signOutNode = document.getElementById("sign-out");
                signOutNode.addEventListener("click", function () {
                    IdentityManager.destroyCredentials();
                    window.location.reload();
                });
            }
            delayedOAuth();
        };
        return MapExample;
    }());
    return MapExample;
});
//# sourceMappingURL=Main.js.map