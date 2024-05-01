# April 2024

## Missing link 1: Combination Proxy

## Setup

- ✅ Added and altered `openapi-proxy.schema.json` to `actionschema/types`
- ✅ Setup the skelleton for the next.js app router project

## Frontend

- ✅ Make a frontend that allows easy OpenAPIProxy creation via a form.
- ✅ Serve this on `proxy.actionschema.com`
- ✅ Add `?url=xxx&url=xxx` capability so it's easy to prefil the form with openapis and a selection of available operations
- ✅ Ensure it submits to `makeProxyOpenapi` and responds with result.
- ✅ Add another button that simply responds with the `OpenapiProxy` Json instead.
- ✅ In explorer, add a link to `proxy.actionschema.com?url=xxx`

## Creation

<!-- FIX WOW FIRST, then come back here... -->

- ✅ Serve a nice homepage for every proxy.
- ✅ Serve `proxy.actionschema.com/[id]/openapi.json`
- ✅ Serve api at `proxy.actionschema.com/[id]/`
- ✅ Ensure `/makeProxyOpenapi` in `api/openapi.json` gets resolved correctly (problem in `openapi-fetch-typescript`)
- ✅ Put `openapi-util` stuff in `actionschema/util`
- ✅ Put `getOperations` there too
- 🟠 Ensure `getOperations` resolves every `component/schemas` and remote ones. Maybe it's possible to do with some redocly function (or continue from `resolveResource`)
- ✅ Implement `makeProxyOpenapi(proxy)` which turns an `OpenapiProxy` into an `openapi.json`
- Debug `mergePartialApis` until it provides an openapi back
- Deploy this. Continue with the combination proxy later
