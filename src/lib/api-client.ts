import type { DataSourceType } from "@prisma/client";
import type { StoredHeaders, StoredConfig } from "@/lib/data-sources";

export type ApiRequestParams = {
  type: DataSourceType;
  endpoint: string;
  method?: string | null;
  headers?: StoredHeaders | null;
  config?: StoredConfig;
};

export type ApiResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
  status?: number;
};

type MockConfig = { mock?: unknown };
type RestConfig = { body?: string | Record<string, unknown> };
type GraphQLConfig = { query?: string; variables?: Record<string, unknown> };
type GraphQLError = { message: string };

/**
 * Выполняет реальный запрос к REST API
 */
export async function fetchApiData(params: ApiRequestParams): Promise<ApiResponse> {
  const { type, endpoint, method = "GET", headers, config } = params;

  try {
    if (type === "MOCK") {
      // Для MOCK возвращаем данные из config
      const mockData = (config as MockConfig)?.mock || null;
      return {
        success: true,
        data: mockData,
      };
    }

    if (type === "REST") {
      const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
      };

      const fetchOptions: RequestInit = {
        method: method || "GET",
        headers: requestHeaders,
      };

      // Для POST/PUT/PATCH добавляем body из config
      if (method && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        const body = (config as RestConfig)?.body;
        if (body) {
          fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
        }
      }

      const response = await fetch(endpoint, fetchOptions);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        status: response.status,
      };
    }

    if (type === "GRAPHQL") {
      const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
      };

      const query = (config as GraphQLConfig)?.query || "";
      const variables = (config as GraphQLConfig)?.variables || {};

      const response = await fetch(endpoint, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const result = await response.json() as { data?: unknown; errors?: GraphQLError[] };

      // GraphQL возвращает errors даже при HTTP 200
      if (result.errors) {
        return {
          success: false,
          error: result.errors.map((e: GraphQLError) => e.message).join(", "),
        };
      }

      return {
        success: true,
        data: result.data,
        status: response.status,
      };
    }

    return {
      success: false,
      error: `Unsupported data source type: ${type}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Проверяет доступность endpoint (ping test)
 */
export async function testApiEndpoint(params: ApiRequestParams): Promise<ApiResponse> {
  try {
    const result = await fetchApiData(params);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection test failed",
    };
  }
}
