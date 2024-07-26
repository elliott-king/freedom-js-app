// https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/#step-4b-create-resolver-and-attach-to-query
import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using a bounding box
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */

export const request = (ctx) => {
  return {
    operation: "GET",
    path: "/event/_search",
    params: {
      body: {
        from: 0,
        size: 50,
        // Exact match using full-text query
        // https://opensearch.org/docs/latest/query-dsl/full-text/index/
        // match: {
        //   ["name.keyword"]: "Summer Reading: Coloring Club",
        // },
        // },
        query: {
          bool: {
            must: {
              match_all: {},
            },
            // Example:
            // { "lat" : { "N" : "40.602352" }, "lon" : { "N" : "-73.75350209999999" } }
            filter: {
              geo_bounding_box: {
                location: {
                  top: ctx.args.top,
                  left: ctx.args.left,
                  bottom: ctx.args.bottom,
                  right: ctx.args.right,
                  // Example:
                  // top: 42,
                  // left: -75,
                  // bottom: 40,
                  // right: -72,
                },
              },
            },
          },
        },
      },
    },
  };
};

// TODO: query to get a single doc: https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-elasticsearch-resolvers-js.html#retrieving-a-single-document-js

/**
 * Returns the fetched items
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */

export const response = (ctx) => {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.hits.hits.map((hit) => hit._source);
};
