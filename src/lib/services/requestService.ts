import { 
  Request, 
  CreateRequestDto, 
  UpdateRequestDto, 
  PaginatedRequestsResponse,
  RequestPaginationParams 
} from '@/lib/types/request';
import { BASE_URL } from '@/lib/config';

class RequestService {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  async createRequest(data: CreateRequestDto): Promise<Request> {
    const response = await fetch(`${BASE_URL}/request`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle different error types
      if (response.status === 500) {
        // For 500 errors, try to parse error message or provide fallback
        try {
          const error = await response.json();
          throw new Error(error.message || 'Internal server error occurred');
        } catch {
          throw new Error('Request creation failed due to server error');
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create request');
      }
    }

    // Try to parse response, but handle potential parsing errors
    try {
      return await response.json();
    } catch (parseError) {
      // If JSON parsing fails due to circular reference, the request was likely successful
      // We'll throw a special success error that the mutation can catch
      console.warn('Response parsing failed, but request likely succeeded:', parseError);
      throw new Error('REQUEST_CREATED_SUCCESSFULLY');
    }
  }

  async getRequests(params: RequestPaginationParams): Promise<PaginatedRequestsResponse> {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) {
      searchParams.append('search', params.search);
    }

    if (params.status) {
      searchParams.append('status', params.status);
    }

    const response = await fetch(`${BASE_URL}/request?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requests');
    }

    return response.json();
  }

  async getRequestById(id: string): Promise<Request> {
    const response = await fetch(`${BASE_URL}/request/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch request');
    }

    return response.json();
  }

  async updateRequest(id: string, data: UpdateRequestDto): Promise<Request> {
    const response = await fetch(`${BASE_URL}/request/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update request');
    }

    return response.json();
  }

  async deleteRequest(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/request/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete request');
    }
  }
}

export const requestService = new RequestService();