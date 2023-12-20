// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  API_AUTH: 'https://servicesdemo.reniec.gob.pe',
  // API_MASTER: 'http://10.48.60.13:7010/api-plataforma-electronica',
  // API_MASTER: 'https://portalproyectos.reniec.gob.pe/api-plataforma-electronica',
  API_MASTER: 'http://localhost:8080',

  jwtDomainsTokenized: ['localhost:4200'],

  // TOKENS
  VAR_TOKEN: 'access_token',
  VAR_TOKEN_EXTERNAL: 'access_token_external',
  VAR_AUTH: 'auth',
  VAR_USER: 'user',

  // PROFILES
  PERFIL_ANALISTA: '03',
  PERFIL_COORDINADOR: '02',

  // ROLES
  ROLE_ATENDER: 'ROLE_ATENDER',

  // HTTP STATUS
  CODE_200: '200',
  CODE_400: '400',
  CODE_401: '401',
  CODE_404: '404',
  CODE_403: '403',
  CODE_500: '500',

  // RESPONSE CODE
  CODE_000: '000',
  CODE_999: '999',

  // PAGINATION
  ROWS_PAGE: 10, // Filas por página
  ROWS_PAGE2: 50, // Filas por página
  START_PAGE: 1, // Página inicial

  // TIPO DE ARCHIVO
  TIPO_ARCHIVO_FIRMA_SUSTENTO: '01',
  TIPO_ARCHIVO_LIBRO_SUSTENTO: '02',
  TIPO_ARCHIVO_FIRMA_DETALLE_ALTA: '03',
  TIPO_ARCHIVO_FIRMA_DETALLE_ACTUALIZAR: '04',

  // TIPO DE SOLICITUD DE FIRMA
  TIPO_SOLICITUD_ALTA: 1,
  TIPO_SOLICITUD_BAJA: 2,
  TIPO_SOLICITUD_ACTUALIZAR: 3,

  // ESTADO SOLICITUD
  TIPO_RECEPCIONADO: 'RECEPCIONADO',
  TIPO_ASIGNADO: 'ASIGNADO',
  TIPO_ATENDIDO: 'ATENDIDO',
  TIPO_REGISTRADO: 'REGISTRADO',
  TIPO_REASIGNADO: 'REASIGNADO',

  // TIPO DE TRÁMITE
  TIPO_REGISTRO_LIBRO_ID: '1',
  TIPO_REGISTRO_FIRMA_ID: '2',
  TIPO_REGISTRO_FIRMA: 'FIRMA',
  TIPO_REGISTRO_LIBRO: 'LIBRO',

  // URLS
  URL_MENU: '/menu',
  URL_INTRO: '/auth/intro',
  URL_LOGIN: '/auth/login',
  URL_MOD_FIRMAS: '/firmas',
  URL_MOD_FIRMAS_VALIDACION: '/firmas/validacion',
  URL_MOD_FIRMAS_REGISTRO: '/firmas/registro',
  URL_MOD_ACTAS_REGISTRALES: '/actas-registrales',
  URL_MOD_ACTAS_REGISTRALES_VALIDACION: '/actas-registrales/validacion',
  URL_MOD_ACTAS_REGISTRALES_REGISTRO: '/actas-registrales/registro',
  URL_MOD_SEGUIMIENTO: '/seguimiento',
  URL_MOD_SEGUIMIENTO_VALIDACION: '/seguimiento/validacion',
  URL_MOD_SEGUIMIENTO_BUSQUEDA: '/seguimiento/busqueda',
  URL_MOD_REPORTES_EXCEL: '/reportesExcel',
  URL_MOD_REPORTES_DETALLE: '/rpDetalle',
  URL_MOD_GESTION_SOLICITUDES: '/gestion-solicitudes',
  URL_MOD_REPORTES: '/reportes',
  URL_MOD_GESTION_SOLICITUDES_ATENCION: '/gestion-solicitudes/atencion',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
