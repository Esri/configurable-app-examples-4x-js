
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

var pathname = window.location.pathname;
var packagePath = pathname.substring(0, pathname.lastIndexOf("/"));
var localeUrlParamRegex = /locale=([\w-]+)/;
var dojoLocale = location.search.match(localeUrlParamRegex) ?
    RegExp.$1 :
    undefined;
var config = {
    async: true,
    locale: dojoLocale,
    packages: [{
        name: "Application",
        location: packagePath + "/app",
        main: "Main"
    },
    {
        name: "ApplicationBase",
        location: packagePath + "/../ApplicationBase",
        main: "ApplicationBase"
    },
    {
        name: "config",
        location: packagePath + "/config"
    }]
};
window["dojoConfig"] = config;
