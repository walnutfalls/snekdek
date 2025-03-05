"use strict";
(self["webpackChunksnekdek"] = self["webpackChunksnekdek"] || []).push([["signalr"],{

/***/ "./node_modules/@microsoft/signalr/dist/esm/AbortController.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/AbortController.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortController: () => (/* binding */ AbortController)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
// Not exported from index.
/** @private */
class AbortController {
    constructor() {
        this._isAborted = false;
        this.onabort = null;
    }
    abort() {
        if (!this._isAborted) {
            this._isAborted = true;
            if (this.onabort) {
                this.onabort();
            }
        }
    }
    get signal() {
        return this;
    }
    get aborted() {
        return this._isAborted;
    }
}
//# sourceMappingURL=AbortController.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessTokenHttpClient: () => (/* binding */ AccessTokenHttpClient)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HeaderNames */ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class AccessTokenHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(innerClient, accessTokenFactory) {
        super();
        this._innerClient = innerClient;
        this._accessTokenFactory = accessTokenFactory;
    }
    async send(request) {
        let allowRetry = true;
        if (this._accessTokenFactory && (!this._accessToken || (request.url && request.url.indexOf("/negotiate?") > 0))) {
            // don't retry if the request is a negotiate or if we just got a potentially new token from the access token factory
            allowRetry = false;
            this._accessToken = await this._accessTokenFactory();
        }
        this._setAuthorizationHeader(request);
        const response = await this._innerClient.send(request);
        if (allowRetry && response.statusCode === 401 && this._accessTokenFactory) {
            this._accessToken = await this._accessTokenFactory();
            this._setAuthorizationHeader(request);
            return await this._innerClient.send(request);
        }
        return response;
    }
    _setAuthorizationHeader(request) {
        if (!request.headers) {
            request.headers = {};
        }
        if (this._accessToken) {
            request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization] = `Bearer ${this._accessToken}`;
        }
        // don't remove the header if there isn't an access token factory, the user manually added the header in this case
        else if (this._accessTokenFactory) {
            if (request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization]) {
                delete request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization];
            }
        }
    }
    getCookieString(url) {
        return this._innerClient.getCookieString(url);
    }
}
//# sourceMappingURL=AccessTokenHttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultHttpClient: () => (/* binding */ DefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FetchHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XhrHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





/** Default implementation of {@link @microsoft/signalr.HttpClient}. */
class DefaultHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
    constructor(logger) {
        super();
        if (typeof fetch !== "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            this._httpClient = new _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__.FetchHttpClient(logger);
        }
        else if (typeof XMLHttpRequest !== "undefined") {
            this._httpClient = new _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__.XhrHttpClient(logger);
        }
        else {
            throw new Error("No usable HttpClient found.");
        }
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_4__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return this._httpClient.send(request);
    }
    getCookieString(url) {
        return this._httpClient.getCookieString(url);
    }
}
//# sourceMappingURL=DefaultHttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultReconnectPolicy: () => (/* binding */ DefaultReconnectPolicy)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// 0, 2, 10, 30 second delays before reconnect attempts.
const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
/** @private */
class DefaultReconnectPolicy {
    constructor(retryDelays) {
        this._retryDelays = retryDelays !== undefined ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
    }
    nextRetryDelayInMilliseconds(retryContext) {
        return this._retryDelays[retryContext.previousRetryCount];
    }
}
//# sourceMappingURL=DefaultReconnectPolicy.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Errors.js":
/*!************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Errors.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   AggregateErrors: () => (/* binding */ AggregateErrors),
/* harmony export */   DisabledTransportError: () => (/* binding */ DisabledTransportError),
/* harmony export */   FailedToNegotiateWithServerError: () => (/* binding */ FailedToNegotiateWithServerError),
/* harmony export */   FailedToStartTransportError: () => (/* binding */ FailedToStartTransportError),
/* harmony export */   HttpError: () => (/* binding */ HttpError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   UnsupportedTransportError: () => (/* binding */ UnsupportedTransportError)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Error thrown when an HTTP request fails. */
class HttpError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
     *
     * @param {string} errorMessage A descriptive error message.
     * @param {number} statusCode The HTTP status code represented by this error.
     */
    constructor(errorMessage, statusCode) {
        const trueProto = new.target.prototype;
        super(`${errorMessage}: Status code '${statusCode}'`);
        this.statusCode = statusCode;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when a timeout elapses. */
class TimeoutError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "A timeout occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when an action is aborted. */
class AbortError extends Error {
    /** Constructs a new instance of {@link AbortError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "An abort occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is unsupported by the browser. */
/** @private */
class UnsupportedTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'UnsupportedTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is disabled by the browser. */
/** @private */
class DisabledTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'DisabledTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport cannot be started. */
/** @private */
class FailedToStartTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'FailedToStartTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the negotiation with the server failed to complete. */
/** @private */
class FailedToNegotiateWithServerError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
     *
     * @param {string} message A descriptive error message.
     */
    constructor(message) {
        const trueProto = new.target.prototype;
        super(message);
        this.errorType = 'FailedToNegotiateWithServerError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when multiple errors have occurred. */
/** @private */
class AggregateErrors extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
     *
     * @param {string} message A descriptive error message.
     * @param {Error[]} innerErrors The collection of errors this error is aggregating.
     */
    constructor(message, innerErrors) {
        const trueProto = new.target.prototype;
        super(message);
        this.innerErrors = innerErrors;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
//# sourceMappingURL=Errors.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FetchHttpClient: () => (/* binding */ FetchHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class FetchHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
        // Node added a fetch implementation to the global scope starting in v18.
        // We need to add a cookie jar in node to be able to share cookies with WebSocket
        if (typeof fetch === "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
            this._jar = new (requireFunc("tough-cookie")).CookieJar();
            if (typeof fetch === "undefined") {
                this._fetchType = requireFunc("node-fetch");
            }
            else {
                // Use fetch from Node if available
                this._fetchType = fetch;
            }
            // node-fetch doesn't have a nice API for getting and setting cookies
            // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
            this._fetchType = requireFunc("fetch-cookie")(this._fetchType, this._jar);
        }
        else {
            this._fetchType = fetch.bind((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)());
        }
        if (typeof AbortController === "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
            this._abortControllerType = requireFunc("abort-controller");
        }
        else {
            this._abortControllerType = AbortController;
        }
    }
    /** @inheritDoc */
    async send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
        }
        if (!request.method) {
            throw new Error("No method defined.");
        }
        if (!request.url) {
            throw new Error("No url defined.");
        }
        const abortController = new this._abortControllerType();
        let error;
        // Hook our abortSignal into the abort controller
        if (request.abortSignal) {
            request.abortSignal.onabort = () => {
                abortController.abort();
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
            };
        }
        // If a timeout has been passed in, setup a timeout to call abort
        // Type needs to be any to fit window.setTimeout and NodeJS.setTimeout
        let timeoutId = null;
        if (request.timeout) {
            const msTimeout = request.timeout;
            timeoutId = setTimeout(() => {
                abortController.abort();
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.TimeoutError();
            }, msTimeout);
        }
        if (request.content === "") {
            request.content = undefined;
        }
        if (request.content) {
            // Explicitly setting the Content-Type header for React Native on Android platform.
            request.headers = request.headers || {};
            if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(request.content)) {
                request.headers["Content-Type"] = "application/octet-stream";
            }
            else {
                request.headers["Content-Type"] = "text/plain;charset=UTF-8";
            }
        }
        let response;
        try {
            response = await this._fetchType(request.url, {
                body: request.content,
                cache: "no-cache",
                credentials: request.withCredentials === true ? "include" : "same-origin",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    ...request.headers,
                },
                method: request.method,
                mode: "cors",
                redirect: "follow",
                signal: abortController.signal,
            });
        }
        catch (e) {
            if (error) {
                throw error;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${e}.`);
            throw e;
        }
        finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = null;
            }
        }
        if (!response.ok) {
            const errorMessage = await deserializeContent(response, "text");
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.HttpError(errorMessage || response.statusText, response.status);
        }
        const content = deserializeContent(response, request.responseType);
        const payload = await content;
        return new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(response.status, response.statusText, payload);
    }
    getCookieString(url) {
        let cookies = "";
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && this._jar) {
            // @ts-ignore: unused variable
            this._jar.getCookies(url, (e, c) => cookies = c.join("; "));
        }
        return cookies;
    }
}
function deserializeContent(response, responseType) {
    let content;
    switch (responseType) {
        case "arraybuffer":
            content = response.arrayBuffer();
            break;
        case "text":
            content = response.text();
            break;
        case "blob":
        case "document":
        case "json":
            throw new Error(`${responseType} is not supported.`);
        default:
            content = response.text();
            break;
    }
    return content;
}
//# sourceMappingURL=FetchHttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandshakeProtocol: () => (/* binding */ HandshakeProtocol)
/* harmony export */ });
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextMessageFormat */ "./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class HandshakeProtocol {
    // Handshake request is always JSON
    writeHandshakeRequest(handshakeRequest) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.write(JSON.stringify(handshakeRequest));
    }
    parseHandshakeResponse(data) {
        let messageData;
        let remainingData;
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(data)) {
            // Format is binary but still need to read JSON text from handshake response
            const binaryData = new Uint8Array(data);
            const separatorIndex = binaryData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparatorCode);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = String.fromCharCode.apply(null, Array.prototype.slice.call(binaryData.slice(0, responseLength)));
            remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
        }
        else {
            const textData = data;
            const separatorIndex = textData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparator);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = textData.substring(0, responseLength);
            remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
        }
        // At this point we should have just the single handshake message
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.parse(messageData);
        const response = JSON.parse(messages[0]);
        if (response.type) {
            throw new Error("Expected a handshake response from the server.");
        }
        const responseMessage = response;
        // multiple messages could have arrived with handshake
        // return additional data to be parsed as usual, or null if all parsed
        return [remainingData, responseMessage];
    }
}
//# sourceMappingURL=HandshakeProtocol.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderNames: () => (/* binding */ HeaderNames)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class HeaderNames {
}
HeaderNames.Authorization = "Authorization";
HeaderNames.Cookie = "Cookie";
//# sourceMappingURL=HeaderNames.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js":
/*!****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HttpClient.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpClient: () => (/* binding */ HttpClient),
/* harmony export */   HttpResponse: () => (/* binding */ HttpResponse)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Represents an HTTP response. */
class HttpResponse {
    constructor(statusCode, statusText, content) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.content = content;
    }
}
/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
class HttpClient {
    get(url, options) {
        return this.send({
            ...options,
            method: "GET",
            url,
        });
    }
    post(url, options) {
        return this.send({
            ...options,
            method: "POST",
            url,
        });
    }
    delete(url, options) {
        return this.send({
            ...options,
            method: "DELETE",
            url,
        });
    }
    /** Gets all cookies that apply to the specified URL.
     *
     * @param url The URL that the cookies are valid for.
     * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
     */
    // @ts-ignore
    getCookieString(url) {
        return "";
    }
}
//# sourceMappingURL=HttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js":
/*!********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpConnection: () => (/* binding */ HttpConnection),
/* harmony export */   TransportSendQueue: () => (/* binding */ TransportSendQueue)
/* harmony export */ });
/* harmony import */ var _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AccessTokenHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js");
/* harmony import */ var _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./LongPollingTransport */ "./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js");
/* harmony import */ var _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ServerSentEventsTransport */ "./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./WebSocketTransport */ "./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.









const MAX_REDIRECTS = 100;
/** @private */
class HttpConnection {
    constructor(url, options = {}) {
        this._stopPromiseResolver = () => { };
        this.features = {};
        this._negotiateVersion = 1;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        this._logger = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.createLogger)(options.logger);
        this.baseUrl = this._resolveUrl(url);
        options = options || {};
        options.logMessageContent = options.logMessageContent === undefined ? false : options.logMessageContent;
        if (typeof options.withCredentials === "boolean" || options.withCredentials === undefined) {
            options.withCredentials = options.withCredentials === undefined ? true : options.withCredentials;
        }
        else {
            throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
        }
        options.timeout = options.timeout === undefined ? 100 * 1000 : options.timeout;
        let webSocketModule = null;
        let eventSourceModule = null;
        if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && "function" !== "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            webSocketModule = requireFunc("ws");
            eventSourceModule = requireFunc("eventsource");
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
            options.WebSocket = WebSocket;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.WebSocket) {
            if (webSocketModule) {
                options.WebSocket = webSocketModule;
            }
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
            options.EventSource = EventSource;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.EventSource) {
            if (typeof eventSourceModule !== "undefined") {
                options.EventSource = eventSourceModule;
            }
        }
        this._httpClient = new _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_1__.AccessTokenHttpClient(options.httpClient || new _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__.DefaultHttpClient(this._logger), options.accessTokenFactory);
        this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        this._connectionStarted = false;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async start(transferFormat) {
        transferFormat = transferFormat || _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat.Binary;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Starting connection with transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[transferFormat]}'.`);
        if (this._connectionState !== "Disconnected" /* ConnectionState.Disconnected */) {
            return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = "Connecting" /* ConnectionState.Connecting */;
        this._startInternalPromise = this._startInternal(transferFormat);
        await this._startInternalPromise;
        // The TypeScript compiler thinks that connectionState must be Connecting here. The TypeScript compiler is wrong.
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "Failed to start the HttpConnection before stop() was called.";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, message);
            // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
            await this._stopPromise;
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
        }
        else if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, message);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
        }
        this._connectionStarted = true;
    }
    send(data) {
        if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
            return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
        }
        if (!this._sendQueue) {
            this._sendQueue = new TransportSendQueue(this.transport);
        }
        // Transport will not be null if state is connected
        return this._sendQueue.send(data);
    }
    async stop(error) {
        if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        this._connectionState = "Disconnecting" /* ConnectionState.Disconnecting */;
        this._stopPromise = new Promise((resolve) => {
            // Don't complete stop() until stopConnection() completes.
            this._stopPromiseResolver = resolve;
        });
        // stopInternal should never throw so just observe it.
        await this._stopInternal(error);
        await this._stopPromise;
    }
    async _stopInternal(error) {
        // Set error as soon as possible otherwise there is a race between
        // the transport closing and providing an error and the error from a close message
        // We would prefer the close message error.
        this._stopError = error;
        try {
            await this._startInternalPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
        // The transport's onclose will trigger stopConnection which will run our onclose event.
        // The transport should always be set if currently connected. If it wasn't set, it's likely because
        // stop was called during start() and start() failed.
        if (this.transport) {
            try {
                await this.transport.stop();
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
                this._stopConnection();
            }
            this.transport = undefined;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
        }
    }
    async _startInternal(transferFormat) {
        // Store the original base url and the access token factory since they may change
        // as part of negotiating
        let url = this.baseUrl;
        this._accessTokenFactory = this._options.accessTokenFactory;
        this._httpClient._accessTokenFactory = this._accessTokenFactory;
        try {
            if (this._options.skipNegotiation) {
                if (this._options.transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets) {
                    // No need to add a connection ID in this case
                    this.transport = this._constructTransport(_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets);
                    // We should just call connect directly in this case.
                    // No fallback or negotiate in this case.
                    await this._startTransport(url, transferFormat);
                }
                else {
                    throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                }
            }
            else {
                let negotiateResponse = null;
                let redirects = 0;
                do {
                    negotiateResponse = await this._getNegotiationResponse(url);
                    // the user tries to stop the connection when it is being started
                    if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */ || this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
                        throw new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The connection was stopped during negotiation.");
                    }
                    if (negotiateResponse.error) {
                        throw new Error(negotiateResponse.error);
                    }
                    if (negotiateResponse.ProtocolVersion) {
                        throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
                    }
                    if (negotiateResponse.url) {
                        url = negotiateResponse.url;
                    }
                    if (negotiateResponse.accessToken) {
                        // Replace the current access token factory with one that uses
                        // the returned access token
                        const accessToken = negotiateResponse.accessToken;
                        this._accessTokenFactory = () => accessToken;
                        // set the factory to undefined so the AccessTokenHttpClient won't retry with the same token, since we know it won't change until a connection restart
                        this._httpClient._accessToken = accessToken;
                        this._httpClient._accessTokenFactory = undefined;
                    }
                    redirects++;
                } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
                if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
                    throw new Error("Negotiate redirection limit exceeded.");
                }
                await this._createTransport(url, this._options.transport, negotiateResponse, transferFormat);
            }
            if (this.transport instanceof _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__.LongPollingTransport) {
                this.features.inherentKeepAlive = true;
            }
            if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
                // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
                // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "The HttpConnection connected successfully.");
                this._connectionState = "Connected" /* ConnectionState.Connected */;
            }
            // stop() is waiting on us via this.startInternalPromise so keep this.transport around so it can clean up.
            // This is the only case startInternal can exit in neither the connected nor disconnected state because stopConnection()
            // will transition to the disconnected state. start() will wait for the transition using the stopPromise.
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, "Failed to start the connection: " + e);
            this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
            this.transport = undefined;
            // if start fails, any active calls to stop assume that start will complete the stop promise
            this._stopPromiseResolver();
            return Promise.reject(e);
        }
    }
    async _getNegotiationResponse(url) {
        const headers = {};
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
        headers[name] = value;
        const negotiateUrl = this._resolveNegotiateUrl(url);
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
        try {
            const response = await this._httpClient.post(negotiateUrl, {
                content: "",
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            });
            if (response.statusCode !== 200) {
                return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
            }
            const negotiateResponse = JSON.parse(response.content);
            if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
                // Negotiate version 0 doesn't use connectionToken
                // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
                negotiateResponse.connectionToken = negotiateResponse.connectionId;
            }
            if (negotiateResponse.useStatefulReconnect && this._options._useStatefulReconnect !== true) {
                return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToNegotiateWithServerError("Client didn't negotiate Stateful Reconnect but the server did."));
            }
            return negotiateResponse;
        }
        catch (e) {
            let errorMessage = "Failed to complete negotiation with the server: " + e;
            if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_5__.HttpError) {
                if (e.statusCode === 404) {
                    errorMessage = errorMessage + " Either this is not a SignalR endpoint or there is a proxy blocking the connection.";
                }
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, errorMessage);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToNegotiateWithServerError(errorMessage));
        }
    }
    _createConnectUrl(url, connectionToken) {
        if (!connectionToken) {
            return url;
        }
        return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
    }
    async _createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
        let connectUrl = this._createConnectUrl(url, negotiateResponse.connectionToken);
        if (this._isITransport(requestedTransport)) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
            this.transport = requestedTransport;
            await this._startTransport(connectUrl, requestedTransferFormat);
            this.connectionId = negotiateResponse.connectionId;
            return;
        }
        const transportExceptions = [];
        const transports = negotiateResponse.availableTransports || [];
        let negotiate = negotiateResponse;
        for (const endpoint of transports) {
            const transportOrError = this._resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, (negotiate === null || negotiate === void 0 ? void 0 : negotiate.useStatefulReconnect) === true);
            if (transportOrError instanceof Error) {
                // Store the error and continue, we don't want to cause a re-negotiate in these cases
                transportExceptions.push(`${endpoint.transport} failed:`);
                transportExceptions.push(transportOrError);
            }
            else if (this._isITransport(transportOrError)) {
                this.transport = transportOrError;
                if (!negotiate) {
                    try {
                        negotiate = await this._getNegotiationResponse(url);
                    }
                    catch (ex) {
                        return Promise.reject(ex);
                    }
                    connectUrl = this._createConnectUrl(url, negotiate.connectionToken);
                }
                try {
                    await this._startTransport(connectUrl, requestedTransferFormat);
                    this.connectionId = negotiate.connectionId;
                    return;
                }
                catch (ex) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
                    negotiate = undefined;
                    transportExceptions.push(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToStartTransportError(`${endpoint.transport} failed: ${ex}`, _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[endpoint.transport]));
                    if (this._connectionState !== "Connecting" /* ConnectionState.Connecting */) {
                        const message = "Failed to select transport before stop() was called.";
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, message);
                        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
                    }
                }
            }
        }
        if (transportExceptions.length > 0) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AggregateErrors(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`, transportExceptions));
        }
        return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
    }
    _constructTransport(transport) {
        switch (transport) {
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets:
                if (!this._options.WebSocket) {
                    throw new Error("'WebSocket' is not supported in your environment.");
                }
                return new _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__.WebSocketTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.ServerSentEvents:
                if (!this._options.EventSource) {
                    throw new Error("'EventSource' is not supported in your environment.");
                }
                return new _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__.ServerSentEventsTransport(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.LongPolling:
                return new _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__.LongPollingTransport(this._httpClient, this._logger, this._options);
            default:
                throw new Error(`Unknown transport: ${transport}.`);
        }
    }
    _startTransport(url, transferFormat) {
        this.transport.onreceive = this.onreceive;
        if (this.features.reconnect) {
            this.transport.onclose = async (e) => {
                let callStop = false;
                if (this.features.reconnect) {
                    try {
                        this.features.disconnected();
                        await this.transport.connect(url, transferFormat);
                        await this.features.resend();
                    }
                    catch {
                        callStop = true;
                    }
                }
                else {
                    this._stopConnection(e);
                    return;
                }
                if (callStop) {
                    this._stopConnection(e);
                }
            };
        }
        else {
            this.transport.onclose = (e) => this._stopConnection(e);
        }
        return this.transport.connect(url, transferFormat);
    }
    _resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, useStatefulReconnect) {
        const transport = _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[endpoint.transport];
        if (transport === null || transport === undefined) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
            return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
        }
        else {
            if (transportMatches(requestedTransport, transport)) {
                const transferFormats = endpoint.transferFormats.map((s) => _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[s]);
                if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                    if ((transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets && !this._options.WebSocket) ||
                        (transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.ServerSentEvents && !this._options.EventSource)) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it is not supported in your environment.'`);
                        return new _Errors__WEBPACK_IMPORTED_MODULE_5__.UnsupportedTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' is not supported in your environment.`, transport);
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Selecting transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}'.`);
                        try {
                            this.features.reconnect = transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets ? useStatefulReconnect : undefined;
                            return this._constructTransport(transport);
                        }
                        catch (ex) {
                            return ex;
                        }
                    }
                }
                else {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it does not support the requested transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[requestedTransferFormat]}'.`);
                    return new Error(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' does not support ${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[requestedTransferFormat]}.`);
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it was disabled by the client.`);
                return new _Errors__WEBPACK_IMPORTED_MODULE_5__.DisabledTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' is disabled by the client.`, transport);
            }
        }
    }
    _isITransport(transport) {
        return transport && typeof (transport) === "object" && "connect" in transport;
    }
    _stopConnection(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this._connectionState}.`);
        this.transport = undefined;
        // If we have a stopError, it takes precedence over the error from the transport
        error = this._stopError || error;
        this._stopError = undefined;
        if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
            return;
        }
        if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
            throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
        }
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            // A call to stop() induced this call to stopConnection and needs to be completed.
            // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
            this._stopPromiseResolver();
        }
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `Connection disconnected with error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Connection disconnected.");
        }
        if (this._sendQueue) {
            this._sendQueue.stop().catch((e) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
            });
            this._sendQueue = undefined;
        }
        this.connectionId = undefined;
        this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        if (this._connectionStarted) {
            this._connectionStarted = false;
            try {
                if (this.onclose) {
                    this.onclose(error);
                }
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
            }
        }
    }
    _resolveUrl(url) {
        // startsWith is not supported in IE
        if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
            return url;
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser) {
            throw new Error(`Cannot resolve '${url}'.`);
        }
        // Setting the url to the href propery of an anchor tag handles normalization
        // for us. There are 3 main cases.
        // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
        // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
        // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
        const aTag = window.document.createElement("a");
        aTag.href = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
        return aTag.href;
    }
    _resolveNegotiateUrl(url) {
        const negotiateUrl = new URL(url);
        if (negotiateUrl.pathname.endsWith('/')) {
            negotiateUrl.pathname += "negotiate";
        }
        else {
            negotiateUrl.pathname += "/negotiate";
        }
        const searchParams = new URLSearchParams(negotiateUrl.searchParams);
        if (!searchParams.has("negotiateVersion")) {
            searchParams.append("negotiateVersion", this._negotiateVersion.toString());
        }
        if (searchParams.has("useStatefulReconnect")) {
            if (searchParams.get("useStatefulReconnect") === "true") {
                this._options._useStatefulReconnect = true;
            }
        }
        else if (this._options._useStatefulReconnect === true) {
            searchParams.append("useStatefulReconnect", "true");
        }
        negotiateUrl.search = searchParams.toString();
        return negotiateUrl.toString();
    }
}
function transportMatches(requestedTransport, actualTransport) {
    return !requestedTransport || ((actualTransport & requestedTransport) !== 0);
}
/** @private */
class TransportSendQueue {
    constructor(_transport) {
        this._transport = _transport;
        this._buffer = [];
        this._executing = true;
        this._sendBufferedData = new PromiseSource();
        this._transportResult = new PromiseSource();
        this._sendLoopPromise = this._sendLoop();
    }
    send(data) {
        this._bufferData(data);
        if (!this._transportResult) {
            this._transportResult = new PromiseSource();
        }
        return this._transportResult.promise;
    }
    stop() {
        this._executing = false;
        this._sendBufferedData.resolve();
        return this._sendLoopPromise;
    }
    _bufferData(data) {
        if (this._buffer.length && typeof (this._buffer[0]) !== typeof (data)) {
            throw new Error(`Expected data to be of type ${typeof (this._buffer)} but was of type ${typeof (data)}`);
        }
        this._buffer.push(data);
        this._sendBufferedData.resolve();
    }
    async _sendLoop() {
        while (true) {
            await this._sendBufferedData.promise;
            if (!this._executing) {
                if (this._transportResult) {
                    this._transportResult.reject("Connection stopped.");
                }
                break;
            }
            this._sendBufferedData = new PromiseSource();
            const transportResult = this._transportResult;
            this._transportResult = undefined;
            const data = typeof (this._buffer[0]) === "string" ?
                this._buffer.join("") :
                TransportSendQueue._concatBuffers(this._buffer);
            this._buffer.length = 0;
            try {
                await this._transport.send(data);
                transportResult.resolve();
            }
            catch (error) {
                transportResult.reject(error);
            }
        }
    }
    static _concatBuffers(arrayBuffers) {
        const totalLength = arrayBuffers.map((b) => b.byteLength).reduce((a, b) => a + b);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const item of arrayBuffers) {
            result.set(new Uint8Array(item), offset);
            offset += item.byteLength;
        }
        return result.buffer;
    }
}
class PromiseSource {
    constructor() {
        this.promise = new Promise((resolve, reject) => [this._resolver, this._rejecter] = [resolve, reject]);
    }
    resolve() {
        this._resolver();
    }
    reject(reason) {
        this._rejecter(reason);
    }
}
//# sourceMappingURL=HttpConnection.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HubConnection.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HubConnection.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnection: () => (/* binding */ HubConnection),
/* harmony export */   HubConnectionState: () => (/* binding */ HubConnectionState)
/* harmony export */ });
/* harmony import */ var _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HandshakeProtocol */ "./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Subject */ "./node_modules/@microsoft/signalr/dist/esm/Subject.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _MessageBuffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MessageBuffer */ "./node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
const DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE = 100000;
/** Describes the current state of the {@link HubConnection} to the server. */
var HubConnectionState;
(function (HubConnectionState) {
    /** The hub connection is disconnected. */
    HubConnectionState["Disconnected"] = "Disconnected";
    /** The hub connection is connecting. */
    HubConnectionState["Connecting"] = "Connecting";
    /** The hub connection is connected. */
    HubConnectionState["Connected"] = "Connected";
    /** The hub connection is disconnecting. */
    HubConnectionState["Disconnecting"] = "Disconnecting";
    /** The hub connection is reconnecting. */
    HubConnectionState["Reconnecting"] = "Reconnecting";
})(HubConnectionState || (HubConnectionState = {}));
/** Represents a connection to a SignalR Hub. */
class HubConnection {
    /** @internal */
    // Using a public static factory method means we can have a private constructor and an _internal_
    // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
    // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
    // public parameter-less constructor.
    static create(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
        return new HubConnection(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize);
    }
    constructor(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
        this._nextKeepAlive = 0;
        this._freezeEventListener = () => {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
        };
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(connection, "connection");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logger, "logger");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds !== null && serverTimeoutInMilliseconds !== void 0 ? serverTimeoutInMilliseconds : DEFAULT_TIMEOUT_IN_MS;
        this.keepAliveIntervalInMilliseconds = keepAliveIntervalInMilliseconds !== null && keepAliveIntervalInMilliseconds !== void 0 ? keepAliveIntervalInMilliseconds : DEFAULT_PING_INTERVAL_IN_MS;
        this._statefulReconnectBufferSize = statefulReconnectBufferSize !== null && statefulReconnectBufferSize !== void 0 ? statefulReconnectBufferSize : DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE;
        this._logger = logger;
        this._protocol = protocol;
        this.connection = connection;
        this._reconnectPolicy = reconnectPolicy;
        this._handshakeProtocol = new _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__.HandshakeProtocol();
        this.connection.onreceive = (data) => this._processIncomingData(data);
        this.connection.onclose = (error) => this._connectionClosed(error);
        this._callbacks = {};
        this._methods = {};
        this._closedCallbacks = [];
        this._reconnectingCallbacks = [];
        this._reconnectedCallbacks = [];
        this._invocationId = 0;
        this._receivedHandshakeResponse = false;
        this._connectionState = HubConnectionState.Disconnected;
        this._connectionStarted = false;
        this._cachedPingMessage = this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping });
    }
    /** Indicates the state of the {@link HubConnection} to the server. */
    get state() {
        return this._connectionState;
    }
    /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
     *  in the disconnected state or if the negotiation step was skipped.
     */
    get connectionId() {
        return this.connection ? (this.connection.connectionId || null) : null;
    }
    /** Indicates the url of the {@link HubConnection} to the server. */
    get baseUrl() {
        return this.connection.baseUrl || "";
    }
    /**
     * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
     * Reconnecting states.
     * @param {string} url The url to connect to.
     */
    set baseUrl(url) {
        if (this._connectionState !== HubConnectionState.Disconnected && this._connectionState !== HubConnectionState.Reconnecting) {
            throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
        }
        if (!url) {
            throw new Error("The HubConnection url must be a valid url.");
        }
        this.connection.baseUrl = url;
    }
    /** Starts the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
     */
    start() {
        this._startPromise = this._startWithStateTransitions();
        return this._startPromise;
    }
    async _startWithStateTransitions() {
        if (this._connectionState !== HubConnectionState.Disconnected) {
            return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = HubConnectionState.Connecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Starting HubConnection.");
        try {
            await this._startInternal();
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                // Log when the browser freezes the tab so users know why their connection unexpectedly stopped working
                window.document.addEventListener("freeze", this._freezeEventListener);
            }
            this._connectionState = HubConnectionState.Connected;
            this._connectionStarted = true;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "HubConnection connected successfully.");
        }
        catch (e) {
            this._connectionState = HubConnectionState.Disconnected;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
            return Promise.reject(e);
        }
    }
    async _startInternal() {
        this._stopDuringStartError = undefined;
        this._receivedHandshakeResponse = false;
        // Set up the promise before any connection is (re)started otherwise it could race with received messages
        const handshakePromise = new Promise((resolve, reject) => {
            this._handshakeResolver = resolve;
            this._handshakeRejecter = reject;
        });
        await this.connection.start(this._protocol.transferFormat);
        try {
            let version = this._protocol.version;
            if (!this.connection.features.reconnect) {
                // Stateful Reconnect starts with HubProtocol version 2, newer clients connecting to older servers will fail to connect due to
                // the handshake only supporting version 1, so we will try to send version 1 during the handshake to keep old servers working.
                version = 1;
            }
            const handshakeRequest = {
                protocol: this._protocol.name,
                version,
            };
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Sending handshake request.");
            await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(handshakeRequest));
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Using HubProtocol '${this._protocol.name}'.`);
            // defensively cleanup timeout in case we receive a message from the server before we finish start
            this._cleanupTimeout();
            this._resetTimeoutPeriod();
            this._resetKeepAliveInterval();
            await handshakePromise;
            // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
            // being rejected on close, because this continuation can run after both the handshake completed successfully
            // and the connection was closed.
            if (this._stopDuringStartError) {
                // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                // will cause the calling continuation to get scheduled to run later.
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw this._stopDuringStartError;
            }
            const useStatefulReconnect = this.connection.features.reconnect || false;
            if (useStatefulReconnect) {
                this._messageBuffer = new _MessageBuffer__WEBPACK_IMPORTED_MODULE_4__.MessageBuffer(this._protocol, this.connection, this._statefulReconnectBufferSize);
                this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer);
                this.connection.features.resend = () => {
                    if (this._messageBuffer) {
                        return this._messageBuffer._resend();
                    }
                };
            }
            if (!this.connection.features.inherentKeepAlive) {
                await this._sendMessage(this._cachedPingMessage);
            }
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
            this._cleanupTimeout();
            this._cleanupPingTimer();
            // HttpConnection.stop() should not complete until after the onclose callback is invoked.
            // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
            await this.connection.stop(e);
            throw e;
        }
    }
    /** Stops the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
     */
    async stop() {
        // Capture the start promise before the connection might be restarted in an onclose callback.
        const startPromise = this._startPromise;
        this.connection.features.reconnect = false;
        this._stopPromise = this._stopInternal();
        await this._stopPromise;
        try {
            // Awaiting undefined continues immediately
            await startPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
    }
    _stopInternal(error) {
        if (this._connectionState === HubConnectionState.Disconnected) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        const state = this._connectionState;
        this._connectionState = HubConnectionState.Disconnecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Stopping HubConnection.");
        if (this._reconnectDelayHandle) {
            // We're in a reconnect delay which means the underlying connection is currently already stopped.
            // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
            // fire the onclose callbacks.
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
            clearTimeout(this._reconnectDelayHandle);
            this._reconnectDelayHandle = undefined;
            this._completeClose();
            return Promise.resolve();
        }
        if (state === HubConnectionState.Connected) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._sendCloseMessage();
        }
        this._cleanupTimeout();
        this._cleanupPingTimer();
        this._stopDuringStartError = error || new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The connection was stopped before the hub handshake could complete.");
        // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
        // or the onclose callback is invoked. The onclose callback will transition the HubConnection
        // to the disconnected state if need be before HttpConnection.stop() completes.
        return this.connection.stop(error);
    }
    async _sendCloseMessage() {
        try {
            await this._sendWithProtocol(this._createCloseMessage());
        }
        catch {
            // Ignore, this is a best effort attempt to let the server know the client closed gracefully.
        }
    }
    /** Invokes a streaming hub method on the server using the specified name and arguments.
     *
     * @typeparam T The type of the items returned by the server.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
     */
    stream(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createStreamInvocation(methodName, args, streamIds);
        // eslint-disable-next-line prefer-const
        let promiseQueue;
        const subject = new _Subject__WEBPACK_IMPORTED_MODULE_6__.Subject();
        subject.cancelCallback = () => {
            const cancelInvocation = this._createCancelInvocation(invocationDescriptor.invocationId);
            delete this._callbacks[invocationDescriptor.invocationId];
            return promiseQueue.then(() => {
                return this._sendWithProtocol(cancelInvocation);
            });
        };
        this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
            if (error) {
                subject.error(error);
                return;
            }
            else if (invocationEvent) {
                // invocationEvent will not be null when an error is not passed to the callback
                if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                    if (invocationEvent.error) {
                        subject.error(new Error(invocationEvent.error));
                    }
                    else {
                        subject.complete();
                    }
                }
                else {
                    subject.next((invocationEvent.item));
                }
            }
        };
        promiseQueue = this._sendWithProtocol(invocationDescriptor)
            .catch((e) => {
            subject.error(e);
            delete this._callbacks[invocationDescriptor.invocationId];
        });
        this._launchStreams(streams, promiseQueue);
        return subject;
    }
    _sendMessage(message) {
        this._resetKeepAliveInterval();
        return this.connection.send(message);
    }
    /**
     * Sends a js object to the server.
     * @param message The js object to serialize and send.
     */
    _sendWithProtocol(message) {
        if (this._messageBuffer) {
            return this._messageBuffer._send(message);
        }
        else {
            return this._sendMessage(this._protocol.writeMessage(message));
        }
    }
    /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
     *
     * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
     * be processing the invocation.
     *
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
     */
    send(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const sendPromise = this._sendWithProtocol(this._createInvocation(methodName, args, true, streamIds));
        this._launchStreams(streams, sendPromise);
        return sendPromise;
    }
    /** Invokes a hub method on the server using the specified name and arguments.
     *
     * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
     * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
     * resolving the Promise.
     *
     * @typeparam T The expected return type.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
     */
    invoke(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createInvocation(methodName, args, false, streamIds);
        const p = new Promise((resolve, reject) => {
            // invocationId will always have a value for a non-blocking invocation
            this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if (invocationEvent) {
                    // invocationEvent will not be null when an error is not passed to the callback
                    if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                        if (invocationEvent.error) {
                            reject(new Error(invocationEvent.error));
                        }
                        else {
                            resolve(invocationEvent.result);
                        }
                    }
                    else {
                        reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
                    }
                }
            };
            const promiseQueue = this._sendWithProtocol(invocationDescriptor)
                .catch((e) => {
                reject(e);
                // invocationId will always have a value for a non-blocking invocation
                delete this._callbacks[invocationDescriptor.invocationId];
            });
            this._launchStreams(streams, promiseQueue);
        });
        return p;
    }
    on(methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }
        methodName = methodName.toLowerCase();
        if (!this._methods[methodName]) {
            this._methods[methodName] = [];
        }
        // Preventing adding the same handler multiple times.
        if (this._methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }
        this._methods[methodName].push(newMethod);
    }
    off(methodName, method) {
        if (!methodName) {
            return;
        }
        methodName = methodName.toLowerCase();
        const handlers = this._methods[methodName];
        if (!handlers) {
            return;
        }
        if (method) {
            const removeIdx = handlers.indexOf(method);
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);
                if (handlers.length === 0) {
                    delete this._methods[methodName];
                }
            }
        }
        else {
            delete this._methods[methodName];
        }
    }
    /** Registers a handler that will be invoked when the connection is closed.
     *
     * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
     */
    onclose(callback) {
        if (callback) {
            this._closedCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection starts reconnecting.
     *
     * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
     */
    onreconnecting(callback) {
        if (callback) {
            this._reconnectingCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection successfully reconnects.
     *
     * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
     */
    onreconnected(callback) {
        if (callback) {
            this._reconnectedCallbacks.push(callback);
        }
    }
    _processIncomingData(data) {
        this._cleanupTimeout();
        if (!this._receivedHandshakeResponse) {
            data = this._processHandshakeResponse(data);
            this._receivedHandshakeResponse = true;
        }
        // Data may have all been read when processing handshake response
        if (data) {
            // Parse the messages
            const messages = this._protocol.parseMessages(data, this._logger);
            for (const message of messages) {
                if (this._messageBuffer && !this._messageBuffer._shouldProcessMessage(message)) {
                    // Don't process the message, we are either waiting for a SequenceMessage or received a duplicate message
                    continue;
                }
                switch (message.type) {
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                        this._invokeClientMethod(message)
                            .catch((e) => {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Invoke client method threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                        });
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion: {
                        const callback = this._callbacks[message.invocationId];
                        if (callback) {
                            if (message.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                                delete this._callbacks[message.invocationId];
                            }
                            try {
                                callback(message);
                            }
                            catch (e) {
                                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream callback threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                            }
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                        // Don't care about pings
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close: {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Close message received from server.");
                        const error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
                        if (message.allowReconnect === true) {
                            // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                            // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.connection.stop(error);
                        }
                        else {
                            // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                            this._stopPromise = this._stopInternal(error);
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
                        if (this._messageBuffer) {
                            this._messageBuffer._ack(message);
                        }
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
                        if (this._messageBuffer) {
                            this._messageBuffer._resetSequence(message);
                        }
                        break;
                    default:
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `Invalid message type: ${message.type}.`);
                        break;
                }
            }
        }
        this._resetTimeoutPeriod();
    }
    _processHandshakeResponse(data) {
        let responseMessage;
        let remainingData;
        try {
            [remainingData, responseMessage] = this._handshakeProtocol.parseHandshakeResponse(data);
        }
        catch (e) {
            const message = "Error parsing handshake response: " + e;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        if (responseMessage.error) {
            const message = "Server returned handshake error: " + responseMessage.error;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Server handshake complete.");
        }
        this._handshakeResolver();
        return remainingData;
    }
    _resetKeepAliveInterval() {
        if (this.connection.features.inherentKeepAlive) {
            return;
        }
        // Set the time we want the next keep alive to be sent
        // Timer will be setup on next message receive
        this._nextKeepAlive = new Date().getTime() + this.keepAliveIntervalInMilliseconds;
        this._cleanupPingTimer();
    }
    _resetTimeoutPeriod() {
        if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
            // Set the timeout timer
            this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
            // Set keepAlive timer if there isn't one
            if (this._pingServerHandle === undefined) {
                let nextPing = this._nextKeepAlive - new Date().getTime();
                if (nextPing < 0) {
                    nextPing = 0;
                }
                // The timer needs to be set from a networking callback to avoid Chrome timer throttling from causing timers to run once a minute
                this._pingServerHandle = setTimeout(async () => {
                    if (this._connectionState === HubConnectionState.Connected) {
                        try {
                            await this._sendMessage(this._cachedPingMessage);
                        }
                        catch {
                            // We don't care about the error. It should be seen elsewhere in the client.
                            // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                            this._cleanupPingTimer();
                        }
                    }
                }, nextPing);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    serverTimeout() {
        // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
        // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
    }
    async _invokeClientMethod(invocationMessage) {
        const methodName = invocationMessage.target.toLowerCase();
        const methods = this._methods[methodName];
        if (!methods) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No client method with the name '${methodName}' found.`);
            // No handlers provided by client but the server is expecting a response still, so we send an error
            if (invocationMessage.invocationId) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
                await this._sendWithProtocol(this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null));
            }
            return;
        }
        // Avoid issues with handlers removing themselves thus modifying the list while iterating through it
        const methodsCopy = methods.slice();
        // Server expects a response
        const expectsResponse = invocationMessage.invocationId ? true : false;
        // We preserve the last result or exception but still call all handlers
        let res;
        let exception;
        let completionMessage;
        for (const m of methodsCopy) {
            try {
                const prevRes = res;
                res = await m.apply(this, invocationMessage.arguments);
                if (expectsResponse && res && prevRes) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Multiple results provided for '${methodName}'. Sending error to server.`);
                    completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `Client provided multiple results.`, null);
                }
                // Ignore exception if we got a result after, the exception will be logged
                exception = undefined;
            }
            catch (e) {
                exception = e;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `A callback for the method '${methodName}' threw error '${e}'.`);
            }
        }
        if (completionMessage) {
            await this._sendWithProtocol(completionMessage);
        }
        else if (expectsResponse) {
            // If there is an exception that means either no result was given or a handler after a result threw
            if (exception) {
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `${exception}`, null);
            }
            else if (res !== undefined) {
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, null, res);
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
                // Client didn't provide a result or throw from a handler, server expects a response so we send an error
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null);
            }
            await this._sendWithProtocol(completionMessage);
        }
        else {
            if (res) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Result given for '${methodName}' method but server is not expecting a result.`);
            }
        }
    }
    _connectionClosed(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this._connectionState}.`);
        // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
        this._stopDuringStartError = this._stopDuringStartError || error || new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The underlying connection was closed before the hub handshake could complete.");
        // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
        // If it has already completed, this should just noop.
        if (this._handshakeResolver) {
            this._handshakeResolver();
        }
        this._cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
        this._cleanupTimeout();
        this._cleanupPingTimer();
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._completeClose(error);
        }
        else if (this._connectionState === HubConnectionState.Connected && this._reconnectPolicy) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._reconnect(error);
        }
        else if (this._connectionState === HubConnectionState.Connected) {
            this._completeClose(error);
        }
        // If none of the above if conditions were true were called the HubConnection must be in either:
        // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
        // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
        //    and potentially continue the reconnect() loop.
        // 3. The Disconnected state in which case we're already done.
    }
    _completeClose(error) {
        if (this._connectionStarted) {
            this._connectionState = HubConnectionState.Disconnected;
            this._connectionStarted = false;
            if (this._messageBuffer) {
                this._messageBuffer._dispose(error !== null && error !== void 0 ? error : new Error("Connection closed."));
                this._messageBuffer = undefined;
            }
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                window.document.removeEventListener("freeze", this._freezeEventListener);
            }
            try {
                this._closedCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
            }
        }
    }
    async _reconnect(error) {
        const reconnectStartTime = Date.now();
        let previousReconnectAttempts = 0;
        let retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
        let nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
        if (nextRetryDelay === null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
            this._completeClose(error);
            return;
        }
        this._connectionState = HubConnectionState.Reconnecting;
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Connection reconnecting.");
        }
        if (this._reconnectingCallbacks.length !== 0) {
            try {
                this._reconnectingCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
            }
            // Exit early if an onreconnecting callback called connection.stop().
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                return;
            }
        }
        while (nextRetryDelay !== null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts} will start in ${nextRetryDelay} ms.`);
            await new Promise((resolve) => {
                this._reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
            });
            this._reconnectDelayHandle = undefined;
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                return;
            }
            try {
                await this._startInternal();
                this._connectionState = HubConnectionState.Connected;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "HubConnection reconnected successfully.");
                if (this._reconnectedCallbacks.length !== 0) {
                    try {
                        this._reconnectedCallbacks.forEach((c) => c.apply(this, [this.connection.connectionId]));
                    }
                    catch (e) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
                    }
                }
                return;
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
                if (this._connectionState !== HubConnectionState.Reconnecting) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`);
                    // The TypeScript compiler thinks that connectionState must be Connected here. The TypeScript compiler is wrong.
                    if (this._connectionState === HubConnectionState.Disconnecting) {
                        this._completeClose();
                    }
                    return;
                }
                retryError = e instanceof Error ? e : new Error(e.toString());
                nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
            }
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
        this._completeClose();
    }
    _getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
        try {
            return this._reconnectPolicy.nextRetryDelayInMilliseconds({
                elapsedMilliseconds,
                previousRetryCount,
                retryReason,
            });
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
            return null;
        }
    }
    _cancelCallbacksWithError(error) {
        const callbacks = this._callbacks;
        this._callbacks = {};
        Object.keys(callbacks)
            .forEach((key) => {
            const callback = callbacks[key];
            try {
                callback(null, error);
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream 'error' callback called with '${error}' threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
            }
        });
    }
    _cleanupPingTimer() {
        if (this._pingServerHandle) {
            clearTimeout(this._pingServerHandle);
            this._pingServerHandle = undefined;
        }
    }
    _cleanupTimeout() {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
        }
    }
    _createInvocation(methodName, args, nonblocking, streamIds) {
        if (nonblocking) {
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
        else {
            const invocationId = this._invocationId;
            this._invocationId++;
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
    }
    _launchStreams(streams, promiseQueue) {
        if (streams.length === 0) {
            return;
        }
        // Synchronize stream data so they arrive in-order on the server
        if (!promiseQueue) {
            promiseQueue = Promise.resolve();
        }
        // We want to iterate over the keys, since the keys are the stream ids
        // eslint-disable-next-line guard-for-in
        for (const streamId in streams) {
            streams[streamId].subscribe({
                complete: () => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId)));
                },
                error: (err) => {
                    let message;
                    if (err instanceof Error) {
                        message = err.message;
                    }
                    else if (err && err.toString) {
                        message = err.toString();
                    }
                    else {
                        message = "Unknown error";
                    }
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId, message)));
                },
                next: (item) => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createStreamItemMessage(streamId, item)));
                },
            });
        }
    }
    _replaceStreamingParams(args) {
        const streams = [];
        const streamIds = [];
        for (let i = 0; i < args.length; i++) {
            const argument = args[i];
            if (this._isObservable(argument)) {
                const streamId = this._invocationId;
                this._invocationId++;
                // Store the stream for later use
                streams[streamId] = argument;
                streamIds.push(streamId.toString());
                // remove stream from args
                args.splice(i, 1);
            }
        }
        return [streams, streamIds];
    }
    _isObservable(arg) {
        // This allows other stream implementations to just work (like rxjs)
        return arg && arg.subscribe && typeof arg.subscribe === "function";
    }
    _createStreamInvocation(methodName, args, streamIds) {
        const invocationId = this._invocationId;
        this._invocationId++;
        if (streamIds.length !== 0) {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                streamIds,
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
        else {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
    }
    _createCancelInvocation(id) {
        return {
            invocationId: id,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.CancelInvocation,
        };
    }
    _createStreamItemMessage(id, item) {
        return {
            invocationId: id,
            item,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem,
        };
    }
    _createCompletionMessage(id, error, result) {
        if (error) {
            return {
                error,
                invocationId: id,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
            };
        }
        return {
            invocationId: id,
            result,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
        };
    }
    _createCloseMessage() {
        return { type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close };
    }
}
//# sourceMappingURL=HubConnection.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnectionBuilder: () => (/* binding */ HubConnectionBuilder)
/* harmony export */ });
/* harmony import */ var _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultReconnectPolicy */ "./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js");
/* harmony import */ var _HttpConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HttpConnection */ "./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js");
/* harmony import */ var _HubConnection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HubConnection */ "./node_modules/@microsoft/signalr/dist/esm/HubConnection.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./JsonHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const LogLevelNameMapping = {
    trace: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace,
    debug: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug,
    info: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    information: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    warn: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    warning: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    error: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error,
    critical: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical,
    none: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.None,
};
function parseLogLevel(name) {
    // Case-insensitive matching via lower-casing
    // Yes, I know case-folding is a complicated problem in Unicode, but we only support
    // the ASCII strings defined in LogLevelNameMapping anyway, so it's fine -anurse.
    const mapping = LogLevelNameMapping[name.toLowerCase()];
    if (typeof mapping !== "undefined") {
        return mapping;
    }
    else {
        throw new Error(`Unknown log level: ${name}`);
    }
}
/** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
class HubConnectionBuilder {
    configureLogging(logging) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logging, "logging");
        if (isLogger(logging)) {
            this.logger = logging;
        }
        else if (typeof logging === "string") {
            const logLevel = parseLogLevel(logging);
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logLevel);
        }
        else {
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logging);
        }
        return this;
    }
    withUrl(url, transportTypeOrOptions) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isNotEmpty(url, "url");
        this.url = url;
        // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
        // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
        if (typeof transportTypeOrOptions === "object") {
            this.httpConnectionOptions = { ...this.httpConnectionOptions, ...transportTypeOrOptions };
        }
        else {
            this.httpConnectionOptions = {
                ...this.httpConnectionOptions,
                transport: transportTypeOrOptions,
            };
        }
        return this;
    }
    /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
     *
     * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
     */
    withHubProtocol(protocol) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.protocol = protocol;
        return this;
    }
    withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
        if (this.reconnectPolicy) {
            throw new Error("A reconnectPolicy has already been set.");
        }
        if (!retryDelaysOrReconnectPolicy) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy();
        }
        else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
        }
        else {
            this.reconnectPolicy = retryDelaysOrReconnectPolicy;
        }
        return this;
    }
    /** Configures {@link @microsoft/signalr.HubConnection.serverTimeoutInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withServerTimeout(milliseconds) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
        this._serverTimeoutInMilliseconds = milliseconds;
        return this;
    }
    /** Configures {@link @microsoft/signalr.HubConnection.keepAliveIntervalInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withKeepAliveInterval(milliseconds) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
        this._keepAliveIntervalInMilliseconds = milliseconds;
        return this;
    }
    /** Enables and configures options for the Stateful Reconnect feature.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withStatefulReconnect(options) {
        if (this.httpConnectionOptions === undefined) {
            this.httpConnectionOptions = {};
        }
        this.httpConnectionOptions._useStatefulReconnect = true;
        this._statefulReconnectBufferSize = options === null || options === void 0 ? void 0 : options.bufferSize;
        return this;
    }
    /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
     *
     * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
     */
    build() {
        // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
        // provided to configureLogger
        const httpConnectionOptions = this.httpConnectionOptions || {};
        // If it's 'null', the user **explicitly** asked for null, don't mess with it.
        if (httpConnectionOptions.logger === undefined) {
            // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
            httpConnectionOptions.logger = this.logger;
        }
        // Now create the connection
        if (!this.url) {
            throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
        }
        const connection = new _HttpConnection__WEBPACK_IMPORTED_MODULE_3__.HttpConnection(this.url, httpConnectionOptions);
        return _HubConnection__WEBPACK_IMPORTED_MODULE_4__.HubConnection.create(connection, this.logger || _Loggers__WEBPACK_IMPORTED_MODULE_5__.NullLogger.instance, this.protocol || new _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__.JsonHubProtocol(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
    }
}
function isLogger(logger) {
    return logger.log !== undefined;
}
//# sourceMappingURL=HubConnectionBuilder.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JsonHubProtocol: () => (/* binding */ JsonHubProtocol)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextMessageFormat */ "./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





const JSON_HUB_PROTOCOL_NAME = "json";
/** Implements the JSON Hub Protocol. */
class JsonHubProtocol {
    constructor() {
        /** @inheritDoc */
        this.name = JSON_HUB_PROTOCOL_NAME;
        /** @inheritDoc */
        this.version = 2;
        /** @inheritDoc */
        this.transferFormat = _ITransport__WEBPACK_IMPORTED_MODULE_0__.TransferFormat.Text;
    }
    /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
     *
     * @param {string} input A string containing the serialized representation.
     * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
     */
    parseMessages(input, logger) {
        // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
        if (typeof input !== "string") {
            throw new Error("Invalid input for JSON hub protocol. Expected a string.");
        }
        if (!input) {
            return [];
        }
        if (logger === null) {
            logger = _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
        }
        // Parse the messages
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.parse(input);
        const hubMessages = [];
        for (const message of messages) {
            const parsedMessage = JSON.parse(message);
            if (typeof parsedMessage.type !== "number") {
                throw new Error("Invalid payload.");
            }
            switch (parsedMessage.type) {
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                    this._isInvocationMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    this._isStreamItemMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion:
                    this._isCompletionMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                    // Single value, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close:
                    // All optional values, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
                    this._isAckMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
                    this._isSequenceMessage(parsedMessage);
                    break;
                default:
                    // Future protocol changes can add message types, old clients can ignore them
                    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
                    continue;
            }
            hubMessages.push(parsedMessage);
        }
        return hubMessages;
    }
    /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
     *
     * @param {HubMessage} message The message to write.
     * @returns {string} A string containing the serialized representation of the message.
     */
    writeMessage(message) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.write(JSON.stringify(message));
    }
    _isInvocationMessage(message) {
        this._assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
        if (message.invocationId !== undefined) {
            this._assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
        }
    }
    _isStreamItemMessage(message) {
        this._assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
        if (message.item === undefined) {
            throw new Error("Invalid payload for StreamItem message.");
        }
    }
    _isCompletionMessage(message) {
        if (message.result && message.error) {
            throw new Error("Invalid payload for Completion message.");
        }
        if (!message.result && message.error) {
            this._assertNotEmptyString(message.error, "Invalid payload for Completion message.");
        }
        this._assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
    }
    _isAckMessage(message) {
        if (typeof message.sequenceId !== 'number') {
            throw new Error("Invalid SequenceId for Ack message.");
        }
    }
    _isSequenceMessage(message) {
        if (typeof message.sequenceId !== 'number') {
            throw new Error("Invalid SequenceId for Sequence message.");
        }
    }
    _assertNotEmptyString(value, errorMessage) {
        if (typeof value !== "string" || value === "") {
            throw new Error(errorMessage);
        }
    }
}
//# sourceMappingURL=JsonHubProtocol.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LongPollingTransport: () => (/* binding */ LongPollingTransport)
/* harmony export */ });
/* harmony import */ var _AbortController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbortController */ "./node_modules/@microsoft/signalr/dist/esm/AbortController.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





// Not exported from 'index', this type is internal.
/** @private */
class LongPollingTransport {
    // This is an internal type, not exported from 'index' so this is really just internal.
    get pollAborted() {
        return this._pollAbort.aborted;
    }
    constructor(httpClient, logger, options) {
        this._httpClient = httpClient;
        this._logger = logger;
        this._pollAbort = new _AbortController__WEBPACK_IMPORTED_MODULE_0__.AbortController();
        this._options = options;
        this._running = false;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
        this._url = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Connecting.");
        // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary &&
            (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
            throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
        }
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
        const headers = { [name]: value, ...this._options.headers };
        const pollOptions = {
            abortSignal: this._pollAbort.signal,
            headers,
            timeout: 100000,
            withCredentials: this._options.withCredentials,
        };
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary) {
            pollOptions.responseType = "arraybuffer";
        }
        // Make initial long polling request
        // Server uses first long polling request to finish initializing connection and it returns without data
        const pollUrl = `${url}&_=${Date.now()}`;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
        const response = await this._httpClient.get(pollUrl, pollOptions);
        if (response.statusCode !== 200) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
            // Mark running as false so that the poll immediately ends and runs the close logic
            this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
            this._running = false;
        }
        else {
            this._running = true;
        }
        this._receiving = this._poll(this._url, pollOptions);
    }
    async _poll(url, pollOptions) {
        try {
            while (this._running) {
                try {
                    const pollUrl = `${url}&_=${Date.now()}`;
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
                    const response = await this._httpClient.get(pollUrl, pollOptions);
                    if (response.statusCode === 204) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                        this._running = false;
                    }
                    else if (response.statusCode !== 200) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
                        // Unexpected status code
                        this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
                        this._running = false;
                    }
                    else {
                        // Process the response
                        if (response.content) {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(response.content, this._options.logMessageContent)}.`);
                            if (this.onreceive) {
                                this.onreceive(response.content);
                            }
                        }
                        else {
                            // This is another way timeout manifest.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                    }
                }
                catch (e) {
                    if (!this._running) {
                        // Log but disregard errors that occur after stopping
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
                    }
                    else {
                        if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.TimeoutError) {
                            // Ignore timeouts and reissue the poll.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                        else {
                            // Close the connection with the error as the result.
                            this._closeError = e;
                            this._running = false;
                        }
                    }
                }
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Polling complete.");
            // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
            // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
            if (!this.pollAborted) {
                this._raiseOnClose();
            }
        }
    }
    async send(data) {
        if (!this._running) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.sendMessage)(this._logger, "LongPolling", this._httpClient, this._url, data, this._options);
    }
    async stop() {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stopping polling.");
        // Tell receiving loop to stop, abort any current request, and then wait for it to finish
        this._running = false;
        this._pollAbort.abort();
        try {
            await this._receiving;
            // Send DELETE to clean up long polling on the server
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
            const headers = {};
            const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
            headers[name] = value;
            const deleteOptions = {
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            };
            let error;
            try {
                await this._httpClient.delete(this._url, deleteOptions);
            }
            catch (err) {
                error = err;
            }
            if (error) {
                if (error instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError) {
                    if (error.statusCode === 404) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.");
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Error sending a DELETE request: ${error}`);
                    }
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) DELETE request accepted.");
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stop finished.");
            // Raise close event here instead of in polling
            // It needs to happen after the DELETE request is sent
            this._raiseOnClose();
        }
    }
    _raiseOnClose() {
        if (this.onclose) {
            let logMessage = "(LongPolling transport) Firing onclose event.";
            if (this._closeError) {
                logMessage += " Error: " + this._closeError;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, logMessage);
            this.onclose(this._closeError);
        }
    }
}
//# sourceMappingURL=LongPollingTransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageBuffer: () => (/* binding */ MessageBuffer)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class MessageBuffer {
    constructor(protocol, connection, bufferSize) {
        this._bufferSize = 100000;
        this._messages = [];
        this._totalMessageCount = 0;
        this._waitForSequenceMessage = false;
        // Message IDs start at 1 and always increment by 1
        this._nextReceivingSequenceId = 1;
        this._latestReceivedSequenceId = 0;
        this._bufferedByteCount = 0;
        this._reconnectInProgress = false;
        this._protocol = protocol;
        this._connection = connection;
        this._bufferSize = bufferSize;
    }
    async _send(message) {
        const serializedMessage = this._protocol.writeMessage(message);
        let backpressurePromise = Promise.resolve();
        // Only count invocation messages. Acks, pings, etc. don't need to be resent on reconnect
        if (this._isInvocationMessage(message)) {
            this._totalMessageCount++;
            let backpressurePromiseResolver = () => { };
            let backpressurePromiseRejector = () => { };
            if ((0,_Utils__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(serializedMessage)) {
                this._bufferedByteCount += serializedMessage.byteLength;
            }
            else {
                this._bufferedByteCount += serializedMessage.length;
            }
            if (this._bufferedByteCount >= this._bufferSize) {
                backpressurePromise = new Promise((resolve, reject) => {
                    backpressurePromiseResolver = resolve;
                    backpressurePromiseRejector = reject;
                });
            }
            this._messages.push(new BufferedItem(serializedMessage, this._totalMessageCount, backpressurePromiseResolver, backpressurePromiseRejector));
        }
        try {
            // If this is set it means we are reconnecting or resending
            // We don't want to send on a disconnected connection
            // And we don't want to send if resend is running since that would mean sending
            // this message twice
            if (!this._reconnectInProgress) {
                await this._connection.send(serializedMessage);
            }
        }
        catch {
            this._disconnected();
        }
        await backpressurePromise;
    }
    _ack(ackMessage) {
        let newestAckedMessage = -1;
        // Find index of newest message being acked
        for (let index = 0; index < this._messages.length; index++) {
            const element = this._messages[index];
            if (element._id <= ackMessage.sequenceId) {
                newestAckedMessage = index;
                if ((0,_Utils__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(element._message)) {
                    this._bufferedByteCount -= element._message.byteLength;
                }
                else {
                    this._bufferedByteCount -= element._message.length;
                }
                // resolve items that have already been sent and acked
                element._resolver();
            }
            else if (this._bufferedByteCount < this._bufferSize) {
                // resolve items that now fall under the buffer limit but haven't been acked
                element._resolver();
            }
            else {
                break;
            }
        }
        if (newestAckedMessage !== -1) {
            // We're removing everything including the message pointed to, so add 1
            this._messages = this._messages.slice(newestAckedMessage + 1);
        }
    }
    _shouldProcessMessage(message) {
        if (this._waitForSequenceMessage) {
            if (message.type !== _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence) {
                return false;
            }
            else {
                this._waitForSequenceMessage = false;
                return true;
            }
        }
        // No special processing for acks, pings, etc.
        if (!this._isInvocationMessage(message)) {
            return true;
        }
        const currentId = this._nextReceivingSequenceId;
        this._nextReceivingSequenceId++;
        if (currentId <= this._latestReceivedSequenceId) {
            if (currentId === this._latestReceivedSequenceId) {
                // Should only hit this if we just reconnected and the server is sending
                // Messages it has buffered, which would mean it hasn't seen an Ack for these messages
                this._ackTimer();
            }
            // Ignore, this is a duplicate message
            return false;
        }
        this._latestReceivedSequenceId = currentId;
        // Only start the timer for sending an Ack message when we have a message to ack. This also conveniently solves
        // timer throttling by not having a recursive timer, and by starting the timer via a network call (recv)
        this._ackTimer();
        return true;
    }
    _resetSequence(message) {
        if (message.sequenceId > this._nextReceivingSequenceId) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));
            return;
        }
        this._nextReceivingSequenceId = message.sequenceId;
    }
    _disconnected() {
        this._reconnectInProgress = true;
        this._waitForSequenceMessage = true;
    }
    async _resend() {
        const sequenceId = this._messages.length !== 0
            ? this._messages[0]._id
            : this._totalMessageCount + 1;
        await this._connection.send(this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence, sequenceId }));
        // Get a local variable to the _messages, just in case messages are acked while resending
        // Which would slice the _messages array (which creates a new copy)
        const messages = this._messages;
        for (const element of messages) {
            await this._connection.send(element._message);
        }
        this._reconnectInProgress = false;
    }
    _dispose(error) {
        error !== null && error !== void 0 ? error : (error = new Error("Unable to reconnect to server."));
        // Unblock backpressure if any
        for (const element of this._messages) {
            element._rejector(error);
        }
    }
    _isInvocationMessage(message) {
        // There is no way to check if something implements an interface.
        // So we individually check the messages in a switch statement.
        // To make sure we don't miss any message types we rely on the compiler
        // seeing the function returns a value and it will do the
        // exhaustive check for us on the switch statement, since we don't use 'case default'
        switch (message.type) {
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Invocation:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.StreamItem:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Completion:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.StreamInvocation:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.CancelInvocation:
                return true;
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Close:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ping:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ack:
                return false;
        }
    }
    _ackTimer() {
        if (this._ackTimerHandle === undefined) {
            this._ackTimerHandle = setTimeout(async () => {
                try {
                    if (!this._reconnectInProgress) {
                        await this._connection.send(this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ack, sequenceId: this._latestReceivedSequenceId }));
                    }
                    // Ignore errors, that means the connection is closed and we don't care about the Ack message anymore.
                }
                catch { }
                clearTimeout(this._ackTimerHandle);
                this._ackTimerHandle = undefined;
                // 1 second delay so we don't spam Ack messages if there are many messages being received at once.
            }, 1000);
        }
    }
}
class BufferedItem {
    constructor(message, id, resolver, rejector) {
        this._message = message;
        this._id = id;
        this._resolver = resolver;
        this._rejector = rejector;
    }
}
//# sourceMappingURL=MessageBuffer.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerSentEventsTransport: () => (/* binding */ ServerSentEventsTransport)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



/** @private */
class ServerSentEventsTransport {
    constructor(httpClient, accessToken, logger, options) {
        this._httpClient = httpClient;
        this._accessToken = accessToken;
        this._logger = logger;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(SSE transport) Connecting.");
        // set url before accessTokenFactory because this._url is only for send and we set the auth header instead of the query string for send
        this._url = url;
        if (this._accessToken) {
            url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`;
        }
        return new Promise((resolve, reject) => {
            let opened = false;
            if (transferFormat !== _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Text) {
                reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                return;
            }
            let eventSource;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isWebWorker) {
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials });
            }
            else {
                // Non-browser passes cookies via the dictionary
                const cookies = this._httpClient.getCookieString(url);
                const headers = {};
                headers.Cookie = cookies;
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials, headers: { ...headers, ...this._options.headers } });
            }
            try {
                eventSource.onmessage = (e) => {
                    if (this.onreceive) {
                        try {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(SSE transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(e.data, this._options.logMessageContent)}.`);
                            this.onreceive(e.data);
                        }
                        catch (error) {
                            this._close(error);
                            return;
                        }
                    }
                };
                // @ts-ignore: not using event on purpose
                eventSource.onerror = (e) => {
                    // EventSource doesn't give any useful information about server side closes.
                    if (opened) {
                        this._close();
                    }
                    else {
                        reject(new Error("EventSource failed to connect. The connection could not be found on the server,"
                            + " either the connection ID is not present on the server, or a proxy is refusing/buffering the connection."
                            + " If you have multiple servers check that sticky sessions are enabled."));
                    }
                };
                eventSource.onopen = () => {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `SSE connected to ${this._url}`);
                    this._eventSource = eventSource;
                    opened = true;
                    resolve();
                };
            }
            catch (e) {
                reject(e);
                return;
            }
        });
    }
    async send(data) {
        if (!this._eventSource) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.sendMessage)(this._logger, "SSE", this._httpClient, this._url, data, this._options);
    }
    stop() {
        this._close();
        return Promise.resolve();
    }
    _close(e) {
        if (this._eventSource) {
            this._eventSource.close();
            this._eventSource = undefined;
            if (this.onclose) {
                this.onclose(e);
            }
        }
    }
}
//# sourceMappingURL=ServerSentEventsTransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Subject.js":
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Subject.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subject: () => (/* binding */ Subject)
/* harmony export */ });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/** Stream implementation to stream items to the server. */
class Subject {
    constructor() {
        this.observers = [];
    }
    next(item) {
        for (const observer of this.observers) {
            observer.next(item);
        }
    }
    error(err) {
        for (const observer of this.observers) {
            if (observer.error) {
                observer.error(err);
            }
        }
    }
    complete() {
        for (const observer of this.observers) {
            if (observer.complete) {
                observer.complete();
            }
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
        return new _Utils__WEBPACK_IMPORTED_MODULE_0__.SubjectSubscription(this, observer);
    }
}
//# sourceMappingURL=Subject.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextMessageFormat: () => (/* binding */ TextMessageFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Not exported from index
/** @private */
class TextMessageFormat {
    static write(output) {
        return `${output}${TextMessageFormat.RecordSeparator}`;
    }
    static parse(input) {
        if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
            throw new Error("Message is incomplete.");
        }
        const messages = input.split(TextMessageFormat.RecordSeparator);
        messages.pop();
        return messages;
    }
}
TextMessageFormat.RecordSeparatorCode = 0x1e;
TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
//# sourceMappingURL=TextMessageFormat.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/Utils.js":
/*!***********************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Utils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Arg: () => (/* binding */ Arg),
/* harmony export */   ConsoleLogger: () => (/* binding */ ConsoleLogger),
/* harmony export */   Platform: () => (/* binding */ Platform),
/* harmony export */   SubjectSubscription: () => (/* binding */ SubjectSubscription),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   constructUserAgent: () => (/* binding */ constructUserAgent),
/* harmony export */   createLogger: () => (/* binding */ createLogger),
/* harmony export */   formatArrayBuffer: () => (/* binding */ formatArrayBuffer),
/* harmony export */   getDataDetail: () => (/* binding */ getDataDetail),
/* harmony export */   getErrorString: () => (/* binding */ getErrorString),
/* harmony export */   getGlobalThis: () => (/* binding */ getGlobalThis),
/* harmony export */   getUserAgentHeader: () => (/* binding */ getUserAgentHeader),
/* harmony export */   isArrayBuffer: () => (/* binding */ isArrayBuffer),
/* harmony export */   sendMessage: () => (/* binding */ sendMessage)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


// Version token that will be replaced by the prepack command
/** The version of the SignalR client. */
const VERSION = "8.0.7";
/** @private */
class Arg {
    static isRequired(val, name) {
        if (val === null || val === undefined) {
            throw new Error(`The '${name}' argument is required.`);
        }
    }
    static isNotEmpty(val, name) {
        if (!val || val.match(/^\s*$/)) {
            throw new Error(`The '${name}' argument should not be empty.`);
        }
    }
    static isIn(val, values, name) {
        // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
        if (!(val in values)) {
            throw new Error(`Unknown ${name} value: ${val}.`);
        }
    }
}
/** @private */
class Platform {
    // react-native has a window but no document so we should check both
    static get isBrowser() {
        return !Platform.isNode && typeof window === "object" && typeof window.document === "object";
    }
    // WebWorkers don't have a window object so the isBrowser check would fail
    static get isWebWorker() {
        return !Platform.isNode && typeof self === "object" && "importScripts" in self;
    }
    // react-native has a window but no document
    static get isReactNative() {
        return !Platform.isNode && typeof window === "object" && typeof window.document === "undefined";
    }
    // Node apps shouldn't have a window object, but WebWorkers don't either
    // so we need to check for both WebWorker and window
    static get isNode() {
        return typeof process !== "undefined" && process.release && process.release.name === "node";
    }
}
/** @private */
function getDataDetail(data, includeContent) {
    let detail = "";
    if (isArrayBuffer(data)) {
        detail = `Binary data of length ${data.byteLength}`;
        if (includeContent) {
            detail += `. Content: '${formatArrayBuffer(data)}'`;
        }
    }
    else if (typeof data === "string") {
        detail = `String data of length ${data.length}`;
        if (includeContent) {
            detail += `. Content: '${data}'`;
        }
    }
    return detail;
}
/** @private */
function formatArrayBuffer(data) {
    const view = new Uint8Array(data);
    // Uint8Array.map only supports returning another Uint8Array?
    let str = "";
    view.forEach((num) => {
        const pad = num < 16 ? "0" : "";
        str += `0x${pad}${num.toString(16)} `;
    });
    // Trim of trailing space.
    return str.substr(0, str.length - 1);
}
// Also in signalr-protocol-msgpack/Utils.ts
/** @private */
function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}
/** @private */
async function sendMessage(logger, transportName, httpClient, url, content, options) {
    const headers = {};
    const [name, value] = getUserAgentHeader();
    headers[name] = value;
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, options.logMessageContent)}.`);
    const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
    const response = await httpClient.post(url, {
        content,
        headers: { ...headers, ...options.headers },
        responseType,
        timeout: options.timeout,
        withCredentials: options.withCredentials,
    });
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
}
/** @private */
function createLogger(logger) {
    if (logger === undefined) {
        return new ConsoleLogger(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information);
    }
    if (logger === null) {
        return _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
    }
    if (logger.log !== undefined) {
        return logger;
    }
    return new ConsoleLogger(logger);
}
/** @private */
class SubjectSubscription {
    constructor(subject, observer) {
        this._subject = subject;
        this._observer = observer;
    }
    dispose() {
        const index = this._subject.observers.indexOf(this._observer);
        if (index > -1) {
            this._subject.observers.splice(index, 1);
        }
        if (this._subject.observers.length === 0 && this._subject.cancelCallback) {
            this._subject.cancelCallback().catch((_) => { });
        }
    }
}
/** @private */
class ConsoleLogger {
    constructor(minimumLogLevel) {
        this._minLevel = minimumLogLevel;
        this.out = console;
    }
    log(logLevel, message) {
        if (logLevel >= this._minLevel) {
            const msg = `[${new Date().toISOString()}] ${_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel[logLevel]}: ${message}`;
            switch (logLevel) {
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical:
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error:
                    this.out.error(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning:
                    this.out.warn(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information:
                    this.out.info(msg);
                    break;
                default:
                    // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                    this.out.log(msg);
                    break;
            }
        }
    }
}
/** @private */
function getUserAgentHeader() {
    let userAgentHeaderName = "X-SignalR-User-Agent";
    if (Platform.isNode) {
        userAgentHeaderName = "User-Agent";
    }
    return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
/** @private */
function constructUserAgent(version, os, runtime, runtimeVersion) {
    // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
    let userAgent = "Microsoft SignalR/";
    const majorAndMinor = version.split(".");
    userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
    userAgent += ` (${version}; `;
    if (os && os !== "") {
        userAgent += `${os}; `;
    }
    else {
        userAgent += "Unknown OS; ";
    }
    userAgent += `${runtime}`;
    if (runtimeVersion) {
        userAgent += `; ${runtimeVersion}`;
    }
    else {
        userAgent += "; Unknown Runtime Version";
    }
    userAgent += ")";
    return userAgent;
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getOsName() {
    if (Platform.isNode) {
        switch (process.platform) {
            case "win32":
                return "Windows NT";
            case "darwin":
                return "macOS";
            case "linux":
                return "Linux";
            default:
                return process.platform;
        }
    }
    else {
        return "";
    }
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getRuntimeVersion() {
    if (Platform.isNode) {
        return process.versions.node;
    }
    return undefined;
}
function getRuntime() {
    if (Platform.isNode) {
        return "NodeJS";
    }
    else {
        return "Browser";
    }
}
/** @private */
function getErrorString(e) {
    if (e.stack) {
        return e.stack;
    }
    else if (e.message) {
        return e.message;
    }
    return `${e}`;
}
/** @private */
function getGlobalThis() {
    // globalThis is semi-new and not available in Node until v12
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    throw new Error("could not find global");
}
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js":
/*!************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebSocketTransport: () => (/* binding */ WebSocketTransport)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HeaderNames */ "./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




/** @private */
class WebSocketTransport {
    constructor(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
        this._logger = logger;
        this._accessTokenFactory = accessTokenFactory;
        this._logMessageContent = logMessageContent;
        this._webSocketConstructor = webSocketConstructor;
        this._httpClient = httpClient;
        this.onreceive = null;
        this.onclose = null;
        this._headers = headers;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) Connecting.");
        let token;
        if (this._accessTokenFactory) {
            token = await this._accessTokenFactory();
        }
        return new Promise((resolve, reject) => {
            url = url.replace(/^http/, "ws");
            let webSocket;
            const cookies = this._httpClient.getCookieString(url);
            let opened = false;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isReactNative) {
                const headers = {};
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                if (token) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Authorization] = `Bearer ${token}`;
                }
                if (cookies) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Cookie] = cookies;
                }
                // Only pass headers when in non-browser environments
                webSocket = new this._webSocketConstructor(url, undefined, {
                    headers: { ...headers, ...this._headers },
                });
            }
            else {
                if (token) {
                    url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
                }
            }
            if (!webSocket) {
                // Chrome is not happy with passing 'undefined' as protocol
                webSocket = new this._webSocketConstructor(url);
            }
            if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Binary) {
                webSocket.binaryType = "arraybuffer";
            }
            webSocket.onopen = (_event) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `WebSocket connected to ${url}.`);
                this._webSocket = webSocket;
                opened = true;
                resolve();
            };
            webSocket.onerror = (event) => {
                let error = null;
                // ErrorEvent is a browser only type we need to check if the type exists before using it
                if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                    error = event.error;
                }
                else {
                    error = "There was an error with the transport";
                }
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `(WebSockets transport) ${error}.`);
            };
            webSocket.onmessage = (message) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(message.data, this._logMessageContent)}.`);
                if (this.onreceive) {
                    try {
                        this.onreceive(message.data);
                    }
                    catch (error) {
                        this._close(error);
                        return;
                    }
                }
            };
            webSocket.onclose = (event) => {
                // Don't call close handler if connection was never established
                // We'll reject the connect call instead
                if (opened) {
                    this._close(event);
                }
                else {
                    let error = null;
                    // ErrorEvent is a browser only type we need to check if the type exists before using it
                    if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                        error = event.error;
                    }
                    else {
                        error = "WebSocket failed to connect. The connection could not be found on the server,"
                            + " either the endpoint may not be a SignalR endpoint,"
                            + " the connection ID is not present on the server, or there is a proxy blocking WebSockets."
                            + " If you have multiple servers check that sticky sessions are enabled.";
                    }
                    reject(new Error(error));
                }
            };
        });
    }
    send(data) {
        if (this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) sending data. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(data, this._logMessageContent)}.`);
            this._webSocket.send(data);
            return Promise.resolve();
        }
        return Promise.reject("WebSocket is not in the OPEN state");
    }
    stop() {
        if (this._webSocket) {
            // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
            // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
            this._close(undefined);
        }
        return Promise.resolve();
    }
    _close(event) {
        // webSocket will be null if the transport did not start successfully
        if (this._webSocket) {
            // Clear websocket handlers because we are considering the socket closed now
            this._webSocket.onclose = () => { };
            this._webSocket.onmessage = () => { };
            this._webSocket.onerror = () => { };
            this._webSocket.close();
            this._webSocket = undefined;
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) socket closed.");
        if (this.onclose) {
            if (this._isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
                this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason || "no reason given"}).`));
            }
            else if (event instanceof Error) {
                this.onclose(event);
            }
            else {
                this.onclose();
            }
        }
    }
    _isCloseEvent(event) {
        return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
    }
}
//# sourceMappingURL=WebSocketTransport.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XhrHttpClient: () => (/* binding */ XhrHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class XhrHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (request.content === "") {
                request.content = undefined;
            }
            if (request.content) {
                // Explicitly setting the Content-Type header for React Native on Android platform.
                if ((0,_Utils__WEBPACK_IMPORTED_MODULE_2__.isArrayBuffer)(request.content)) {
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                }
                else {
                    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                }
            }
            const headers = request.headers;
            if (headers) {
                Object.keys(headers)
                    .forEach((header) => {
                    xhr.setRequestHeader(header, headers[header]);
                });
            }
            if (request.responseType) {
                xhr.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = () => {
                    xhr.abort();
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
                };
            }
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
            xhr.onload = () => {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                }
                else {
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.response || xhr.responseText || xhr.statusText, xhr.status));
                }
            };
            xhr.onerror = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.statusText, xhr.status));
            };
            xhr.ontimeout = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.TimeoutError());
            };
            xhr.send(request.content);
        });
    }
}
//# sourceMappingURL=XhrHttpClient.js.map

/***/ }),

/***/ "./node_modules/@microsoft/signalr/dist/esm/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* reexport safe */ _Errors__WEBPACK_IMPORTED_MODULE_0__.AbortError),
/* harmony export */   DefaultHttpClient: () => (/* reexport safe */ _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__.DefaultHttpClient),
/* harmony export */   HttpClient: () => (/* reexport safe */ _HttpClient__WEBPACK_IMPORTED_MODULE_1__.HttpClient),
/* harmony export */   HttpError: () => (/* reexport safe */ _Errors__WEBPACK_IMPORTED_MODULE_0__.HttpError),
/* harmony export */   HttpResponse: () => (/* reexport safe */ _HttpClient__WEBPACK_IMPORTED_MODULE_1__.HttpResponse),
/* harmony export */   HttpTransportType: () => (/* reexport safe */ _ITransport__WEBPACK_IMPORTED_MODULE_7__.HttpTransportType),
/* harmony export */   HubConnection: () => (/* reexport safe */ _HubConnection__WEBPACK_IMPORTED_MODULE_3__.HubConnection),
/* harmony export */   HubConnectionBuilder: () => (/* reexport safe */ _HubConnectionBuilder__WEBPACK_IMPORTED_MODULE_4__.HubConnectionBuilder),
/* harmony export */   HubConnectionState: () => (/* reexport safe */ _HubConnection__WEBPACK_IMPORTED_MODULE_3__.HubConnectionState),
/* harmony export */   JsonHubProtocol: () => (/* reexport safe */ _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_9__.JsonHubProtocol),
/* harmony export */   LogLevel: () => (/* reexport safe */ _ILogger__WEBPACK_IMPORTED_MODULE_6__.LogLevel),
/* harmony export */   MessageType: () => (/* reexport safe */ _IHubProtocol__WEBPACK_IMPORTED_MODULE_5__.MessageType),
/* harmony export */   NullLogger: () => (/* reexport safe */ _Loggers__WEBPACK_IMPORTED_MODULE_8__.NullLogger),
/* harmony export */   Subject: () => (/* reexport safe */ _Subject__WEBPACK_IMPORTED_MODULE_10__.Subject),
/* harmony export */   TimeoutError: () => (/* reexport safe */ _Errors__WEBPACK_IMPORTED_MODULE_0__.TimeoutError),
/* harmony export */   TransferFormat: () => (/* reexport safe */ _ITransport__WEBPACK_IMPORTED_MODULE_7__.TransferFormat),
/* harmony export */   VERSION: () => (/* reexport safe */ _Utils__WEBPACK_IMPORTED_MODULE_11__.VERSION)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Errors */ "./node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HttpClient */ "./node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultHttpClient */ "./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js");
/* harmony import */ var _HubConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HubConnection */ "./node_modules/@microsoft/signalr/dist/esm/HubConnection.js");
/* harmony import */ var _HubConnectionBuilder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HubConnectionBuilder */ "./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js");
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./IHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ILogger */ "./node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ITransport */ "./node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Loggers */ "./node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./JsonHubProtocol */ "./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Subject */ "./node_modules/@microsoft/signalr/dist/esm/Subject.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Utils */ "./node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.












//# sourceMappingURL=index.js.map

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsaUNBQWlDLDhDQUFRO0FBQ3pDLDJCQUEyQixpREFBWTtBQUN2QztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDK0Q7QUFDUDtBQUNBO0FBQ1k7QUFDTjtBQUNqQjtBQUNSO0FBQzRCO0FBQzFCO0FBQ2E7QUFDaEI7QUFDRjtBQUNsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NuZWtkZWsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0Fib3J0Q29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9zbmVrZGVrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9BY2Nlc3NUb2tlbkh0dHBDbGllbnQuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vRGVmYXVsdEh0dHBDbGllbnQuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vRGVmYXVsdFJlY29ubmVjdFBvbGljeS5qcyIsIndlYnBhY2s6Ly9zbmVrZGVrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9FcnJvcnMuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vRmV0Y2hIdHRwQ2xpZW50LmpzIiwid2VicGFjazovL3NuZWtkZWsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0hhbmRzaGFrZVByb3RvY29sLmpzIiwid2VicGFjazovL3NuZWtkZWsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0hlYWRlck5hbWVzLmpzIiwid2VicGFjazovL3NuZWtkZWsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0h0dHBDbGllbnQuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vSHR0cENvbm5lY3Rpb24uanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vSHViQ29ubmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9zbmVrZGVrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9IdWJDb25uZWN0aW9uQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9zbmVrZGVrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9Kc29uSHViUHJvdG9jb2wuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vTG9uZ1BvbGxpbmdUcmFuc3BvcnQuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vTWVzc2FnZUJ1ZmZlci5qcyIsIndlYnBhY2s6Ly9zbmVrZGVrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9TZXJ2ZXJTZW50RXZlbnRzVHJhbnNwb3J0LmpzIiwid2VicGFjazovL3NuZWtkZWsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL1N1YmplY3QuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vVGV4dE1lc3NhZ2VGb3JtYXQuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vVXRpbHMuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vV2ViU29ja2V0VHJhbnNwb3J0LmpzIiwid2VicGFjazovL3NuZWtkZWsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL1hockh0dHBDbGllbnQuanMiLCJ3ZWJwYWNrOi8vc25la2Rlay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4vLyBSb3VnaCBwb2x5ZmlsbCBvZiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQWJvcnRDb250cm9sbGVyXHJcbi8vIFdlIGRvbid0IGFjdHVhbGx5IGV2ZXIgdXNlIHRoZSBBUEkgYmVpbmcgcG9seWZpbGxlZCwgd2UgYWx3YXlzIHVzZSB0aGUgcG9seWZpbGwgYmVjYXVzZVxyXG4vLyBpdCdzIGEgdmVyeSBuZXcgQVBJIHJpZ2h0IG5vdy5cclxuLy8gTm90IGV4cG9ydGVkIGZyb20gaW5kZXguXHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgQWJvcnRDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2lzQWJvcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25hYm9ydCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhYm9ydCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQWJvcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc0Fib3J0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uYWJvcnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldCBzaWduYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXQgYWJvcnRlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNBYm9ydGVkO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFib3J0Q29udHJvbGxlci5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IEhlYWRlck5hbWVzIH0gZnJvbSBcIi4vSGVhZGVyTmFtZXNcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gXCIuL0h0dHBDbGllbnRcIjtcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBBY2Nlc3NUb2tlbkh0dHBDbGllbnQgZXh0ZW5kcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGlubmVyQ2xpZW50LCBhY2Nlc3NUb2tlbkZhY3RvcnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2lubmVyQ2xpZW50ID0gaW5uZXJDbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5ID0gYWNjZXNzVG9rZW5GYWN0b3J5O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2VuZChyZXF1ZXN0KSB7XHJcbiAgICAgICAgbGV0IGFsbG93UmV0cnkgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkgJiYgKCF0aGlzLl9hY2Nlc3NUb2tlbiB8fCAocmVxdWVzdC51cmwgJiYgcmVxdWVzdC51cmwuaW5kZXhPZihcIi9uZWdvdGlhdGU/XCIpID4gMCkpKSB7XHJcbiAgICAgICAgICAgIC8vIGRvbid0IHJldHJ5IGlmIHRoZSByZXF1ZXN0IGlzIGEgbmVnb3RpYXRlIG9yIGlmIHdlIGp1c3QgZ290IGEgcG90ZW50aWFsbHkgbmV3IHRva2VuIGZyb20gdGhlIGFjY2VzcyB0b2tlbiBmYWN0b3J5XHJcbiAgICAgICAgICAgIGFsbG93UmV0cnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2V0QXV0aG9yaXphdGlvbkhlYWRlcihyZXF1ZXN0KTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2lubmVyQ2xpZW50LnNlbmQocmVxdWVzdCk7XHJcbiAgICAgICAgaWYgKGFsbG93UmV0cnkgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gNDAxICYmIHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRBdXRob3JpemF0aW9uSGVhZGVyKHJlcXVlc3QpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5faW5uZXJDbGllbnQuc2VuZChyZXF1ZXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfVxyXG4gICAgX3NldEF1dGhvcml6YXRpb25IZWFkZXIocmVxdWVzdCkge1xyXG4gICAgICAgIGlmICghcmVxdWVzdC5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuaGVhZGVycyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fYWNjZXNzVG9rZW4pIHtcclxuICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzW0hlYWRlck5hbWVzLkF1dGhvcml6YXRpb25dID0gYEJlYXJlciAke3RoaXMuX2FjY2Vzc1Rva2VufWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRvbid0IHJlbW92ZSB0aGUgaGVhZGVyIGlmIHRoZXJlIGlzbid0IGFuIGFjY2VzcyB0b2tlbiBmYWN0b3J5LCB0aGUgdXNlciBtYW51YWxseSBhZGRlZCB0aGUgaGVhZGVyIGluIHRoaXMgY2FzZVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5oZWFkZXJzW0hlYWRlck5hbWVzLkF1dGhvcml6YXRpb25dKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVxdWVzdC5oZWFkZXJzW0hlYWRlck5hbWVzLkF1dGhvcml6YXRpb25dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0Q29va2llU3RyaW5nKHVybCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lckNsaWVudC5nZXRDb29raWVTdHJpbmcodXJsKTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1BY2Nlc3NUb2tlbkh0dHBDbGllbnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBBYm9ydEVycm9yIH0gZnJvbSBcIi4vRXJyb3JzXCI7XHJcbmltcG9ydCB7IEZldGNoSHR0cENsaWVudCB9IGZyb20gXCIuL0ZldGNoSHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSBcIi4vSHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbmltcG9ydCB7IFhockh0dHBDbGllbnQgfSBmcm9tIFwiLi9YaHJIdHRwQ2xpZW50XCI7XHJcbi8qKiBEZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHR0cENsaWVudH0uICovXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SHR0cENsaWVudCBleHRlbmRzIEh0dHBDbGllbnQge1xyXG4gICAgLyoqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuRGVmYXVsdEh0dHBDbGllbnR9LCB1c2luZyB0aGUgcHJvdmlkZWQge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5JTG9nZ2VyfSB0byBsb2cgbWVzc2FnZXMuICovXHJcbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZmV0Y2ggIT09IFwidW5kZWZpbmVkXCIgfHwgUGxhdGZvcm0uaXNOb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2h0dHBDbGllbnQgPSBuZXcgRmV0Y2hIdHRwQ2xpZW50KGxvZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB0aGlzLl9odHRwQ2xpZW50ID0gbmV3IFhockh0dHBDbGllbnQobG9nZ2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHVzYWJsZSBIdHRwQ2xpZW50IGZvdW5kLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogQGluaGVyaXREb2MgKi9cclxuICAgIHNlbmQocmVxdWVzdCkge1xyXG4gICAgICAgIC8vIENoZWNrIHRoYXQgYWJvcnQgd2FzIG5vdCBzaWduYWxlZCBiZWZvcmUgY2FsbGluZyBzZW5kXHJcbiAgICAgICAgaWYgKHJlcXVlc3QuYWJvcnRTaWduYWwgJiYgcmVxdWVzdC5hYm9ydFNpZ25hbC5hYm9ydGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWJvcnRFcnJvcigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXF1ZXN0Lm1ldGhvZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTm8gbWV0aG9kIGRlZmluZWQuXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXF1ZXN0LnVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTm8gdXJsIGRlZmluZWQuXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHBDbGllbnQuc2VuZChyZXF1ZXN0KTtcclxuICAgIH1cclxuICAgIGdldENvb2tpZVN0cmluZyh1cmwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faHR0cENsaWVudC5nZXRDb29raWVTdHJpbmcodXJsKTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1EZWZhdWx0SHR0cENsaWVudC5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbi8vIDAsIDIsIDEwLCAzMCBzZWNvbmQgZGVsYXlzIGJlZm9yZSByZWNvbm5lY3QgYXR0ZW1wdHMuXHJcbmNvbnN0IERFRkFVTFRfUkVUUllfREVMQVlTX0lOX01JTExJU0VDT05EUyA9IFswLCAyMDAwLCAxMDAwMCwgMzAwMDAsIG51bGxdO1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRSZWNvbm5lY3RQb2xpY3kge1xyXG4gICAgY29uc3RydWN0b3IocmV0cnlEZWxheXMpIHtcclxuICAgICAgICB0aGlzLl9yZXRyeURlbGF5cyA9IHJldHJ5RGVsYXlzICE9PSB1bmRlZmluZWQgPyBbLi4ucmV0cnlEZWxheXMsIG51bGxdIDogREVGQVVMVF9SRVRSWV9ERUxBWVNfSU5fTUlMTElTRUNPTkRTO1xyXG4gICAgfVxyXG4gICAgbmV4dFJldHJ5RGVsYXlJbk1pbGxpc2Vjb25kcyhyZXRyeUNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmV0cnlEZWxheXNbcmV0cnlDb250ZXh0LnByZXZpb3VzUmV0cnlDb3VudF07XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGVmYXVsdFJlY29ubmVjdFBvbGljeS5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbi8qKiBFcnJvciB0aHJvd24gd2hlbiBhbiBIVFRQIHJlcXVlc3QgZmFpbHMuICovXHJcbmV4cG9ydCBjbGFzcyBIdHRwRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh0dHBFcnJvcn0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yTWVzc2FnZSBBIGRlc2NyaXB0aXZlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzQ29kZSBUaGUgSFRUUCBzdGF0dXMgY29kZSByZXByZXNlbnRlZCBieSB0aGlzIGVycm9yLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlcnJvck1lc3NhZ2UsIHN0YXR1c0NvZGUpIHtcclxuICAgICAgICBjb25zdCB0cnVlUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcclxuICAgICAgICBzdXBlcihgJHtlcnJvck1lc3NhZ2V9OiBTdGF0dXMgY29kZSAnJHtzdGF0dXNDb2RlfSdgKTtcclxuICAgICAgICB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgaXNzdWUgaW4gVHlwZXNjcmlwdCBjb21waWxlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM5NjUjaXNzdWVjb21tZW50LTI3ODU3MDIwMFxyXG4gICAgICAgIHRoaXMuX19wcm90b19fID0gdHJ1ZVByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8qKiBFcnJvciB0aHJvd24gd2hlbiBhIHRpbWVvdXQgZWxhcHNlcy4gKi9cclxuZXhwb3J0IGNsYXNzIFRpbWVvdXRFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIC8qKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuVGltZW91dEVycm9yfS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JNZXNzYWdlIEEgZGVzY3JpcHRpdmUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZXJyb3JNZXNzYWdlID0gXCJBIHRpbWVvdXQgb2NjdXJyZWQuXCIpIHtcclxuICAgICAgICBjb25zdCB0cnVlUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcclxuICAgICAgICBzdXBlcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgaXNzdWUgaW4gVHlwZXNjcmlwdCBjb21waWxlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM5NjUjaXNzdWVjb21tZW50LTI3ODU3MDIwMFxyXG4gICAgICAgIHRoaXMuX19wcm90b19fID0gdHJ1ZVByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8qKiBFcnJvciB0aHJvd24gd2hlbiBhbiBhY3Rpb24gaXMgYWJvcnRlZC4gKi9cclxuZXhwb3J0IGNsYXNzIEFib3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQWJvcnRFcnJvcn0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yTWVzc2FnZSBBIGRlc2NyaXB0aXZlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVycm9yTWVzc2FnZSA9IFwiQW4gYWJvcnQgb2NjdXJyZWQuXCIpIHtcclxuICAgICAgICBjb25zdCB0cnVlUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcclxuICAgICAgICBzdXBlcihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgaXNzdWUgaW4gVHlwZXNjcmlwdCBjb21waWxlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM5NjUjaXNzdWVjb21tZW50LTI3ODU3MDIwMFxyXG4gICAgICAgIHRoaXMuX19wcm90b19fID0gdHJ1ZVByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8qKiBFcnJvciB0aHJvd24gd2hlbiB0aGUgc2VsZWN0ZWQgdHJhbnNwb3J0IGlzIHVuc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLiAqL1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIFVuc3VwcG9ydGVkVHJhbnNwb3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLlVuc3VwcG9ydGVkVHJhbnNwb3J0RXJyb3J9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIEEgZGVzY3JpcHRpdmUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqIEBwYXJhbSB7SHR0cFRyYW5zcG9ydFR5cGV9IHRyYW5zcG9ydCBUaGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdHRwVHJhbnNwb3J0VHlwZX0gdGhpcyBlcnJvciBvY2N1cnJlZCBvbi5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgdHJhbnNwb3J0KSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XHJcbiAgICAgICAgdGhpcy5lcnJvclR5cGUgPSAnVW5zdXBwb3J0ZWRUcmFuc3BvcnRFcnJvcic7XHJcbiAgICAgICAgLy8gV29ya2Fyb3VuZCBpc3N1ZSBpbiBUeXBlc2NyaXB0IGNvbXBpbGVyXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xMzk2NSNpc3N1ZWNvbW1lbnQtMjc4NTcwMjAwXHJcbiAgICAgICAgdGhpcy5fX3Byb3RvX18gPSB0cnVlUHJvdG87XHJcbiAgICB9XHJcbn1cclxuLyoqIEVycm9yIHRocm93biB3aGVuIHRoZSBzZWxlY3RlZCB0cmFuc3BvcnQgaXMgZGlzYWJsZWQgYnkgdGhlIGJyb3dzZXIuICovXHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgRGlzYWJsZWRUcmFuc3BvcnRFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIC8qKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuRGlzYWJsZWRUcmFuc3BvcnRFcnJvcn0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgQSBkZXNjcmlwdGl2ZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICogQHBhcmFtIHtIdHRwVHJhbnNwb3J0VHlwZX0gdHJhbnNwb3J0IFRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh0dHBUcmFuc3BvcnRUeXBlfSB0aGlzIGVycm9yIG9jY3VycmVkIG9uLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCB0cmFuc3BvcnQpIHtcclxuICAgICAgICBjb25zdCB0cnVlUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcclxuICAgICAgICB0aGlzLmVycm9yVHlwZSA9ICdEaXNhYmxlZFRyYW5zcG9ydEVycm9yJztcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gdGhlIHNlbGVjdGVkIHRyYW5zcG9ydCBjYW5ub3QgYmUgc3RhcnRlZC4gKi9cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBGYWlsZWRUb1N0YXJ0VHJhbnNwb3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkZhaWxlZFRvU3RhcnRUcmFuc3BvcnRFcnJvcn0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgQSBkZXNjcmlwdGl2ZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICogQHBhcmFtIHtIdHRwVHJhbnNwb3J0VHlwZX0gdHJhbnNwb3J0IFRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh0dHBUcmFuc3BvcnRUeXBlfSB0aGlzIGVycm9yIG9jY3VycmVkIG9uLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCB0cmFuc3BvcnQpIHtcclxuICAgICAgICBjb25zdCB0cnVlUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcclxuICAgICAgICB0aGlzLmVycm9yVHlwZSA9ICdGYWlsZWRUb1N0YXJ0VHJhbnNwb3J0RXJyb3InO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgaXNzdWUgaW4gVHlwZXNjcmlwdCBjb21waWxlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM5NjUjaXNzdWVjb21tZW50LTI3ODU3MDIwMFxyXG4gICAgICAgIHRoaXMuX19wcm90b19fID0gdHJ1ZVByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8qKiBFcnJvciB0aHJvd24gd2hlbiB0aGUgbmVnb3RpYXRpb24gd2l0aCB0aGUgc2VydmVyIGZhaWxlZCB0byBjb21wbGV0ZS4gKi9cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBGYWlsZWRUb05lZ290aWF0ZVdpdGhTZXJ2ZXJFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIC8qKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuRmFpbGVkVG9OZWdvdGlhdGVXaXRoU2VydmVyRXJyb3J9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIEEgZGVzY3JpcHRpdmUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnN0IHRydWVQcm90byA9IG5ldy50YXJnZXQucHJvdG90eXBlO1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuZXJyb3JUeXBlID0gJ0ZhaWxlZFRvTmVnb3RpYXRlV2l0aFNlcnZlckVycm9yJztcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gbXVsdGlwbGUgZXJyb3JzIGhhdmUgb2NjdXJyZWQuICovXHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgQWdncmVnYXRlRXJyb3JzIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgLyoqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2Yge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5BZ2dyZWdhdGVFcnJvcnN9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIEEgZGVzY3JpcHRpdmUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqIEBwYXJhbSB7RXJyb3JbXX0gaW5uZXJFcnJvcnMgVGhlIGNvbGxlY3Rpb24gb2YgZXJyb3JzIHRoaXMgZXJyb3IgaXMgYWdncmVnYXRpbmcuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGlubmVyRXJyb3JzKSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5pbm5lckVycm9ycyA9IGlubmVyRXJyb3JzO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgaXNzdWUgaW4gVHlwZXNjcmlwdCBjb21waWxlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM5NjUjaXNzdWVjb21tZW50LTI3ODU3MDIwMFxyXG4gICAgICAgIHRoaXMuX19wcm90b19fID0gdHJ1ZVByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUVycm9ycy5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IEFib3J0RXJyb3IsIEh0dHBFcnJvciwgVGltZW91dEVycm9yIH0gZnJvbSBcIi4vRXJyb3JzXCI7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXNwb25zZSB9IGZyb20gXCIuL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tIFwiLi9JTG9nZ2VyXCI7XHJcbmltcG9ydCB7IFBsYXRmb3JtLCBnZXRHbG9iYWxUaGlzLCBpc0FycmF5QnVmZmVyIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuZXhwb3J0IGNsYXNzIEZldGNoSHR0cENsaWVudCBleHRlbmRzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IobG9nZ2VyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgLy8gTm9kZSBhZGRlZCBhIGZldGNoIGltcGxlbWVudGF0aW9uIHRvIHRoZSBnbG9iYWwgc2NvcGUgc3RhcnRpbmcgaW4gdjE4LlxyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gYWRkIGEgY29va2llIGphciBpbiBub2RlIHRvIGJlIGFibGUgdG8gc2hhcmUgY29va2llcyB3aXRoIFdlYlNvY2tldFxyXG4gICAgICAgIGlmICh0eXBlb2YgZmV0Y2ggPT09IFwidW5kZWZpbmVkXCIgfHwgUGxhdGZvcm0uaXNOb2RlKSB7XHJcbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGlnbm9yZSB0aGUgZHluYW1pYyByZXF1aXJlIGluIHdlYnBhY2sgYnVpbGRzIHdlIG5lZWQgdG8gZG8gdGhpcyBtYWdpY1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlOiBUUyBkb2Vzbid0IGtub3cgYWJvdXQgdGhlc2UgbmFtZXNcclxuICAgICAgICAgICAgY29uc3QgcmVxdWlyZUZ1bmMgPSB0eXBlb2YgX193ZWJwYWNrX3JlcXVpcmVfXyA9PT0gXCJmdW5jdGlvblwiID8gX19ub25fd2VicGFja19yZXF1aXJlX18gOiByZXF1aXJlO1xyXG4gICAgICAgICAgICAvLyBDb29raWVzIGFyZW4ndCBhdXRvbWF0aWNhbGx5IGhhbmRsZWQgaW4gTm9kZSBzbyB3ZSBuZWVkIHRvIGFkZCBhIENvb2tpZUphciB0byBwcmVzZXJ2ZSBjb29raWVzIGFjcm9zcyByZXF1ZXN0c1xyXG4gICAgICAgICAgICB0aGlzLl9qYXIgPSBuZXcgKHJlcXVpcmVGdW5jKFwidG91Z2gtY29va2llXCIpKS5Db29raWVKYXIoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmZXRjaCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmV0Y2hUeXBlID0gcmVxdWlyZUZ1bmMoXCJub2RlLWZldGNoXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIGZldGNoIGZyb20gTm9kZSBpZiBhdmFpbGFibGVcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZldGNoVHlwZSA9IGZldGNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIG5vZGUtZmV0Y2ggZG9lc24ndCBoYXZlIGEgbmljZSBBUEkgZm9yIGdldHRpbmcgYW5kIHNldHRpbmcgY29va2llc1xyXG4gICAgICAgICAgICAvLyBmZXRjaC1jb29raWUgd2lsbCB3cmFwIGEgZmV0Y2ggaW1wbGVtZW50YXRpb24gd2l0aCBhIGRlZmF1bHQgQ29va2llSmFyIG9yIGEgcHJvdmlkZWQgb25lXHJcbiAgICAgICAgICAgIHRoaXMuX2ZldGNoVHlwZSA9IHJlcXVpcmVGdW5jKFwiZmV0Y2gtY29va2llXCIpKHRoaXMuX2ZldGNoVHlwZSwgdGhpcy5famFyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZldGNoVHlwZSA9IGZldGNoLmJpbmQoZ2V0R2xvYmFsVGhpcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBBYm9ydENvbnRyb2xsZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgLy8gSW4gb3JkZXIgdG8gaWdub3JlIHRoZSBkeW5hbWljIHJlcXVpcmUgaW4gd2VicGFjayBidWlsZHMgd2UgbmVlZCB0byBkbyB0aGlzIG1hZ2ljXHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IFRTIGRvZXNuJ3Qga25vdyBhYm91dCB0aGVzZSBuYW1lc1xyXG4gICAgICAgICAgICBjb25zdCByZXF1aXJlRnVuYyA9IHR5cGVvZiBfX3dlYnBhY2tfcmVxdWlyZV9fID09PSBcImZ1bmN0aW9uXCIgPyBfX25vbl93ZWJwYWNrX3JlcXVpcmVfXyA6IHJlcXVpcmU7XHJcbiAgICAgICAgICAgIC8vIE5vZGUgbmVlZHMgRXZlbnRMaXN0ZW5lciBtZXRob2RzIG9uIEFib3J0Q29udHJvbGxlciB3aGljaCBvdXIgY3VzdG9tIHBvbHlmaWxsIGRvZXNuJ3QgcHJvdmlkZVxyXG4gICAgICAgICAgICB0aGlzLl9hYm9ydENvbnRyb2xsZXJUeXBlID0gcmVxdWlyZUZ1bmMoXCJhYm9ydC1jb250cm9sbGVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYWJvcnRDb250cm9sbGVyVHlwZSA9IEFib3J0Q29udHJvbGxlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogQGluaGVyaXREb2MgKi9cclxuICAgIGFzeW5jIHNlbmQocmVxdWVzdCkge1xyXG4gICAgICAgIC8vIENoZWNrIHRoYXQgYWJvcnQgd2FzIG5vdCBzaWduYWxlZCBiZWZvcmUgY2FsbGluZyBzZW5kXHJcbiAgICAgICAgaWYgKHJlcXVlc3QuYWJvcnRTaWduYWwgJiYgcmVxdWVzdC5hYm9ydFNpZ25hbC5hYm9ydGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBBYm9ydEVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVxdWVzdC5tZXRob2QpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gbWV0aG9kIGRlZmluZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJlcXVlc3QudXJsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHVybCBkZWZpbmVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYWJvcnRDb250cm9sbGVyID0gbmV3IHRoaXMuX2Fib3J0Q29udHJvbGxlclR5cGUoKTtcclxuICAgICAgICBsZXQgZXJyb3I7XHJcbiAgICAgICAgLy8gSG9vayBvdXIgYWJvcnRTaWduYWwgaW50byB0aGUgYWJvcnQgY29udHJvbGxlclxyXG4gICAgICAgIGlmIChyZXF1ZXN0LmFib3J0U2lnbmFsKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuYWJvcnRTaWduYWwub25hYm9ydCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFib3J0Q29udHJvbGxlci5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgQWJvcnRFcnJvcigpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBhIHRpbWVvdXQgaGFzIGJlZW4gcGFzc2VkIGluLCBzZXR1cCBhIHRpbWVvdXQgdG8gY2FsbCBhYm9ydFxyXG4gICAgICAgIC8vIFR5cGUgbmVlZHMgdG8gYmUgYW55IHRvIGZpdCB3aW5kb3cuc2V0VGltZW91dCBhbmQgTm9kZUpTLnNldFRpbWVvdXRcclxuICAgICAgICBsZXQgdGltZW91dElkID0gbnVsbDtcclxuICAgICAgICBpZiAocmVxdWVzdC50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zVGltZW91dCA9IHJlcXVlc3QudGltZW91dDtcclxuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYFRpbWVvdXQgZnJvbSBIVFRQIHJlcXVlc3QuYCk7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBUaW1lb3V0RXJyb3IoKTtcclxuICAgICAgICAgICAgfSwgbXNUaW1lb3V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3QuY29udGVudCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICByZXF1ZXN0LmNvbnRlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0LmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgLy8gRXhwbGljaXRseSBzZXR0aW5nIHRoZSBDb250ZW50LVR5cGUgaGVhZGVyIGZvciBSZWFjdCBOYXRpdmUgb24gQW5kcm9pZCBwbGF0Zm9ybS5cclxuICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzID0gcmVxdWVzdC5oZWFkZXJzIHx8IHt9O1xyXG4gICAgICAgICAgICBpZiAoaXNBcnJheUJ1ZmZlcihyZXF1ZXN0LmNvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzcG9uc2U7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9mZXRjaFR5cGUocmVxdWVzdC51cmwsIHtcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuY29udGVudCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBcIm5vLWNhY2hlXCIsXHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPT09IHRydWUgPyBcImluY2x1ZGVcIiA6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIlgtUmVxdWVzdGVkLVdpdGhcIjogXCJYTUxIdHRwUmVxdWVzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgbW9kZTogXCJjb3JzXCIsXHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdDogXCJmb2xsb3dcIixcclxuICAgICAgICAgICAgICAgIHNpZ25hbDogYWJvcnRDb250cm9sbGVyLnNpZ25hbCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5XYXJuaW5nLCBgRXJyb3IgZnJvbSBIVFRQIHJlcXVlc3QuICR7ZX0uYCk7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICBpZiAodGltZW91dElkKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5hYm9ydFNpZ25hbCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5hYm9ydFNpZ25hbC5vbmFib3J0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGF3YWl0IGRlc2VyaWFsaXplQ29udGVudChyZXNwb25zZSwgXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgSHR0cEVycm9yKGVycm9yTWVzc2FnZSB8fCByZXNwb25zZS5zdGF0dXNUZXh0LCByZXNwb25zZS5zdGF0dXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb250ZW50ID0gZGVzZXJpYWxpemVDb250ZW50KHJlc3BvbnNlLCByZXF1ZXN0LnJlc3BvbnNlVHlwZSk7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IGNvbnRlbnQ7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBIdHRwUmVzcG9uc2UocmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5zdGF0dXNUZXh0LCBwYXlsb2FkKTtcclxuICAgIH1cclxuICAgIGdldENvb2tpZVN0cmluZyh1cmwpIHtcclxuICAgICAgICBsZXQgY29va2llcyA9IFwiXCI7XHJcbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzTm9kZSAmJiB0aGlzLl9qYXIpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogdW51c2VkIHZhcmlhYmxlXHJcbiAgICAgICAgICAgIHRoaXMuX2phci5nZXRDb29raWVzKHVybCwgKGUsIGMpID0+IGNvb2tpZXMgPSBjLmpvaW4oXCI7IFwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb29raWVzO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGRlc2VyaWFsaXplQ29udGVudChyZXNwb25zZSwgcmVzcG9uc2VUeXBlKSB7XHJcbiAgICBsZXQgY29udGVudDtcclxuICAgIHN3aXRjaCAocmVzcG9uc2VUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImFycmF5YnVmZmVyXCI6XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwidGV4dFwiOlxyXG4gICAgICAgICAgICBjb250ZW50ID0gcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiYmxvYlwiOlxyXG4gICAgICAgIGNhc2UgXCJkb2N1bWVudFwiOlxyXG4gICAgICAgIGNhc2UgXCJqc29uXCI6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtyZXNwb25zZVR5cGV9IGlzIG5vdCBzdXBwb3J0ZWQuYCk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29udGVudCA9IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29udGVudDtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1GZXRjaEh0dHBDbGllbnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBUZXh0TWVzc2FnZUZvcm1hdCB9IGZyb20gXCIuL1RleHRNZXNzYWdlRm9ybWF0XCI7XHJcbmltcG9ydCB7IGlzQXJyYXlCdWZmZXIgfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIEhhbmRzaGFrZVByb3RvY29sIHtcclxuICAgIC8vIEhhbmRzaGFrZSByZXF1ZXN0IGlzIGFsd2F5cyBKU09OXHJcbiAgICB3cml0ZUhhbmRzaGFrZVJlcXVlc3QoaGFuZHNoYWtlUmVxdWVzdCkge1xyXG4gICAgICAgIHJldHVybiBUZXh0TWVzc2FnZUZvcm1hdC53cml0ZShKU09OLnN0cmluZ2lmeShoYW5kc2hha2VSZXF1ZXN0KSk7XHJcbiAgICB9XHJcbiAgICBwYXJzZUhhbmRzaGFrZVJlc3BvbnNlKGRhdGEpIHtcclxuICAgICAgICBsZXQgbWVzc2FnZURhdGE7XHJcbiAgICAgICAgbGV0IHJlbWFpbmluZ0RhdGE7XHJcbiAgICAgICAgaWYgKGlzQXJyYXlCdWZmZXIoZGF0YSkpIHtcclxuICAgICAgICAgICAgLy8gRm9ybWF0IGlzIGJpbmFyeSBidXQgc3RpbGwgbmVlZCB0byByZWFkIEpTT04gdGV4dCBmcm9tIGhhbmRzaGFrZSByZXNwb25zZVxyXG4gICAgICAgICAgICBjb25zdCBiaW5hcnlEYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gYmluYXJ5RGF0YS5pbmRleE9mKFRleHRNZXNzYWdlRm9ybWF0LlJlY29yZFNlcGFyYXRvckNvZGUpO1xyXG4gICAgICAgICAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXNzYWdlIGlzIGluY29tcGxldGUuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnRlbnQgYmVmb3JlIHNlcGFyYXRvciBpcyBoYW5kc2hha2UgcmVzcG9uc2VcclxuICAgICAgICAgICAgLy8gb3B0aW9uYWwgY29udGVudCBhZnRlciBpcyBhZGRpdGlvbmFsIG1lc3NhZ2VzXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlTGVuZ3RoID0gc2VwYXJhdG9ySW5kZXggKyAxO1xyXG4gICAgICAgICAgICBtZXNzYWdlRGF0YSA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYmluYXJ5RGF0YS5zbGljZSgwLCByZXNwb25zZUxlbmd0aCkpKTtcclxuICAgICAgICAgICAgcmVtYWluaW5nRGF0YSA9IChiaW5hcnlEYXRhLmJ5dGVMZW5ndGggPiByZXNwb25zZUxlbmd0aCkgPyBiaW5hcnlEYXRhLnNsaWNlKHJlc3BvbnNlTGVuZ3RoKS5idWZmZXIgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGV4dERhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IHRleHREYXRhLmluZGV4T2YoVGV4dE1lc3NhZ2VGb3JtYXQuUmVjb3JkU2VwYXJhdG9yKTtcclxuICAgICAgICAgICAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWVzc2FnZSBpcyBpbmNvbXBsZXRlLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb250ZW50IGJlZm9yZSBzZXBhcmF0b3IgaXMgaGFuZHNoYWtlIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIC8vIG9wdGlvbmFsIGNvbnRlbnQgYWZ0ZXIgaXMgYWRkaXRpb25hbCBtZXNzYWdlc1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZUxlbmd0aCA9IHNlcGFyYXRvckluZGV4ICsgMTtcclxuICAgICAgICAgICAgbWVzc2FnZURhdGEgPSB0ZXh0RGF0YS5zdWJzdHJpbmcoMCwgcmVzcG9uc2VMZW5ndGgpO1xyXG4gICAgICAgICAgICByZW1haW5pbmdEYXRhID0gKHRleHREYXRhLmxlbmd0aCA+IHJlc3BvbnNlTGVuZ3RoKSA/IHRleHREYXRhLnN1YnN0cmluZyhyZXNwb25zZUxlbmd0aCkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIHNob3VsZCBoYXZlIGp1c3QgdGhlIHNpbmdsZSBoYW5kc2hha2UgbWVzc2FnZVxyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gVGV4dE1lc3NhZ2VGb3JtYXQucGFyc2UobWVzc2FnZURhdGEpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShtZXNzYWdlc1swXSk7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnR5cGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgYSBoYW5kc2hha2UgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VNZXNzYWdlID0gcmVzcG9uc2U7XHJcbiAgICAgICAgLy8gbXVsdGlwbGUgbWVzc2FnZXMgY291bGQgaGF2ZSBhcnJpdmVkIHdpdGggaGFuZHNoYWtlXHJcbiAgICAgICAgLy8gcmV0dXJuIGFkZGl0aW9uYWwgZGF0YSB0byBiZSBwYXJzZWQgYXMgdXN1YWwsIG9yIG51bGwgaWYgYWxsIHBhcnNlZFxyXG4gICAgICAgIHJldHVybiBbcmVtYWluaW5nRGF0YSwgcmVzcG9uc2VNZXNzYWdlXTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1IYW5kc2hha2VQcm90b2NvbC5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmV4cG9ydCBjbGFzcyBIZWFkZXJOYW1lcyB7XHJcbn1cclxuSGVhZGVyTmFtZXMuQXV0aG9yaXphdGlvbiA9IFwiQXV0aG9yaXphdGlvblwiO1xyXG5IZWFkZXJOYW1lcy5Db29raWUgPSBcIkNvb2tpZVwiO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1IZWFkZXJOYW1lcy5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbi8qKiBSZXByZXNlbnRzIGFuIEhUVFAgcmVzcG9uc2UuICovXHJcbmV4cG9ydCBjbGFzcyBIdHRwUmVzcG9uc2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhdHVzQ29kZSwgc3RhdHVzVGV4dCwgY29udGVudCkge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNUZXh0ID0gc3RhdHVzVGV4dDtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgfVxyXG59XHJcbi8qKiBBYnN0cmFjdGlvbiBvdmVyIGFuIEhUVFAgY2xpZW50LlxyXG4gKlxyXG4gKiBUaGlzIGNsYXNzIHByb3ZpZGVzIGFuIGFic3RyYWN0aW9uIG92ZXIgYW4gSFRUUCBjbGllbnQgc28gdGhhdCBhIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbiBjYW4gYmUgcHJvdmlkZWQgb24gZGlmZmVyZW50IHBsYXRmb3Jtcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcclxuICAgIGdldCh1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZW5kKHtcclxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwb3N0KHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbmQoe1xyXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUodXJsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCh7XHJcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqIEdldHMgYWxsIGNvb2tpZXMgdGhhdCBhcHBseSB0byB0aGUgc3BlY2lmaWVkIFVSTC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgdGhhdCB0aGUgY29va2llcyBhcmUgdmFsaWQgZm9yLlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gQSBzdHJpbmcgY29udGFpbmluZyBhbGwgdGhlIGtleS12YWx1ZSBjb29raWUgcGFpcnMgZm9yIHRoZSBzcGVjaWZpZWQgVVJMLlxyXG4gICAgICovXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBnZXRDb29raWVTdHJpbmcodXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SHR0cENsaWVudC5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IEFjY2Vzc1Rva2VuSHR0cENsaWVudCB9IGZyb20gXCIuL0FjY2Vzc1Rva2VuSHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBEZWZhdWx0SHR0cENsaWVudCB9IGZyb20gXCIuL0RlZmF1bHRIdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7IEFnZ3JlZ2F0ZUVycm9ycywgRGlzYWJsZWRUcmFuc3BvcnRFcnJvciwgRmFpbGVkVG9OZWdvdGlhdGVXaXRoU2VydmVyRXJyb3IsIEZhaWxlZFRvU3RhcnRUcmFuc3BvcnRFcnJvciwgSHR0cEVycm9yLCBVbnN1cHBvcnRlZFRyYW5zcG9ydEVycm9yLCBBYm9ydEVycm9yIH0gZnJvbSBcIi4vRXJyb3JzXCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBIdHRwVHJhbnNwb3J0VHlwZSwgVHJhbnNmZXJGb3JtYXQgfSBmcm9tIFwiLi9JVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IExvbmdQb2xsaW5nVHJhbnNwb3J0IH0gZnJvbSBcIi4vTG9uZ1BvbGxpbmdUcmFuc3BvcnRcIjtcclxuaW1wb3J0IHsgU2VydmVyU2VudEV2ZW50c1RyYW5zcG9ydCB9IGZyb20gXCIuL1NlcnZlclNlbnRFdmVudHNUcmFuc3BvcnRcIjtcclxuaW1wb3J0IHsgQXJnLCBjcmVhdGVMb2dnZXIsIGdldFVzZXJBZ2VudEhlYWRlciwgUGxhdGZvcm0gfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG5pbXBvcnQgeyBXZWJTb2NrZXRUcmFuc3BvcnQgfSBmcm9tIFwiLi9XZWJTb2NrZXRUcmFuc3BvcnRcIjtcclxuY29uc3QgTUFYX1JFRElSRUNUUyA9IDEwMDtcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ29ubmVjdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIHRoaXMuX3N0b3BQcm9taXNlUmVzb2x2ZXIgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5mZWF0dXJlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuX25lZ290aWF0ZVZlcnNpb24gPSAxO1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHVybCwgXCJ1cmxcIik7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gY3JlYXRlTG9nZ2VyKG9wdGlvbnMubG9nZ2VyKTtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSB0aGlzLl9yZXNvbHZlVXJsKHVybCk7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgb3B0aW9ucy5sb2dNZXNzYWdlQ29udGVudCA9IG9wdGlvbnMubG9nTWVzc2FnZUNvbnRlbnQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogb3B0aW9ucy5sb2dNZXNzYWdlQ29udGVudDtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzID09PSBcImJvb2xlYW5cIiB8fCBvcHRpb25zLndpdGhDcmVkZW50aWFscyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLndpdGhDcmVkZW50aWFscztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIndpdGhDcmVkZW50aWFscyBvcHRpb24gd2FzIG5vdCBhICdib29sZWFuJyBvciAndW5kZWZpbmVkJyB2YWx1ZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3B0aW9ucy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0ID09PSB1bmRlZmluZWQgPyAxMDAgKiAxMDAwIDogb3B0aW9ucy50aW1lb3V0O1xyXG4gICAgICAgIGxldCB3ZWJTb2NrZXRNb2R1bGUgPSBudWxsO1xyXG4gICAgICAgIGxldCBldmVudFNvdXJjZU1vZHVsZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzTm9kZSAmJiB0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAvLyBJbiBvcmRlciB0byBpZ25vcmUgdGhlIGR5bmFtaWMgcmVxdWlyZSBpbiB3ZWJwYWNrIGJ1aWxkcyB3ZSBuZWVkIHRvIGRvIHRoaXMgbWFnaWNcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogVFMgZG9lc24ndCBrbm93IGFib3V0IHRoZXNlIG5hbWVzXHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmVGdW5jID0gdHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gPT09IFwiZnVuY3Rpb25cIiA/IF9fbm9uX3dlYnBhY2tfcmVxdWlyZV9fIDogcmVxdWlyZTtcclxuICAgICAgICAgICAgd2ViU29ja2V0TW9kdWxlID0gcmVxdWlyZUZ1bmMoXCJ3c1wiKTtcclxuICAgICAgICAgICAgZXZlbnRTb3VyY2VNb2R1bGUgPSByZXF1aXJlRnVuYyhcImV2ZW50c291cmNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIVBsYXRmb3JtLmlzTm9kZSAmJiB0eXBlb2YgV2ViU29ja2V0ICE9PSBcInVuZGVmaW5lZFwiICYmICFvcHRpb25zLldlYlNvY2tldCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLldlYlNvY2tldCA9IFdlYlNvY2tldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoUGxhdGZvcm0uaXNOb2RlICYmICFvcHRpb25zLldlYlNvY2tldCkge1xyXG4gICAgICAgICAgICBpZiAod2ViU29ja2V0TW9kdWxlKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLldlYlNvY2tldCA9IHdlYlNvY2tldE1vZHVsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIVBsYXRmb3JtLmlzTm9kZSAmJiB0eXBlb2YgRXZlbnRTb3VyY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgIW9wdGlvbnMuRXZlbnRTb3VyY2UpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5FdmVudFNvdXJjZSA9IEV2ZW50U291cmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChQbGF0Zm9ybS5pc05vZGUgJiYgIW9wdGlvbnMuRXZlbnRTb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudFNvdXJjZU1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5FdmVudFNvdXJjZSA9IGV2ZW50U291cmNlTW9kdWxlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2h0dHBDbGllbnQgPSBuZXcgQWNjZXNzVG9rZW5IdHRwQ2xpZW50KG9wdGlvbnMuaHR0cENsaWVudCB8fCBuZXcgRGVmYXVsdEh0dHBDbGllbnQodGhpcy5fbG9nZ2VyKSwgb3B0aW9ucy5hY2Nlc3NUb2tlbkZhY3RvcnkpO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IFwiRGlzY29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCAqLztcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMub25yZWNlaXZlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uY2xvc2UgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RhcnQodHJhbnNmZXJGb3JtYXQpIHtcclxuICAgICAgICB0cmFuc2ZlckZvcm1hdCA9IHRyYW5zZmVyRm9ybWF0IHx8IFRyYW5zZmVyRm9ybWF0LkJpbmFyeTtcclxuICAgICAgICBBcmcuaXNJbih0cmFuc2ZlckZvcm1hdCwgVHJhbnNmZXJGb3JtYXQsIFwidHJhbnNmZXJGb3JtYXRcIik7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYFN0YXJ0aW5nIGNvbm5lY3Rpb24gd2l0aCB0cmFuc2ZlciBmb3JtYXQgJyR7VHJhbnNmZXJGb3JtYXRbdHJhbnNmZXJGb3JtYXRdfScuYCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSAhPT0gXCJEaXNjb25uZWN0ZWRcIiAvKiBDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3Qgc3RhcnQgYW4gSHR0cENvbm5lY3Rpb24gdGhhdCBpcyBub3QgaW4gdGhlICdEaXNjb25uZWN0ZWQnIHN0YXRlLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IFwiQ29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0aW5nICovO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0SW50ZXJuYWxQcm9taXNlID0gdGhpcy5fc3RhcnRJbnRlcm5hbCh0cmFuc2ZlckZvcm1hdCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRJbnRlcm5hbFByb21pc2U7XHJcbiAgICAgICAgLy8gVGhlIFR5cGVTY3JpcHQgY29tcGlsZXIgdGhpbmtzIHRoYXQgY29ubmVjdGlvblN0YXRlIG11c3QgYmUgQ29ubmVjdGluZyBoZXJlLiBUaGUgVHlwZVNjcmlwdCBjb21waWxlciBpcyB3cm9uZy5cclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBcIkRpc2Nvbm5lY3RpbmdcIiAvKiBDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGluZyAqLykge1xyXG4gICAgICAgICAgICAvLyBzdG9wKCkgd2FzIGNhbGxlZCBhbmQgdHJhbnNpdGlvbmVkIHRoZSBjbGllbnQgaW50byB0aGUgRGlzY29ubmVjdGluZyBzdGF0ZS5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IFwiRmFpbGVkIHRvIHN0YXJ0IHRoZSBIdHRwQ29ubmVjdGlvbiBiZWZvcmUgc3RvcCgpIHdhcyBjYWxsZWQuXCI7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAvLyBXZSBjYW5ub3QgYXdhaXQgc3RvcFByb21pc2UgaW5zaWRlIHN0YXJ0SW50ZXJuYWwgc2luY2Ugc3RvcEludGVybmFsIGF3YWl0cyB0aGUgc3RhcnRJbnRlcm5hbFByb21pc2UuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0b3BQcm9taXNlO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFib3J0RXJyb3IobWVzc2FnZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IFwiQ29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCAqLykge1xyXG4gICAgICAgICAgICAvLyBzdG9wKCkgd2FzIGNhbGxlZCBhbmQgdHJhbnNpdGlvbmVkIHRoZSBjbGllbnQgaW50byB0aGUgRGlzY29ubmVjdGluZyBzdGF0ZS5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IFwiSHR0cENvbm5lY3Rpb24uc3RhcnRJbnRlcm5hbCBjb21wbGV0ZWQgZ3JhY2VmdWxseSBidXQgZGlkbid0IGVudGVyIHRoZSBjb25uZWN0aW9uIGludG8gdGhlIGNvbm5lY3RlZCBzdGF0ZSFcIjtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWJvcnRFcnJvcihtZXNzYWdlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGFydGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHNlbmQoZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IFwiQ29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCAqLykge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHNlbmQgZGF0YSBpZiB0aGUgY29ubmVjdGlvbiBpcyBub3QgaW4gdGhlICdDb25uZWN0ZWQnIFN0YXRlLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fc2VuZFF1ZXVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbmRRdWV1ZSA9IG5ldyBUcmFuc3BvcnRTZW5kUXVldWUodGhpcy50cmFuc3BvcnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUcmFuc3BvcnQgd2lsbCBub3QgYmUgbnVsbCBpZiBzdGF0ZSBpcyBjb25uZWN0ZWRcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VuZFF1ZXVlLnNlbmQoZGF0YSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdG9wKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gXCJEaXNjb25uZWN0ZWRcIiAvKiBDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkICovKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBDYWxsIHRvIEh0dHBDb25uZWN0aW9uLnN0b3AoJHtlcnJvcn0pIGlnbm9yZWQgYmVjYXVzZSB0aGUgY29ubmVjdGlvbiBpcyBhbHJlYWR5IGluIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gXCJEaXNjb25uZWN0aW5nXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcgKi8pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYENhbGwgdG8gSHR0cENvbm5lY3Rpb24uc3RvcCgke2Vycm9yfSkgaWdub3JlZCBiZWNhdXNlIHRoZSBjb25uZWN0aW9uIGlzIGFscmVhZHkgaW4gdGhlIGRpc2Nvbm5lY3Rpbmcgc3RhdGUuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gXCJEaXNjb25uZWN0aW5nXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcgKi87XHJcbiAgICAgICAgdGhpcy5fc3RvcFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBEb24ndCBjb21wbGV0ZSBzdG9wKCkgdW50aWwgc3RvcENvbm5lY3Rpb24oKSBjb21wbGV0ZXMuXHJcbiAgICAgICAgICAgIHRoaXMuX3N0b3BQcm9taXNlUmVzb2x2ZXIgPSByZXNvbHZlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHN0b3BJbnRlcm5hbCBzaG91bGQgbmV2ZXIgdGhyb3cgc28ganVzdCBvYnNlcnZlIGl0LlxyXG4gICAgICAgIGF3YWl0IHRoaXMuX3N0b3BJbnRlcm5hbChlcnJvcik7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5fc3RvcFByb21pc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBfc3RvcEludGVybmFsKGVycm9yKSB7XHJcbiAgICAgICAgLy8gU2V0IGVycm9yIGFzIHNvb24gYXMgcG9zc2libGUgb3RoZXJ3aXNlIHRoZXJlIGlzIGEgcmFjZSBiZXR3ZWVuXHJcbiAgICAgICAgLy8gdGhlIHRyYW5zcG9ydCBjbG9zaW5nIGFuZCBwcm92aWRpbmcgYW4gZXJyb3IgYW5kIHRoZSBlcnJvciBmcm9tIGEgY2xvc2UgbWVzc2FnZVxyXG4gICAgICAgIC8vIFdlIHdvdWxkIHByZWZlciB0aGUgY2xvc2UgbWVzc2FnZSBlcnJvci5cclxuICAgICAgICB0aGlzLl9zdG9wRXJyb3IgPSBlcnJvcjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zdGFydEludGVybmFsUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gVGhpcyBleGNlcHRpb24gaXMgcmV0dXJuZWQgdG8gdGhlIHVzZXIgYXMgYSByZWplY3RlZCBQcm9taXNlIGZyb20gdGhlIHN0YXJ0IG1ldGhvZC5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVGhlIHRyYW5zcG9ydCdzIG9uY2xvc2Ugd2lsbCB0cmlnZ2VyIHN0b3BDb25uZWN0aW9uIHdoaWNoIHdpbGwgcnVuIG91ciBvbmNsb3NlIGV2ZW50LlxyXG4gICAgICAgIC8vIFRoZSB0cmFuc3BvcnQgc2hvdWxkIGFsd2F5cyBiZSBzZXQgaWYgY3VycmVudGx5IGNvbm5lY3RlZC4gSWYgaXQgd2Fzbid0IHNldCwgaXQncyBsaWtlbHkgYmVjYXVzZVxyXG4gICAgICAgIC8vIHN0b3Agd2FzIGNhbGxlZCBkdXJpbmcgc3RhcnQoKSBhbmQgc3RhcnQoKSBmYWlsZWQuXHJcbiAgICAgICAgaWYgKHRoaXMudHJhbnNwb3J0KSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnRyYW5zcG9ydC5zdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBIdHRwQ29ubmVjdGlvbi50cmFuc3BvcnQuc3RvcCgpIHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BDb25uZWN0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIkh0dHBDb25uZWN0aW9uLnRyYW5zcG9ydCBpcyB1bmRlZmluZWQgaW4gSHR0cENvbm5lY3Rpb24uc3RvcCgpIGJlY2F1c2Ugc3RhcnQoKSBmYWlsZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzeW5jIF9zdGFydEludGVybmFsKHRyYW5zZmVyRm9ybWF0KSB7XHJcbiAgICAgICAgLy8gU3RvcmUgdGhlIG9yaWdpbmFsIGJhc2UgdXJsIGFuZCB0aGUgYWNjZXNzIHRva2VuIGZhY3Rvcnkgc2luY2UgdGhleSBtYXkgY2hhbmdlXHJcbiAgICAgICAgLy8gYXMgcGFydCBvZiBuZWdvdGlhdGluZ1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmJhc2VVcmw7XHJcbiAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5ID0gdGhpcy5fb3B0aW9ucy5hY2Nlc3NUb2tlbkZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5faHR0cENsaWVudC5fYWNjZXNzVG9rZW5GYWN0b3J5ID0gdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnNraXBOZWdvdGlhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3J0ID09PSBIdHRwVHJhbnNwb3J0VHlwZS5XZWJTb2NrZXRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gbmVlZCB0byBhZGQgYSBjb25uZWN0aW9uIElEIGluIHRoaXMgY2FzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdGhpcy5fY29uc3RydWN0VHJhbnNwb3J0KEh0dHBUcmFuc3BvcnRUeXBlLldlYlNvY2tldHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHNob3VsZCBqdXN0IGNhbGwgY29ubmVjdCBkaXJlY3RseSBpbiB0aGlzIGNhc2UuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gZmFsbGJhY2sgb3IgbmVnb3RpYXRlIGluIHRoaXMgY2FzZS5cclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zdGFydFRyYW5zcG9ydCh1cmwsIHRyYW5zZmVyRm9ybWF0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5lZ290aWF0aW9uIGNhbiBvbmx5IGJlIHNraXBwZWQgd2hlbiB1c2luZyB0aGUgV2ViU29ja2V0IHRyYW5zcG9ydCBkaXJlY3RseS5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmVnb3RpYXRlUmVzcG9uc2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlZGlyZWN0cyA9IDA7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmVnb3RpYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9nZXROZWdvdGlhdGlvblJlc3BvbnNlKHVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHVzZXIgdHJpZXMgdG8gc3RvcCB0aGUgY29ubmVjdGlvbiB3aGVuIGl0IGlzIGJlaW5nIHN0YXJ0ZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBcIkRpc2Nvbm5lY3RpbmdcIiAvKiBDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGluZyAqLyB8fCB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiRGlzY29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQWJvcnRFcnJvcihcIlRoZSBjb25uZWN0aW9uIHdhcyBzdG9wcGVkIGR1cmluZyBuZWdvdGlhdGlvbi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZWdvdGlhdGVSZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobmVnb3RpYXRlUmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmVnb3RpYXRlUmVzcG9uc2UuUHJvdG9jb2xWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRldGVjdGVkIGEgY29ubmVjdGlvbiBhdHRlbXB0IHRvIGFuIEFTUC5ORVQgU2lnbmFsUiBTZXJ2ZXIuIFRoaXMgY2xpZW50IG9ubHkgc3VwcG9ydHMgY29ubmVjdGluZyB0byBhbiBBU1AuTkVUIENvcmUgU2lnbmFsUiBTZXJ2ZXIuIFNlZSBodHRwczovL2FrYS5tcy9zaWduYWxyLWNvcmUtZGlmZmVyZW5jZXMgZm9yIGRldGFpbHMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmVnb3RpYXRlUmVzcG9uc2UudXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IG5lZ290aWF0ZVJlc3BvbnNlLnVybDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZ290aWF0ZVJlc3BvbnNlLmFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGN1cnJlbnQgYWNjZXNzIHRva2VuIGZhY3Rvcnkgd2l0aCBvbmUgdGhhdCB1c2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXR1cm5lZCBhY2Nlc3MgdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBuZWdvdGlhdGVSZXNwb25zZS5hY2Nlc3NUb2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5ID0gKCkgPT4gYWNjZXNzVG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgZmFjdG9yeSB0byB1bmRlZmluZWQgc28gdGhlIEFjY2Vzc1Rva2VuSHR0cENsaWVudCB3b24ndCByZXRyeSB3aXRoIHRoZSBzYW1lIHRva2VuLCBzaW5jZSB3ZSBrbm93IGl0IHdvbid0IGNoYW5nZSB1bnRpbCBhIGNvbm5lY3Rpb24gcmVzdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9odHRwQ2xpZW50Ll9hY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9odHRwQ2xpZW50Ll9hY2Nlc3NUb2tlbkZhY3RvcnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0cysrO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAobmVnb3RpYXRlUmVzcG9uc2UudXJsICYmIHJlZGlyZWN0cyA8IE1BWF9SRURJUkVDVFMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZGlyZWN0cyA9PT0gTUFYX1JFRElSRUNUUyAmJiBuZWdvdGlhdGVSZXNwb25zZS51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWdvdGlhdGUgcmVkaXJlY3Rpb24gbGltaXQgZXhjZWVkZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fY3JlYXRlVHJhbnNwb3J0KHVybCwgdGhpcy5fb3B0aW9ucy50cmFuc3BvcnQsIG5lZ290aWF0ZVJlc3BvbnNlLCB0cmFuc2ZlckZvcm1hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNwb3J0IGluc3RhbmNlb2YgTG9uZ1BvbGxpbmdUcmFuc3BvcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmVhdHVyZXMuaW5oZXJlbnRLZWVwQWxpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiQ29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0aW5nICovKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIGNvbm5lY3Rpb24gdHJhbnNpdGlvbnMgdG8gdGhlIGNvbm5lY3RlZCBzdGF0ZSBwcmlvciB0byBjb21wbGV0aW5nIHRoaXMuc3RhcnRJbnRlcm5hbFByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAvLyBzdGFydCgpIHdpbGwgaGFuZGxlIHRoZSBjYXNlIHdoZW4gc3RvcCB3YXMgY2FsbGVkIGFuZCBzdGFydEludGVybmFsIGV4aXRzIHN0aWxsIGluIHRoZSBkaXNjb25uZWN0aW5nIHN0YXRlLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJUaGUgSHR0cENvbm5lY3Rpb24gY29ubmVjdGVkIHN1Y2Nlc3NmdWxseS5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBcIkNvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQgKi87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc3RvcCgpIGlzIHdhaXRpbmcgb24gdXMgdmlhIHRoaXMuc3RhcnRJbnRlcm5hbFByb21pc2Ugc28ga2VlcCB0aGlzLnRyYW5zcG9ydCBhcm91bmQgc28gaXQgY2FuIGNsZWFuIHVwLlxyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBvbmx5IGNhc2Ugc3RhcnRJbnRlcm5hbCBjYW4gZXhpdCBpbiBuZWl0aGVyIHRoZSBjb25uZWN0ZWQgbm9yIGRpc2Nvbm5lY3RlZCBzdGF0ZSBiZWNhdXNlIHN0b3BDb25uZWN0aW9uKClcclxuICAgICAgICAgICAgLy8gd2lsbCB0cmFuc2l0aW9uIHRvIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUuIHN0YXJ0KCkgd2lsbCB3YWl0IGZvciB0aGUgdHJhbnNpdGlvbiB1c2luZyB0aGUgc3RvcFByb21pc2UuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIFwiRmFpbGVkIHRvIHN0YXJ0IHRoZSBjb25uZWN0aW9uOiBcIiArIGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBcIkRpc2Nvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQgKi87XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAvLyBpZiBzdGFydCBmYWlscywgYW55IGFjdGl2ZSBjYWxscyB0byBzdG9wIGFzc3VtZSB0aGF0IHN0YXJ0IHdpbGwgY29tcGxldGUgdGhlIHN0b3AgcHJvbWlzZVxyXG4gICAgICAgICAgICB0aGlzLl9zdG9wUHJvbWlzZVJlc29sdmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBfZ2V0TmVnb3RpYXRpb25SZXNwb25zZSh1cmwpIHtcclxuICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XHJcbiAgICAgICAgY29uc3QgW25hbWUsIHZhbHVlXSA9IGdldFVzZXJBZ2VudEhlYWRlcigpO1xyXG4gICAgICAgIGhlYWRlcnNbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICBjb25zdCBuZWdvdGlhdGVVcmwgPSB0aGlzLl9yZXNvbHZlTmVnb3RpYXRlVXJsKHVybCk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYFNlbmRpbmcgbmVnb3RpYXRpb24gcmVxdWVzdDogJHtuZWdvdGlhdGVVcmx9LmApO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5faHR0cENsaWVudC5wb3N0KG5lZ290aWF0ZVVybCwge1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgLi4uaGVhZGVycywgLi4udGhpcy5fb3B0aW9ucy5oZWFkZXJzIH0sXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aGlzLl9vcHRpb25zLnRpbWVvdXQsXHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRoaXMuX29wdGlvbnMud2l0aENyZWRlbnRpYWxzLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgVW5leHBlY3RlZCBzdGF0dXMgY29kZSByZXR1cm5lZCBmcm9tIG5lZ290aWF0ZSAnJHtyZXNwb25zZS5zdGF0dXNDb2RlfSdgKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbmVnb3RpYXRlUmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIW5lZ290aWF0ZVJlc3BvbnNlLm5lZ290aWF0ZVZlcnNpb24gfHwgbmVnb3RpYXRlUmVzcG9uc2UubmVnb3RpYXRlVmVyc2lvbiA8IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIE5lZ290aWF0ZSB2ZXJzaW9uIDAgZG9lc24ndCB1c2UgY29ubmVjdGlvblRva2VuXHJcbiAgICAgICAgICAgICAgICAvLyBTbyB3ZSBzZXQgaXQgZXF1YWwgdG8gY29ubmVjdGlvbklkIHNvIGFsbCBvdXIgbG9naWMgY2FuIHVzZSBjb25uZWN0aW9uVG9rZW4gd2l0aG91dCBiZWluZyBhd2FyZSBvZiB0aGUgbmVnb3RpYXRlIHZlcnNpb25cclxuICAgICAgICAgICAgICAgIG5lZ290aWF0ZVJlc3BvbnNlLmNvbm5lY3Rpb25Ub2tlbiA9IG5lZ290aWF0ZVJlc3BvbnNlLmNvbm5lY3Rpb25JZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmVnb3RpYXRlUmVzcG9uc2UudXNlU3RhdGVmdWxSZWNvbm5lY3QgJiYgdGhpcy5fb3B0aW9ucy5fdXNlU3RhdGVmdWxSZWNvbm5lY3QgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRmFpbGVkVG9OZWdvdGlhdGVXaXRoU2VydmVyRXJyb3IoXCJDbGllbnQgZGlkbid0IG5lZ290aWF0ZSBTdGF0ZWZ1bCBSZWNvbm5lY3QgYnV0IHRoZSBzZXJ2ZXIgZGlkLlwiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5lZ290aWF0ZVJlc3BvbnNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gXCJGYWlsZWQgdG8gY29tcGxldGUgbmVnb3RpYXRpb24gd2l0aCB0aGUgc2VydmVyOiBcIiArIGU7XHJcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgSHR0cEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5zdGF0dXNDb2RlID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvck1lc3NhZ2UgKyBcIiBFaXRoZXIgdGhpcyBpcyBub3QgYSBTaWduYWxSIGVuZHBvaW50IG9yIHRoZXJlIGlzIGEgcHJveHkgYmxvY2tpbmcgdGhlIGNvbm5lY3Rpb24uXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBGYWlsZWRUb05lZ290aWF0ZVdpdGhTZXJ2ZXJFcnJvcihlcnJvck1lc3NhZ2UpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlQ29ubmVjdFVybCh1cmwsIGNvbm5lY3Rpb25Ub2tlbikge1xyXG4gICAgICAgIGlmICghY29ubmVjdGlvblRva2VuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmwgKyAodXJsLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgYGlkPSR7Y29ubmVjdGlvblRva2VufWA7XHJcbiAgICB9XHJcbiAgICBhc3luYyBfY3JlYXRlVHJhbnNwb3J0KHVybCwgcmVxdWVzdGVkVHJhbnNwb3J0LCBuZWdvdGlhdGVSZXNwb25zZSwgcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXQpIHtcclxuICAgICAgICBsZXQgY29ubmVjdFVybCA9IHRoaXMuX2NyZWF0ZUNvbm5lY3RVcmwodXJsLCBuZWdvdGlhdGVSZXNwb25zZS5jb25uZWN0aW9uVG9rZW4pO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0lUcmFuc3BvcnQocmVxdWVzdGVkVHJhbnNwb3J0KSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIkNvbm5lY3Rpb24gd2FzIHByb3ZpZGVkIGFuIGluc3RhbmNlIG9mIElUcmFuc3BvcnQsIHVzaW5nIHRoYXQgZGlyZWN0bHkuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zcG9ydCA9IHJlcXVlc3RlZFRyYW5zcG9ydDtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRUcmFuc3BvcnQoY29ubmVjdFVybCwgcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXQpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25JZCA9IG5lZ290aWF0ZVJlc3BvbnNlLmNvbm5lY3Rpb25JZDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0cmFuc3BvcnRFeGNlcHRpb25zID0gW107XHJcbiAgICAgICAgY29uc3QgdHJhbnNwb3J0cyA9IG5lZ290aWF0ZVJlc3BvbnNlLmF2YWlsYWJsZVRyYW5zcG9ydHMgfHwgW107XHJcbiAgICAgICAgbGV0IG5lZ290aWF0ZSA9IG5lZ290aWF0ZVJlc3BvbnNlO1xyXG4gICAgICAgIGZvciAoY29uc3QgZW5kcG9pbnQgb2YgdHJhbnNwb3J0cykge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc3BvcnRPckVycm9yID0gdGhpcy5fcmVzb2x2ZVRyYW5zcG9ydE9yRXJyb3IoZW5kcG9pbnQsIHJlcXVlc3RlZFRyYW5zcG9ydCwgcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXQsIChuZWdvdGlhdGUgPT09IG51bGwgfHwgbmVnb3RpYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZWdvdGlhdGUudXNlU3RhdGVmdWxSZWNvbm5lY3QpID09PSB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKHRyYW5zcG9ydE9yRXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGVycm9yIGFuZCBjb250aW51ZSwgd2UgZG9uJ3Qgd2FudCB0byBjYXVzZSBhIHJlLW5lZ290aWF0ZSBpbiB0aGVzZSBjYXNlc1xyXG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0RXhjZXB0aW9ucy5wdXNoKGAke2VuZHBvaW50LnRyYW5zcG9ydH0gZmFpbGVkOmApO1xyXG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0RXhjZXB0aW9ucy5wdXNoKHRyYW5zcG9ydE9yRXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX2lzSVRyYW5zcG9ydCh0cmFuc3BvcnRPckVycm9yKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnRPckVycm9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZWdvdGlhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZWdvdGlhdGUgPSBhd2FpdCB0aGlzLl9nZXROZWdvdGlhdGlvblJlc3BvbnNlKHVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0VXJsID0gdGhpcy5fY3JlYXRlQ29ubmVjdFVybCh1cmwsIG5lZ290aWF0ZS5jb25uZWN0aW9uVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zdGFydFRyYW5zcG9ydChjb25uZWN0VXJsLCByZXF1ZXN0ZWRUcmFuc2ZlckZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uSWQgPSBuZWdvdGlhdGUuY29ubmVjdGlvbklkO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBGYWlsZWQgdG8gc3RhcnQgdGhlIHRyYW5zcG9ydCAnJHtlbmRwb2ludC50cmFuc3BvcnR9JzogJHtleH1gKTtcclxuICAgICAgICAgICAgICAgICAgICBuZWdvdGlhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0RXhjZXB0aW9ucy5wdXNoKG5ldyBGYWlsZWRUb1N0YXJ0VHJhbnNwb3J0RXJyb3IoYCR7ZW5kcG9pbnQudHJhbnNwb3J0fSBmYWlsZWQ6ICR7ZXh9YCwgSHR0cFRyYW5zcG9ydFR5cGVbZW5kcG9pbnQudHJhbnNwb3J0XSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IFwiQ29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0aW5nICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIkZhaWxlZCB0byBzZWxlY3QgdHJhbnNwb3J0IGJlZm9yZSBzdG9wKCkgd2FzIGNhbGxlZC5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWJvcnRFcnJvcihtZXNzYWdlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0cmFuc3BvcnRFeGNlcHRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBZ2dyZWdhdGVFcnJvcnMoYFVuYWJsZSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgd2l0aCBhbnkgb2YgdGhlIGF2YWlsYWJsZSB0cmFuc3BvcnRzLiAke3RyYW5zcG9ydEV4Y2VwdGlvbnMuam9pbihcIiBcIil9YCwgdHJhbnNwb3J0RXhjZXB0aW9ucykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTm9uZSBvZiB0aGUgdHJhbnNwb3J0cyBzdXBwb3J0ZWQgYnkgdGhlIGNsaWVudCBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBzZXJ2ZXIuXCIpKTtcclxuICAgIH1cclxuICAgIF9jb25zdHJ1Y3RUcmFuc3BvcnQodHJhbnNwb3J0KSB7XHJcbiAgICAgICAgc3dpdGNoICh0cmFuc3BvcnQpIHtcclxuICAgICAgICAgICAgY2FzZSBIdHRwVHJhbnNwb3J0VHlwZS5XZWJTb2NrZXRzOlxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLldlYlNvY2tldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIidXZWJTb2NrZXQnIGlzIG5vdCBzdXBwb3J0ZWQgaW4geW91ciBlbnZpcm9ubWVudC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFdlYlNvY2tldFRyYW5zcG9ydCh0aGlzLl9odHRwQ2xpZW50LCB0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnksIHRoaXMuX2xvZ2dlciwgdGhpcy5fb3B0aW9ucy5sb2dNZXNzYWdlQ29udGVudCwgdGhpcy5fb3B0aW9ucy5XZWJTb2NrZXQsIHRoaXMuX29wdGlvbnMuaGVhZGVycyB8fCB7fSk7XHJcbiAgICAgICAgICAgIGNhc2UgSHR0cFRyYW5zcG9ydFR5cGUuU2VydmVyU2VudEV2ZW50czpcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fb3B0aW9ucy5FdmVudFNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIidFdmVudFNvdXJjZScgaXMgbm90IHN1cHBvcnRlZCBpbiB5b3VyIGVudmlyb25tZW50LlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2VydmVyU2VudEV2ZW50c1RyYW5zcG9ydCh0aGlzLl9odHRwQ2xpZW50LCB0aGlzLl9odHRwQ2xpZW50Ll9hY2Nlc3NUb2tlbiwgdGhpcy5fbG9nZ2VyLCB0aGlzLl9vcHRpb25zKTtcclxuICAgICAgICAgICAgY2FzZSBIdHRwVHJhbnNwb3J0VHlwZS5Mb25nUG9sbGluZzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTG9uZ1BvbGxpbmdUcmFuc3BvcnQodGhpcy5faHR0cENsaWVudCwgdGhpcy5fbG9nZ2VyLCB0aGlzLl9vcHRpb25zKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0cmFuc3BvcnQ6ICR7dHJhbnNwb3J0fS5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfc3RhcnRUcmFuc3BvcnQodXJsLCB0cmFuc2ZlckZvcm1hdCkge1xyXG4gICAgICAgIHRoaXMudHJhbnNwb3J0Lm9ucmVjZWl2ZSA9IHRoaXMub25yZWNlaXZlO1xyXG4gICAgICAgIGlmICh0aGlzLmZlYXR1cmVzLnJlY29ubmVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5vbmNsb3NlID0gYXN5bmMgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjYWxsU3RvcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmVhdHVyZXMucmVjb25uZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWF0dXJlcy5kaXNjb25uZWN0ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50cmFuc3BvcnQuY29ubmVjdCh1cmwsIHRyYW5zZmVyRm9ybWF0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5mZWF0dXJlcy5yZXNlbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsU3RvcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RvcENvbm5lY3Rpb24oZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxTdG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RvcENvbm5lY3Rpb24oZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5vbmNsb3NlID0gKGUpID0+IHRoaXMuX3N0b3BDb25uZWN0aW9uKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuY29ubmVjdCh1cmwsIHRyYW5zZmVyRm9ybWF0KTtcclxuICAgIH1cclxuICAgIF9yZXNvbHZlVHJhbnNwb3J0T3JFcnJvcihlbmRwb2ludCwgcmVxdWVzdGVkVHJhbnNwb3J0LCByZXF1ZXN0ZWRUcmFuc2ZlckZvcm1hdCwgdXNlU3RhdGVmdWxSZWNvbm5lY3QpIHtcclxuICAgICAgICBjb25zdCB0cmFuc3BvcnQgPSBIdHRwVHJhbnNwb3J0VHlwZVtlbmRwb2ludC50cmFuc3BvcnRdO1xyXG4gICAgICAgIGlmICh0cmFuc3BvcnQgPT09IG51bGwgfHwgdHJhbnNwb3J0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYFNraXBwaW5nIHRyYW5zcG9ydCAnJHtlbmRwb2ludC50cmFuc3BvcnR9JyBiZWNhdXNlIGl0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBjbGllbnQuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoYFNraXBwaW5nIHRyYW5zcG9ydCAnJHtlbmRwb2ludC50cmFuc3BvcnR9JyBiZWNhdXNlIGl0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBjbGllbnQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodHJhbnNwb3J0TWF0Y2hlcyhyZXF1ZXN0ZWRUcmFuc3BvcnQsIHRyYW5zcG9ydCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZmVyRm9ybWF0cyA9IGVuZHBvaW50LnRyYW5zZmVyRm9ybWF0cy5tYXAoKHMpID0+IFRyYW5zZmVyRm9ybWF0W3NdKTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmFuc2ZlckZvcm1hdHMuaW5kZXhPZihyZXF1ZXN0ZWRUcmFuc2ZlckZvcm1hdCkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgodHJhbnNwb3J0ID09PSBIdHRwVHJhbnNwb3J0VHlwZS5XZWJTb2NrZXRzICYmICF0aGlzLl9vcHRpb25zLldlYlNvY2tldCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRyYW5zcG9ydCA9PT0gSHR0cFRyYW5zcG9ydFR5cGUuU2VydmVyU2VudEV2ZW50cyAmJiAhdGhpcy5fb3B0aW9ucy5FdmVudFNvdXJjZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYFNraXBwaW5nIHRyYW5zcG9ydCAnJHtIdHRwVHJhbnNwb3J0VHlwZVt0cmFuc3BvcnRdfScgYmVjYXVzZSBpdCBpcyBub3Qgc3VwcG9ydGVkIGluIHlvdXIgZW52aXJvbm1lbnQuJ2ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVuc3VwcG9ydGVkVHJhbnNwb3J0RXJyb3IoYCcke0h0dHBUcmFuc3BvcnRUeXBlW3RyYW5zcG9ydF19JyBpcyBub3Qgc3VwcG9ydGVkIGluIHlvdXIgZW52aXJvbm1lbnQuYCwgdHJhbnNwb3J0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBTZWxlY3RpbmcgdHJhbnNwb3J0ICcke0h0dHBUcmFuc3BvcnRUeXBlW3RyYW5zcG9ydF19Jy5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVhdHVyZXMucmVjb25uZWN0ID0gdHJhbnNwb3J0ID09PSBIdHRwVHJhbnNwb3J0VHlwZS5XZWJTb2NrZXRzID8gdXNlU3RhdGVmdWxSZWNvbm5lY3QgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29uc3RydWN0VHJhbnNwb3J0KHRyYW5zcG9ydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgU2tpcHBpbmcgdHJhbnNwb3J0ICcke0h0dHBUcmFuc3BvcnRUeXBlW3RyYW5zcG9ydF19JyBiZWNhdXNlIGl0IGRvZXMgbm90IHN1cHBvcnQgdGhlIHJlcXVlc3RlZCB0cmFuc2ZlciBmb3JtYXQgJyR7VHJhbnNmZXJGb3JtYXRbcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXRdfScuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgJyR7SHR0cFRyYW5zcG9ydFR5cGVbdHJhbnNwb3J0XX0nIGRvZXMgbm90IHN1cHBvcnQgJHtUcmFuc2ZlckZvcm1hdFtyZXF1ZXN0ZWRUcmFuc2ZlckZvcm1hdF19LmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYFNraXBwaW5nIHRyYW5zcG9ydCAnJHtIdHRwVHJhbnNwb3J0VHlwZVt0cmFuc3BvcnRdfScgYmVjYXVzZSBpdCB3YXMgZGlzYWJsZWQgYnkgdGhlIGNsaWVudC5gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGlzYWJsZWRUcmFuc3BvcnRFcnJvcihgJyR7SHR0cFRyYW5zcG9ydFR5cGVbdHJhbnNwb3J0XX0nIGlzIGRpc2FibGVkIGJ5IHRoZSBjbGllbnQuYCwgdHJhbnNwb3J0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9pc0lUcmFuc3BvcnQodHJhbnNwb3J0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zcG9ydCAmJiB0eXBlb2YgKHRyYW5zcG9ydCkgPT09IFwib2JqZWN0XCIgJiYgXCJjb25uZWN0XCIgaW4gdHJhbnNwb3J0O1xyXG4gICAgfVxyXG4gICAgX3N0b3BDb25uZWN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYEh0dHBDb25uZWN0aW9uLnN0b3BDb25uZWN0aW9uKCR7ZXJyb3J9KSBjYWxsZWQgd2hpbGUgaW4gc3RhdGUgJHt0aGlzLl9jb25uZWN0aW9uU3RhdGV9LmApO1xyXG4gICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBzdG9wRXJyb3IsIGl0IHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGUgZXJyb3IgZnJvbSB0aGUgdHJhbnNwb3J0XHJcbiAgICAgICAgZXJyb3IgPSB0aGlzLl9zdG9wRXJyb3IgfHwgZXJyb3I7XHJcbiAgICAgICAgdGhpcy5fc3RvcEVycm9yID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiRGlzY29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCAqLykge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgQ2FsbCB0byBIdHRwQ29ubmVjdGlvbi5zdG9wQ29ubmVjdGlvbigke2Vycm9yfSkgd2FzIGlnbm9yZWQgYmVjYXVzZSB0aGUgY29ubmVjdGlvbiBpcyBhbHJlYWR5IGluIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUuYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gXCJDb25uZWN0aW5nXCIgLyogQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RpbmcgKi8pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5XYXJuaW5nLCBgQ2FsbCB0byBIdHRwQ29ubmVjdGlvbi5zdG9wQ29ubmVjdGlvbigke2Vycm9yfSkgd2FzIGlnbm9yZWQgYmVjYXVzZSB0aGUgY29ubmVjdGlvbiBpcyBzdGlsbCBpbiB0aGUgY29ubmVjdGluZyBzdGF0ZS5gKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIdHRwQ29ubmVjdGlvbi5zdG9wQ29ubmVjdGlvbigke2Vycm9yfSkgd2FzIGNhbGxlZCB3aGlsZSB0aGUgY29ubmVjdGlvbiBpcyBzdGlsbCBpbiB0aGUgY29ubmVjdGluZyBzdGF0ZS5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gXCJEaXNjb25uZWN0aW5nXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcgKi8pIHtcclxuICAgICAgICAgICAgLy8gQSBjYWxsIHRvIHN0b3AoKSBpbmR1Y2VkIHRoaXMgY2FsbCB0byBzdG9wQ29ubmVjdGlvbiBhbmQgbmVlZHMgdG8gYmUgY29tcGxldGVkLlxyXG4gICAgICAgICAgICAvLyBBbnkgc3RvcCgpIGF3YWl0ZXJzIHdpbGwgYmUgc2NoZWR1bGVkIHRvIGNvbnRpbnVlIGFmdGVyIHRoZSBvbmNsb3NlIGNhbGxiYWNrIGZpcmVzLlxyXG4gICAgICAgICAgICB0aGlzLl9zdG9wUHJvbWlzZVJlc29sdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgQ29ubmVjdGlvbiBkaXNjb25uZWN0ZWQgd2l0aCBlcnJvciAnJHtlcnJvcn0nLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgXCJDb25uZWN0aW9uIGRpc2Nvbm5lY3RlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9zZW5kUXVldWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VuZFF1ZXVlLnN0b3AoKS5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYFRyYW5zcG9ydFNlbmRRdWV1ZS5zdG9wKCkgdGhyZXcgZXJyb3IgJyR7ZX0nLmApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fc2VuZFF1ZXVlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25JZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBcIkRpc2Nvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQgKi87XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbmNsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNsb3NlKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYEh0dHBDb25uZWN0aW9uLm9uY2xvc2UoJHtlcnJvcn0pIHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9yZXNvbHZlVXJsKHVybCkge1xyXG4gICAgICAgIC8vIHN0YXJ0c1dpdGggaXMgbm90IHN1cHBvcnRlZCBpbiBJRVxyXG4gICAgICAgIGlmICh1cmwubGFzdEluZGV4T2YoXCJodHRwczovL1wiLCAwKSA9PT0gMCB8fCB1cmwubGFzdEluZGV4T2YoXCJodHRwOi8vXCIsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghUGxhdGZvcm0uaXNCcm93c2VyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlc29sdmUgJyR7dXJsfScuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldHRpbmcgdGhlIHVybCB0byB0aGUgaHJlZiBwcm9wZXJ5IG9mIGFuIGFuY2hvciB0YWcgaGFuZGxlcyBub3JtYWxpemF0aW9uXHJcbiAgICAgICAgLy8gZm9yIHVzLiBUaGVyZSBhcmUgMyBtYWluIGNhc2VzLlxyXG4gICAgICAgIC8vIDEuIFJlbGF0aXZlIHBhdGggbm9ybWFsaXphdGlvbiBlLmcgXCJiXCIgLT4gXCJodHRwOi8vbG9jYWxob3N0OjUwMDAvYS9iXCJcclxuICAgICAgICAvLyAyLiBBYnNvbHV0ZSBwYXRoIG5vcm1hbGl6YXRpb24gZS5nIFwiL2EvYlwiIC0+IFwiaHR0cDovL2xvY2FsaG9zdDo1MDAwL2EvYlwiXHJcbiAgICAgICAgLy8gMy4gTmV0d29ya3BhdGggcmVmZXJlbmNlIG5vcm1hbGl6YXRpb24gZS5nIFwiLy9sb2NhbGhvc3Q6NTAwMC9hL2JcIiAtPiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hL2JcIlxyXG4gICAgICAgIGNvbnN0IGFUYWcgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgYVRhZy5ocmVmID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIGBOb3JtYWxpemluZyAnJHt1cmx9JyB0byAnJHthVGFnLmhyZWZ9Jy5gKTtcclxuICAgICAgICByZXR1cm4gYVRhZy5ocmVmO1xyXG4gICAgfVxyXG4gICAgX3Jlc29sdmVOZWdvdGlhdGVVcmwodXJsKSB7XHJcbiAgICAgICAgY29uc3QgbmVnb3RpYXRlVXJsID0gbmV3IFVSTCh1cmwpO1xyXG4gICAgICAgIGlmIChuZWdvdGlhdGVVcmwucGF0aG5hbWUuZW5kc1dpdGgoJy8nKSkge1xyXG4gICAgICAgICAgICBuZWdvdGlhdGVVcmwucGF0aG5hbWUgKz0gXCJuZWdvdGlhdGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5lZ290aWF0ZVVybC5wYXRobmFtZSArPSBcIi9uZWdvdGlhdGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhuZWdvdGlhdGVVcmwuc2VhcmNoUGFyYW1zKTtcclxuICAgICAgICBpZiAoIXNlYXJjaFBhcmFtcy5oYXMoXCJuZWdvdGlhdGVWZXJzaW9uXCIpKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhcmFtcy5hcHBlbmQoXCJuZWdvdGlhdGVWZXJzaW9uXCIsIHRoaXMuX25lZ290aWF0ZVZlcnNpb24udG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWFyY2hQYXJhbXMuaGFzKFwidXNlU3RhdGVmdWxSZWNvbm5lY3RcIikpIHtcclxuICAgICAgICAgICAgaWYgKHNlYXJjaFBhcmFtcy5nZXQoXCJ1c2VTdGF0ZWZ1bFJlY29ubmVjdFwiKSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMuX3VzZVN0YXRlZnVsUmVjb25uZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9vcHRpb25zLl91c2VTdGF0ZWZ1bFJlY29ubmVjdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hQYXJhbXMuYXBwZW5kKFwidXNlU3RhdGVmdWxSZWNvbm5lY3RcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZWdvdGlhdGVVcmwuc2VhcmNoID0gc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIG5lZ290aWF0ZVVybC50b1N0cmluZygpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHRyYW5zcG9ydE1hdGNoZXMocmVxdWVzdGVkVHJhbnNwb3J0LCBhY3R1YWxUcmFuc3BvcnQpIHtcclxuICAgIHJldHVybiAhcmVxdWVzdGVkVHJhbnNwb3J0IHx8ICgoYWN0dWFsVHJhbnNwb3J0ICYgcmVxdWVzdGVkVHJhbnNwb3J0KSAhPT0gMCk7XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc3BvcnRTZW5kUXVldWUge1xyXG4gICAgY29uc3RydWN0b3IoX3RyYW5zcG9ydCkge1xyXG4gICAgICAgIHRoaXMuX3RyYW5zcG9ydCA9IF90cmFuc3BvcnQ7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVyID0gW107XHJcbiAgICAgICAgdGhpcy5fZXhlY3V0aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9zZW5kQnVmZmVyZWREYXRhID0gbmV3IFByb21pc2VTb3VyY2UoKTtcclxuICAgICAgICB0aGlzLl90cmFuc3BvcnRSZXN1bHQgPSBuZXcgUHJvbWlzZVNvdXJjZSgpO1xyXG4gICAgICAgIHRoaXMuX3NlbmRMb29wUHJvbWlzZSA9IHRoaXMuX3NlbmRMb29wKCk7XHJcbiAgICB9XHJcbiAgICBzZW5kKGRhdGEpIHtcclxuICAgICAgICB0aGlzLl9idWZmZXJEYXRhKGRhdGEpO1xyXG4gICAgICAgIGlmICghdGhpcy5fdHJhbnNwb3J0UmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zcG9ydFJlc3VsdCA9IG5ldyBQcm9taXNlU291cmNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc3BvcnRSZXN1bHQucHJvbWlzZTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc2VuZEJ1ZmZlcmVkRGF0YS5yZXNvbHZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmRMb29wUHJvbWlzZTtcclxuICAgIH1cclxuICAgIF9idWZmZXJEYXRhKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fYnVmZmVyLmxlbmd0aCAmJiB0eXBlb2YgKHRoaXMuX2J1ZmZlclswXSkgIT09IHR5cGVvZiAoZGF0YSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBkYXRhIHRvIGJlIG9mIHR5cGUgJHt0eXBlb2YgKHRoaXMuX2J1ZmZlcil9IGJ1dCB3YXMgb2YgdHlwZSAke3R5cGVvZiAoZGF0YSl9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2J1ZmZlci5wdXNoKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3NlbmRCdWZmZXJlZERhdGEucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX3NlbmRMb29wKCkge1xyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRCdWZmZXJlZERhdGEucHJvbWlzZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9leGVjdXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc3BvcnRSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmFuc3BvcnRSZXN1bHQucmVqZWN0KFwiQ29ubmVjdGlvbiBzdG9wcGVkLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbmRCdWZmZXJlZERhdGEgPSBuZXcgUHJvbWlzZVNvdXJjZSgpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc3BvcnRSZXN1bHQgPSB0aGlzLl90cmFuc3BvcnRSZXN1bHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zcG9ydFJlc3VsdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHR5cGVvZiAodGhpcy5fYnVmZmVyWzBdKSA9PT0gXCJzdHJpbmdcIiA/XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXIuam9pbihcIlwiKSA6XHJcbiAgICAgICAgICAgICAgICBUcmFuc3BvcnRTZW5kUXVldWUuX2NvbmNhdEJ1ZmZlcnModGhpcy5fYnVmZmVyKTtcclxuICAgICAgICAgICAgdGhpcy5fYnVmZmVyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl90cmFuc3BvcnQuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRyYW5zcG9ydFJlc3VsdC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnRSZXN1bHQucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBfY29uY2F0QnVmZmVycyhhcnJheUJ1ZmZlcnMpIHtcclxuICAgICAgICBjb25zdCB0b3RhbExlbmd0aCA9IGFycmF5QnVmZmVycy5tYXAoKGIpID0+IGIuYnl0ZUxlbmd0aCkucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodG90YWxMZW5ndGgpO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhcnJheUJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnNldChuZXcgVWludDhBcnJheShpdGVtKSwgb2Zmc2V0KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGl0ZW0uYnl0ZUxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5idWZmZXI7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgUHJvbWlzZVNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBbdGhpcy5fcmVzb2x2ZXIsIHRoaXMuX3JlamVjdGVyXSA9IFtyZXNvbHZlLCByZWplY3RdKTtcclxuICAgIH1cclxuICAgIHJlc29sdmUoKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzb2x2ZXIoKTtcclxuICAgIH1cclxuICAgIHJlamVjdChyZWFzb24pIHtcclxuICAgICAgICB0aGlzLl9yZWplY3RlcihyZWFzb24pO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUh0dHBDb25uZWN0aW9uLmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgSGFuZHNoYWtlUHJvdG9jb2wgfSBmcm9tIFwiLi9IYW5kc2hha2VQcm90b2NvbFwiO1xyXG5pbXBvcnQgeyBBYm9ydEVycm9yIH0gZnJvbSBcIi4vRXJyb3JzXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vSUh1YlByb3RvY29sXCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSBcIi4vU3ViamVjdFwiO1xyXG5pbXBvcnQgeyBBcmcsIGdldEVycm9yU3RyaW5nLCBQbGF0Zm9ybSB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbmltcG9ydCB7IE1lc3NhZ2VCdWZmZXIgfSBmcm9tIFwiLi9NZXNzYWdlQnVmZmVyXCI7XHJcbmNvbnN0IERFRkFVTFRfVElNRU9VVF9JTl9NUyA9IDMwICogMTAwMDtcclxuY29uc3QgREVGQVVMVF9QSU5HX0lOVEVSVkFMX0lOX01TID0gMTUgKiAxMDAwO1xyXG5jb25zdCBERUZBVUxUX1NUQVRFRlVMX1JFQ09OTkVDVF9CVUZGRVJfU0laRSA9IDEwMDAwMDtcclxuLyoqIERlc2NyaWJlcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUge0BsaW5rIEh1YkNvbm5lY3Rpb259IHRvIHRoZSBzZXJ2ZXIuICovXHJcbmV4cG9ydCB2YXIgSHViQ29ubmVjdGlvblN0YXRlO1xyXG4oZnVuY3Rpb24gKEh1YkNvbm5lY3Rpb25TdGF0ZSkge1xyXG4gICAgLyoqIFRoZSBodWIgY29ubmVjdGlvbiBpcyBkaXNjb25uZWN0ZWQuICovXHJcbiAgICBIdWJDb25uZWN0aW9uU3RhdGVbXCJEaXNjb25uZWN0ZWRcIl0gPSBcIkRpc2Nvbm5lY3RlZFwiO1xyXG4gICAgLyoqIFRoZSBodWIgY29ubmVjdGlvbiBpcyBjb25uZWN0aW5nLiAqL1xyXG4gICAgSHViQ29ubmVjdGlvblN0YXRlW1wiQ29ubmVjdGluZ1wiXSA9IFwiQ29ubmVjdGluZ1wiO1xyXG4gICAgLyoqIFRoZSBodWIgY29ubmVjdGlvbiBpcyBjb25uZWN0ZWQuICovXHJcbiAgICBIdWJDb25uZWN0aW9uU3RhdGVbXCJDb25uZWN0ZWRcIl0gPSBcIkNvbm5lY3RlZFwiO1xyXG4gICAgLyoqIFRoZSBodWIgY29ubmVjdGlvbiBpcyBkaXNjb25uZWN0aW5nLiAqL1xyXG4gICAgSHViQ29ubmVjdGlvblN0YXRlW1wiRGlzY29ubmVjdGluZ1wiXSA9IFwiRGlzY29ubmVjdGluZ1wiO1xyXG4gICAgLyoqIFRoZSBodWIgY29ubmVjdGlvbiBpcyByZWNvbm5lY3RpbmcuICovXHJcbiAgICBIdWJDb25uZWN0aW9uU3RhdGVbXCJSZWNvbm5lY3RpbmdcIl0gPSBcIlJlY29ubmVjdGluZ1wiO1xyXG59KShIdWJDb25uZWN0aW9uU3RhdGUgfHwgKEh1YkNvbm5lY3Rpb25TdGF0ZSA9IHt9KSk7XHJcbi8qKiBSZXByZXNlbnRzIGEgY29ubmVjdGlvbiB0byBhIFNpZ25hbFIgSHViLiAqL1xyXG5leHBvcnQgY2xhc3MgSHViQ29ubmVjdGlvbiB7XHJcbiAgICAvKiogQGludGVybmFsICovXHJcbiAgICAvLyBVc2luZyBhIHB1YmxpYyBzdGF0aWMgZmFjdG9yeSBtZXRob2QgbWVhbnMgd2UgY2FuIGhhdmUgYSBwcml2YXRlIGNvbnN0cnVjdG9yIGFuZCBhbiBfaW50ZXJuYWxfXHJcbiAgICAvLyBjcmVhdGUgbWV0aG9kIHRoYXQgY2FuIGJlIHVzZWQgYnkgSHViQ29ubmVjdGlvbkJ1aWxkZXIuIEFuIFwiaW50ZXJuYWxcIiBjb25zdHJ1Y3RvciB3b3VsZCBqdXN0XHJcbiAgICAvLyBiZSBzdHJpcHBlZCBhd2F5IGFuZCB0aGUgJy5kLnRzJyBmaWxlIHdvdWxkIGhhdmUgbm8gY29uc3RydWN0b3IsIHdoaWNoIGlzIGludGVycHJldGVkIGFzIGFcclxuICAgIC8vIHB1YmxpYyBwYXJhbWV0ZXItbGVzcyBjb25zdHJ1Y3Rvci5cclxuICAgIHN0YXRpYyBjcmVhdGUoY29ubmVjdGlvbiwgbG9nZ2VyLCBwcm90b2NvbCwgcmVjb25uZWN0UG9saWN5LCBzZXJ2ZXJUaW1lb3V0SW5NaWxsaXNlY29uZHMsIGtlZXBBbGl2ZUludGVydmFsSW5NaWxsaXNlY29uZHMsIHN0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSHViQ29ubmVjdGlvbihjb25uZWN0aW9uLCBsb2dnZXIsIHByb3RvY29sLCByZWNvbm5lY3RQb2xpY3ksIHNlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kcywga2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcywgc3RhdGVmdWxSZWNvbm5lY3RCdWZmZXJTaXplKTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3Rpb24sIGxvZ2dlciwgcHJvdG9jb2wsIHJlY29ubmVjdFBvbGljeSwgc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzLCBrZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzLCBzdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUpIHtcclxuICAgICAgICB0aGlzLl9uZXh0S2VlcEFsaXZlID0gMDtcclxuICAgICAgICB0aGlzLl9mcmVlemVFdmVudExpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLldhcm5pbmcsIFwiVGhlIHBhZ2UgaXMgYmVpbmcgZnJvemVuLCB0aGlzIHdpbGwgbGlrZWx5IGxlYWQgdG8gdGhlIGNvbm5lY3Rpb24gYmVpbmcgY2xvc2VkIGFuZCBtZXNzYWdlcyBiZWluZyBsb3N0LiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIGRvY3MgYXQgaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2FzcG5ldC9jb3JlL3NpZ25hbHIvamF2YXNjcmlwdC1jbGllbnQjYnNsZWVwXCIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQoY29ubmVjdGlvbiwgXCJjb25uZWN0aW9uXCIpO1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKGxvZ2dlciwgXCJsb2dnZXJcIik7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQocHJvdG9jb2wsIFwicHJvdG9jb2xcIik7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJUaW1lb3V0SW5NaWxsaXNlY29uZHMgPSBzZXJ2ZXJUaW1lb3V0SW5NaWxsaXNlY29uZHMgIT09IG51bGwgJiYgc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzICE9PSB2b2lkIDAgPyBzZXJ2ZXJUaW1lb3V0SW5NaWxsaXNlY29uZHMgOiBERUZBVUxUX1RJTUVPVVRfSU5fTVM7XHJcbiAgICAgICAgdGhpcy5rZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzID0ga2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcyAhPT0gbnVsbCAmJiBrZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzICE9PSB2b2lkIDAgPyBrZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzIDogREVGQVVMVF9QSU5HX0lOVEVSVkFMX0lOX01TO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSA9IHN0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSAhPT0gbnVsbCAmJiBzdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUgIT09IHZvaWQgMCA/IHN0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSA6IERFRkFVTFRfU1RBVEVGVUxfUkVDT05ORUNUX0JVRkZFUl9TSVpFO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLl9wcm90b2NvbCA9IHByb3RvY29sO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XHJcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0UG9saWN5ID0gcmVjb25uZWN0UG9saWN5O1xyXG4gICAgICAgIHRoaXMuX2hhbmRzaGFrZVByb3RvY29sID0gbmV3IEhhbmRzaGFrZVByb3RvY29sKCk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9ucmVjZWl2ZSA9IChkYXRhKSA9PiB0aGlzLl9wcm9jZXNzSW5jb21pbmdEYXRhKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmNsb3NlID0gKGVycm9yKSA9PiB0aGlzLl9jb25uZWN0aW9uQ2xvc2VkKGVycm9yKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgICAgICB0aGlzLl9tZXRob2RzID0ge307XHJcbiAgICAgICAgdGhpcy5fY2xvc2VkQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0aW5nQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0ZWRDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICB0aGlzLl9pbnZvY2F0aW9uSWQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3JlY2VpdmVkSGFuZHNoYWtlUmVzcG9uc2UgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBIdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVkUGluZ01lc3NhZ2UgPSB0aGlzLl9wcm90b2NvbC53cml0ZU1lc3NhZ2UoeyB0eXBlOiBNZXNzYWdlVHlwZS5QaW5nIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqIEluZGljYXRlcyB0aGUgc3RhdGUgb2YgdGhlIHtAbGluayBIdWJDb25uZWN0aW9ufSB0byB0aGUgc2VydmVyLiAqL1xyXG4gICAgZ2V0IHN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uU3RhdGU7XHJcbiAgICB9XHJcbiAgICAvKiogUmVwcmVzZW50cyB0aGUgY29ubmVjdGlvbiBpZCBvZiB0aGUge0BsaW5rIEh1YkNvbm5lY3Rpb259IG9uIHRoZSBzZXJ2ZXIuIFRoZSBjb25uZWN0aW9uIGlkIHdpbGwgYmUgbnVsbCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIGVpdGhlclxyXG4gICAgICogIGluIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUgb3IgaWYgdGhlIG5lZ290aWF0aW9uIHN0ZXAgd2FzIHNraXBwZWQuXHJcbiAgICAgKi9cclxuICAgIGdldCBjb25uZWN0aW9uSWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbiA/ICh0aGlzLmNvbm5lY3Rpb24uY29ubmVjdGlvbklkIHx8IG51bGwpIDogbnVsbDtcclxuICAgIH1cclxuICAgIC8qKiBJbmRpY2F0ZXMgdGhlIHVybCBvZiB0aGUge0BsaW5rIEh1YkNvbm5lY3Rpb259IHRvIHRoZSBzZXJ2ZXIuICovXHJcbiAgICBnZXQgYmFzZVVybCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmJhc2VVcmwgfHwgXCJcIjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBhIG5ldyB1cmwgZm9yIHRoZSBIdWJDb25uZWN0aW9uLiBOb3RlIHRoYXQgdGhlIHVybCBjYW4gb25seSBiZSBjaGFuZ2VkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgaW4gZWl0aGVyIHRoZSBEaXNjb25uZWN0ZWQgb3JcclxuICAgICAqIFJlY29ubmVjdGluZyBzdGF0ZXMuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSB1cmwgdG8gY29ubmVjdCB0by5cclxuICAgICAqL1xyXG4gICAgc2V0IGJhc2VVcmwodXJsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSAhPT0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCAmJiB0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5SZWNvbm5lY3RpbmcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIEh1YkNvbm5lY3Rpb24gbXVzdCBiZSBpbiB0aGUgRGlzY29ubmVjdGVkIG9yIFJlY29ubmVjdGluZyBzdGF0ZSB0byBjaGFuZ2UgdGhlIHVybC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdXJsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBIdWJDb25uZWN0aW9uIHVybCBtdXN0IGJlIGEgdmFsaWQgdXJsLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmJhc2VVcmwgPSB1cmw7XHJcbiAgICB9XHJcbiAgICAvKiogU3RhcnRzIHRoZSBjb25uZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBjb25uZWN0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBlc3RhYmxpc2hlZCwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yLlxyXG4gICAgICovXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLl9zdGFydFByb21pc2UgPSB0aGlzLl9zdGFydFdpdGhTdGF0ZVRyYW5zaXRpb25zKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0UHJvbWlzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIF9zdGFydFdpdGhTdGF0ZVRyYW5zaXRpb25zKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBzdGFydCBhIEh1YkNvbm5lY3Rpb24gdGhhdCBpcyBub3QgaW4gdGhlICdEaXNjb25uZWN0ZWQnIHN0YXRlLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IEh1YkNvbm5lY3Rpb25TdGF0ZS5Db25uZWN0aW5nO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIFwiU3RhcnRpbmcgSHViQ29ubmVjdGlvbi5cIik7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRJbnRlcm5hbCgpO1xyXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNCcm93c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb2cgd2hlbiB0aGUgYnJvd3NlciBmcmVlemVzIHRoZSB0YWIgc28gdXNlcnMga25vdyB3aHkgdGhlaXIgY29ubmVjdGlvbiB1bmV4cGVjdGVkbHkgc3RvcHBlZCB3b3JraW5nXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZyZWV6ZVwiLCB0aGlzLl9mcmVlemVFdmVudExpc3RlbmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBIdWJDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIFwiSHViQ29ubmVjdGlvbiBjb25uZWN0ZWQgc3VjY2Vzc2Z1bGx5LlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZDtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYEh1YkNvbm5lY3Rpb24gZmFpbGVkIHRvIHN0YXJ0IHN1Y2Nlc3NmdWxseSBiZWNhdXNlIG9mIGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzeW5jIF9zdGFydEludGVybmFsKCkge1xyXG4gICAgICAgIHRoaXMuX3N0b3BEdXJpbmdTdGFydEVycm9yID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX3JlY2VpdmVkSGFuZHNoYWtlUmVzcG9uc2UgPSBmYWxzZTtcclxuICAgICAgICAvLyBTZXQgdXAgdGhlIHByb21pc2UgYmVmb3JlIGFueSBjb25uZWN0aW9uIGlzIChyZSlzdGFydGVkIG90aGVyd2lzZSBpdCBjb3VsZCByYWNlIHdpdGggcmVjZWl2ZWQgbWVzc2FnZXNcclxuICAgICAgICBjb25zdCBoYW5kc2hha2VQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kc2hha2VSZXNvbHZlciA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRzaGFrZVJlamVjdGVyID0gcmVqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zdGFydCh0aGlzLl9wcm90b2NvbC50cmFuc2ZlckZvcm1hdCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHZlcnNpb24gPSB0aGlzLl9wcm90b2NvbC52ZXJzaW9uO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGlvbi5mZWF0dXJlcy5yZWNvbm5lY3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIFN0YXRlZnVsIFJlY29ubmVjdCBzdGFydHMgd2l0aCBIdWJQcm90b2NvbCB2ZXJzaW9uIDIsIG5ld2VyIGNsaWVudHMgY29ubmVjdGluZyB0byBvbGRlciBzZXJ2ZXJzIHdpbGwgZmFpbCB0byBjb25uZWN0IGR1ZSB0b1xyXG4gICAgICAgICAgICAgICAgLy8gdGhlIGhhbmRzaGFrZSBvbmx5IHN1cHBvcnRpbmcgdmVyc2lvbiAxLCBzbyB3ZSB3aWxsIHRyeSB0byBzZW5kIHZlcnNpb24gMSBkdXJpbmcgdGhlIGhhbmRzaGFrZSB0byBrZWVwIG9sZCBzZXJ2ZXJzIHdvcmtpbmcuXHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBoYW5kc2hha2VSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgcHJvdG9jb2w6IHRoaXMuX3Byb3RvY29sLm5hbWUsXHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIlNlbmRpbmcgaGFuZHNoYWtlIHJlcXVlc3QuXCIpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kTWVzc2FnZSh0aGlzLl9oYW5kc2hha2VQcm90b2NvbC53cml0ZUhhbmRzaGFrZVJlcXVlc3QoaGFuZHNoYWtlUmVxdWVzdCkpO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgVXNpbmcgSHViUHJvdG9jb2wgJyR7dGhpcy5fcHJvdG9jb2wubmFtZX0nLmApO1xyXG4gICAgICAgICAgICAvLyBkZWZlbnNpdmVseSBjbGVhbnVwIHRpbWVvdXQgaW4gY2FzZSB3ZSByZWNlaXZlIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIgYmVmb3JlIHdlIGZpbmlzaCBzdGFydFxyXG4gICAgICAgICAgICB0aGlzLl9jbGVhbnVwVGltZW91dCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNldFRpbWVvdXRQZXJpb2QoKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzZXRLZWVwQWxpdmVJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICBhd2FpdCBoYW5kc2hha2VQcm9taXNlO1xyXG4gICAgICAgICAgICAvLyBJdCdzIGltcG9ydGFudCB0byBjaGVjayB0aGUgc3RvcER1cmluZ1N0YXJ0RXJyb3IgaW5zdGVhZCBvZiBqdXN0IHJlbHlpbmcgb24gdGhlIGhhbmRzaGFrZVByb21pc2VcclxuICAgICAgICAgICAgLy8gYmVpbmcgcmVqZWN0ZWQgb24gY2xvc2UsIGJlY2F1c2UgdGhpcyBjb250aW51YXRpb24gY2FuIHJ1biBhZnRlciBib3RoIHRoZSBoYW5kc2hha2UgY29tcGxldGVkIHN1Y2Nlc3NmdWxseVxyXG4gICAgICAgICAgICAvLyBhbmQgdGhlIGNvbm5lY3Rpb24gd2FzIGNsb3NlZC5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N0b3BEdXJpbmdTdGFydEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGltcG9ydGFudCB0byB0aHJvdyBpbnN0ZWFkIG9mIHJldHVybmluZyBhIHJlamVjdGVkIHByb21pc2UsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBhbGxvdyBhbnkgc3RhdGVcclxuICAgICAgICAgICAgICAgIC8vIHRyYW5zaXRpb25zIHRvIG9jY3VyIGJldHdlZW4gbm93IGFuZCB0aGUgY2FsbGluZyBjb2RlIG9ic2VydmluZyB0aGUgZXhjZXB0aW9ucy4gUmV0dXJuaW5nIGEgcmVqZWN0ZWQgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgLy8gd2lsbCBjYXVzZSB0aGUgY2FsbGluZyBjb250aW51YXRpb24gdG8gZ2V0IHNjaGVkdWxlZCB0byBydW4gbGF0ZXIuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRocm93LWxpdGVyYWxcclxuICAgICAgICAgICAgICAgIHRocm93IHRoaXMuX3N0b3BEdXJpbmdTdGFydEVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZVN0YXRlZnVsUmVjb25uZWN0ID0gdGhpcy5jb25uZWN0aW9uLmZlYXR1cmVzLnJlY29ubmVjdCB8fCBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHVzZVN0YXRlZnVsUmVjb25uZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlQnVmZmVyID0gbmV3IE1lc3NhZ2VCdWZmZXIodGhpcy5fcHJvdG9jb2wsIHRoaXMuY29ubmVjdGlvbiwgdGhpcy5fc3RhdGVmdWxSZWNvbm5lY3RCdWZmZXJTaXplKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5mZWF0dXJlcy5kaXNjb25uZWN0ZWQgPSB0aGlzLl9tZXNzYWdlQnVmZmVyLl9kaXNjb25uZWN0ZWQuYmluZCh0aGlzLl9tZXNzYWdlQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5mZWF0dXJlcy5yZXNlbmQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VCdWZmZXIuX3Jlc2VuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMuaW5oZXJlbnRLZWVwQWxpdmUpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRNZXNzYWdlKHRoaXMuX2NhY2hlZFBpbmdNZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgSHViIGhhbmRzaGFrZSBmYWlsZWQgd2l0aCBlcnJvciAnJHtlfScgZHVyaW5nIHN0YXJ0KCkuIFN0b3BwaW5nIEh1YkNvbm5lY3Rpb24uYCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsZWFudXBUaW1lb3V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsZWFudXBQaW5nVGltZXIoKTtcclxuICAgICAgICAgICAgLy8gSHR0cENvbm5lY3Rpb24uc3RvcCgpIHNob3VsZCBub3QgY29tcGxldGUgdW50aWwgYWZ0ZXIgdGhlIG9uY2xvc2UgY2FsbGJhY2sgaXMgaW52b2tlZC5cclxuICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHRyYW5zaXRpb24gdGhlIEh1YkNvbm5lY3Rpb24gdG8gdGhlIGRpc2Nvbm5lY3RlZCBzdGF0ZSBiZWZvcmUgSHR0cENvbm5lY3Rpb24uc3RvcCgpIGNvbXBsZXRlcy5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLnN0b3AoZSk7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIFN0b3BzIHRoZSBjb25uZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBjb25uZWN0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSB0ZXJtaW5hdGVkLCBvciByZWplY3RzIHdpdGggYW4gZXJyb3IuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcbiAgICAgICAgLy8gQ2FwdHVyZSB0aGUgc3RhcnQgcHJvbWlzZSBiZWZvcmUgdGhlIGNvbm5lY3Rpb24gbWlnaHQgYmUgcmVzdGFydGVkIGluIGFuIG9uY2xvc2UgY2FsbGJhY2suXHJcbiAgICAgICAgY29uc3Qgc3RhcnRQcm9taXNlID0gdGhpcy5fc3RhcnRQcm9taXNlO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5mZWF0dXJlcy5yZWNvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zdG9wUHJvbWlzZSA9IHRoaXMuX3N0b3BJbnRlcm5hbCgpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuX3N0b3BQcm9taXNlO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIEF3YWl0aW5nIHVuZGVmaW5lZCBjb250aW51ZXMgaW1tZWRpYXRlbHlcclxuICAgICAgICAgICAgYXdhaXQgc3RhcnRQcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAvLyBUaGlzIGV4Y2VwdGlvbiBpcyByZXR1cm5lZCB0byB0aGUgdXNlciBhcyBhIHJlamVjdGVkIFByb21pc2UgZnJvbSB0aGUgc3RhcnQgbWV0aG9kLlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9zdG9wSW50ZXJuYWwoZXJyb3IpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBIdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBDYWxsIHRvIEh1YkNvbm5lY3Rpb24uc3RvcCgke2Vycm9yfSkgaWdub3JlZCBiZWNhdXNlIGl0IGlzIGFscmVhZHkgaW4gdGhlIGRpc2Nvbm5lY3RlZCBzdGF0ZS5gKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBIdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgQ2FsbCB0byBIdHRwQ29ubmVjdGlvbi5zdG9wKCR7ZXJyb3J9KSBpZ25vcmVkIGJlY2F1c2UgdGhlIGNvbm5lY3Rpb24gaXMgYWxyZWFkeSBpbiB0aGUgZGlzY29ubmVjdGluZyBzdGF0ZS5gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3BQcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBIdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGluZztcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIlN0b3BwaW5nIEh1YkNvbm5lY3Rpb24uXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3REZWxheUhhbmRsZSkge1xyXG4gICAgICAgICAgICAvLyBXZSdyZSBpbiBhIHJlY29ubmVjdCBkZWxheSB3aGljaCBtZWFucyB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGlzIGN1cnJlbnRseSBhbHJlYWR5IHN0b3BwZWQuXHJcbiAgICAgICAgICAgIC8vIEp1c3QgY2xlYXIgdGhlIGhhbmRsZSB0byBzdG9wIHRoZSByZWNvbm5lY3QgbG9vcCAod2hpY2ggbm8gb25lIGlzIHdhaXRpbmcgb24gdGhhbmtmdWxseSkgYW5kXHJcbiAgICAgICAgICAgIC8vIGZpcmUgdGhlIG9uY2xvc2UgY2FsbGJhY2tzLlxyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIkNvbm5lY3Rpb24gc3RvcHBlZCBkdXJpbmcgcmVjb25uZWN0IGRlbGF5LiBEb25lIHJlY29ubmVjdGluZy5cIik7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWNvbm5lY3REZWxheUhhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdERlbGF5SGFuZGxlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZUNsb3NlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0YXRlID09PSBIdWJDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICAgICAgdGhpcy5fc2VuZENsb3NlTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jbGVhbnVwVGltZW91dCgpO1xyXG4gICAgICAgIHRoaXMuX2NsZWFudXBQaW5nVGltZXIoKTtcclxuICAgICAgICB0aGlzLl9zdG9wRHVyaW5nU3RhcnRFcnJvciA9IGVycm9yIHx8IG5ldyBBYm9ydEVycm9yKFwiVGhlIGNvbm5lY3Rpb24gd2FzIHN0b3BwZWQgYmVmb3JlIHRoZSBodWIgaGFuZHNoYWtlIGNvdWxkIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICAvLyBIdHRwQ29ubmVjdGlvbi5zdG9wKCkgc2hvdWxkIG5vdCBjb21wbGV0ZSB1bnRpbCBhZnRlciBlaXRoZXIgSHR0cENvbm5lY3Rpb24uc3RhcnQoKSBmYWlsc1xyXG4gICAgICAgIC8vIG9yIHRoZSBvbmNsb3NlIGNhbGxiYWNrIGlzIGludm9rZWQuIFRoZSBvbmNsb3NlIGNhbGxiYWNrIHdpbGwgdHJhbnNpdGlvbiB0aGUgSHViQ29ubmVjdGlvblxyXG4gICAgICAgIC8vIHRvIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUgaWYgbmVlZCBiZSBiZWZvcmUgSHR0cENvbm5lY3Rpb24uc3RvcCgpIGNvbXBsZXRlcy5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnN0b3AoZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX3NlbmRDbG9zZU1lc3NhZ2UoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2VuZFdpdGhQcm90b2NvbCh0aGlzLl9jcmVhdGVDbG9zZU1lc3NhZ2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgLy8gSWdub3JlLCB0aGlzIGlzIGEgYmVzdCBlZmZvcnQgYXR0ZW1wdCB0byBsZXQgdGhlIHNlcnZlciBrbm93IHRoZSBjbGllbnQgY2xvc2VkIGdyYWNlZnVsbHkuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIEludm9rZXMgYSBzdHJlYW1pbmcgaHViIG1ldGhvZCBvbiB0aGUgc2VydmVyIHVzaW5nIHRoZSBzcGVjaWZpZWQgbmFtZSBhbmQgYXJndW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIEB0eXBlcGFyYW0gVCBUaGUgdHlwZSBvZiB0aGUgaXRlbXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBzZXJ2ZXIgbWV0aG9kIHRvIGludm9rZS5cclxuICAgICAqIEBwYXJhbSB7YW55W119IGFyZ3MgVGhlIGFyZ3VtZW50cyB1c2VkIHRvIGludm9rZSB0aGUgc2VydmVyIG1ldGhvZC5cclxuICAgICAqIEByZXR1cm5zIHtJU3RyZWFtUmVzdWx0PFQ+fSBBbiBvYmplY3QgdGhhdCB5aWVsZHMgcmVzdWx0cyBmcm9tIHRoZSBzZXJ2ZXIgYXMgdGhleSBhcmUgcmVjZWl2ZWQuXHJcbiAgICAgKi9cclxuICAgIHN0cmVhbShtZXRob2ROYW1lLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgW3N0cmVhbXMsIHN0cmVhbUlkc10gPSB0aGlzLl9yZXBsYWNlU3RyZWFtaW5nUGFyYW1zKGFyZ3MpO1xyXG4gICAgICAgIGNvbnN0IGludm9jYXRpb25EZXNjcmlwdG9yID0gdGhpcy5fY3JlYXRlU3RyZWFtSW52b2NhdGlvbihtZXRob2ROYW1lLCBhcmdzLCBzdHJlYW1JZHMpO1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcclxuICAgICAgICBsZXQgcHJvbWlzZVF1ZXVlO1xyXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgU3ViamVjdCgpO1xyXG4gICAgICAgIHN1YmplY3QuY2FuY2VsQ2FsbGJhY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbEludm9jYXRpb24gPSB0aGlzLl9jcmVhdGVDYW5jZWxJbnZvY2F0aW9uKGludm9jYXRpb25EZXNjcmlwdG9yLmludm9jYXRpb25JZCk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbaW52b2NhdGlvbkRlc2NyaXB0b3IuaW52b2NhdGlvbklkXTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VRdWV1ZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZW5kV2l0aFByb3RvY29sKGNhbmNlbEludm9jYXRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrc1tpbnZvY2F0aW9uRGVzY3JpcHRvci5pbnZvY2F0aW9uSWRdID0gKGludm9jYXRpb25FdmVudCwgZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJqZWN0LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbnZvY2F0aW9uRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGludm9jYXRpb25FdmVudCB3aWxsIG5vdCBiZSBudWxsIHdoZW4gYW4gZXJyb3IgaXMgbm90IHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uRXZlbnQudHlwZSA9PT0gTWVzc2FnZVR5cGUuQ29tcGxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uRXZlbnQuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihuZXcgRXJyb3IoaW52b2NhdGlvbkV2ZW50LmVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5uZXh0KChpbnZvY2F0aW9uRXZlbnQuaXRlbSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9taXNlUXVldWUgPSB0aGlzLl9zZW5kV2l0aFByb3RvY29sKGludm9jYXRpb25EZXNjcmlwdG9yKVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlKTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tpbnZvY2F0aW9uRGVzY3JpcHRvci5pbnZvY2F0aW9uSWRdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2xhdW5jaFN0cmVhbXMoc3RyZWFtcywgcHJvbWlzZVF1ZXVlKTtcclxuICAgICAgICByZXR1cm4gc3ViamVjdDtcclxuICAgIH1cclxuICAgIF9zZW5kTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzZXRLZWVwQWxpdmVJbnRlcnZhbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uc2VuZChtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2VuZHMgYSBqcyBvYmplY3QgdG8gdGhlIHNlcnZlci5cclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBqcyBvYmplY3QgdG8gc2VyaWFsaXplIGFuZCBzZW5kLlxyXG4gICAgICovXHJcbiAgICBfc2VuZFdpdGhQcm90b2NvbChtZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VCdWZmZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VCdWZmZXIuX3NlbmQobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VuZE1lc3NhZ2UodGhpcy5fcHJvdG9jb2wud3JpdGVNZXNzYWdlKG1lc3NhZ2UpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogSW52b2tlcyBhIGh1YiBtZXRob2Qgb24gdGhlIHNlcnZlciB1c2luZyB0aGUgc3BlY2lmaWVkIG5hbWUgYW5kIGFyZ3VtZW50cy4gRG9lcyBub3Qgd2FpdCBmb3IgYSByZXNwb25zZSBmcm9tIHRoZSByZWNlaXZlci5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgUHJvbWlzZSByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCByZXNvbHZlcyB3aGVuIHRoZSBjbGllbnQgaGFzIHNlbnQgdGhlIGludm9jYXRpb24gdG8gdGhlIHNlcnZlci4gVGhlIHNlcnZlciBtYXkgc3RpbGxcclxuICAgICAqIGJlIHByb2Nlc3NpbmcgdGhlIGludm9jYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIHNlcnZlciBtZXRob2QgdG8gaW52b2tlLlxyXG4gICAgICogQHBhcmFtIHthbnlbXX0gYXJncyBUaGUgYXJndW1lbnRzIHVzZWQgdG8gaW52b2tlIHRoZSBzZXJ2ZXIgbWV0aG9kLlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IEEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGludm9jYXRpb24gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHNlbnQsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvci5cclxuICAgICAqL1xyXG4gICAgc2VuZChtZXRob2ROYW1lLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgW3N0cmVhbXMsIHN0cmVhbUlkc10gPSB0aGlzLl9yZXBsYWNlU3RyZWFtaW5nUGFyYW1zKGFyZ3MpO1xyXG4gICAgICAgIGNvbnN0IHNlbmRQcm9taXNlID0gdGhpcy5fc2VuZFdpdGhQcm90b2NvbCh0aGlzLl9jcmVhdGVJbnZvY2F0aW9uKG1ldGhvZE5hbWUsIGFyZ3MsIHRydWUsIHN0cmVhbUlkcykpO1xyXG4gICAgICAgIHRoaXMuX2xhdW5jaFN0cmVhbXMoc3RyZWFtcywgc2VuZFByb21pc2UpO1xyXG4gICAgICAgIHJldHVybiBzZW5kUHJvbWlzZTtcclxuICAgIH1cclxuICAgIC8qKiBJbnZva2VzIGEgaHViIG1ldGhvZCBvbiB0aGUgc2VydmVyIHVzaW5nIHRoZSBzcGVjaWZpZWQgbmFtZSBhbmQgYXJndW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBQcm9taXNlIHJldHVybmVkIGJ5IHRoaXMgbWV0aG9kIHJlc29sdmVzIHdoZW4gdGhlIHNlcnZlciBpbmRpY2F0ZXMgaXQgaGFzIGZpbmlzaGVkIGludm9raW5nIHRoZSBtZXRob2QuIFdoZW4gdGhlIHByb21pc2VcclxuICAgICAqIHJlc29sdmVzLCB0aGUgc2VydmVyIGhhcyBmaW5pc2hlZCBpbnZva2luZyB0aGUgbWV0aG9kLiBJZiB0aGUgc2VydmVyIG1ldGhvZCByZXR1cm5zIGEgcmVzdWx0LCBpdCBpcyBwcm9kdWNlZCBhcyB0aGUgcmVzdWx0IG9mXHJcbiAgICAgKiByZXNvbHZpbmcgdGhlIFByb21pc2UuXHJcbiAgICAgKlxyXG4gICAgICogQHR5cGVwYXJhbSBUIFRoZSBleHBlY3RlZCByZXR1cm4gdHlwZS5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBzZXJ2ZXIgbWV0aG9kIHRvIGludm9rZS5cclxuICAgICAqIEBwYXJhbSB7YW55W119IGFyZ3MgVGhlIGFyZ3VtZW50cyB1c2VkIHRvIGludm9rZSB0aGUgc2VydmVyIG1ldGhvZC5cclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fSBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIHNlcnZlciBtZXRob2QgKGlmIGFueSksIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvci5cclxuICAgICAqL1xyXG4gICAgaW52b2tlKG1ldGhvZE5hbWUsIC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBbc3RyZWFtcywgc3RyZWFtSWRzXSA9IHRoaXMuX3JlcGxhY2VTdHJlYW1pbmdQYXJhbXMoYXJncyk7XHJcbiAgICAgICAgY29uc3QgaW52b2NhdGlvbkRlc2NyaXB0b3IgPSB0aGlzLl9jcmVhdGVJbnZvY2F0aW9uKG1ldGhvZE5hbWUsIGFyZ3MsIGZhbHNlLCBzdHJlYW1JZHMpO1xyXG4gICAgICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGludm9jYXRpb25JZCB3aWxsIGFsd2F5cyBoYXZlIGEgdmFsdWUgZm9yIGEgbm9uLWJsb2NraW5nIGludm9jYXRpb25cclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2ludm9jYXRpb25EZXNjcmlwdG9yLmludm9jYXRpb25JZF0gPSAoaW52b2NhdGlvbkV2ZW50LCBlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpbnZvY2F0aW9uRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpbnZvY2F0aW9uRXZlbnQgd2lsbCBub3QgYmUgbnVsbCB3aGVuIGFuIGVycm9yIGlzIG5vdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludm9jYXRpb25FdmVudC50eXBlID09PSBNZXNzYWdlVHlwZS5Db21wbGV0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uRXZlbnQuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoaW52b2NhdGlvbkV2ZW50LmVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGludm9jYXRpb25FdmVudC5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBVbmV4cGVjdGVkIG1lc3NhZ2UgdHlwZTogJHtpbnZvY2F0aW9uRXZlbnQudHlwZX1gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlUXVldWUgPSB0aGlzLl9zZW5kV2l0aFByb3RvY29sKGludm9jYXRpb25EZXNjcmlwdG9yKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnZvY2F0aW9uSWQgd2lsbCBhbHdheXMgaGF2ZSBhIHZhbHVlIGZvciBhIG5vbi1ibG9ja2luZyBpbnZvY2F0aW9uXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2ludm9jYXRpb25EZXNjcmlwdG9yLmludm9jYXRpb25JZF07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXVuY2hTdHJlYW1zKHN0cmVhbXMsIHByb21pc2VRdWV1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHA7XHJcbiAgICB9XHJcbiAgICBvbihtZXRob2ROYW1lLCBuZXdNZXRob2QpIHtcclxuICAgICAgICBpZiAoIW1ldGhvZE5hbWUgfHwgIW5ld01ldGhvZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXRob2RzW21ldGhvZE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGhvZHNbbWV0aG9kTmFtZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUHJldmVudGluZyBhZGRpbmcgdGhlIHNhbWUgaGFuZGxlciBtdWx0aXBsZSB0aW1lcy5cclxuICAgICAgICBpZiAodGhpcy5fbWV0aG9kc1ttZXRob2ROYW1lXS5pbmRleE9mKG5ld01ldGhvZCkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbWV0aG9kc1ttZXRob2ROYW1lXS5wdXNoKG5ld01ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBvZmYobWV0aG9kTmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuX21ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKCFoYW5kbGVycykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlSWR4ID0gaGFuZGxlcnMuaW5kZXhPZihtZXRob2QpO1xyXG4gICAgICAgICAgICBpZiAocmVtb3ZlSWR4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlcnMuc3BsaWNlKHJlbW92ZUlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX21ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiBSZWdpc3RlcnMgYSBoYW5kbGVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgY2xvc2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBoYW5kbGVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgY2xvc2VkLiBPcHRpb25hbGx5IHJlY2VpdmVzIGEgc2luZ2xlIGFyZ3VtZW50IGNvbnRhaW5pbmcgdGhlIGVycm9yIHRoYXQgY2F1c2VkIHRoZSBjb25uZWN0aW9uIHRvIGNsb3NlIChpZiBhbnkpLlxyXG4gICAgICovXHJcbiAgICBvbmNsb3NlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogUmVnaXN0ZXJzIGEgaGFuZGxlciB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBjb25uZWN0aW9uIHN0YXJ0cyByZWNvbm5lY3RpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGhhbmRsZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBzdGFydHMgcmVjb25uZWN0aW5nLiBPcHRpb25hbGx5IHJlY2VpdmVzIGEgc2luZ2xlIGFyZ3VtZW50IGNvbnRhaW5pbmcgdGhlIGVycm9yIHRoYXQgY2F1c2VkIHRoZSBjb25uZWN0aW9uIHRvIHN0YXJ0IHJlY29ubmVjdGluZyAoaWYgYW55KS5cclxuICAgICAqL1xyXG4gICAgb25yZWNvbm5lY3RpbmcoY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0aW5nQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiBSZWdpc3RlcnMgYSBoYW5kbGVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGNvbm5lY3Rpb24gc3VjY2Vzc2Z1bGx5IHJlY29ubmVjdHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGhhbmRsZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBzdWNjZXNzZnVsbHkgcmVjb25uZWN0cy5cclxuICAgICAqL1xyXG4gICAgb25yZWNvbm5lY3RlZChjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfcHJvY2Vzc0luY29taW5nRGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5fY2xlYW51cFRpbWVvdXQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuX3JlY2VpdmVkSGFuZHNoYWtlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3Byb2Nlc3NIYW5kc2hha2VSZXNwb25zZShkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVjZWl2ZWRIYW5kc2hha2VSZXNwb25zZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERhdGEgbWF5IGhhdmUgYWxsIGJlZW4gcmVhZCB3aGVuIHByb2Nlc3NpbmcgaGFuZHNoYWtlIHJlc3BvbnNlXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gUGFyc2UgdGhlIG1lc3NhZ2VzXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5fcHJvdG9jb2wucGFyc2VNZXNzYWdlcyhkYXRhLCB0aGlzLl9sb2dnZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tZXNzYWdlQnVmZmVyICYmICF0aGlzLl9tZXNzYWdlQnVmZmVyLl9zaG91bGRQcm9jZXNzTWVzc2FnZShtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIERvbid0IHByb2Nlc3MgdGhlIG1lc3NhZ2UsIHdlIGFyZSBlaXRoZXIgd2FpdGluZyBmb3IgYSBTZXF1ZW5jZU1lc3NhZ2Ugb3IgcmVjZWl2ZWQgYSBkdXBsaWNhdGUgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkludm9jYXRpb246XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludm9rZUNsaWVudE1ldGhvZChtZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgSW52b2tlIGNsaWVudCBtZXRob2QgdGhyZXcgZXJyb3I6ICR7Z2V0RXJyb3JTdHJpbmcoZSl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlN0cmVhbUl0ZW06XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5Db21wbGV0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5fY2FsbGJhY2tzW21lc3NhZ2UuaW52b2NhdGlvbklkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBNZXNzYWdlVHlwZS5Db21wbGV0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1ttZXNzYWdlLmludm9jYXRpb25JZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgU3RyZWFtIGNhbGxiYWNrIHRocmV3IGVycm9yOiAke2dldEVycm9yU3RyaW5nKGUpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlBpbmc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGNhcmUgYWJvdXQgcGluZ3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5DbG9zZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBcIkNsb3NlIG1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSBzZXJ2ZXIuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG1lc3NhZ2UuZXJyb3IgPyBuZXcgRXJyb3IoXCJTZXJ2ZXIgcmV0dXJuZWQgYW4gZXJyb3Igb24gY2xvc2U6IFwiICsgbWVzc2FnZS5lcnJvcikgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLmFsbG93UmVjb25uZWN0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJdCBmZWVscyB3cm9uZyBub3QgdG8gYXdhaXQgY29ubmVjdGlvbi5zdG9wKCkgaGVyZSwgYnV0IHByb2Nlc3NJbmNvbWluZ0RhdGEgaXMgY2FsbGVkIGFzIHBhcnQgb2YgYW4gb25yZWNlaXZlIGNhbGxiYWNrIHdoaWNoIGlzIG5vdCBhc3luYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgYWxyZWFkeSB0aGUgYmVoYXZpb3IgZm9yIHNlcnZlclRpbWVvdXQoKSwgYW5kIEh0dHBDb25uZWN0aW9uLlN0b3AoKSBzaG91bGQgY2F0Y2ggYW5kIGxvZyBhbGwgcG9zc2libGUgZXhjZXB0aW9ucy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5zdG9wKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGNhbm5vdCBhd2FpdCBzdG9wSW50ZXJuYWwoKSBoZXJlLCBidXQgc3Vic2VxdWVudCBjYWxscyB0byBzdG9wKCkgd2lsbCBhd2FpdCB0aGlzIGlmIHN0b3BJbnRlcm5hbCgpIGlzIHN0aWxsIG9uZ29pbmcuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdG9wUHJvbWlzZSA9IHRoaXMuX3N0b3BJbnRlcm5hbChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQWNrOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWVzc2FnZUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZUJ1ZmZlci5fYWNrKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuU2VxdWVuY2U6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tZXNzYWdlQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlQnVmZmVyLl9yZXNldFNlcXVlbmNlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYEludmFsaWQgbWVzc2FnZSB0eXBlOiAke21lc3NhZ2UudHlwZX0uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jlc2V0VGltZW91dFBlcmlvZCgpO1xyXG4gICAgfVxyXG4gICAgX3Byb2Nlc3NIYW5kc2hha2VSZXNwb25zZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlTWVzc2FnZTtcclxuICAgICAgICBsZXQgcmVtYWluaW5nRGF0YTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBbcmVtYWluaW5nRGF0YSwgcmVzcG9uc2VNZXNzYWdlXSA9IHRoaXMuX2hhbmRzaGFrZVByb3RvY29sLnBhcnNlSGFuZHNoYWtlUmVzcG9uc2UoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIkVycm9yIHBhcnNpbmcgaGFuZHNoYWtlIHJlc3BvbnNlOiBcIiArIGU7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZHNoYWtlUmVqZWN0ZXIoZXJyb3IpO1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlTWVzc2FnZS5lcnJvcikge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gXCJTZXJ2ZXIgcmV0dXJuZWQgaGFuZHNoYWtlIGVycm9yOiBcIiArIHJlc3BvbnNlTWVzc2FnZS5lcnJvcjtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kc2hha2VSZWplY3RlcihlcnJvcik7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJTZXJ2ZXIgaGFuZHNoYWtlIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faGFuZHNoYWtlUmVzb2x2ZXIoKTtcclxuICAgICAgICByZXR1cm4gcmVtYWluaW5nRGF0YTtcclxuICAgIH1cclxuICAgIF9yZXNldEtlZXBBbGl2ZUludGVydmFsKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMuaW5oZXJlbnRLZWVwQWxpdmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZXQgdGhlIHRpbWUgd2Ugd2FudCB0aGUgbmV4dCBrZWVwIGFsaXZlIHRvIGJlIHNlbnRcclxuICAgICAgICAvLyBUaW1lciB3aWxsIGJlIHNldHVwIG9uIG5leHQgbWVzc2FnZSByZWNlaXZlXHJcbiAgICAgICAgdGhpcy5fbmV4dEtlZXBBbGl2ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgdGhpcy5rZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzO1xyXG4gICAgICAgIHRoaXMuX2NsZWFudXBQaW5nVGltZXIoKTtcclxuICAgIH1cclxuICAgIF9yZXNldFRpbWVvdXRQZXJpb2QoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMgfHwgIXRoaXMuY29ubmVjdGlvbi5mZWF0dXJlcy5pbmhlcmVudEtlZXBBbGl2ZSkge1xyXG4gICAgICAgICAgICAvLyBTZXQgdGhlIHRpbWVvdXQgdGltZXJcclxuICAgICAgICAgICAgdGhpcy5fdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXJ2ZXJUaW1lb3V0KCksIHRoaXMuc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzKTtcclxuICAgICAgICAgICAgLy8gU2V0IGtlZXBBbGl2ZSB0aW1lciBpZiB0aGVyZSBpc24ndCBvbmVcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BpbmdTZXJ2ZXJIYW5kbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5leHRQaW5nID0gdGhpcy5fbmV4dEtlZXBBbGl2ZSAtIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRQaW5nIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRQaW5nID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFRoZSB0aW1lciBuZWVkcyB0byBiZSBzZXQgZnJvbSBhIG5ldHdvcmtpbmcgY2FsbGJhY2sgdG8gYXZvaWQgQ2hyb21lIHRpbWVyIHRocm90dGxpbmcgZnJvbSBjYXVzaW5nIHRpbWVycyB0byBydW4gb25jZSBhIG1pbnV0ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGluZ1NlcnZlckhhbmRsZSA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRNZXNzYWdlKHRoaXMuX2NhY2hlZFBpbmdNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCBjYXJlIGFib3V0IHRoZSBlcnJvci4gSXQgc2hvdWxkIGJlIHNlZW4gZWxzZXdoZXJlIGluIHRoZSBjbGllbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY29ubmVjdGlvbiBpcyBwcm9iYWJseSBpbiBhIGJhZCBvciBjbG9zZWQgc3RhdGUgbm93LCBjbGVhbnVwIHRoZSB0aW1lciBzbyBpdCBzdG9wcyB0cmlnZ2VyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGVhbnVwUGluZ1RpbWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBuZXh0UGluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXHJcbiAgICBzZXJ2ZXJUaW1lb3V0KCkge1xyXG4gICAgICAgIC8vIFRoZSBzZXJ2ZXIgaGFzbid0IHRhbGtlZCB0byB1cyBpbiBhIHdoaWxlLiBJdCBkb2Vzbid0IGxpa2UgdXMgYW55bW9yZSAuLi4gOihcclxuICAgICAgICAvLyBUZXJtaW5hdGUgdGhlIGNvbm5lY3Rpb24sIGJ1dCB3ZSBkb24ndCBuZWVkIHRvIHdhaXQgb24gdGhlIHByb21pc2UuIFRoaXMgY291bGQgdHJpZ2dlciByZWNvbm5lY3RpbmcuXHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5zdG9wKG5ldyBFcnJvcihcIlNlcnZlciB0aW1lb3V0IGVsYXBzZWQgd2l0aG91dCByZWNlaXZpbmcgYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cIikpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX2ludm9rZUNsaWVudE1ldGhvZChpbnZvY2F0aW9uTWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBpbnZvY2F0aW9uTWVzc2FnZS50YXJnZXQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5fbWV0aG9kc1ttZXRob2ROYW1lXTtcclxuICAgICAgICBpZiAoIW1ldGhvZHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5XYXJuaW5nLCBgTm8gY2xpZW50IG1ldGhvZCB3aXRoIHRoZSBuYW1lICcke21ldGhvZE5hbWV9JyBmb3VuZC5gKTtcclxuICAgICAgICAgICAgLy8gTm8gaGFuZGxlcnMgcHJvdmlkZWQgYnkgY2xpZW50IGJ1dCB0aGUgc2VydmVyIGlzIGV4cGVjdGluZyBhIHJlc3BvbnNlIHN0aWxsLCBzbyB3ZSBzZW5kIGFuIGVycm9yXHJcbiAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uTWVzc2FnZS5pbnZvY2F0aW9uSWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYE5vIHJlc3VsdCBnaXZlbiBmb3IgJyR7bWV0aG9kTmFtZX0nIG1ldGhvZCBhbmQgaW52b2NhdGlvbiBJRCAnJHtpbnZvY2F0aW9uTWVzc2FnZS5pbnZvY2F0aW9uSWR9Jy5gKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2wodGhpcy5fY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2UoaW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkLCBcIkNsaWVudCBkaWRuJ3QgcHJvdmlkZSBhIHJlc3VsdC5cIiwgbnVsbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQXZvaWQgaXNzdWVzIHdpdGggaGFuZGxlcnMgcmVtb3ZpbmcgdGhlbXNlbHZlcyB0aHVzIG1vZGlmeWluZyB0aGUgbGlzdCB3aGlsZSBpdGVyYXRpbmcgdGhyb3VnaCBpdFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZHNDb3B5ID0gbWV0aG9kcy5zbGljZSgpO1xyXG4gICAgICAgIC8vIFNlcnZlciBleHBlY3RzIGEgcmVzcG9uc2VcclxuICAgICAgICBjb25zdCBleHBlY3RzUmVzcG9uc2UgPSBpbnZvY2F0aW9uTWVzc2FnZS5pbnZvY2F0aW9uSWQgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgLy8gV2UgcHJlc2VydmUgdGhlIGxhc3QgcmVzdWx0IG9yIGV4Y2VwdGlvbiBidXQgc3RpbGwgY2FsbCBhbGwgaGFuZGxlcnNcclxuICAgICAgICBsZXQgcmVzO1xyXG4gICAgICAgIGxldCBleGNlcHRpb247XHJcbiAgICAgICAgbGV0IGNvbXBsZXRpb25NZXNzYWdlO1xyXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiBtZXRob2RzQ29weSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldlJlcyA9IHJlcztcclxuICAgICAgICAgICAgICAgIHJlcyA9IGF3YWl0IG0uYXBwbHkodGhpcywgaW52b2NhdGlvbk1lc3NhZ2UuYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGlmIChleHBlY3RzUmVzcG9uc2UgJiYgcmVzICYmIHByZXZSZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgTXVsdGlwbGUgcmVzdWx0cyBwcm92aWRlZCBmb3IgJyR7bWV0aG9kTmFtZX0nLiBTZW5kaW5nIGVycm9yIHRvIHNlcnZlci5gKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTWVzc2FnZSA9IHRoaXMuX2NyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKGludm9jYXRpb25NZXNzYWdlLmludm9jYXRpb25JZCwgYENsaWVudCBwcm92aWRlZCBtdWx0aXBsZSByZXN1bHRzLmAsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbiBpZiB3ZSBnb3QgYSByZXN1bHQgYWZ0ZXIsIHRoZSBleGNlcHRpb24gd2lsbCBiZSBsb2dnZWRcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgZXhjZXB0aW9uID0gZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBBIGNhbGxiYWNrIGZvciB0aGUgbWV0aG9kICcke21ldGhvZE5hbWV9JyB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBsZXRpb25NZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2woY29tcGxldGlvbk1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChleHBlY3RzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gZXhjZXB0aW9uIHRoYXQgbWVhbnMgZWl0aGVyIG5vIHJlc3VsdCB3YXMgZ2l2ZW4gb3IgYSBoYW5kbGVyIGFmdGVyIGEgcmVzdWx0IHRocmV3XHJcbiAgICAgICAgICAgIGlmIChleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRpb25NZXNzYWdlID0gdGhpcy5fY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2UoaW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkLCBgJHtleGNlcHRpb259YCwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRpb25NZXNzYWdlID0gdGhpcy5fY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2UoaW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkLCBudWxsLCByZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5XYXJuaW5nLCBgTm8gcmVzdWx0IGdpdmVuIGZvciAnJHttZXRob2ROYW1lfScgbWV0aG9kIGFuZCBpbnZvY2F0aW9uIElEICcke2ludm9jYXRpb25NZXNzYWdlLmludm9jYXRpb25JZH0nLmApO1xyXG4gICAgICAgICAgICAgICAgLy8gQ2xpZW50IGRpZG4ndCBwcm92aWRlIGEgcmVzdWx0IG9yIHRocm93IGZyb20gYSBoYW5kbGVyLCBzZXJ2ZXIgZXhwZWN0cyBhIHJlc3BvbnNlIHNvIHdlIHNlbmQgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRpb25NZXNzYWdlID0gdGhpcy5fY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2UoaW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkLCBcIkNsaWVudCBkaWRuJ3QgcHJvdmlkZSBhIHJlc3VsdC5cIiwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2VuZFdpdGhQcm90b2NvbChjb21wbGV0aW9uTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgUmVzdWx0IGdpdmVuIGZvciAnJHttZXRob2ROYW1lfScgbWV0aG9kIGJ1dCBzZXJ2ZXIgaXMgbm90IGV4cGVjdGluZyBhIHJlc3VsdC5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9jb25uZWN0aW9uQ2xvc2VkKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYEh1YkNvbm5lY3Rpb24uY29ubmVjdGlvbkNsb3NlZCgke2Vycm9yfSkgY2FsbGVkIHdoaWxlIGluIHN0YXRlICR7dGhpcy5fY29ubmVjdGlvblN0YXRlfS5gKTtcclxuICAgICAgICAvLyBUcmlnZ2VyaW5nIHRoaXMuaGFuZHNoYWtlUmVqZWN0ZXIgaXMgaW5zdWZmaWNpZW50IGJlY2F1c2UgaXQgY291bGQgYWxyZWFkeSBiZSByZXNvbHZlZCB3aXRob3V0IHRoZSBjb250aW51YXRpb24gaGF2aW5nIHJ1biB5ZXQuXHJcbiAgICAgICAgdGhpcy5fc3RvcER1cmluZ1N0YXJ0RXJyb3IgPSB0aGlzLl9zdG9wRHVyaW5nU3RhcnRFcnJvciB8fCBlcnJvciB8fCBuZXcgQWJvcnRFcnJvcihcIlRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gd2FzIGNsb3NlZCBiZWZvcmUgdGhlIGh1YiBoYW5kc2hha2UgY291bGQgY29tcGxldGUuXCIpO1xyXG4gICAgICAgIC8vIElmIHRoZSBoYW5kc2hha2UgaXMgaW4gcHJvZ3Jlc3MsIHN0YXJ0IHdpbGwgYmUgd2FpdGluZyBmb3IgdGhlIGhhbmRzaGFrZSBwcm9taXNlLCBzbyB3ZSBjb21wbGV0ZSBpdC5cclxuICAgICAgICAvLyBJZiBpdCBoYXMgYWxyZWFkeSBjb21wbGV0ZWQsIHRoaXMgc2hvdWxkIGp1c3Qgbm9vcC5cclxuICAgICAgICBpZiAodGhpcy5faGFuZHNoYWtlUmVzb2x2ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5faGFuZHNoYWtlUmVzb2x2ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FuY2VsQ2FsbGJhY2tzV2l0aEVycm9yKGVycm9yIHx8IG5ldyBFcnJvcihcIkludm9jYXRpb24gY2FuY2VsZWQgZHVlIHRvIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gYmVpbmcgY2xvc2VkLlwiKSk7XHJcbiAgICAgICAgdGhpcy5fY2xlYW51cFRpbWVvdXQoKTtcclxuICAgICAgICB0aGlzLl9jbGVhbnVwUGluZ1RpbWVyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGVDbG9zZShlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gSHViQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCAmJiB0aGlzLl9yZWNvbm5lY3RQb2xpY3kpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3QoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGVDbG9zZShlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIG5vbmUgb2YgdGhlIGFib3ZlIGlmIGNvbmRpdGlvbnMgd2VyZSB0cnVlIHdlcmUgY2FsbGVkIHRoZSBIdWJDb25uZWN0aW9uIG11c3QgYmUgaW4gZWl0aGVyOlxyXG4gICAgICAgIC8vIDEuIFRoZSBDb25uZWN0aW5nIHN0YXRlIGluIHdoaWNoIGNhc2UgdGhlIGhhbmRzaGFrZVJlc29sdmVyIHdpbGwgY29tcGxldGUgaXQgYW5kIHN0b3BEdXJpbmdTdGFydEVycm9yIHdpbGwgZmFpbCBpdC5cclxuICAgICAgICAvLyAyLiBUaGUgUmVjb25uZWN0aW5nIHN0YXRlIGluIHdoaWNoIGNhc2UgdGhlIGhhbmRzaGFrZVJlc29sdmVyIHdpbGwgY29tcGxldGUgaXQgYW5kIHN0b3BEdXJpbmdTdGFydEVycm9yIHdpbGwgZmFpbCB0aGUgY3VycmVudCByZWNvbm5lY3QgYXR0ZW1wdFxyXG4gICAgICAgIC8vICAgIGFuZCBwb3RlbnRpYWxseSBjb250aW51ZSB0aGUgcmVjb25uZWN0KCkgbG9vcC5cclxuICAgICAgICAvLyAzLiBUaGUgRGlzY29ubmVjdGVkIHN0YXRlIGluIHdoaWNoIGNhc2Ugd2UncmUgYWxyZWFkeSBkb25lLlxyXG4gICAgfVxyXG4gICAgX2NvbXBsZXRlQ2xvc2UoZXJyb3IpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZDtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VCdWZmZXIuX2Rpc3Bvc2UoZXJyb3IgIT09IG51bGwgJiYgZXJyb3IgIT09IHZvaWQgMCA/IGVycm9yIDogbmV3IEVycm9yKFwiQ29ubmVjdGlvbiBjbG9zZWQuXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VCdWZmZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtLmlzQnJvd3Nlcikge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmcmVlemVcIiwgdGhpcy5fZnJlZXplRXZlbnRMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlZENhbGxiYWNrcy5mb3JFYWNoKChjKSA9PiBjLmFwcGx5KHRoaXMsIFtlcnJvcl0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYEFuIG9uY2xvc2UgY2FsbGJhY2sgY2FsbGVkIHdpdGggZXJyb3IgJyR7ZXJyb3J9JyB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBfcmVjb25uZWN0KGVycm9yKSB7XHJcbiAgICAgICAgY29uc3QgcmVjb25uZWN0U3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBsZXQgcHJldmlvdXNSZWNvbm5lY3RBdHRlbXB0cyA9IDA7XHJcbiAgICAgICAgbGV0IHJldHJ5RXJyb3IgPSBlcnJvciAhPT0gdW5kZWZpbmVkID8gZXJyb3IgOiBuZXcgRXJyb3IoXCJBdHRlbXB0aW5nIHRvIHJlY29ubmVjdCBkdWUgdG8gYSB1bmtub3duIGVycm9yLlwiKTtcclxuICAgICAgICBsZXQgbmV4dFJldHJ5RGVsYXkgPSB0aGlzLl9nZXROZXh0UmV0cnlEZWxheShwcmV2aW91c1JlY29ubmVjdEF0dGVtcHRzKyssIDAsIHJldHJ5RXJyb3IpO1xyXG4gICAgICAgIGlmIChuZXh0UmV0cnlEZWxheSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIkNvbm5lY3Rpb24gbm90IHJlY29ubmVjdGluZyBiZWNhdXNlIHRoZSBJUmV0cnlQb2xpY3kgcmV0dXJuZWQgbnVsbCBvbiB0aGUgZmlyc3QgcmVjb25uZWN0IGF0dGVtcHQuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZUNsb3NlKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBIdWJDb25uZWN0aW9uU3RhdGUuUmVjb25uZWN0aW5nO1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgQ29ubmVjdGlvbiByZWNvbm5lY3RpbmcgYmVjYXVzZSBvZiBlcnJvciAnJHtlcnJvcn0nLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgXCJDb25uZWN0aW9uIHJlY29ubmVjdGluZy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3RpbmdDYWxsYmFja3MubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RpbmdDYWxsYmFja3MuZm9yRWFjaCgoYykgPT4gYy5hcHBseSh0aGlzLCBbZXJyb3JdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBBbiBvbnJlY29ubmVjdGluZyBjYWxsYmFjayBjYWxsZWQgd2l0aCBlcnJvciAnJHtlcnJvcn0nIHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBFeGl0IGVhcmx5IGlmIGFuIG9ucmVjb25uZWN0aW5nIGNhbGxiYWNrIGNhbGxlZCBjb25uZWN0aW9uLnN0b3AoKS5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSAhPT0gSHViQ29ubmVjdGlvblN0YXRlLlJlY29ubmVjdGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJDb25uZWN0aW9uIGxlZnQgdGhlIHJlY29ubmVjdGluZyBzdGF0ZSBpbiBvbnJlY29ubmVjdGluZyBjYWxsYmFjay4gRG9uZSByZWNvbm5lY3RpbmcuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChuZXh0UmV0cnlEZWxheSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgUmVjb25uZWN0IGF0dGVtcHQgbnVtYmVyICR7cHJldmlvdXNSZWNvbm5lY3RBdHRlbXB0c30gd2lsbCBzdGFydCBpbiAke25leHRSZXRyeURlbGF5fSBtcy5gKTtcclxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdERlbGF5SGFuZGxlID0gc2V0VGltZW91dChyZXNvbHZlLCBuZXh0UmV0cnlEZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3REZWxheUhhbmRsZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSAhPT0gSHViQ29ubmVjdGlvblN0YXRlLlJlY29ubmVjdGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJDb25uZWN0aW9uIGxlZnQgdGhlIHJlY29ubmVjdGluZyBzdGF0ZSBkdXJpbmcgcmVjb25uZWN0IGRlbGF5LiBEb25lIHJlY29ubmVjdGluZy5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0YXJ0SW50ZXJuYWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IEh1YkNvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBcIkh1YkNvbm5lY3Rpb24gcmVjb25uZWN0ZWQgc3VjY2Vzc2Z1bGx5LlwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3RlZENhbGxiYWNrcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RlZENhbGxiYWNrcy5mb3JFYWNoKChjKSA9PiBjLmFwcGx5KHRoaXMsIFt0aGlzLmNvbm5lY3Rpb24uY29ubmVjdGlvbklkXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgQW4gb25yZWNvbm5lY3RlZCBjYWxsYmFjayBjYWxsZWQgd2l0aCBjb25uZWN0aW9uSWQgJyR7dGhpcy5jb25uZWN0aW9uLmNvbm5lY3Rpb25JZH07IHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIGBSZWNvbm5lY3QgYXR0ZW1wdCBmYWlsZWQgYmVjYXVzZSBvZiBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlICE9PSBIdWJDb25uZWN0aW9uU3RhdGUuUmVjb25uZWN0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYENvbm5lY3Rpb24gbW92ZWQgdG8gdGhlICcke3RoaXMuX2Nvbm5lY3Rpb25TdGF0ZX0nIGZyb20gdGhlIHJlY29ubmVjdGluZyBzdGF0ZSBkdXJpbmcgcmVjb25uZWN0IGF0dGVtcHQuIERvbmUgcmVjb25uZWN0aW5nLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyIHRoaW5rcyB0aGF0IGNvbm5lY3Rpb25TdGF0ZSBtdXN0IGJlIENvbm5lY3RlZCBoZXJlLiBUaGUgVHlwZVNjcmlwdCBjb21waWxlciBpcyB3cm9uZy5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBIdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb21wbGV0ZUNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHJ5RXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlIDogbmV3IEVycm9yKGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBuZXh0UmV0cnlEZWxheSA9IHRoaXMuX2dldE5leHRSZXRyeURlbGF5KHByZXZpb3VzUmVjb25uZWN0QXR0ZW1wdHMrKywgRGF0ZS5ub3coKSAtIHJlY29ubmVjdFN0YXJ0VGltZSwgcmV0cnlFcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgYFJlY29ubmVjdCByZXRyaWVzIGhhdmUgYmVlbiBleGhhdXN0ZWQgYWZ0ZXIgJHtEYXRlLm5vdygpIC0gcmVjb25uZWN0U3RhcnRUaW1lfSBtcyBhbmQgJHtwcmV2aW91c1JlY29ubmVjdEF0dGVtcHRzfSBmYWlsZWQgYXR0ZW1wdHMuIENvbm5lY3Rpb24gZGlzY29ubmVjdGluZy5gKTtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZUNsb3NlKCk7XHJcbiAgICB9XHJcbiAgICBfZ2V0TmV4dFJldHJ5RGVsYXkocHJldmlvdXNSZXRyeUNvdW50LCBlbGFwc2VkTWlsbGlzZWNvbmRzLCByZXRyeVJlYXNvbikge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvbm5lY3RQb2xpY3kubmV4dFJldHJ5RGVsYXlJbk1pbGxpc2Vjb25kcyh7XHJcbiAgICAgICAgICAgICAgICBlbGFwc2VkTWlsbGlzZWNvbmRzLFxyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNSZXRyeUNvdW50LFxyXG4gICAgICAgICAgICAgICAgcmV0cnlSZWFzb24sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgSVJldHJ5UG9saWN5Lm5leHRSZXRyeURlbGF5SW5NaWxsaXNlY29uZHMoJHtwcmV2aW91c1JldHJ5Q291bnR9LCAke2VsYXBzZWRNaWxsaXNlY29uZHN9KSB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9jYW5jZWxDYWxsYmFja3NXaXRoRXJyb3IoZXJyb3IpIHtcclxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3M7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICAgICAgT2JqZWN0LmtleXMoY2FsbGJhY2tzKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gY2FsbGJhY2tzW2tleV07XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBTdHJlYW0gJ2Vycm9yJyBjYWxsYmFjayBjYWxsZWQgd2l0aCAnJHtlcnJvcn0nIHRocmV3IGVycm9yOiAke2dldEVycm9yU3RyaW5nKGUpfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfY2xlYW51cFBpbmdUaW1lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGluZ1NlcnZlckhhbmRsZSkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fcGluZ1NlcnZlckhhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpbmdTZXJ2ZXJIYW5kbGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2NsZWFudXBUaW1lb3V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90aW1lb3V0SGFuZGxlKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0SGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlSW52b2NhdGlvbihtZXRob2ROYW1lLCBhcmdzLCBub25ibG9ja2luZywgc3RyZWFtSWRzKSB7XHJcbiAgICAgICAgaWYgKG5vbmJsb2NraW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChzdHJlYW1JZHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogYXJncyxcclxuICAgICAgICAgICAgICAgICAgICBzdHJlYW1JZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBtZXRob2ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkludm9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBtZXRob2ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkludm9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpbnZvY2F0aW9uSWQgPSB0aGlzLl9pbnZvY2F0aW9uSWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludm9jYXRpb25JZCsrO1xyXG4gICAgICAgICAgICBpZiAoc3RyZWFtSWRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2NhdGlvbklkOiBpbnZvY2F0aW9uSWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBzdHJlYW1JZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBtZXRob2ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkludm9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2NhdGlvbklkOiBpbnZvY2F0aW9uSWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IG1ldGhvZE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGUuSW52b2NhdGlvbixcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfbGF1bmNoU3RyZWFtcyhzdHJlYW1zLCBwcm9taXNlUXVldWUpIHtcclxuICAgICAgICBpZiAoc3RyZWFtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTeW5jaHJvbml6ZSBzdHJlYW0gZGF0YSBzbyB0aGV5IGFycml2ZSBpbi1vcmRlciBvbiB0aGUgc2VydmVyXHJcbiAgICAgICAgaWYgKCFwcm9taXNlUXVldWUpIHtcclxuICAgICAgICAgICAgcHJvbWlzZVF1ZXVlID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFdlIHdhbnQgdG8gaXRlcmF0ZSBvdmVyIHRoZSBrZXlzLCBzaW5jZSB0aGUga2V5cyBhcmUgdGhlIHN0cmVhbSBpZHNcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ3VhcmQtZm9yLWluXHJcbiAgICAgICAgZm9yIChjb25zdCBzdHJlYW1JZCBpbiBzdHJlYW1zKSB7XHJcbiAgICAgICAgICAgIHN0cmVhbXNbc3RyZWFtSWRdLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VRdWV1ZSA9IHByb21pc2VRdWV1ZS50aGVuKCgpID0+IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2wodGhpcy5fY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2Uoc3RyZWFtSWQpKSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChlcnIgJiYgZXJyLnRvU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlVua25vd24gZXJyb3JcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVF1ZXVlID0gcHJvbWlzZVF1ZXVlLnRoZW4oKCkgPT4gdGhpcy5fc2VuZFdpdGhQcm90b2NvbCh0aGlzLl9jcmVhdGVDb21wbGV0aW9uTWVzc2FnZShzdHJlYW1JZCwgbWVzc2FnZSkpKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuZXh0OiAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VRdWV1ZSA9IHByb21pc2VRdWV1ZS50aGVuKCgpID0+IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2wodGhpcy5fY3JlYXRlU3RyZWFtSXRlbU1lc3NhZ2Uoc3RyZWFtSWQsIGl0ZW0pKSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfcmVwbGFjZVN0cmVhbWluZ1BhcmFtcyhhcmdzKSB7XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtcyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHN0cmVhbUlkcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhcmd1bWVudCA9IGFyZ3NbaV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc09ic2VydmFibGUoYXJndW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdHJlYW1JZCA9IHRoaXMuX2ludm9jYXRpb25JZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ludm9jYXRpb25JZCsrO1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHN0cmVhbSBmb3IgbGF0ZXIgdXNlXHJcbiAgICAgICAgICAgICAgICBzdHJlYW1zW3N0cmVhbUlkXSA9IGFyZ3VtZW50O1xyXG4gICAgICAgICAgICAgICAgc3RyZWFtSWRzLnB1c2goc3RyZWFtSWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgc3RyZWFtIGZyb20gYXJnc1xyXG4gICAgICAgICAgICAgICAgYXJncy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtzdHJlYW1zLCBzdHJlYW1JZHNdO1xyXG4gICAgfVxyXG4gICAgX2lzT2JzZXJ2YWJsZShhcmcpIHtcclxuICAgICAgICAvLyBUaGlzIGFsbG93cyBvdGhlciBzdHJlYW0gaW1wbGVtZW50YXRpb25zIHRvIGp1c3Qgd29yayAobGlrZSByeGpzKVxyXG4gICAgICAgIHJldHVybiBhcmcgJiYgYXJnLnN1YnNjcmliZSAmJiB0eXBlb2YgYXJnLnN1YnNjcmliZSA9PT0gXCJmdW5jdGlvblwiO1xyXG4gICAgfVxyXG4gICAgX2NyZWF0ZVN0cmVhbUludm9jYXRpb24obWV0aG9kTmFtZSwgYXJncywgc3RyZWFtSWRzKSB7XHJcbiAgICAgICAgY29uc3QgaW52b2NhdGlvbklkID0gdGhpcy5faW52b2NhdGlvbklkO1xyXG4gICAgICAgIHRoaXMuX2ludm9jYXRpb25JZCsrO1xyXG4gICAgICAgIGlmIChzdHJlYW1JZHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uSWQ6IGludm9jYXRpb25JZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgc3RyZWFtSWRzLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBtZXRob2ROYW1lLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGUuU3RyZWFtSW52b2NhdGlvbixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uSWQ6IGludm9jYXRpb25JZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBtZXRob2ROYW1lLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGUuU3RyZWFtSW52b2NhdGlvbixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlQ2FuY2VsSW52b2NhdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGludm9jYXRpb25JZDogaWQsXHJcbiAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkNhbmNlbEludm9jYXRpb24sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIF9jcmVhdGVTdHJlYW1JdGVtTWVzc2FnZShpZCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGludm9jYXRpb25JZDogaWQsXHJcbiAgICAgICAgICAgIGl0ZW0sXHJcbiAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLlN0cmVhbUl0ZW0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIF9jcmVhdGVDb21wbGV0aW9uTWVzc2FnZShpZCwgZXJyb3IsIHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBpbnZvY2F0aW9uSWQ6IGlkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGUuQ29tcGxldGlvbixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW52b2NhdGlvbklkOiBpZCxcclxuICAgICAgICAgICAgcmVzdWx0LFxyXG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZS5Db21wbGV0aW9uLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlQ2xvc2VNZXNzYWdlKCkge1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6IE1lc3NhZ2VUeXBlLkNsb3NlIH07XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SHViQ29ubmVjdGlvbi5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IERlZmF1bHRSZWNvbm5lY3RQb2xpY3kgfSBmcm9tIFwiLi9EZWZhdWx0UmVjb25uZWN0UG9saWN5XCI7XHJcbmltcG9ydCB7IEh0dHBDb25uZWN0aW9uIH0gZnJvbSBcIi4vSHR0cENvbm5lY3Rpb25cIjtcclxuaW1wb3J0IHsgSHViQ29ubmVjdGlvbiB9IGZyb20gXCIuL0h1YkNvbm5lY3Rpb25cIjtcclxuaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tIFwiLi9JTG9nZ2VyXCI7XHJcbmltcG9ydCB7IEpzb25IdWJQcm90b2NvbCB9IGZyb20gXCIuL0pzb25IdWJQcm90b2NvbFwiO1xyXG5pbXBvcnQgeyBOdWxsTG9nZ2VyIH0gZnJvbSBcIi4vTG9nZ2Vyc1wiO1xyXG5pbXBvcnQgeyBBcmcsIENvbnNvbGVMb2dnZXIgfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG5jb25zdCBMb2dMZXZlbE5hbWVNYXBwaW5nID0ge1xyXG4gICAgdHJhY2U6IExvZ0xldmVsLlRyYWNlLFxyXG4gICAgZGVidWc6IExvZ0xldmVsLkRlYnVnLFxyXG4gICAgaW5mbzogTG9nTGV2ZWwuSW5mb3JtYXRpb24sXHJcbiAgICBpbmZvcm1hdGlvbjogTG9nTGV2ZWwuSW5mb3JtYXRpb24sXHJcbiAgICB3YXJuOiBMb2dMZXZlbC5XYXJuaW5nLFxyXG4gICAgd2FybmluZzogTG9nTGV2ZWwuV2FybmluZyxcclxuICAgIGVycm9yOiBMb2dMZXZlbC5FcnJvcixcclxuICAgIGNyaXRpY2FsOiBMb2dMZXZlbC5Dcml0aWNhbCxcclxuICAgIG5vbmU6IExvZ0xldmVsLk5vbmUsXHJcbn07XHJcbmZ1bmN0aW9uIHBhcnNlTG9nTGV2ZWwobmFtZSkge1xyXG4gICAgLy8gQ2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGluZyB2aWEgbG93ZXItY2FzaW5nXHJcbiAgICAvLyBZZXMsIEkga25vdyBjYXNlLWZvbGRpbmcgaXMgYSBjb21wbGljYXRlZCBwcm9ibGVtIGluIFVuaWNvZGUsIGJ1dCB3ZSBvbmx5IHN1cHBvcnRcclxuICAgIC8vIHRoZSBBU0NJSSBzdHJpbmdzIGRlZmluZWQgaW4gTG9nTGV2ZWxOYW1lTWFwcGluZyBhbnl3YXksIHNvIGl0J3MgZmluZSAtYW51cnNlLlxyXG4gICAgY29uc3QgbWFwcGluZyA9IExvZ0xldmVsTmFtZU1hcHBpbmdbbmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuICAgIGlmICh0eXBlb2YgbWFwcGluZyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIHJldHVybiBtYXBwaW5nO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGxvZyBsZXZlbDogJHtuYW1lfWApO1xyXG4gICAgfVxyXG59XHJcbi8qKiBBIGJ1aWxkZXIgZm9yIGNvbmZpZ3VyaW5nIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbn0gaW5zdGFuY2VzLiAqL1xyXG5leHBvcnQgY2xhc3MgSHViQ29ubmVjdGlvbkJ1aWxkZXIge1xyXG4gICAgY29uZmlndXJlTG9nZ2luZyhsb2dnaW5nKSB7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQobG9nZ2luZywgXCJsb2dnaW5nXCIpO1xyXG4gICAgICAgIGlmIChpc0xvZ2dlcihsb2dnaW5nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBsb2dnaW5nID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZ0xldmVsID0gcGFyc2VMb2dMZXZlbChsb2dnaW5nKTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcihsb2dMZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKGxvZ2dpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHdpdGhVcmwodXJsLCB0cmFuc3BvcnRUeXBlT3JPcHRpb25zKSB7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQodXJsLCBcInVybFwiKTtcclxuICAgICAgICBBcmcuaXNOb3RFbXB0eSh1cmwsIFwidXJsXCIpO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIC8vIEZsb3ctdHlwaW5nIGtub3dzIHdoZXJlIGl0J3MgYXQuIFNpbmNlIEh0dHBUcmFuc3BvcnRUeXBlIGlzIGEgbnVtYmVyIGFuZCBJSHR0cENvbm5lY3Rpb25PcHRpb25zIGlzIGd1YXJhbnRlZWRcclxuICAgICAgICAvLyB0byBiZSBhbiBvYmplY3QsIHdlIGtub3cgKGFzIGRvZXMgVHlwZVNjcmlwdCkgdGhpcyBjb21wYXJpc29uIGlzIGFsbCB3ZSBuZWVkIHRvIGZpZ3VyZSBvdXQgd2hpY2ggb3ZlcmxvYWQgd2FzIGNhbGxlZC5cclxuICAgICAgICBpZiAodHlwZW9mIHRyYW5zcG9ydFR5cGVPck9wdGlvbnMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5odHRwQ29ubmVjdGlvbk9wdGlvbnMgPSB7IC4uLnRoaXMuaHR0cENvbm5lY3Rpb25PcHRpb25zLCAuLi50cmFuc3BvcnRUeXBlT3JPcHRpb25zIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmh0dHBDb25uZWN0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLnRoaXMuaHR0cENvbm5lY3Rpb25PcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0OiB0cmFuc3BvcnRUeXBlT3JPcHRpb25zLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKiBDb25maWd1cmVzIHRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb259IHRvIHVzZSB0aGUgc3BlY2lmaWVkIEh1YiBQcm90b2NvbC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0lIdWJQcm90b2NvbH0gcHJvdG9jb2wgVGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSUh1YlByb3RvY29sfSBpbXBsZW1lbnRhdGlvbiB0byB1c2UuXHJcbiAgICAgKi9cclxuICAgIHdpdGhIdWJQcm90b2NvbChwcm90b2NvbCkge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHByb3RvY29sLCBcInByb3RvY29sXCIpO1xyXG4gICAgICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHdpdGhBdXRvbWF0aWNSZWNvbm5lY3QocmV0cnlEZWxheXNPclJlY29ubmVjdFBvbGljeSkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlY29ubmVjdFBvbGljeSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHJlY29ubmVjdFBvbGljeSBoYXMgYWxyZWFkeSBiZWVuIHNldC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmV0cnlEZWxheXNPclJlY29ubmVjdFBvbGljeSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlY29ubmVjdFBvbGljeSA9IG5ldyBEZWZhdWx0UmVjb25uZWN0UG9saWN5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmV0cnlEZWxheXNPclJlY29ubmVjdFBvbGljeSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWNvbm5lY3RQb2xpY3kgPSBuZXcgRGVmYXVsdFJlY29ubmVjdFBvbGljeShyZXRyeURlbGF5c09yUmVjb25uZWN0UG9saWN5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb25uZWN0UG9saWN5ID0gcmV0cnlEZWxheXNPclJlY29ubmVjdFBvbGljeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKiogQ29uZmlndXJlcyB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb24uc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzfSBmb3IgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbn0uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbkJ1aWxkZXJ9IGluc3RhbmNlLCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIHdpdGhTZXJ2ZXJUaW1lb3V0KG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKG1pbGxpc2Vjb25kcywgXCJtaWxsaXNlY29uZHNcIik7XHJcbiAgICAgICAgdGhpcy5fc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqIENvbmZpZ3VyZXMge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9uLmtlZXBBbGl2ZUludGVydmFsSW5NaWxsaXNlY29uZHN9IGZvciB0aGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9ufS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9uQnVpbGRlcn0gaW5zdGFuY2UsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgd2l0aEtlZXBBbGl2ZUludGVydmFsKG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKG1pbGxpc2Vjb25kcywgXCJtaWxsaXNlY29uZHNcIik7XHJcbiAgICAgICAgdGhpcy5fa2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKiBFbmFibGVzIGFuZCBjb25maWd1cmVzIG9wdGlvbnMgZm9yIHRoZSBTdGF0ZWZ1bCBSZWNvbm5lY3QgZmVhdHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9uQnVpbGRlcn0gaW5zdGFuY2UsIGZvciBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgd2l0aFN0YXRlZnVsUmVjb25uZWN0KG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5odHRwQ29ubmVjdGlvbk9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmh0dHBDb25uZWN0aW9uT3B0aW9ucyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmh0dHBDb25uZWN0aW9uT3B0aW9ucy5fdXNlU3RhdGVmdWxSZWNvbm5lY3QgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5idWZmZXJTaXplO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqIENyZWF0ZXMgYSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb259IGZyb20gdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBzcGVjaWZpZWQgaW4gdGhpcyBidWlsZGVyLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtIdWJDb25uZWN0aW9ufSBUaGUgY29uZmlndXJlZCB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb259LlxyXG4gICAgICovXHJcbiAgICBidWlsZCgpIHtcclxuICAgICAgICAvLyBJZiBodHRwQ29ubmVjdGlvbk9wdGlvbnMgaGFzIGEgbG9nZ2VyLCB1c2UgaXQuIE90aGVyd2lzZSwgb3ZlcnJpZGUgaXQgd2l0aCB0aGUgb25lXHJcbiAgICAgICAgLy8gcHJvdmlkZWQgdG8gY29uZmlndXJlTG9nZ2VyXHJcbiAgICAgICAgY29uc3QgaHR0cENvbm5lY3Rpb25PcHRpb25zID0gdGhpcy5odHRwQ29ubmVjdGlvbk9wdGlvbnMgfHwge307XHJcbiAgICAgICAgLy8gSWYgaXQncyAnbnVsbCcsIHRoZSB1c2VyICoqZXhwbGljaXRseSoqIGFza2VkIGZvciBudWxsLCBkb24ndCBtZXNzIHdpdGggaXQuXHJcbiAgICAgICAgaWYgKGh0dHBDb25uZWN0aW9uT3B0aW9ucy5sb2dnZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBJZiBvdXIgbG9nZ2VyIGlzIHVuZGVmaW5lZCBvciBudWxsLCB0aGF0J3MgT0ssIHRoZSBIdHRwQ29ubmVjdGlvbiBjb25zdHJ1Y3RvciB3aWxsIGhhbmRsZSBpdC5cclxuICAgICAgICAgICAgaHR0cENvbm5lY3Rpb25PcHRpb25zLmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBOb3cgY3JlYXRlIHRoZSBjb25uZWN0aW9uXHJcbiAgICAgICAgaWYgKCF0aGlzLnVybCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ0h1YkNvbm5lY3Rpb25CdWlsZGVyLndpdGhVcmwnIG1ldGhvZCBtdXN0IGJlIGNhbGxlZCBiZWZvcmUgYnVpbGRpbmcgdGhlIGNvbm5lY3Rpb24uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb25uZWN0aW9uID0gbmV3IEh0dHBDb25uZWN0aW9uKHRoaXMudXJsLCBodHRwQ29ubmVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBIdWJDb25uZWN0aW9uLmNyZWF0ZShjb25uZWN0aW9uLCB0aGlzLmxvZ2dlciB8fCBOdWxsTG9nZ2VyLmluc3RhbmNlLCB0aGlzLnByb3RvY29sIHx8IG5ldyBKc29uSHViUHJvdG9jb2woKSwgdGhpcy5yZWNvbm5lY3RQb2xpY3ksIHRoaXMuX3NlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kcywgdGhpcy5fa2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcywgdGhpcy5fc3RhdGVmdWxSZWNvbm5lY3RCdWZmZXJTaXplKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpc0xvZ2dlcihsb2dnZXIpIHtcclxuICAgIHJldHVybiBsb2dnZXIubG9nICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SHViQ29ubmVjdGlvbkJ1aWxkZXIuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCIuL0lIdWJQcm90b2NvbFwiO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgVHJhbnNmZXJGb3JtYXQgfSBmcm9tIFwiLi9JVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IE51bGxMb2dnZXIgfSBmcm9tIFwiLi9Mb2dnZXJzXCI7XHJcbmltcG9ydCB7IFRleHRNZXNzYWdlRm9ybWF0IH0gZnJvbSBcIi4vVGV4dE1lc3NhZ2VGb3JtYXRcIjtcclxuY29uc3QgSlNPTl9IVUJfUFJPVE9DT0xfTkFNRSA9IFwianNvblwiO1xyXG4vKiogSW1wbGVtZW50cyB0aGUgSlNPTiBIdWIgUHJvdG9jb2wuICovXHJcbmV4cG9ydCBjbGFzcyBKc29uSHViUHJvdG9jb2wge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLyoqIEBpbmhlcml0RG9jICovXHJcbiAgICAgICAgdGhpcy5uYW1lID0gSlNPTl9IVUJfUFJPVE9DT0xfTkFNRTtcclxuICAgICAgICAvKiogQGluaGVyaXREb2MgKi9cclxuICAgICAgICB0aGlzLnZlcnNpb24gPSAyO1xyXG4gICAgICAgIC8qKiBAaW5oZXJpdERvYyAqL1xyXG4gICAgICAgIHRoaXMudHJhbnNmZXJGb3JtYXQgPSBUcmFuc2ZlckZvcm1hdC5UZXh0O1xyXG4gICAgfVxyXG4gICAgLyoqIENyZWF0ZXMgYW4gYXJyYXkgb2Yge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJNZXNzYWdlfSBvYmplY3RzIGZyb20gdGhlIHNwZWNpZmllZCBzZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dCBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogQHBhcmFtIHtJTG9nZ2VyfSBsb2dnZXIgQSBsb2dnZXIgdGhhdCB3aWxsIGJlIHVzZWQgdG8gbG9nIG1lc3NhZ2VzIHRoYXQgb2NjdXIgZHVyaW5nIHBhcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIHBhcnNlTWVzc2FnZXMoaW5wdXQsIGxvZ2dlcikge1xyXG4gICAgICAgIC8vIFRoZSBpbnRlcmZhY2UgZG9lcyBhbGxvdyBcIkFycmF5QnVmZmVyXCIgdG8gYmUgcGFzc2VkIGluLCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdC4gU28gbGV0J3MgdGhyb3cgYSB1c2VmdWwgZXJyb3IuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGlucHV0IGZvciBKU09OIGh1YiBwcm90b2NvbC4gRXhwZWN0ZWQgYSBzdHJpbmcuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWlucHV0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxvZ2dlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsb2dnZXIgPSBOdWxsTG9nZ2VyLmluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBQYXJzZSB0aGUgbWVzc2FnZXNcclxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFRleHRNZXNzYWdlRm9ybWF0LnBhcnNlKGlucHV0KTtcclxuICAgICAgICBjb25zdCBodWJNZXNzYWdlcyA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZWRNZXNzYWdlLnR5cGUgIT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGF5bG9hZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoIChwYXJzZWRNZXNzYWdlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuSW52b2NhdGlvbjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0ludm9jYXRpb25NZXNzYWdlKHBhcnNlZE1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5TdHJlYW1JdGVtOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzU3RyZWFtSXRlbU1lc3NhZ2UocGFyc2VkTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkNvbXBsZXRpb246XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNDb21wbGV0aW9uTWVzc2FnZShwYXJzZWRNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuUGluZzpcclxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUgdmFsdWUsIG5vIG5lZWQgdG8gdmFsaWRhdGVcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ2xvc2U6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWxsIG9wdGlvbmFsIHZhbHVlcywgbm8gbmVlZCB0byB2YWxpZGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5BY2s6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNBY2tNZXNzYWdlKHBhcnNlZE1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5TZXF1ZW5jZTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1NlcXVlbmNlTWVzc2FnZShwYXJzZWRNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRnV0dXJlIHByb3RvY29sIGNoYW5nZXMgY2FuIGFkZCBtZXNzYWdlIHR5cGVzLCBvbGQgY2xpZW50cyBjYW4gaWdub3JlIHRoZW1cclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBcIlVua25vd24gbWVzc2FnZSB0eXBlICdcIiArIHBhcnNlZE1lc3NhZ2UudHlwZSArIFwiJyBpZ25vcmVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBodWJNZXNzYWdlcy5wdXNoKHBhcnNlZE1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaHViTWVzc2FnZXM7XHJcbiAgICB9XHJcbiAgICAvKiogV3JpdGVzIHRoZSBzcGVjaWZpZWQge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJNZXNzYWdlfSB0byBhIHN0cmluZyBhbmQgcmV0dXJucyBpdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0h1Yk1lc3NhZ2V9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gd3JpdGUuXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZyBjb250YWluaW5nIHRoZSBzZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtZXNzYWdlLlxyXG4gICAgICovXHJcbiAgICB3cml0ZU1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgICAgIHJldHVybiBUZXh0TWVzc2FnZUZvcm1hdC53cml0ZShKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XHJcbiAgICB9XHJcbiAgICBfaXNJbnZvY2F0aW9uTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy5fYXNzZXJ0Tm90RW1wdHlTdHJpbmcobWVzc2FnZS50YXJnZXQsIFwiSW52YWxpZCBwYXlsb2FkIGZvciBJbnZvY2F0aW9uIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgIGlmIChtZXNzYWdlLmludm9jYXRpb25JZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VydE5vdEVtcHR5U3RyaW5nKG1lc3NhZ2UuaW52b2NhdGlvbklkLCBcIkludmFsaWQgcGF5bG9hZCBmb3IgSW52b2NhdGlvbiBtZXNzYWdlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaXNTdHJlYW1JdGVtTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy5fYXNzZXJ0Tm90RW1wdHlTdHJpbmcobWVzc2FnZS5pbnZvY2F0aW9uSWQsIFwiSW52YWxpZCBwYXlsb2FkIGZvciBTdHJlYW1JdGVtIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgIGlmIChtZXNzYWdlLml0ZW0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBheWxvYWQgZm9yIFN0cmVhbUl0ZW0gbWVzc2FnZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2lzQ29tcGxldGlvbk1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgICAgIGlmIChtZXNzYWdlLnJlc3VsdCAmJiBtZXNzYWdlLmVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGF5bG9hZCBmb3IgQ29tcGxldGlvbiBtZXNzYWdlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFtZXNzYWdlLnJlc3VsdCAmJiBtZXNzYWdlLmVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VydE5vdEVtcHR5U3RyaW5nKG1lc3NhZ2UuZXJyb3IsIFwiSW52YWxpZCBwYXlsb2FkIGZvciBDb21wbGV0aW9uIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hc3NlcnROb3RFbXB0eVN0cmluZyhtZXNzYWdlLmludm9jYXRpb25JZCwgXCJJbnZhbGlkIHBheWxvYWQgZm9yIENvbXBsZXRpb24gbWVzc2FnZS5cIik7XHJcbiAgICB9XHJcbiAgICBfaXNBY2tNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2Uuc2VxdWVuY2VJZCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTZXF1ZW5jZUlkIGZvciBBY2sgbWVzc2FnZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2lzU2VxdWVuY2VNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2Uuc2VxdWVuY2VJZCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTZXF1ZW5jZUlkIGZvciBTZXF1ZW5jZSBtZXNzYWdlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfYXNzZXJ0Tm90RW1wdHlTdHJpbmcodmFsdWUsIGVycm9yTWVzc2FnZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIgfHwgdmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUpzb25IdWJQcm90b2NvbC5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IEFib3J0Q29udHJvbGxlciB9IGZyb20gXCIuL0Fib3J0Q29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBIdHRwRXJyb3IsIFRpbWVvdXRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgVHJhbnNmZXJGb3JtYXQgfSBmcm9tIFwiLi9JVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IEFyZywgZ2V0RGF0YURldGFpbCwgZ2V0VXNlckFnZW50SGVhZGVyLCBzZW5kTWVzc2FnZSB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbi8vIE5vdCBleHBvcnRlZCBmcm9tICdpbmRleCcsIHRoaXMgdHlwZSBpcyBpbnRlcm5hbC5cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBMb25nUG9sbGluZ1RyYW5zcG9ydCB7XHJcbiAgICAvLyBUaGlzIGlzIGFuIGludGVybmFsIHR5cGUsIG5vdCBleHBvcnRlZCBmcm9tICdpbmRleCcgc28gdGhpcyBpcyByZWFsbHkganVzdCBpbnRlcm5hbC5cclxuICAgIGdldCBwb2xsQWJvcnRlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9sbEFib3J0LmFib3J0ZWQ7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihodHRwQ2xpZW50LCBsb2dnZXIsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLl9odHRwQ2xpZW50ID0gaHR0cENsaWVudDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5fcG9sbEFib3J0ID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9ucmVjZWl2ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbmNsb3NlID0gbnVsbDtcclxuICAgIH1cclxuICAgIGFzeW5jIGNvbm5lY3QodXJsLCB0cmFuc2ZlckZvcm1hdCkge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHVybCwgXCJ1cmxcIik7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQodHJhbnNmZXJGb3JtYXQsIFwidHJhbnNmZXJGb3JtYXRcIik7XHJcbiAgICAgICAgQXJnLmlzSW4odHJhbnNmZXJGb3JtYXQsIFRyYW5zZmVyRm9ybWF0LCBcInRyYW5zZmVyRm9ybWF0XCIpO1xyXG4gICAgICAgIHRoaXMuX3VybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBcIihMb25nUG9sbGluZyB0cmFuc3BvcnQpIENvbm5lY3RpbmcuXCIpO1xyXG4gICAgICAgIC8vIEFsbG93IGJpbmFyeSBmb3JtYXQgb24gTm9kZSBhbmQgQnJvd3NlcnMgdGhhdCBzdXBwb3J0IGJpbmFyeSBjb250ZW50IChpbmRpY2F0ZWQgYnkgdGhlIHByZXNlbmNlIG9mIHJlc3BvbnNlVHlwZSBwcm9wZXJ0eSlcclxuICAgICAgICBpZiAodHJhbnNmZXJGb3JtYXQgPT09IFRyYW5zZmVyRm9ybWF0LkJpbmFyeSAmJlxyXG4gICAgICAgICAgICAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBuZXcgWE1MSHR0cFJlcXVlc3QoKS5yZXNwb25zZVR5cGUgIT09IFwic3RyaW5nXCIpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJpbmFyeSBwcm90b2NvbHMgb3ZlciBYbWxIdHRwUmVxdWVzdCBub3QgaW1wbGVtZW50aW5nIGFkdmFuY2VkIGZlYXR1cmVzIGFyZSBub3Qgc3VwcG9ydGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgW25hbWUsIHZhbHVlXSA9IGdldFVzZXJBZ2VudEhlYWRlcigpO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7IFtuYW1lXTogdmFsdWUsIC4uLnRoaXMuX29wdGlvbnMuaGVhZGVycyB9O1xyXG4gICAgICAgIGNvbnN0IHBvbGxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhYm9ydFNpZ25hbDogdGhpcy5fcG9sbEFib3J0LnNpZ25hbCxcclxuICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgdGltZW91dDogMTAwMDAwLFxyXG4gICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRoaXMuX29wdGlvbnMud2l0aENyZWRlbnRpYWxzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHRyYW5zZmVyRm9ybWF0ID09PSBUcmFuc2ZlckZvcm1hdC5CaW5hcnkpIHtcclxuICAgICAgICAgICAgcG9sbE9wdGlvbnMucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBNYWtlIGluaXRpYWwgbG9uZyBwb2xsaW5nIHJlcXVlc3RcclxuICAgICAgICAvLyBTZXJ2ZXIgdXNlcyBmaXJzdCBsb25nIHBvbGxpbmcgcmVxdWVzdCB0byBmaW5pc2ggaW5pdGlhbGl6aW5nIGNvbm5lY3Rpb24gYW5kIGl0IHJldHVybnMgd2l0aG91dCBkYXRhXHJcbiAgICAgICAgY29uc3QgcG9sbFVybCA9IGAke3VybH0mXz0ke0RhdGUubm93KCl9YDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgcG9sbGluZzogJHtwb2xsVXJsfS5gKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHBvbGxVcmwsIHBvbGxPcHRpb25zKTtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGAoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBVbmV4cGVjdGVkIHJlc3BvbnNlIGNvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX0uYCk7XHJcbiAgICAgICAgICAgIC8vIE1hcmsgcnVubmluZyBhcyBmYWxzZSBzbyB0aGF0IHRoZSBwb2xsIGltbWVkaWF0ZWx5IGVuZHMgYW5kIHJ1bnMgdGhlIGNsb3NlIGxvZ2ljXHJcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlRXJyb3IgPSBuZXcgSHR0cEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQgfHwgXCJcIiwgcmVzcG9uc2Uuc3RhdHVzQ29kZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZWNlaXZpbmcgPSB0aGlzLl9wb2xsKHRoaXMuX3VybCwgcG9sbE9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX3BvbGwodXJsLCBwb2xsT3B0aW9ucykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLl9ydW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvbGxVcmwgPSBgJHt1cmx9Jl89JHtEYXRlLm5vdygpfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYChMb25nUG9sbGluZyB0cmFuc3BvcnQpIHBvbGxpbmc6ICR7cG9sbFVybH0uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9odHRwQ2xpZW50LmdldChwb2xsVXJsLCBwb2xsT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBcIihMb25nUG9sbGluZyB0cmFuc3BvcnQpIFBvbGwgdGVybWluYXRlZCBieSBzZXJ2ZXIuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgVW5leHBlY3RlZCByZXNwb25zZSBjb2RlOiAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9LmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBVbmV4cGVjdGVkIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlRXJyb3IgPSBuZXcgSHR0cEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQgfHwgXCJcIiwgcmVzcG9uc2Uuc3RhdHVzQ29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByb2Nlc3MgdGhlIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgZGF0YSByZWNlaXZlZC4gJHtnZXREYXRhRGV0YWlsKHJlc3BvbnNlLmNvbnRlbnQsIHRoaXMuX29wdGlvbnMubG9nTWVzc2FnZUNvbnRlbnQpfS5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9ucmVjZWl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25yZWNlaXZlKHJlc3BvbnNlLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbm90aGVyIHdheSB0aW1lb3V0IG1hbmlmZXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBQb2xsIHRpbWVkIG91dCwgcmVpc3N1aW5nLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ydW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExvZyBidXQgZGlzcmVnYXJkIGVycm9ycyB0aGF0IG9jY3VyIGFmdGVyIHN0b3BwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGAoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBQb2xsIGVycm9yZWQgYWZ0ZXIgc2h1dGRvd246ICR7ZS5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUaW1lb3V0RXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSB0aW1lb3V0cyBhbmQgcmVpc3N1ZSB0aGUgcG9sbC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgUG9sbCB0aW1lZCBvdXQsIHJlaXNzdWluZy5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDbG9zZSB0aGUgY29ubmVjdGlvbiB3aXRoIHRoZSBlcnJvciBhcyB0aGUgcmVzdWx0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VFcnJvciA9IGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgUG9sbGluZyBjb21wbGV0ZS5cIik7XHJcbiAgICAgICAgICAgIC8vIFdlIHdpbGwgcmVhY2ggaGVyZSB3aXRoIHBvbGxBYm9ydGVkPT1mYWxzZSB3aGVuIHRoZSBzZXJ2ZXIgcmV0dXJuZWQgYSByZXNwb25zZSBjYXVzaW5nIHRoZSB0cmFuc3BvcnQgdG8gc3RvcC5cclxuICAgICAgICAgICAgLy8gSWYgcG9sbEFib3J0ZWQ9PXRydWUgdGhlbiBjbGllbnQgaW5pdGlhdGVkIHRoZSBzdG9wIGFuZCB0aGUgc3RvcCBtZXRob2Qgd2lsbCByYWlzZSB0aGUgY2xvc2UgZXZlbnQgYWZ0ZXIgREVMRVRFIGlzIHNlbnQuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wb2xsQWJvcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmFpc2VPbkNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBzZW5kKGRhdGEpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3J1bm5pbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBzZW5kIHVudGlsIHRoZSB0cmFuc3BvcnQgaXMgY29ubmVjdGVkXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbmRNZXNzYWdlKHRoaXMuX2xvZ2dlciwgXCJMb25nUG9sbGluZ1wiLCB0aGlzLl9odHRwQ2xpZW50LCB0aGlzLl91cmwsIGRhdGEsIHRoaXMuX29wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBcIihMb25nUG9sbGluZyB0cmFuc3BvcnQpIFN0b3BwaW5nIHBvbGxpbmcuXCIpO1xyXG4gICAgICAgIC8vIFRlbGwgcmVjZWl2aW5nIGxvb3AgdG8gc3RvcCwgYWJvcnQgYW55IGN1cnJlbnQgcmVxdWVzdCwgYW5kIHRoZW4gd2FpdCBmb3IgaXQgdG8gZmluaXNoXHJcbiAgICAgICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3BvbGxBYm9ydC5hYm9ydCgpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3JlY2VpdmluZztcclxuICAgICAgICAgICAgLy8gU2VuZCBERUxFVEUgdG8gY2xlYW4gdXAgbG9uZyBwb2xsaW5nIG9uIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYChMb25nUG9sbGluZyB0cmFuc3BvcnQpIHNlbmRpbmcgREVMRVRFIHJlcXVlc3QgdG8gJHt0aGlzLl91cmx9LmApO1xyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSBnZXRVc2VyQWdlbnRIZWFkZXIoKTtcclxuICAgICAgICAgICAgaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBkZWxldGVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAuLi5oZWFkZXJzLCAuLi50aGlzLl9vcHRpb25zLmhlYWRlcnMgfSxcclxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IHRoaXMuX29wdGlvbnMudGltZW91dCxcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdGhpcy5fb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBlcnJvcjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2h0dHBDbGllbnQuZGVsZXRlKHRoaXMuX3VybCwgZGVsZXRlT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzQ29kZSA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgQSA0MDQgcmVzcG9uc2Ugd2FzIHJldHVybmVkIGZyb20gc2VuZGluZyBhIERFTEVURSByZXF1ZXN0LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGAoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBFcnJvciBzZW5kaW5nIGEgREVMRVRFIHJlcXVlc3Q6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBERUxFVEUgcmVxdWVzdCBhY2NlcHRlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgU3RvcCBmaW5pc2hlZC5cIik7XHJcbiAgICAgICAgICAgIC8vIFJhaXNlIGNsb3NlIGV2ZW50IGhlcmUgaW5zdGVhZCBvZiBpbiBwb2xsaW5nXHJcbiAgICAgICAgICAgIC8vIEl0IG5lZWRzIHRvIGhhcHBlbiBhZnRlciB0aGUgREVMRVRFIHJlcXVlc3QgaXMgc2VudFxyXG4gICAgICAgICAgICB0aGlzLl9yYWlzZU9uQ2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfcmFpc2VPbkNsb3NlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uY2xvc2UpIHtcclxuICAgICAgICAgICAgbGV0IGxvZ01lc3NhZ2UgPSBcIihMb25nUG9sbGluZyB0cmFuc3BvcnQpIEZpcmluZyBvbmNsb3NlIGV2ZW50LlwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2xvc2VFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbG9nTWVzc2FnZSArPSBcIiBFcnJvcjogXCIgKyB0aGlzLl9jbG9zZUVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGxvZ01lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2xvc2UodGhpcy5fY2xvc2VFcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxvbmdQb2xsaW5nVHJhbnNwb3J0LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwiLi9JSHViUHJvdG9jb2xcIjtcclxuaW1wb3J0IHsgaXNBcnJheUJ1ZmZlciB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgTWVzc2FnZUJ1ZmZlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90b2NvbCwgY29ubmVjdGlvbiwgYnVmZmVyU2l6ZSkge1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlclNpemUgPSAxMDAwMDA7XHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl90b3RhbE1lc3NhZ2VDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5fd2FpdEZvclNlcXVlbmNlTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIE1lc3NhZ2UgSURzIHN0YXJ0IGF0IDEgYW5kIGFsd2F5cyBpbmNyZW1lbnQgYnkgMVxyXG4gICAgICAgIHRoaXMuX25leHRSZWNlaXZpbmdTZXF1ZW5jZUlkID0gMTtcclxuICAgICAgICB0aGlzLl9sYXRlc3RSZWNlaXZlZFNlcXVlbmNlSWQgPSAwO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZUNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLl9yZWNvbm5lY3RJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcHJvdG9jb2wgPSBwcm90b2NvbDtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcclxuICAgICAgICB0aGlzLl9idWZmZXJTaXplID0gYnVmZmVyU2l6ZTtcclxuICAgIH1cclxuICAgIGFzeW5jIF9zZW5kKG1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zdCBzZXJpYWxpemVkTWVzc2FnZSA9IHRoaXMuX3Byb3RvY29sLndyaXRlTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICBsZXQgYmFja3ByZXNzdXJlUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIC8vIE9ubHkgY291bnQgaW52b2NhdGlvbiBtZXNzYWdlcy4gQWNrcywgcGluZ3MsIGV0Yy4gZG9uJ3QgbmVlZCB0byBiZSByZXNlbnQgb24gcmVjb25uZWN0XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW52b2NhdGlvbk1lc3NhZ2UobWVzc2FnZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fdG90YWxNZXNzYWdlQ291bnQrKztcclxuICAgICAgICAgICAgbGV0IGJhY2twcmVzc3VyZVByb21pc2VSZXNvbHZlciA9ICgpID0+IHsgfTtcclxuICAgICAgICAgICAgbGV0IGJhY2twcmVzc3VyZVByb21pc2VSZWplY3RvciA9ICgpID0+IHsgfTtcclxuICAgICAgICAgICAgaWYgKGlzQXJyYXlCdWZmZXIoc2VyaWFsaXplZE1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXJlZEJ5dGVDb3VudCArPSBzZXJpYWxpemVkTWVzc2FnZS5ieXRlTGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyZWRCeXRlQ291bnQgKz0gc2VyaWFsaXplZE1lc3NhZ2UubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9idWZmZXJlZEJ5dGVDb3VudCA+PSB0aGlzLl9idWZmZXJTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrcHJlc3N1cmVQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2twcmVzc3VyZVByb21pc2VSZXNvbHZlciA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja3ByZXNzdXJlUHJvbWlzZVJlamVjdG9yID0gcmVqZWN0O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZXMucHVzaChuZXcgQnVmZmVyZWRJdGVtKHNlcmlhbGl6ZWRNZXNzYWdlLCB0aGlzLl90b3RhbE1lc3NhZ2VDb3VudCwgYmFja3ByZXNzdXJlUHJvbWlzZVJlc29sdmVyLCBiYWNrcHJlc3N1cmVQcm9taXNlUmVqZWN0b3IpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBzZXQgaXQgbWVhbnMgd2UgYXJlIHJlY29ubmVjdGluZyBvciByZXNlbmRpbmdcclxuICAgICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzZW5kIG9uIGEgZGlzY29ubmVjdGVkIGNvbm5lY3Rpb25cclxuICAgICAgICAgICAgLy8gQW5kIHdlIGRvbid0IHdhbnQgdG8gc2VuZCBpZiByZXNlbmQgaXMgcnVubmluZyBzaW5jZSB0aGF0IHdvdWxkIG1lYW4gc2VuZGluZ1xyXG4gICAgICAgICAgICAvLyB0aGlzIG1lc3NhZ2UgdHdpY2VcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWNvbm5lY3RJblByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9jb25uZWN0aW9uLnNlbmQoc2VyaWFsaXplZE1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzY29ubmVjdGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IGJhY2twcmVzc3VyZVByb21pc2U7XHJcbiAgICB9XHJcbiAgICBfYWNrKGFja01lc3NhZ2UpIHtcclxuICAgICAgICBsZXQgbmV3ZXN0QWNrZWRNZXNzYWdlID0gLTE7XHJcbiAgICAgICAgLy8gRmluZCBpbmRleCBvZiBuZXdlc3QgbWVzc2FnZSBiZWluZyBhY2tlZFxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9tZXNzYWdlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX21lc3NhZ2VzW2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuX2lkIDw9IGFja01lc3NhZ2Uuc2VxdWVuY2VJZCkge1xyXG4gICAgICAgICAgICAgICAgbmV3ZXN0QWNrZWRNZXNzYWdlID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheUJ1ZmZlcihlbGVtZW50Ll9tZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZUNvdW50IC09IGVsZW1lbnQuX21lc3NhZ2UuYnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZUNvdW50IC09IGVsZW1lbnQuX21lc3NhZ2UubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcmVzb2x2ZSBpdGVtcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIHNlbnQgYW5kIGFja2VkXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50Ll9yZXNvbHZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX2J1ZmZlcmVkQnl0ZUNvdW50IDwgdGhpcy5fYnVmZmVyU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVzb2x2ZSBpdGVtcyB0aGF0IG5vdyBmYWxsIHVuZGVyIHRoZSBidWZmZXIgbGltaXQgYnV0IGhhdmVuJ3QgYmVlbiBhY2tlZFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5fcmVzb2x2ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdlc3RBY2tlZE1lc3NhZ2UgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIFdlJ3JlIHJlbW92aW5nIGV2ZXJ5dGhpbmcgaW5jbHVkaW5nIHRoZSBtZXNzYWdlIHBvaW50ZWQgdG8sIHNvIGFkZCAxXHJcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VzID0gdGhpcy5fbWVzc2FnZXMuc2xpY2UobmV3ZXN0QWNrZWRNZXNzYWdlICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX3Nob3VsZFByb2Nlc3NNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAodGhpcy5fd2FpdEZvclNlcXVlbmNlTWVzc2FnZSkge1xyXG4gICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlICE9PSBNZXNzYWdlVHlwZS5TZXF1ZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2FpdEZvclNlcXVlbmNlTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTm8gc3BlY2lhbCBwcm9jZXNzaW5nIGZvciBhY2tzLCBwaW5ncywgZXRjLlxyXG4gICAgICAgIGlmICghdGhpcy5faXNJbnZvY2F0aW9uTWVzc2FnZShtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY3VycmVudElkID0gdGhpcy5fbmV4dFJlY2VpdmluZ1NlcXVlbmNlSWQ7XHJcbiAgICAgICAgdGhpcy5fbmV4dFJlY2VpdmluZ1NlcXVlbmNlSWQrKztcclxuICAgICAgICBpZiAoY3VycmVudElkIDw9IHRoaXMuX2xhdGVzdFJlY2VpdmVkU2VxdWVuY2VJZCkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudElkID09PSB0aGlzLl9sYXRlc3RSZWNlaXZlZFNlcXVlbmNlSWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNob3VsZCBvbmx5IGhpdCB0aGlzIGlmIHdlIGp1c3QgcmVjb25uZWN0ZWQgYW5kIHRoZSBzZXJ2ZXIgaXMgc2VuZGluZ1xyXG4gICAgICAgICAgICAgICAgLy8gTWVzc2FnZXMgaXQgaGFzIGJ1ZmZlcmVkLCB3aGljaCB3b3VsZCBtZWFuIGl0IGhhc24ndCBzZWVuIGFuIEFjayBmb3IgdGhlc2UgbWVzc2FnZXNcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Fja1RpbWVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSWdub3JlLCB0aGlzIGlzIGEgZHVwbGljYXRlIG1lc3NhZ2VcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9sYXRlc3RSZWNlaXZlZFNlcXVlbmNlSWQgPSBjdXJyZW50SWQ7XHJcbiAgICAgICAgLy8gT25seSBzdGFydCB0aGUgdGltZXIgZm9yIHNlbmRpbmcgYW4gQWNrIG1lc3NhZ2Ugd2hlbiB3ZSBoYXZlIGEgbWVzc2FnZSB0byBhY2suIFRoaXMgYWxzbyBjb252ZW5pZW50bHkgc29sdmVzXHJcbiAgICAgICAgLy8gdGltZXIgdGhyb3R0bGluZyBieSBub3QgaGF2aW5nIGEgcmVjdXJzaXZlIHRpbWVyLCBhbmQgYnkgc3RhcnRpbmcgdGhlIHRpbWVyIHZpYSBhIG5ldHdvcmsgY2FsbCAocmVjdilcclxuICAgICAgICB0aGlzLl9hY2tUaW1lcigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgX3Jlc2V0U2VxdWVuY2UobWVzc2FnZSkge1xyXG4gICAgICAgIGlmIChtZXNzYWdlLnNlcXVlbmNlSWQgPiB0aGlzLl9uZXh0UmVjZWl2aW5nU2VxdWVuY2VJZCkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uc3RvcChuZXcgRXJyb3IoXCJTZXF1ZW5jZSBJRCBncmVhdGVyIHRoYW4gYW1vdW50IG9mIG1lc3NhZ2VzIHdlJ3ZlIHJlY2VpdmVkLlwiKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbmV4dFJlY2VpdmluZ1NlcXVlbmNlSWQgPSBtZXNzYWdlLnNlcXVlbmNlSWQ7XHJcbiAgICB9XHJcbiAgICBfZGlzY29ubmVjdGVkKCkge1xyXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdEluUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3dhaXRGb3JTZXF1ZW5jZU1lc3NhZ2UgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX3Jlc2VuZCgpIHtcclxuICAgICAgICBjb25zdCBzZXF1ZW5jZUlkID0gdGhpcy5fbWVzc2FnZXMubGVuZ3RoICE9PSAwXHJcbiAgICAgICAgICAgID8gdGhpcy5fbWVzc2FnZXNbMF0uX2lkXHJcbiAgICAgICAgICAgIDogdGhpcy5fdG90YWxNZXNzYWdlQ291bnQgKyAxO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuX2Nvbm5lY3Rpb24uc2VuZCh0aGlzLl9wcm90b2NvbC53cml0ZU1lc3NhZ2UoeyB0eXBlOiBNZXNzYWdlVHlwZS5TZXF1ZW5jZSwgc2VxdWVuY2VJZCB9KSk7XHJcbiAgICAgICAgLy8gR2V0IGEgbG9jYWwgdmFyaWFibGUgdG8gdGhlIF9tZXNzYWdlcywganVzdCBpbiBjYXNlIG1lc3NhZ2VzIGFyZSBhY2tlZCB3aGlsZSByZXNlbmRpbmdcclxuICAgICAgICAvLyBXaGljaCB3b3VsZCBzbGljZSB0aGUgX21lc3NhZ2VzIGFycmF5ICh3aGljaCBjcmVhdGVzIGEgbmV3IGNvcHkpXHJcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcztcclxuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgbWVzc2FnZXMpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fY29ubmVjdGlvbi5zZW5kKGVsZW1lbnQuX21lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZWNvbm5lY3RJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBfZGlzcG9zZShlcnJvcikge1xyXG4gICAgICAgIGVycm9yICE9PSBudWxsICYmIGVycm9yICE9PSB2b2lkIDAgPyBlcnJvciA6IChlcnJvciA9IG5ldyBFcnJvcihcIlVuYWJsZSB0byByZWNvbm5lY3QgdG8gc2VydmVyLlwiKSk7XHJcbiAgICAgICAgLy8gVW5ibG9jayBiYWNrcHJlc3N1cmUgaWYgYW55XHJcbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRoaXMuX21lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuX3JlamVjdG9yKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaXNJbnZvY2F0aW9uTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgLy8gVGhlcmUgaXMgbm8gd2F5IHRvIGNoZWNrIGlmIHNvbWV0aGluZyBpbXBsZW1lbnRzIGFuIGludGVyZmFjZS5cclxuICAgICAgICAvLyBTbyB3ZSBpbmRpdmlkdWFsbHkgY2hlY2sgdGhlIG1lc3NhZ2VzIGluIGEgc3dpdGNoIHN0YXRlbWVudC5cclxuICAgICAgICAvLyBUbyBtYWtlIHN1cmUgd2UgZG9uJ3QgbWlzcyBhbnkgbWVzc2FnZSB0eXBlcyB3ZSByZWx5IG9uIHRoZSBjb21waWxlclxyXG4gICAgICAgIC8vIHNlZWluZyB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHZhbHVlIGFuZCBpdCB3aWxsIGRvIHRoZVxyXG4gICAgICAgIC8vIGV4aGF1c3RpdmUgY2hlY2sgZm9yIHVzIG9uIHRoZSBzd2l0Y2ggc3RhdGVtZW50LCBzaW5jZSB3ZSBkb24ndCB1c2UgJ2Nhc2UgZGVmYXVsdCdcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkludm9jYXRpb246XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuU3RyZWFtSXRlbTpcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5Db21wbGV0aW9uOlxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlN0cmVhbUludm9jYXRpb246XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ2FuY2VsSW52b2NhdGlvbjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkNsb3NlOlxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlNlcXVlbmNlOlxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlBpbmc6XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQWNrOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9hY2tUaW1lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5fYWNrVGltZXJIYW5kbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY2tUaW1lckhhbmRsZSA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3JlY29ubmVjdEluUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fY29ubmVjdGlvbi5zZW5kKHRoaXMuX3Byb3RvY29sLndyaXRlTWVzc2FnZSh7IHR5cGU6IE1lc3NhZ2VUeXBlLkFjaywgc2VxdWVuY2VJZDogdGhpcy5fbGF0ZXN0UmVjZWl2ZWRTZXF1ZW5jZUlkIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIGVycm9ycywgdGhhdCBtZWFucyB0aGUgY29ubmVjdGlvbiBpcyBjbG9zZWQgYW5kIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlIEFjayBtZXNzYWdlIGFueW1vcmUuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCB7IH1cclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9hY2tUaW1lckhhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2tUaW1lckhhbmRsZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIC8vIDEgc2Vjb25kIGRlbGF5IHNvIHdlIGRvbid0IHNwYW0gQWNrIG1lc3NhZ2VzIGlmIHRoZXJlIGFyZSBtYW55IG1lc3NhZ2VzIGJlaW5nIHJlY2VpdmVkIGF0IG9uY2UuXHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jbGFzcyBCdWZmZXJlZEl0ZW0ge1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgaWQsIHJlc29sdmVyLCByZWplY3Rvcikge1xyXG4gICAgICAgIHRoaXMuX21lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5fcmVzb2x2ZXIgPSByZXNvbHZlcjtcclxuICAgICAgICB0aGlzLl9yZWplY3RvciA9IHJlamVjdG9yO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1lc3NhZ2VCdWZmZXIuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgVHJhbnNmZXJGb3JtYXQgfSBmcm9tIFwiLi9JVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IEFyZywgZ2V0RGF0YURldGFpbCwgZ2V0VXNlckFnZW50SGVhZGVyLCBQbGF0Zm9ybSwgc2VuZE1lc3NhZ2UgfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZlclNlbnRFdmVudHNUcmFuc3BvcnQge1xyXG4gICAgY29uc3RydWN0b3IoaHR0cENsaWVudCwgYWNjZXNzVG9rZW4sIGxvZ2dlciwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuX2h0dHBDbGllbnQgPSBodHRwQ2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuID0gYWNjZXNzVG9rZW47XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMub25yZWNlaXZlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uY2xvc2UgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY29ubmVjdCh1cmwsIHRyYW5zZmVyRm9ybWF0KSB7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQodXJsLCBcInVybFwiKTtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZCh0cmFuc2ZlckZvcm1hdCwgXCJ0cmFuc2ZlckZvcm1hdFwiKTtcclxuICAgICAgICBBcmcuaXNJbih0cmFuc2ZlckZvcm1hdCwgVHJhbnNmZXJGb3JtYXQsIFwidHJhbnNmZXJGb3JtYXRcIik7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoU1NFIHRyYW5zcG9ydCkgQ29ubmVjdGluZy5cIik7XHJcbiAgICAgICAgLy8gc2V0IHVybCBiZWZvcmUgYWNjZXNzVG9rZW5GYWN0b3J5IGJlY2F1c2UgdGhpcy5fdXJsIGlzIG9ubHkgZm9yIHNlbmQgYW5kIHdlIHNldCB0aGUgYXV0aCBoZWFkZXIgaW5zdGVhZCBvZiB0aGUgcXVlcnkgc3RyaW5nIGZvciBzZW5kXHJcbiAgICAgICAgdGhpcy5fdXJsID0gdXJsO1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICB1cmwgKz0gKHVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiKSArIGBhY2Nlc3NfdG9rZW49JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5fYWNjZXNzVG9rZW4pfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBvcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRyYW5zZmVyRm9ybWF0ICE9PSBUcmFuc2ZlckZvcm1hdC5UZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiVGhlIFNlcnZlci1TZW50IEV2ZW50cyB0cmFuc3BvcnQgb25seSBzdXBwb3J0cyB0aGUgJ1RleHQnIHRyYW5zZmVyIGZvcm1hdFwiKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGV2ZW50U291cmNlO1xyXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNCcm93c2VyIHx8IFBsYXRmb3JtLmlzV2ViV29ya2VyKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudFNvdXJjZSA9IG5ldyB0aGlzLl9vcHRpb25zLkV2ZW50U291cmNlKHVybCwgeyB3aXRoQ3JlZGVudGlhbHM6IHRoaXMuX29wdGlvbnMud2l0aENyZWRlbnRpYWxzIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gTm9uLWJyb3dzZXIgcGFzc2VzIGNvb2tpZXMgdmlhIHRoZSBkaWN0aW9uYXJ5XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb29raWVzID0gdGhpcy5faHR0cENsaWVudC5nZXRDb29raWVTdHJpbmcodXJsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnMuQ29va2llID0gY29va2llcztcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSBnZXRVc2VyQWdlbnRIZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlID0gbmV3IHRoaXMuX29wdGlvbnMuRXZlbnRTb3VyY2UodXJsLCB7IHdpdGhDcmVkZW50aWFsczogdGhpcy5fb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMsIGhlYWRlcnM6IHsgLi4uaGVhZGVycywgLi4udGhpcy5fb3B0aW9ucy5oZWFkZXJzIH0gfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlLm9ubWVzc2FnZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub25yZWNlaXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKFNTRSB0cmFuc3BvcnQpIGRhdGEgcmVjZWl2ZWQuICR7Z2V0RGF0YURldGFpbChlLmRhdGEsIHRoaXMuX29wdGlvbnMubG9nTWVzc2FnZUNvbnRlbnQpfS5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25yZWNlaXZlKGUuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZShlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogbm90IHVzaW5nIGV2ZW50IG9uIHB1cnBvc2VcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlLm9uZXJyb3IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEV2ZW50U291cmNlIGRvZXNuJ3QgZ2l2ZSBhbnkgdXNlZnVsIGluZm9ybWF0aW9uIGFib3V0IHNlcnZlciBzaWRlIGNsb3Nlcy5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BlbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiRXZlbnRTb3VyY2UgZmFpbGVkIHRvIGNvbm5lY3QuIFRoZSBjb25uZWN0aW9uIGNvdWxkIG5vdCBiZSBmb3VuZCBvbiB0aGUgc2VydmVyLFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiIGVpdGhlciB0aGUgY29ubmVjdGlvbiBJRCBpcyBub3QgcHJlc2VudCBvbiB0aGUgc2VydmVyLCBvciBhIHByb3h5IGlzIHJlZnVzaW5nL2J1ZmZlcmluZyB0aGUgY29ubmVjdGlvbi5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiBJZiB5b3UgaGF2ZSBtdWx0aXBsZSBzZXJ2ZXJzIGNoZWNrIHRoYXQgc3RpY2t5IHNlc3Npb25zIGFyZSBlbmFibGVkLlwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlLm9ub3BlbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgU1NFIGNvbm5lY3RlZCB0byAke3RoaXMuX3VybH1gKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudFNvdXJjZSA9IGV2ZW50U291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzZW5kKGRhdGEpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50U291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3Qgc2VuZCB1bnRpbCB0aGUgdHJhbnNwb3J0IGlzIGNvbm5lY3RlZFwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZW5kTWVzc2FnZSh0aGlzLl9sb2dnZXIsIFwiU1NFXCIsIHRoaXMuX2h0dHBDbGllbnQsIHRoaXMuX3VybCwgZGF0YSwgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2Nsb3NlKCk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgX2Nsb3NlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRTb3VyY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRTb3VyY2UuY2xvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRTb3VyY2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25jbG9zZShlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TZXJ2ZXJTZW50RXZlbnRzVHJhbnNwb3J0LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgU3ViamVjdFN1YnNjcmlwdGlvbiB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbi8qKiBTdHJlYW0gaW1wbGVtZW50YXRpb24gdG8gc3RyZWFtIGl0ZW1zIHRvIHRoZSBzZXJ2ZXIuICovXHJcbmV4cG9ydCBjbGFzcyBTdWJqZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBuZXh0KGl0ZW0pIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG9ic2VydmVyIG9mIHRoaXMub2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXJyb3IoZXJyKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBvYnNlcnZlciBvZiB0aGlzLm9ic2VydmVycykge1xyXG4gICAgICAgICAgICBpZiAob2JzZXJ2ZXIuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21wbGV0ZSgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG9ic2VydmVyIG9mIHRoaXMub2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChvYnNlcnZlci5jb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN1YnNjcmliZShvYnNlcnZlcikge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xyXG4gICAgICAgIHJldHVybiBuZXcgU3ViamVjdFN1YnNjcmlwdGlvbih0aGlzLCBvYnNlcnZlcik7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3ViamVjdC5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbi8vIE5vdCBleHBvcnRlZCBmcm9tIGluZGV4XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgVGV4dE1lc3NhZ2VGb3JtYXQge1xyXG4gICAgc3RhdGljIHdyaXRlKG91dHB1dCkge1xyXG4gICAgICAgIHJldHVybiBgJHtvdXRwdXR9JHtUZXh0TWVzc2FnZUZvcm1hdC5SZWNvcmRTZXBhcmF0b3J9YDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwYXJzZShpbnB1dCkge1xyXG4gICAgICAgIGlmIChpbnB1dFtpbnB1dC5sZW5ndGggLSAxXSAhPT0gVGV4dE1lc3NhZ2VGb3JtYXQuUmVjb3JkU2VwYXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1lc3NhZ2UgaXMgaW5jb21wbGV0ZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gaW5wdXQuc3BsaXQoVGV4dE1lc3NhZ2VGb3JtYXQuUmVjb3JkU2VwYXJhdG9yKTtcclxuICAgICAgICBtZXNzYWdlcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gbWVzc2FnZXM7XHJcbiAgICB9XHJcbn1cclxuVGV4dE1lc3NhZ2VGb3JtYXQuUmVjb3JkU2VwYXJhdG9yQ29kZSA9IDB4MWU7XHJcblRleHRNZXNzYWdlRm9ybWF0LlJlY29yZFNlcGFyYXRvciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoVGV4dE1lc3NhZ2VGb3JtYXQuUmVjb3JkU2VwYXJhdG9yQ29kZSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRleHRNZXNzYWdlRm9ybWF0LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tIFwiLi9JTG9nZ2VyXCI7XHJcbmltcG9ydCB7IE51bGxMb2dnZXIgfSBmcm9tIFwiLi9Mb2dnZXJzXCI7XHJcbi8vIFZlcnNpb24gdG9rZW4gdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZSBwcmVwYWNrIGNvbW1hbmRcclxuLyoqIFRoZSB2ZXJzaW9uIG9mIHRoZSBTaWduYWxSIGNsaWVudC4gKi9cclxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBcIjguMC43XCI7XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgQXJnIHtcclxuICAgIHN0YXRpYyBpc1JlcXVpcmVkKHZhbCwgbmFtZSkge1xyXG4gICAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJyR7bmFtZX0nIGFyZ3VtZW50IGlzIHJlcXVpcmVkLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBpc05vdEVtcHR5KHZhbCwgbmFtZSkge1xyXG4gICAgICAgIGlmICghdmFsIHx8IHZhbC5tYXRjaCgvXlxccyokLykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgJyR7bmFtZX0nIGFyZ3VtZW50IHNob3VsZCBub3QgYmUgZW1wdHkuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzSW4odmFsLCB2YWx1ZXMsIG5hbWUpIHtcclxuICAgICAgICAvLyBUeXBlU2NyaXB0IGVudW1zIGhhdmUga2V5cyBmb3IgKipib3RoKiogdGhlIG5hbWUgYW5kIHRoZSB2YWx1ZSBvZiBlYWNoIGVudW0gbWVtYmVyIG9uIHRoZSB0eXBlIGl0c2VsZi5cclxuICAgICAgICBpZiAoISh2YWwgaW4gdmFsdWVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gJHtuYW1lfSB2YWx1ZTogJHt2YWx9LmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtIHtcclxuICAgIC8vIHJlYWN0LW5hdGl2ZSBoYXMgYSB3aW5kb3cgYnV0IG5vIGRvY3VtZW50IHNvIHdlIHNob3VsZCBjaGVjayBib3RoXHJcbiAgICBzdGF0aWMgZ2V0IGlzQnJvd3NlcigpIHtcclxuICAgICAgICByZXR1cm4gIVBsYXRmb3JtLmlzTm9kZSAmJiB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgPT09IFwib2JqZWN0XCI7XHJcbiAgICB9XHJcbiAgICAvLyBXZWJXb3JrZXJzIGRvbid0IGhhdmUgYSB3aW5kb3cgb2JqZWN0IHNvIHRoZSBpc0Jyb3dzZXIgY2hlY2sgd291bGQgZmFpbFxyXG4gICAgc3RhdGljIGdldCBpc1dlYldvcmtlcigpIHtcclxuICAgICAgICByZXR1cm4gIVBsYXRmb3JtLmlzTm9kZSAmJiB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiAmJiBcImltcG9ydFNjcmlwdHNcIiBpbiBzZWxmO1xyXG4gICAgfVxyXG4gICAgLy8gcmVhY3QtbmF0aXZlIGhhcyBhIHdpbmRvdyBidXQgbm8gZG9jdW1lbnRcclxuICAgIHN0YXRpYyBnZXQgaXNSZWFjdE5hdGl2ZSgpIHtcclxuICAgICAgICByZXR1cm4gIVBsYXRmb3JtLmlzTm9kZSAmJiB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9XHJcbiAgICAvLyBOb2RlIGFwcHMgc2hvdWxkbid0IGhhdmUgYSB3aW5kb3cgb2JqZWN0LCBidXQgV2ViV29ya2VycyBkb24ndCBlaXRoZXJcclxuICAgIC8vIHNvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGJvdGggV2ViV29ya2VyIGFuZCB3aW5kb3dcclxuICAgIHN0YXRpYyBnZXQgaXNOb2RlKCkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzLnJlbGVhc2UgJiYgcHJvY2Vzcy5yZWxlYXNlLm5hbWUgPT09IFwibm9kZVwiO1xyXG4gICAgfVxyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YURldGFpbChkYXRhLCBpbmNsdWRlQ29udGVudCkge1xyXG4gICAgbGV0IGRldGFpbCA9IFwiXCI7XHJcbiAgICBpZiAoaXNBcnJheUJ1ZmZlcihkYXRhKSkge1xyXG4gICAgICAgIGRldGFpbCA9IGBCaW5hcnkgZGF0YSBvZiBsZW5ndGggJHtkYXRhLmJ5dGVMZW5ndGh9YDtcclxuICAgICAgICBpZiAoaW5jbHVkZUNvbnRlbnQpIHtcclxuICAgICAgICAgICAgZGV0YWlsICs9IGAuIENvbnRlbnQ6ICcke2Zvcm1hdEFycmF5QnVmZmVyKGRhdGEpfSdgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgZGV0YWlsID0gYFN0cmluZyBkYXRhIG9mIGxlbmd0aCAke2RhdGEubGVuZ3RofWA7XHJcbiAgICAgICAgaWYgKGluY2x1ZGVDb250ZW50KSB7XHJcbiAgICAgICAgICAgIGRldGFpbCArPSBgLiBDb250ZW50OiAnJHtkYXRhfSdgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkZXRhaWw7XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRBcnJheUJ1ZmZlcihkYXRhKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XHJcbiAgICAvLyBVaW50OEFycmF5Lm1hcCBvbmx5IHN1cHBvcnRzIHJldHVybmluZyBhbm90aGVyIFVpbnQ4QXJyYXk/XHJcbiAgICBsZXQgc3RyID0gXCJcIjtcclxuICAgIHZpZXcuZm9yRWFjaCgobnVtKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFkID0gbnVtIDwgMTYgPyBcIjBcIiA6IFwiXCI7XHJcbiAgICAgICAgc3RyICs9IGAweCR7cGFkfSR7bnVtLnRvU3RyaW5nKDE2KX0gYDtcclxuICAgIH0pO1xyXG4gICAgLy8gVHJpbSBvZiB0cmFpbGluZyBzcGFjZS5cclxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIHN0ci5sZW5ndGggLSAxKTtcclxufVxyXG4vLyBBbHNvIGluIHNpZ25hbHItcHJvdG9jb2wtbXNncGFjay9VdGlscy50c1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XHJcbiAgICByZXR1cm4gdmFsICYmIHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgICAgICh2YWwgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fFxyXG4gICAgICAgICAgICAvLyBTb21ldGltZXMgd2UgZ2V0IGFuIEFycmF5QnVmZmVyIHRoYXQgZG9lc24ndCBzYXRpc2Z5IGluc3RhbmNlb2ZcclxuICAgICAgICAgICAgKHZhbC5jb25zdHJ1Y3RvciAmJiB2YWwuY29uc3RydWN0b3IubmFtZSA9PT0gXCJBcnJheUJ1ZmZlclwiKSk7XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZShsb2dnZXIsIHRyYW5zcG9ydE5hbWUsIGh0dHBDbGllbnQsIHVybCwgY29udGVudCwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IHt9O1xyXG4gICAgY29uc3QgW25hbWUsIHZhbHVlXSA9IGdldFVzZXJBZ2VudEhlYWRlcigpO1xyXG4gICAgaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYCgke3RyYW5zcG9ydE5hbWV9IHRyYW5zcG9ydCkgc2VuZGluZyBkYXRhLiAke2dldERhdGFEZXRhaWwoY29udGVudCwgb3B0aW9ucy5sb2dNZXNzYWdlQ29udGVudCl9LmApO1xyXG4gICAgY29uc3QgcmVzcG9uc2VUeXBlID0gaXNBcnJheUJ1ZmZlcihjb250ZW50KSA/IFwiYXJyYXlidWZmZXJcIiA6IFwidGV4dFwiO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBodHRwQ2xpZW50LnBvc3QodXJsLCB7XHJcbiAgICAgICAgY29udGVudCxcclxuICAgICAgICBoZWFkZXJzOiB7IC4uLmhlYWRlcnMsIC4uLm9wdGlvbnMuaGVhZGVycyB9LFxyXG4gICAgICAgIHJlc3BvbnNlVHlwZSxcclxuICAgICAgICB0aW1lb3V0OiBvcHRpb25zLnRpbWVvdXQsXHJcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBvcHRpb25zLndpdGhDcmVkZW50aWFscyxcclxuICAgIH0pO1xyXG4gICAgbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYCgke3RyYW5zcG9ydE5hbWV9IHRyYW5zcG9ydCkgcmVxdWVzdCBjb21wbGV0ZS4gUmVzcG9uc2Ugc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9LmApO1xyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9nZ2VyKGxvZ2dlcikge1xyXG4gICAgaWYgKGxvZ2dlciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zb2xlTG9nZ2VyKExvZ0xldmVsLkluZm9ybWF0aW9uKTtcclxuICAgIH1cclxuICAgIGlmIChsb2dnZXIgPT09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gTnVsbExvZ2dlci5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgIGlmIChsb2dnZXIubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBDb25zb2xlTG9nZ2VyKGxvZ2dlcik7XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBTdWJqZWN0U3Vic2NyaXB0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHN1YmplY3QsIG9ic2VydmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IHN1YmplY3Q7XHJcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZXIgPSBvYnNlcnZlcjtcclxuICAgIH1cclxuICAgIGRpc3Bvc2UoKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9zdWJqZWN0Lm9ic2VydmVycy5pbmRleE9mKHRoaXMuX29ic2VydmVyKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJqZWN0Lm9ic2VydmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fc3ViamVjdC5vYnNlcnZlcnMubGVuZ3RoID09PSAwICYmIHRoaXMuX3N1YmplY3QuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fc3ViamVjdC5jYW5jZWxDYWxsYmFjaygpLmNhdGNoKChfKSA9PiB7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIge1xyXG4gICAgY29uc3RydWN0b3IobWluaW11bUxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5fbWluTGV2ZWwgPSBtaW5pbXVtTG9nTGV2ZWw7XHJcbiAgICAgICAgdGhpcy5vdXQgPSBjb25zb2xlO1xyXG4gICAgfVxyXG4gICAgbG9nKGxvZ0xldmVsLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKGxvZ0xldmVsID49IHRoaXMuX21pbkxldmVsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IGBbJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9XSAke0xvZ0xldmVsW2xvZ0xldmVsXX06ICR7bWVzc2FnZX1gO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGxvZ0xldmVsKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIExvZ0xldmVsLkNyaXRpY2FsOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5FcnJvcjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dC5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5XYXJuaW5nOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0Lndhcm4obXNnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTG9nTGV2ZWwuSW5mb3JtYXRpb246XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXQuaW5mbyhtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnIG9ubHkgZ29lcyB0byBhdHRhY2hlZCBkZWJ1Z2dlcnMgaW4gTm9kZSwgc28gd2UgdXNlIGNvbnNvbGUubG9nIGZvciBUcmFjZSBhbmQgRGVidWdcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dC5sb2cobXNnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJBZ2VudEhlYWRlcigpIHtcclxuICAgIGxldCB1c2VyQWdlbnRIZWFkZXJOYW1lID0gXCJYLVNpZ25hbFItVXNlci1BZ2VudFwiO1xyXG4gICAgaWYgKFBsYXRmb3JtLmlzTm9kZSkge1xyXG4gICAgICAgIHVzZXJBZ2VudEhlYWRlck5hbWUgPSBcIlVzZXItQWdlbnRcIjtcclxuICAgIH1cclxuICAgIHJldHVybiBbdXNlckFnZW50SGVhZGVyTmFtZSwgY29uc3RydWN0VXNlckFnZW50KFZFUlNJT04sIGdldE9zTmFtZSgpLCBnZXRSdW50aW1lKCksIGdldFJ1bnRpbWVWZXJzaW9uKCkpXTtcclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0cnVjdFVzZXJBZ2VudCh2ZXJzaW9uLCBvcywgcnVudGltZSwgcnVudGltZVZlcnNpb24pIHtcclxuICAgIC8vIE1pY3Jvc29mdCBTaWduYWxSL1tWZXJzaW9uXSAoW0RldGFpbGVkIFZlcnNpb25dOyBbT3BlcmF0aW5nIFN5c3RlbV07IFtSdW50aW1lXTsgW1J1bnRpbWUgVmVyc2lvbl0pXHJcbiAgICBsZXQgdXNlckFnZW50ID0gXCJNaWNyb3NvZnQgU2lnbmFsUi9cIjtcclxuICAgIGNvbnN0IG1ham9yQW5kTWlub3IgPSB2ZXJzaW9uLnNwbGl0KFwiLlwiKTtcclxuICAgIHVzZXJBZ2VudCArPSBgJHttYWpvckFuZE1pbm9yWzBdfS4ke21ham9yQW5kTWlub3JbMV19YDtcclxuICAgIHVzZXJBZ2VudCArPSBgICgke3ZlcnNpb259OyBgO1xyXG4gICAgaWYgKG9zICYmIG9zICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdXNlckFnZW50ICs9IGAke29zfTsgYDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHVzZXJBZ2VudCArPSBcIlVua25vd24gT1M7IFwiO1xyXG4gICAgfVxyXG4gICAgdXNlckFnZW50ICs9IGAke3J1bnRpbWV9YDtcclxuICAgIGlmIChydW50aW1lVmVyc2lvbikge1xyXG4gICAgICAgIHVzZXJBZ2VudCArPSBgOyAke3J1bnRpbWVWZXJzaW9ufWA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB1c2VyQWdlbnQgKz0gXCI7IFVua25vd24gUnVudGltZSBWZXJzaW9uXCI7XHJcbiAgICB9XHJcbiAgICB1c2VyQWdlbnQgKz0gXCIpXCI7XHJcbiAgICByZXR1cm4gdXNlckFnZW50O1xyXG59XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzcGFjZWQtY29tbWVudFxyXG4vKiNfX1BVUkVfXyovIGZ1bmN0aW9uIGdldE9zTmFtZSgpIHtcclxuICAgIGlmIChQbGF0Zm9ybS5pc05vZGUpIHtcclxuICAgICAgICBzd2l0Y2ggKHByb2Nlc3MucGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgY2FzZSBcIndpbjMyXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJXaW5kb3dzIE5UXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYXJ3aW5cIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm1hY09TXCI7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsaW51eFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTGludXhcIjtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG59XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzcGFjZWQtY29tbWVudFxyXG4vKiNfX1BVUkVfXyovIGZ1bmN0aW9uIGdldFJ1bnRpbWVWZXJzaW9uKCkge1xyXG4gICAgaWYgKFBsYXRmb3JtLmlzTm9kZSkge1xyXG4gICAgICAgIHJldHVybiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbmZ1bmN0aW9uIGdldFJ1bnRpbWUoKSB7XHJcbiAgICBpZiAoUGxhdGZvcm0uaXNOb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiTm9kZUpTXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gXCJCcm93c2VyXCI7XHJcbiAgICB9XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvclN0cmluZyhlKSB7XHJcbiAgICBpZiAoZS5zdGFjaykge1xyXG4gICAgICAgIHJldHVybiBlLnN0YWNrO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZS5tZXNzYWdlKSB7XHJcbiAgICAgICAgcmV0dXJuIGUubWVzc2FnZTtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHtlfWA7XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxUaGlzKCkge1xyXG4gICAgLy8gZ2xvYmFsVGhpcyBpcyBzZW1pLW5ldyBhbmQgbm90IGF2YWlsYWJsZSBpbiBOb2RlIHVudGlsIHYxMlxyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbFRoaXM7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihcImNvdWxkIG5vdCBmaW5kIGdsb2JhbFwiKTtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1VdGlscy5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IEhlYWRlck5hbWVzIH0gZnJvbSBcIi4vSGVhZGVyTmFtZXNcIjtcclxuaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tIFwiLi9JTG9nZ2VyXCI7XHJcbmltcG9ydCB7IFRyYW5zZmVyRm9ybWF0IH0gZnJvbSBcIi4vSVRyYW5zcG9ydFwiO1xyXG5pbXBvcnQgeyBBcmcsIGdldERhdGFEZXRhaWwsIGdldFVzZXJBZ2VudEhlYWRlciwgUGxhdGZvcm0gfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIFdlYlNvY2tldFRyYW5zcG9ydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihodHRwQ2xpZW50LCBhY2Nlc3NUb2tlbkZhY3RvcnksIGxvZ2dlciwgbG9nTWVzc2FnZUNvbnRlbnQsIHdlYlNvY2tldENvbnN0cnVjdG9yLCBoZWFkZXJzKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSA9IGFjY2Vzc1Rva2VuRmFjdG9yeTtcclxuICAgICAgICB0aGlzLl9sb2dNZXNzYWdlQ29udGVudCA9IGxvZ01lc3NhZ2VDb250ZW50O1xyXG4gICAgICAgIHRoaXMuX3dlYlNvY2tldENvbnN0cnVjdG9yID0gd2ViU29ja2V0Q29uc3RydWN0b3I7XHJcbiAgICAgICAgdGhpcy5faHR0cENsaWVudCA9IGh0dHBDbGllbnQ7XHJcbiAgICAgICAgdGhpcy5vbnJlY2VpdmUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25jbG9zZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICB9XHJcbiAgICBhc3luYyBjb25uZWN0KHVybCwgdHJhbnNmZXJGb3JtYXQpIHtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZCh1cmwsIFwidXJsXCIpO1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHRyYW5zZmVyRm9ybWF0LCBcInRyYW5zZmVyRm9ybWF0XCIpO1xyXG4gICAgICAgIEFyZy5pc0luKHRyYW5zZmVyRm9ybWF0LCBUcmFuc2ZlckZvcm1hdCwgXCJ0cmFuc2ZlckZvcm1hdFwiKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBcIihXZWJTb2NrZXRzIHRyYW5zcG9ydCkgQ29ubmVjdGluZy5cIik7XHJcbiAgICAgICAgbGV0IHRva2VuO1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkpIHtcclxuICAgICAgICAgICAgdG9rZW4gPSBhd2FpdCB0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15odHRwLywgXCJ3c1wiKTtcclxuICAgICAgICAgICAgbGV0IHdlYlNvY2tldDtcclxuICAgICAgICAgICAgY29uc3QgY29va2llcyA9IHRoaXMuX2h0dHBDbGllbnQuZ2V0Q29va2llU3RyaW5nKHVybCk7XHJcbiAgICAgICAgICAgIGxldCBvcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtLmlzTm9kZSB8fCBQbGF0Zm9ybS5pc1JlYWN0TmF0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbbmFtZSwgdmFsdWVdID0gZ2V0VXNlckFnZW50SGVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzW0hlYWRlck5hbWVzLkF1dGhvcml6YXRpb25dID0gYEJlYXJlciAke3Rva2VufWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbSGVhZGVyTmFtZXMuQ29va2llXSA9IGNvb2tpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHBhc3MgaGVhZGVycyB3aGVuIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50c1xyXG4gICAgICAgICAgICAgICAgd2ViU29ja2V0ID0gbmV3IHRoaXMuX3dlYlNvY2tldENvbnN0cnVjdG9yKHVybCwgdW5kZWZpbmVkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAuLi5oZWFkZXJzLCAuLi50aGlzLl9oZWFkZXJzIH0sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAodXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCIpICsgYGFjY2Vzc190b2tlbj0ke2VuY29kZVVSSUNvbXBvbmVudCh0b2tlbil9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXdlYlNvY2tldCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2hyb21lIGlzIG5vdCBoYXBweSB3aXRoIHBhc3NpbmcgJ3VuZGVmaW5lZCcgYXMgcHJvdG9jb2xcclxuICAgICAgICAgICAgICAgIHdlYlNvY2tldCA9IG5ldyB0aGlzLl93ZWJTb2NrZXRDb25zdHJ1Y3Rvcih1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2ZlckZvcm1hdCA9PT0gVHJhbnNmZXJGb3JtYXQuQmluYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICB3ZWJTb2NrZXQuYmluYXJ5VHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3ZWJTb2NrZXQub25vcGVuID0gKF9ldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgYFdlYlNvY2tldCBjb25uZWN0ZWQgdG8gJHt1cmx9LmApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0ID0gd2ViU29ja2V0O1xyXG4gICAgICAgICAgICAgICAgb3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2ViU29ja2V0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvckV2ZW50IGlzIGEgYnJvd3NlciBvbmx5IHR5cGUgd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgdHlwZSBleGlzdHMgYmVmb3JlIHVzaW5nIGl0XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEVycm9yRXZlbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZXZlbnQgaW5zdGFuY2VvZiBFcnJvckV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBldmVudC5lcnJvcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3Igd2l0aCB0aGUgdHJhbnNwb3J0XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgKFdlYlNvY2tldHMgdHJhbnNwb3J0KSAke2Vycm9yfS5gKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2ViU29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKFdlYlNvY2tldHMgdHJhbnNwb3J0KSBkYXRhIHJlY2VpdmVkLiAke2dldERhdGFEZXRhaWwobWVzc2FnZS5kYXRhLCB0aGlzLl9sb2dNZXNzYWdlQ29udGVudCl9LmApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25yZWNlaXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbnJlY2VpdmUobWVzc2FnZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2ViU29ja2V0Lm9uY2xvc2UgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIERvbid0IGNhbGwgY2xvc2UgaGFuZGxlciBpZiBjb25uZWN0aW9uIHdhcyBuZXZlciBlc3RhYmxpc2hlZFxyXG4gICAgICAgICAgICAgICAgLy8gV2UnbGwgcmVqZWN0IHRoZSBjb25uZWN0IGNhbGwgaW5zdGVhZFxyXG4gICAgICAgICAgICAgICAgaWYgKG9wZW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JFdmVudCBpcyBhIGJyb3dzZXIgb25seSB0eXBlIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIHR5cGUgZXhpc3RzIGJlZm9yZSB1c2luZyBpdFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgRXJyb3JFdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBldmVudCBpbnN0YW5jZW9mIEVycm9yRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBldmVudC5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gXCJXZWJTb2NrZXQgZmFpbGVkIHRvIGNvbm5lY3QuIFRoZSBjb25uZWN0aW9uIGNvdWxkIG5vdCBiZSBmb3VuZCBvbiB0aGUgc2VydmVyLFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiIGVpdGhlciB0aGUgZW5kcG9pbnQgbWF5IG5vdCBiZSBhIFNpZ25hbFIgZW5kcG9pbnQsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgdGhlIGNvbm5lY3Rpb24gSUQgaXMgbm90IHByZXNlbnQgb24gdGhlIHNlcnZlciwgb3IgdGhlcmUgaXMgYSBwcm94eSBibG9ja2luZyBXZWJTb2NrZXRzLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiIElmIHlvdSBoYXZlIG11bHRpcGxlIHNlcnZlcnMgY2hlY2sgdGhhdCBzdGlja3kgc2Vzc2lvbnMgYXJlIGVuYWJsZWQuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHNlbmQoZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl93ZWJTb2NrZXQgJiYgdGhpcy5fd2ViU29ja2V0LnJlYWR5U3RhdGUgPT09IHRoaXMuX3dlYlNvY2tldENvbnN0cnVjdG9yLk9QRU4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYChXZWJTb2NrZXRzIHRyYW5zcG9ydCkgc2VuZGluZyBkYXRhLiAke2dldERhdGFEZXRhaWwoZGF0YSwgdGhpcy5fbG9nTWVzc2FnZUNvbnRlbnQpfS5gKTtcclxuICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0LnNlbmQoZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiV2ViU29ja2V0IGlzIG5vdCBpbiB0aGUgT1BFTiBzdGF0ZVwiKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3dlYlNvY2tldCkge1xyXG4gICAgICAgICAgICAvLyBNYW51YWxseSBpbnZva2Ugb25jbG9zZSBjYWxsYmFjayBpbmxpbmUgc28gd2Uga25vdyB0aGUgSHR0cENvbm5lY3Rpb24gd2FzIGNsb3NlZCBwcm9wZXJseSBiZWZvcmUgcmV0dXJuaW5nXHJcbiAgICAgICAgICAgIC8vIFRoaXMgYWxzbyBzb2x2ZXMgYW4gaXNzdWUgd2hlcmUgd2Vic29ja2V0Lm9uY2xvc2UgY291bGQgdGFrZSAxOCsgc2Vjb25kcyB0byB0cmlnZ2VyIGR1cmluZyBuZXR3b3JrIGRpc2Nvbm5lY3RzXHJcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIF9jbG9zZShldmVudCkge1xyXG4gICAgICAgIC8vIHdlYlNvY2tldCB3aWxsIGJlIG51bGwgaWYgdGhlIHRyYW5zcG9ydCBkaWQgbm90IHN0YXJ0IHN1Y2Nlc3NmdWxseVxyXG4gICAgICAgIGlmICh0aGlzLl93ZWJTb2NrZXQpIHtcclxuICAgICAgICAgICAgLy8gQ2xlYXIgd2Vic29ja2V0IGhhbmRsZXJzIGJlY2F1c2Ugd2UgYXJlIGNvbnNpZGVyaW5nIHRoZSBzb2NrZXQgY2xvc2VkIG5vd1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQub25jbG9zZSA9ICgpID0+IHsgfTtcclxuICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0Lm9ubWVzc2FnZSA9ICgpID0+IHsgfTtcclxuICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0Lm9uZXJyb3IgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYlNvY2tldC5jbG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKFdlYlNvY2tldHMgdHJhbnNwb3J0KSBzb2NrZXQgY2xvc2VkLlwiKTtcclxuICAgICAgICBpZiAodGhpcy5vbmNsb3NlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Nsb3NlRXZlbnQoZXZlbnQpICYmIChldmVudC53YXNDbGVhbiA9PT0gZmFsc2UgfHwgZXZlbnQuY29kZSAhPT0gMTAwMCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25jbG9zZShuZXcgRXJyb3IoYFdlYlNvY2tldCBjbG9zZWQgd2l0aCBzdGF0dXMgY29kZTogJHtldmVudC5jb2RlfSAoJHtldmVudC5yZWFzb24gfHwgXCJubyByZWFzb24gZ2l2ZW5cIn0pLmApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaXNDbG9zZUV2ZW50KGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50ICYmIHR5cGVvZiBldmVudC53YXNDbGVhbiA9PT0gXCJib29sZWFuXCIgJiYgdHlwZW9mIGV2ZW50LmNvZGUgPT09IFwibnVtYmVyXCI7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2ViU29ja2V0VHJhbnNwb3J0LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgQWJvcnRFcnJvciwgSHR0cEVycm9yLCBUaW1lb3V0RXJyb3IgfSBmcm9tIFwiLi9FcnJvcnNcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlc3BvbnNlIH0gZnJvbSBcIi4vSHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgaXNBcnJheUJ1ZmZlciB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbmV4cG9ydCBjbGFzcyBYaHJIdHRwQ2xpZW50IGV4dGVuZHMgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcclxuICAgIH1cclxuICAgIC8qKiBAaW5oZXJpdERvYyAqL1xyXG4gICAgc2VuZChyZXF1ZXN0KSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgdGhhdCBhYm9ydCB3YXMgbm90IHNpZ25hbGVkIGJlZm9yZSBjYWxsaW5nIHNlbmRcclxuICAgICAgICBpZiAocmVxdWVzdC5hYm9ydFNpZ25hbCAmJiByZXF1ZXN0LmFib3J0U2lnbmFsLmFib3J0ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBYm9ydEVycm9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJlcXVlc3QubWV0aG9kKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJObyBtZXRob2QgZGVmaW5lZC5cIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJlcXVlc3QudXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJObyB1cmwgZGVmaW5lZC5cIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID09PSB1bmRlZmluZWQgPyB0cnVlIDogcmVxdWVzdC53aXRoQ3JlZGVudGlhbHM7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5jb250ZW50ID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmNvbnRlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlcXVlc3QuY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRXhwbGljaXRseSBzZXR0aW5nIHRoZSBDb250ZW50LVR5cGUgaGVhZGVyIGZvciBSZWFjdCBOYXRpdmUgb24gQW5kcm9pZCBwbGF0Zm9ybS5cclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5QnVmZmVyKHJlcXVlc3QuY29udGVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnM7XHJcbiAgICAgICAgICAgIGlmIChoZWFkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChoZWFkZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5yZXNwb25zZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSByZXF1ZXN0LnJlc3BvbnNlVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5hYm9ydFNpZ25hbCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5hYm9ydFNpZ25hbC5vbmFib3J0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgQWJvcnRFcnJvcigpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlcXVlc3QudGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgeGhyLnRpbWVvdXQgPSByZXF1ZXN0LnRpbWVvdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LmFib3J0U2lnbmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5hYm9ydFNpZ25hbC5vbmFib3J0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgSHR0cFJlc3BvbnNlKHhoci5zdGF0dXMsIHhoci5zdGF0dXNUZXh0LCB4aHIucmVzcG9uc2UgfHwgeGhyLnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBIdHRwRXJyb3IoeGhyLnJlc3BvbnNlIHx8IHhoci5yZXNwb25zZVRleHQgfHwgeGhyLnN0YXR1c1RleHQsIHhoci5zdGF0dXMpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLldhcm5pbmcsIGBFcnJvciBmcm9tIEhUVFAgcmVxdWVzdC4gJHt4aHIuc3RhdHVzfTogJHt4aHIuc3RhdHVzVGV4dH0uYCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEh0dHBFcnJvcih4aHIuc3RhdHVzVGV4dCwgeGhyLnN0YXR1cykpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5XYXJuaW5nLCBgVGltZW91dCBmcm9tIEhUVFAgcmVxdWVzdC5gKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgVGltZW91dEVycm9yKCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZChyZXF1ZXN0LmNvbnRlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVhockh0dHBDbGllbnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5leHBvcnQgeyBBYm9ydEVycm9yLCBIdHRwRXJyb3IsIFRpbWVvdXRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5leHBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiLi9IdHRwQ2xpZW50XCI7XHJcbmV4cG9ydCB7IERlZmF1bHRIdHRwQ2xpZW50IH0gZnJvbSBcIi4vRGVmYXVsdEh0dHBDbGllbnRcIjtcclxuZXhwb3J0IHsgSHViQ29ubmVjdGlvbiwgSHViQ29ubmVjdGlvblN0YXRlIH0gZnJvbSBcIi4vSHViQ29ubmVjdGlvblwiO1xyXG5leHBvcnQgeyBIdWJDb25uZWN0aW9uQnVpbGRlciB9IGZyb20gXCIuL0h1YkNvbm5lY3Rpb25CdWlsZGVyXCI7XHJcbmV4cG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vSUh1YlByb3RvY29sXCI7XHJcbmV4cG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5leHBvcnQgeyBIdHRwVHJhbnNwb3J0VHlwZSwgVHJhbnNmZXJGb3JtYXQgfSBmcm9tIFwiLi9JVHJhbnNwb3J0XCI7XHJcbmV4cG9ydCB7IE51bGxMb2dnZXIgfSBmcm9tIFwiLi9Mb2dnZXJzXCI7XHJcbmV4cG9ydCB7IEpzb25IdWJQcm90b2NvbCB9IGZyb20gXCIuL0pzb25IdWJQcm90b2NvbFwiO1xyXG5leHBvcnQgeyBTdWJqZWN0IH0gZnJvbSBcIi4vU3ViamVjdFwiO1xyXG5leHBvcnQgeyBWRVJTSU9OIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9