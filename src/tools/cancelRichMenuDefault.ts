/**
 * Copyright 2025 LY Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { FastMCP } from "fastmcp";
import { z } from "zod";
import { LineSessionData } from "../types/session.js";
import { getMessagingApiClient } from "../clients/lineClientFactory.js";
import { getSessionOrDefault } from "../utils/getSessionOrDefault.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../common/response.js";

export function registerCancelRichMenuDefault(
  server: FastMCP<LineSessionData>,
) {
  server.addTool({
    name: "cancel_rich_menu_default",
    description: "Cancel the default rich menu.",
    parameters: z.object({}),
    execute: async (_args, context) => {
      try {
        const session = getSessionOrDefault(context.session);
        const client = getMessagingApiClient(session);

        const response = await client.cancelDefaultRichMenu();
        return createSuccessResponse(response);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return createErrorResponse(
          `Failed to cancel default rich menu: ${message}`,
        );
      }
    },
  });
}
