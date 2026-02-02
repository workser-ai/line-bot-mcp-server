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

import { LineSessionData } from "../types/session.js";

/**
 * Gets session from context, or creates a default session from env vars for stdio transport.
 * FastMCP does not call authenticate for stdio, so session may be undefined.
 */
export function getSessionOrDefault(
  session: LineSessionData | undefined,
): LineSessionData {
  if (session) {
    return session;
  }

  // Fallback for stdio transport - use env vars
  return {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
    destinationUserId: process.env.DESTINATION_USER_ID || null,
    headers: {},
  };
}
