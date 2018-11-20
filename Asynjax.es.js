/*!
 *
 * Asynjax - Asíncrono Ajax sin jQuery
 * Copyright (c) 2018 JeiHO (https://github.com/jeijei4/Asynjax)
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Version: 1.0.0
 *
 */

/* 
* Polyfill
* developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/map#Polyfill
*/
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        let T, A, k;
        if (this == null) {
            throw new TypeError(' esto es nulo o no está definido');
        }
        let O = Object(this);
        let len = O.length >>> 0;
        if ('function' !== typeof callback) {
            throw new TypeError(callback + ' no es una función');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {

            let kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}

var asynjax = {};

asynjax.httpRequest = function () {
    'use strict';
    // Determine si el objeto XMLHttpRequest es compatible
    // Chrome, Firefox, Opera 8.0+, Safari
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    //Compatible con el navegador IE
    const versions = [
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
    ];
    // Defina la variable local xhr y almacene el objeto ActiveXObject del navegador IE.
    let xhr;
    for (let i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

asynjax.getFormData = function (formData) {
    let r = {};
    try {
        formData.forEach(function (value, key) {
            r[key] = value;
        });
    } catch (err) {
        r = {};
        throw new Error(err.message);
    }
    return r;
};

asynjax.getForm = function (xform) {
    let r = {};
    try {
        const elements = xform.querySelectorAll("input, select, textarea");
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            const key = element.name;
            const value = element.value;
            if (key) {
                r[key] = value;
            }
        }
    } catch (err) {
        r = {};
        throw new Error(err.message);
    }
    return r;
};

asynjax.parseParams = function (xJson) {
    return Object.keys(xJson).map(
        function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(xJson[k])
        }
    ).join('&');
};

asynjax.textError = function (xStatus, xStatusText, xResponseText) {
    'use strict';
    let xResponse = xResponseText.trim();
    if (xResponse.match(/sesi/g) && xResponse.match(/expirado/g)) {
        return 'La sesión ha expirado';
    }
    else {
        let text = "";
        switch (parseInt(xStatus)) {
            case 0:
                text = "Error de conectividad: Verificar la Red";
                break;
            case 400:
                text = "Error de cliente: Solicitud incorrecta. [400]";
                break;
            case 401:
                text = "Error de cliente: No autorizado, la autenticación es posible pero ha fallado o aún no se ha proporcionado. [401]";
                break;
            case 402:
                text = "Error de cliente: Pago requerido. [402]";
                break;
            case 403:
                text = "Error de cliente: Prohibido, el servidor se niega a responder. [403]";
                break;
            case 404:
                text = "Error de cliente: La página solicitada no se encontró. [404]";
                break;
            case 405:
                text = "Error de cliente: Método de solicitud no permitido. [405]";
                break;
            case 406:
                text = "Error de cliente: La respuesta del servidor no es aceptada. [406]";
                break;
            case 407:
                text = "Error de cliente: Debe primero autenticarse con el proxy. [407]";
                break;
            case 408:
                text = "Error de cliente: El servidor agotó el tiempo de espera para la solicitud. [408]";
                break;
            case 409:
                text = "Error de cliente: La solicitud no se pudo completar debido a un conflicto en la solicitud. [409]";
                break;
            case 410:
                text = "Error de cliente: La página solicitada ya no está disponible. [410]";
                break;
            case 411:
                text = 'Error de cliente: La "longitud del contenido" no está definida. El servidor no aceptará la solicitud sin él. [411]';
                break;
            case 412:
                text = "Error de cliente: La condición previa dada en la solicitud es evaluada como falsa por el servidor. [412]";
                break;
            case 413:
                text = "Error de cliente: La entidad de solicitud es demasiado grande. [413]";
                break;
            case 414:
                text = "Error de cliente: La URL es demasiado larga. [414]";
                break;
            case 415:
                text = "Error de cliente: El tipo de medio no es compatible con el servidor. [415]";
                break;
            case 416:
                text = "Error de cliente: El cliente ha solicitado una parte del archivo, pero el servidor no puede suministrar esa parte. [416]";
                break;
            case 417:
                text = "Error de cliente: El servidor no puede cumplir con los requisitos del encabezado de la solicitud. [417]";
                break;
            case 418:
                text = "Error de cliente: Soy una tetera. Se ha intentado realizar una solicitud de café en un servidor que no es una cafetera, sino una tetera. [418]";
                break;
            case 421:
                text = "Error de cliente: Solicitud estraviada. La solicitud se dirigió a un servidor que no es capaz de producir una respuesta. [421]";
                break;
            case 422:
                text = "Error de cliente: La solicitud está bien construida, pero fue imposible de entender debido a errores semánticos. [422]";
                break;
            case 423:
                text = "Error de cliente: El recurso que está siendo accedido está bloqueado. [423]";
                break;
            case 424:
                text = "Error de cliente: Error de dependencia. Error de la solicitud debido a un fallo de una solicitud anterior. [424]";
                break;
            case 426:
                text = "Error de cliente: Actualización obligatoria : El cliente debe cambiar a un protocolo diferente. [426]";
                break;
            case 428:
                text = "Error de cliente: Condición previa obligatoria. El servidor de origen requiere que la solicitud sea condicional. [428]";
                break;
            case 429:
                text = "Error de cliente: El usuario ha enviado demasiadas solicitudes en un período de tiempo determinado. [429]";
                break;
            case 431:
                text = "Error de cliente: El servidor no puede procesar la petición porque el conjunto de las cabeceras de la petición son demasiado grandes. [431]";
                break;
            case 451:
                text = "Error de cliente: No disponible por razones legales. [451]";
                break;
            case 500:
                text = "Error interno del servidor : El servidor encontró una condición inesperada. [500]";
                break;
            case 501:
                text = "Error del Servidor: El servidor no reconoce el método de solicitud o carece de la capacidad para cumplir con la solicitud. [501]";
                break;
            case 502:
                text = "Error del Servidor: El servidor está actuando como una puerta de enlace y recibió una respuesta no válida de otro servidor. [502]";
                break;
            case 503:
                text = "Error del Servidor: El servidor no está disponible actualmente (sobrecargado | en mantenimiento | inactivo). [503]";
                break;
            case 504:
                text = "Error del Servidor: El servidor está actuando como una puerta de enlace y no ha recibido a tiempo una respuesta de otro servidor, por lo que no puede responder adecuadamente a la petición solicitada. [504]";
                break;
            case 505:
                text = "Error del Servidor: El servidor no admite la versión de protocolo HTTP utilizada en la solicitud. [505]";
                break;
            case 506:
                text = "Error del Servidor: Variación también negocia. La negociación de contenido de los resultados de petición deriva en una referencia circular. [506]";
                break;
            case 507:
                text = "Error del Servidor: No hay suficiente espacio de almacenamiento libre. [507]";
                break;
            case 508:
                text = "Error del Servidor: La petición no se puede procesar porque el servidor ha encontrado un bucle infinito. [508]";
                break;
            case 510:
                text = "Error del Servidor: La petición del cliente debe añadir más extensiones para que el servidor pueda procesarla. [510]";
                break;
            case 511:
                text = "Error del Servidor: El cliente debe autenticarse para poder realizar peticiones. [511]";
                break;
            default:
                text = "parsererror" === xStatusText ? "Error de análisis en el JSON solicitado." : "timeout" === xStatusText ? "Error: tiempo de espera excedido." : "abort" === xStatusText ? "Petición Ajax abortada." : "Error no detectado (" + xStatus + " - " + xStatusText + "): " + xResponse;
        }
        return text;
    }
};

asynjax.send = function (url, method, request, formData) {
    'use strict';
    let client = asynjax.httpRequest();
    client.open(method, url, true, null, null);

    client.withCredentials = (true === request.withCredentials); //default false;

    client.ontimeout = function () {
        console.error("El tiempo de espera para la solicitud " + url + " a caducado.");
    };

    client.onerror = function () {
        console.error('Asynjax error: ' + asynjax.textError(client.status, client.statusText, client.responseText));
    };

    client.onreadystatechange = function () {
        if (client.readyState === 4) {
            if (client.status === 200) {// 200 = OK
                let responseText = client.responseText;

                if (true === request.asJson) {
                    let getData = responseText.trim();
                    try {
                        responseText = JSON.parse(getData);
                    } catch (e) {
                        try {
                            // Si la respuesta está en formato JSONP en lugar de JSON puro:
                            const fixedResponse = getData.replace(/\\'/g, "'");
                            responseText = JSON.parse(fixedResponse);
                        } catch (e) {
                            responseText = {};
                        }
                    }
                }

                request.result && request.result(true, responseText);
            } else {
                // Devolución de llamada de error
                request.result && request.result(false, asynjax.textError(client.status, client.statusText, client.responseText));
            }
        }
    };

    if (request.progress) {
        client.upload.onprogress = function (event) {
            let p = '?';
            if (event.lengthComputable) {
                p = Math.round((event.loaded / event.total) * 100);
            }
            request.progress(p);
        };
    }

    if (method === 'POST') {
        client.setRequestHeader("Cache-Control", "no-cache");
        client.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if ('object' === typeof formData) {
            client.send(formData);
        } else {
            if (request.contentType) {
                client.setRequestHeader('Content-Type', request.contentType);
            }
            client.send(request.params);
        }
    } else {
        client.send();
    }
};

asynjax.get = function (url, request) {
    'use strict';
    if (request.params) {
        try {
            let query = [];
            for (let key in request.params) {
                if (!request.params.hasOwnProperty(key)) continue;
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(request.params[key]));
            }
            asynjax.send(url + (query.length ? '?' + query.join('&') : ''), 'GET', request);
        } catch (err) {
            throw new Error(err.message);
        }
    } else {
        request.params = null;
        asynjax.send(url, 'GET', request);
    }
};

asynjax.post = function (url, request, formData) {
    'use strict';
    if ('object' === typeof formData) {
        asynjax.send(url, 'POST', request, formData);
    } else {
        // Solicitud con contentType false, sin procesamiento de datos;
        if (request.contentType !== false) {
            if (request.contentType && request.contentType.match(/json/g)) {
                if (request.params) {
                    try {
                        request.params = JSON.stringify(request.params);
                    } catch (err) {
                        throw new Error(err.message);
                    }
                } else {
                    request.params = null;
                }
                request.contentType = 'application/json; charset=UTF-8';
            } else {
                if (request.params) {
                    try {
                        request.params = asynjax.parseParams(request.params);
                    } catch (err) {
                        throw new Error(err.message);
                    }
                } else {
                    request.params = null;
                }

                request.contentType = request.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';
            }
        }
        asynjax.send(url, 'POST', request);
    }
};
//----//
