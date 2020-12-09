export interface ApiResponse {
  statusCode?: number;
  headers?: Record<string, string>;
  content: any;
}
