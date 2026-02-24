import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL, USER_ROLES } from "../constants";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${BACKEND_BASE_URL}users`,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        department: { type: "string" },
        imageCldPubId: { type: "string" },
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: USER_ROLES,
        required: true,
        defaultValue: "student",
        input: false,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
