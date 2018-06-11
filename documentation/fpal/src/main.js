"use strict";
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
//LOS SIGUIENTES IMPORTS SON SOLO PARA PRODUCCIÓN
//PARA DESARROLLO SE CARGAN EN EL INDEX.HTML
// import 'core-js/client/shim.min.js';
// import 'zone.js/dist/zone.js';
var app_module_1 = require("./app/app.module");
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=main.js.map