import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "freedom-opensearch-backup-bucket-amplify",
  access: (allow) => ({
    "public/*": [
      // fixme: change to 'list' & 'get', and allow only me to write
      allow.guest.to(["list", "write", "get"]),
    ],
  }),
});
