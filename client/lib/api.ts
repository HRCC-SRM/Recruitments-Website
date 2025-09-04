// API client for HRCC Recruitment System
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  srmEmail: string;
  regNo: string;
  branch: string;
  yearOfStudy: number;
  domain: string;
  linkedinLink?: string;
  status?: 'active' | 'shortlisted' | 'rejected' | 'omitted';
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'technical_lead' | 'creative_lead' | 'corporate_lead';
  domain?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  admin: Admin;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  srmEmail: string;
  regNo: string;
  branch: string;
  yearOfStudy: number;
  domain: string;
  linkedinLink?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface DashboardStats {
  totalUsers: number;
  statusBreakdown: {
    active: number;
    shortlisted: number;
    rejected: number;
    omitted: number;
  };
  yearBreakdown: {
    year1: number;
    year2: number;
  };
  branchBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

export interface PaginatedResponse<T> {
  message: string;
  users: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TaskRequest {
  userIds: string[];
  taskTitle: string;
  taskDescription: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  emailSubject?: string;
  emailBody?: string;
}

export interface StatusUpdateRequest {
  status: 'active' | 'shortlisted' | 'rejected' | 'omitted';
  notes?: string;
}

export interface BulkStatusUpdateRequest {
  userIds: string[];
  status: 'active' | 'shortlisted' | 'rejected' | 'omitted';
  notes?: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Don't log AbortError as it's expected when cancelling requests
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', response.token);
    }
    
    return response;
  }

  async logout(): Promise<{ message: string; timestamp: string }> {
    const response = await this.request<{ message: string; timestamp: string }>('/admin/logout', {
      method: 'POST',
    });
    
    // Clear token
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    
    return response;
  }

  async getAdminProfile(): Promise<{ message: string; admin: Admin }> {
    return this.request<{ message: string; admin: Admin }>('/admin/profile');
  }

  // User registration
  async registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Technical Dashboard
  async getTechnicalUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/technical-dashboard/users${query ? `?${query}` : ''}`);
  }

  async getTechnicalStats(): Promise<{ message: string; stats: DashboardStats }> {
    return this.request<{ message: string; stats: DashboardStats }>('/technical-dashboard/stats');
  }

  async getTechnicalUser(userId: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/technical-dashboard/users/${userId}`);
  }

  async updateTechnicalUserStatus(userId: string, statusData: StatusUpdateRequest): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/technical-dashboard/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async bulkUpdateTechnicalUserStatus(statusData: BulkStatusUpdateRequest): Promise<{ message: string; updatedCount: number; matchedCount: number }> {
    return this.request<{ message: string; updatedCount: number; matchedCount: number }>('/technical-dashboard/users/bulk-status', {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async sendTaskToTechnicalUsers(taskData: TaskRequest): Promise<{ message: string; task: any; assignedUsers: User[] }> {
    return this.request<{ message: string; task: any; assignedUsers: User[] }>('/technical-dashboard/tasks/send', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getShortlistedTechnicalUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/technical-dashboard/shortlisted${query ? `?${query}` : ''}`);
  }

  async sendTaskToShortlistedTechnicalUsers(taskData: TaskRequest): Promise<{ message: string; task: any; emailDetails: any; assignedUsers: User[] }> {
    return this.request<{ message: string; task: any; emailDetails: any; assignedUsers: User[] }>('/technical-dashboard/tasks/send-to-shortlisted', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Creative Dashboard
  async getCreativeUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/creative-dashboard/users${query ? `?${query}` : ''}`);
  }

  async getCreativeStats(): Promise<{ message: string; stats: DashboardStats }> {
    return this.request<{ message: string; stats: DashboardStats }>('/creative-dashboard/stats');
  }

  async getCreativeUser(userId: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/creative-dashboard/users/${userId}`);
  }

  async updateCreativeUserStatus(userId: string, statusData: StatusUpdateRequest): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/creative-dashboard/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async bulkUpdateCreativeUserStatus(statusData: BulkStatusUpdateRequest): Promise<{ message: string; updatedCount: number; matchedCount: number }> {
    return this.request<{ message: string; updatedCount: number; matchedCount: number }>('/creative-dashboard/users/bulk-status', {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async sendTaskToCreativeUsers(taskData: TaskRequest): Promise<{ message: string; task: any; assignedUsers: User[] }> {
    return this.request<{ message: string; task: any; assignedUsers: User[] }>('/creative-dashboard/tasks/send', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getShortlistedCreativeUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/creative-dashboard/shortlisted${query ? `?${query}` : ''}`);
  }

  async sendTaskToShortlistedCreativeUsers(taskData: TaskRequest): Promise<{ message: string; task: any; emailDetails: any; assignedUsers: User[] }> {
    return this.request<{ message: string; task: any; emailDetails: any; assignedUsers: User[] }>('/creative-dashboard/tasks/send-to-shortlisted', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Corporate Dashboard
  async getCorporateUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/corporate-dashboard/users${query ? `?${query}` : ''}`);
  }

  async getCorporateStats(): Promise<{ message: string; stats: DashboardStats }> {
    return this.request<{ message: string; stats: DashboardStats }>('/corporate-dashboard/stats');
  }

  async getCorporateUser(userId: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/corporate-dashboard/users/${userId}`);
  }

  async updateCorporateUserStatus(userId: string, statusData: StatusUpdateRequest): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/corporate-dashboard/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async bulkUpdateCorporateUserStatus(statusData: BulkStatusUpdateRequest): Promise<{ message: string; updatedCount: number; matchedCount: number }> {
    return this.request<{ message: string; updatedCount: number; matchedCount: number }>('/corporate-dashboard/users/bulk-status', {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async sendTaskToCorporateUsers(taskData: TaskRequest): Promise<{ message: string; task: any; assignedUsers: User[] }> {
    return this.request<{ message: string; task: any; assignedUsers: User[] }>('/corporate-dashboard/tasks/send', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getShortlistedCorporateUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<User>>(`/corporate-dashboard/shortlisted${query ? `?${query}` : ''}`);
  }

  async sendTaskToShortlistedCorporateUsers(taskData: TaskRequest): Promise<{ message: string; task: any; emailDetails: any; assignedUsers: User[] }> {
    return this.request<{ message: string; task: any; emailDetails: any; assignedUsers: User[] }>('/corporate-dashboard/tasks/send-to-shortlisted', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient };
