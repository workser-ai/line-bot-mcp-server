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

import { messagingApi } from "@line/bot-sdk";
import { USER_AGENT } from "../version.js";
import { LineSessionData } from "../types/session.js";

/**
 * Get or create a MessagingApiClient for the given session.
 * The client is lazily created and cached in the session object.
 */
export function getMessagingApiClient(
  session: LineSessionData,
): messagingApi.MessagingApiClient {
  if (!session._messagingApiClient) {
    session._messagingApiClient = new messagingApi.MessagingApiClient({
      channelAccessToken: session.channelAccessToken,
      defaultHeaders: {
        "User-Agent": USER_AGENT,
      },
    });
  }
  return session._messagingApiClient;
}

/**
 * Get or create a MessagingApiBlobClient for the given session.
 * The client is lazily created and cached in the session object.
 */
export function getMessagingApiBlobClient(
  session: LineSessionData,
): messagingApi.MessagingApiBlobClient {
  if (!session._messagingApiBlobClient) {
    session._messagingApiBlobClient = new messagingApi.MessagingApiBlobClient({
      channelAccessToken: session.channelAccessToken,
      defaultHeaders: {
        "User-Agent": USER_AGENT,
      },
    });
  }
  return session._messagingApiBlobClient;
}
