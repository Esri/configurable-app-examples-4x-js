define([
  "dojo/_base/declare",
  "ApplicationBase/ApplicationBase",
  "dojo/i18n!./nls/resources",
  "ApplicationBase/support/itemUtils",
  "ApplicationBase/support/domHelper",
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager",
  "esri/request",
  "dojo/dom",
  "dojo/on"
], function (
  declare,
  ApplicationBase,
  i18n,
  itemUtils,
  domHelper,
  OAuthInfo,
  esriId,
  esriRequest,
  dom,
  on
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
        var config = base.config, results = base.results;
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
        config.title = !config.title ? itemUtils.getItemTitle(firstItem) : null;
        domHelper.setPageTitle(config.title);

        var portalItem = this.base.results.applicationItem.value;
        var appProxies = (portalItem && portalItem.appProxies) ? portalItem.appProxies : null;
        var viewContainerNode = document.getElementById("viewContainer");
        var defaultViewProperties = itemUtils.getConfigViewProperties(config);
        validWebMapItems.forEach(function (item) {

          var viewNode = document.createElement("div");
          viewContainerNode.appendChild(viewNode);

          var viewProperties = defaultViewProperties;
          viewProperties.container = viewNode;
          itemUtils.createMapFromItem({ item: item, appProxies: appProxies })
            .then(function (map) {
              viewProperties.map = map;
              return itemUtils.createView(viewProperties)
                .then(function (view) {
                  return itemUtils.findQuery(find, view)
                    .then(function () { return itemUtils.goToMarker(marker, view); });
                });
            });
        });
        document.body.classList.remove(this.CSS.loading);

        /*
        everything up to here is exactly the same as the 'webmap-js' sample in this repository
        everything afterward is lifted from our 3.x JSAPI OAuth sample
        https://developers.arcgis.com/javascript/3/jssamples/portal_oauth_popup.html
        */

        // if the url of the community org is known, it can be retrieved from the enterprise org metadata
        if (!config.communityPortalUrl) {
          config.communityPortalUrl = "https://" + base.portal.get("portalProperties.hub.settings.communityOrg.portalHostname");
        }
        delayedOAuth();

        function delayedOAuth () {
          // we need to point folks directly to the Hub Community org during OAuth to ensure that social media logins aren't converted to free public accounts, but rather become new Level 2 users
          var info = new OAuthInfo({
            appId: config.oauthappid,
            portalUrl: config.communityPortalUrl,
            // using a popup maintains application state (requires oauth-callback.html to be in place)
            popup: true
          });

          // override the default behavior of force redirecting to /home/signin.html in scenarios where app is hosted alongside ArcGIS Enterprise or on *.arcgis.com
          esriId.useSignInPage = false;

          esriId.registerOAuthInfos([info]);

          // check to see if a user signed in during a previous visit
          esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
            function (credential) {
              snagUserInfo(credential);
            }
          );

          // generic opportunity to sign in after the application has loaded
          on(dom.byId("sign-in"), "click", function() {
            esriId.getCredential(info.portalUrl + "/sharing", {
              oAuthPopupConfirmation: false
            }).then(function (credential){
              snagUserInfo(credential);
            });
          });

          // give folks an option to sign out
          on(dom.byId("sign-out"), "click", function() {
            esriId.destroyCredentials();
            window.location.reload();
          });

          // after a user has logged in, their token can be used to fetch premium content or run analysis that cost credits
          function snagUserInfo(credential) {
            document.getElementById("sign-in").innerHTML = "<span class=\"phone-hide\">" + credential.userId + "</span>";
          }
        }
      }
    });
  });
