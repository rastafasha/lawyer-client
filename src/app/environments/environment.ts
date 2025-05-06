// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // url_backend: 'http://127.0.0.1:8000/',
  // url_servicios: 'http://127.0.0.1:8000/api',
  // url_frontend: 'http://localhost:4200/',
  // url_media: 'http://127.0.0.1:8000/storage/',

  // remoto
  url_backend: 'https://malcolmcordova.com/lawyer-app/backend-api-lawyer/',
    url_servicios: 'https://malcolmcordova.com/lawyer-app/backend-api-lawyer/public/api',
    url_frontend: 'https://malcolmcordova.com/lawyer-client-app/',
    url_media: 'https://malcolmcordova.com/lawyer-app/backend-api-lawyer/storage/app/public/',
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
