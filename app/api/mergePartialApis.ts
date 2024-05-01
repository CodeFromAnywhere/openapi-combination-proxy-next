import { notEmpty } from "from-anywhere";
import {
  SecurityRequirement,
  Components,
  OpenAPIDocument,
  Operation,
  Info,
} from "actionschema/types";
import { fetchOpenapi, getOperations } from "openapi-util";
import { components } from "@/openapi-types";

export const mergePartialApis = async (context: {
  partialApis: components["schemas"]["PartialApi"][];
  hasAuthorization: boolean;
  info: Info;
}) => {
  const { hasAuthorization, info, partialApis } = context;
  // 1. load in all openapiUrls
  const retreivedPartialApis = await Promise.all(
    partialApis.map(async (item, index) => {
      const openapi = await fetchOpenapi(item.openapiUrl);
      const openapiId = String(index);
      if (!openapi) {
        console.log("Couldn't find openapi");
        return;
      }

      const allOperations = await getOperations(
        openapi,
        openapiId,
        item.openapiUrl,
      );

      // NB: Either get all of them or only a selection.
      const selectedOperations =
        !item.operations || item.operations.length === 0
          ? allOperations
          : allOperations.filter((x) => {
              const shouldKeepOperation = !!item.operations!.find(
                (y) => y.path === x.path && y.method === x.method,
              );
              return shouldKeepOperation;
            });

      return { openapi, selectedOperations, ...item };
    }),
  );

  // 2. go over all operations. Incase path isn't unique, suffix them and fill `proxyPath`
  const paths: { [key: string]: undefined | { [key: string]: Operation } } = {};

  // fill paths
  retreivedPartialApis
    .map((x) => x?.selectedOperations)
    .filter(notEmpty)
    .flat()
    .map((operationItem) => {
      const {
        openapiId,
        path,
        method,
        parameters,
        id,
        operation,
        resolvedRequestBodySchema,
      } = operationItem;
      /**TODO: I guess it's great to make the path as declarative yet short as possible. However, initially, it's probably fine to simply prepend the path with the `openapiId`*/
      const newPath = `${openapiId}/${path}`;
      if (!paths[newPath]) {
        paths[newPath] = {};
      }
      //@ts-ignore
      paths[newPath]![method] = { ...operation, parameters, operationId: id };
    });

  const security: SecurityRequirement[] = [
    hasAuthorization ? { apiKey: [] } : {},
  ];
  const components: Components = hasAuthorization
    ? {
        securitySchemes: { apiKey: { type: "http", description: "API Key" } },
      }
    : {};

  const openapi: OpenAPIDocument = {
    $schema:
      "https://raw.githubusercontent.com/CodeFromAnywhere/ActionSchema/main/schemas/openapi.schema.json",
    openapi: "3.0.0",
    "x-actionschema": "0.0.1",
    servers: [{ url: "https://proxy.actionschema.com/" + name }],
    info,

    security,
    components,
    paths,
  };

  return openapi;
};
