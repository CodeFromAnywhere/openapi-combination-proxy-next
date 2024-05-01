import { Info } from "actionschema/types";
import { Endpoint } from "./[[...path]]/route";
import { mergePartialApis } from "./mergePartialApis";

export const makeProxyOpenapi: Endpoint<"makeProxyOpenapi"> = async ({
  proxy: { info, apiKey, name, partialApis },
}) => {
  // TODO: Connect with KV store, Check if ID is available
  const idNotAvailable = name !== "api" && false;

  if (idNotAvailable) {
    return { isSuccessful: false, message: "Id is not available" };
  }

  const openapi = await mergePartialApis({
    partialApis,
    hasAuthorization: !!apiKey,
    info: info as Info,
  });

  // TODO: Store it
  // 1. Store this openapi + the proxy + admin token into KV store under key [id]
  // 2. Store key [admin token] value [id]

  return {
    isSuccessful: true,
    message: "Done",
  };
};
