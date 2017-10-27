## Hub Auth App Example

http://[server]/hub-auth-ts/

- [X] no sign-in required > loads public webmap

- [X] display premium content that requires an account

includes [proxied premium service](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/working-with-proxies/)

- [X] support optional sign-in > [oauth 2.0 login](https://developers.arcgis.com/javascript/latest/sample-code/identity-oauth-basic/)

- [X] social media account > ~~public~~ _community_ account
```js
var info = new OAuthInfo({
    portalUrl: config.communityPortalUrl
});
```

- [X] get reference to token after users sign in

```js
esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
    function(credential) {
      credential.token
    }
);
```

### Requirements

1. login to developers.arcgis.com
2. use dashboard to create a new application
3. generate a Proxy Service for Traffic
4. add the proxied service to a public webmap
5. copy webmap id into `config/applicationBase.json`
```js
"webMap": {
    "default": "12a5ad74abb64a33a424e92741bff173",
```
6. paste `Client ID` from your new application into `config/application.json`
```js
"oauthappid": "QVQNb3XfDzoboWS0",
```
7. add enterprise org url to `config/application.json`

```js
"portalUrl": "https://edn.maps.arcgis.com",
```
this is used internally to identify the associated community org. another option is to supply it directly.

```js
"communityPortalUrl": "https://civic.maps.arcgis.com",
```

reference:
* [`webmap-ts`](https://github.com/Esri/configurable-app-examples-4x-js/tree/master/webmap-ts)
* [jsapi 3.x OAuth sample](https://developers.arcgis.com/javascript/3/jssamples/portal_oauth_popup.html)
