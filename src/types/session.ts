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

import { IncomingHttpHeaders } from "http";
import { messagingApi } from "@line/bot-sdk";

/**
 * Session data stored per client connection.
 * Contains LINE credentials and lazily-cached SDK clients.
 */
export interface LineSessionData extends Record<string, unknown> {
  /** LINE channel access token from header or env var */
  channelAccessToken: string;

  /** Default destination user ID for push messages */
  destinationUserId: string | null;

  /** Raw HTTP headers for debugging/logging */
  headers: IncomingHttpHeaders;

  /** Lazily-created MessagingApiClient (cached per session) */
  _messagingApiClient?: messagingApi.MessagingApiClient;

  /** Lazily-created MessagingApiBlobClient (cached per session) */
  _messagingApiBlobClient?: messagingApi.MessagingApiBlobClient;
}
