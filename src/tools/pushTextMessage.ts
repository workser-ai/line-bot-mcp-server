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
import { messagingApi } from "@line/bot-sdk";
import { z } from "zod";
import { LineSessionData } from "../types/session.js";
import { getMessagingApiClient } from "../clients/lineClientFactory.js";
import { getSessionOrDefault } from "../utils/getSessionOrDefault.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../common/response.js";
import { NO_USER_ID_ERROR } from "../common/schema/constants.js";
import { textMessageSchema } from "../common/schema/textMessage.js";

export function registerPushTextMessage(server: FastMCP<LineSessionData>) {
  server.addTool({
    name: "push_text_message",
    description:
      "Push a simple text message to a user via LINE. Use this for sending plain text messages without formatting.",
    parameters: z.object({
      userId: z
        .string()
        .optional()
        .describe(
          "The user ID to receive a message. Defaults to the configured destination user ID.",
        ),
      message: textMessageSchema,
    }),
    execute: async (args, context) => {
      const session = getSessionOrDefault(context.session);
      const client = getMessagingApiClient(session);

      const targetUserId = args.userId || session.destinationUserId;

      if (!targetUserId) {
        return createErrorResponse(NO_USER_ID_ERROR);
      }

      try {
        const response = await client.pushMessage({
          to: targetUserId,
          messages: [args.message as unknown as messagingApi.Message],
        });
        return createSuccessResponse(response);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return createErrorResponse(`Failed to push message: ${message}`);
      }
    },
  });
}
