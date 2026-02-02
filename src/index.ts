#!/usr/bin/env node

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
import { IncomingHttpHeaders } from "http";
import { LINE_BOT_MCP_SERVER_VERSION } from "./version.js";

// Extract semver compatible version (remove suffix like -local)
const semverVersion = LINE_BOT_MCP_SERVER_VERSION.split(
  "-",
)[0] as `${number}.${number}.${number}`;
import { LineSessionData } from "./types/session.js";

// Import all tool registration functions
import { registerPushTextMessage } from "./tools/pushTextMessage.js";
import { registerPushFlexMessage } from "./tools/pushFlexMessage.js";
import { registerBroadcastTextMessage } from "./tools/broadcastTextMessage.js";
import { registerBroadcastFlexMessage } from "./tools/broadcastFlexMessage.js";
import { registerGetProfile } from "./tools/getProfile.js";
import { registerGetMessageQuota } from "./tools/getMessageQuota.js";
import { registerGetRichMenuList } from "./tools/getRichMenuList.js";
import { registerDeleteRichMenu } from "./tools/deleteRichMenu.js";
import { registerSetRichMenuDefault } from "./tools/setRichMenuDefault.js";
import { registerCancelRichMenuDefault } from "./tools/cancelRichMenuDefault.js";
import { registerCreateRichMenu } from "./tools/createRichMenu.js";

// Header names for dynamic configuration
const HEADER_CHANNEL_ACCESS_TOKEN = "x-line-channel-access-token";
const HEADER_DESTINATION_USER_ID = "x-line-destination-user-id";

// Determine transport mode from environment
const transportType = process.env.MCP_TRANSPORT || "stdio";

/**
 * Helper to safely get a header value (handles array headers)
 */
function getHeader(headers: IncomingHttpHeaders, name: string): string | null {
  const value = headers[name];
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

const server = new FastMCP<LineSessionData>({
  name: "line-bot",
  version: semverVersion,
  instructions:
    "LINE Bot MCP Server for interacting with LINE Official Account. " +
    "Supports sending messages, managing rich menus, and retrieving user profiles.",

  // Authentication only applies to HTTP transport
  authenticate: async (request): Promise<LineSessionData> => {
    const headers = request.headers;

    // Get token from header or fall back to env var
    const channelAccessToken =
      getHeader(headers, HEADER_CHANNEL_ACCESS_TOKEN) ||
      process.env.CHANNEL_ACCESS_TOKEN ||
      "";

    if (!channelAccessToken) {
      throw new Response(null, {
        status: 401,
        statusText:
          "Missing channel access token. Provide via X-Line-Channel-Access-Token header or CHANNEL_ACCESS_TOKEN env var.",
      });
    }

    const destinationUserId =
      getHeader(headers, HEADER_DESTINATION_USER_ID) ||
      process.env.DESTINATION_USER_ID ||
      null;

    return {
      channelAccessToken,
      destinationUserId,
      headers,
    };
  },
});

// Register all tools
registerPushTextMessage(server);
registerPushFlexMessage(server);
registerBroadcastTextMessage(server);
registerBroadcastFlexMessage(server);
registerGetProfile(server);
registerGetMessageQuota(server);
registerGetRichMenuList(server);
registerDeleteRichMenu(server);
registerSetRichMenuDefault(server);
registerCancelRichMenuDefault(server);
registerCreateRichMenu(server);

// Start server
async function main() {
  if (transportType === "stdio") {
    // For stdio, we need credentials from env vars
    if (!process.env.CHANNEL_ACCESS_TOKEN) {
      console.error(
        "Error: CHANNEL_ACCESS_TOKEN environment variable is required for stdio transport",
      );
      process.exit(1);
    }

    await server.start({
      transportType: "stdio",
    });
  } else {
    // HTTP streaming transport
    const port = parseInt(process.env.MCP_PORT || "8080", 10);

    await server.start({
      transportType: "httpStream",
      httpStream: {
        port,
        endpoint: "/mcp",
      },
    });

    console.log(`LINE Bot MCP Server running on http://localhost:${port}/mcp`);
  }
}

main().catch(error => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
