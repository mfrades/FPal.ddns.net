import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//LOS SIGUIENTES IMPORTS SON SOLO PARA PRODUCCIÓN
//PARA DESARROLLO SE CARGAN EN EL INDEX.HTML
import 'core-js/client/shim.min.js';
import 'zone.js/dist/zone.js';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
