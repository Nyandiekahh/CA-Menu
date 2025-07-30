// CA Kenya Staff Portal - API Service
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  // Get auth token from localStorage
  static getToken() {
    return localStorage.getItem('ca_portal_token');
  }

  // Set auth token
  static setToken(token) {
    localStorage.setItem('ca_portal_token', token);
  }

  // Remove auth token
  static removeToken() {
    localStorage.removeItem('ca_portal_token');
  }

  // Get user data from localStorage
  static getUser() {
    const userData = localStorage.getItem('ca_portal_user');
    return userData ? JSON.parse(userData) : null;
  }

  // Set user data
  static setUser(user) {
    localStorage.setItem('ca_portal_user', JSON.stringify(user));
  }

  // Remove user data
  static removeUser() {
    localStorage.removeItem('ca_portal_user');
  }

  // Make API request with proper headers
  static async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  static async login(email, password) {
    const response = await this.makeRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token and user data
    this.setToken(response.token);
    this.setUser(response.user);

    return response;
  }

  static async register(userData) {
    return await this.makeRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async verifyEmail(email, otp, purpose = 'verification') {
    return await this.makeRequest('/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ email, otp, purpose }),
    });
  }

  static async forgotPassword(email) {
    return await this.makeRequest('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(email, otp, new_password, confirm_password) {
    return await this.makeRequest('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ email, otp, new_password, confirm_password }),
    });
  }

  static async logout() {
    try {
      await this.makeRequest('/auth/logout/', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      this.removeToken();
      this.removeUser();
    }
  }

  // Profile endpoints
  static async getProfile() {
    return await this.makeRequest('/profile/');
  }

  static async updateProfile(userData) {
    return await this.makeRequest('/profile/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  // Meal endpoints
  static async getMeals() {
    return await this.makeRequest('/meals/');
  }

  static async getCategories() {
    return await this.makeRequest('/categories/');
  }

  static async getMeal(id) {
    return await this.makeRequest(`/meals/${id}/`);
  }

  // Order endpoints
  static async createOrder(orderData) {
    return await this.makeRequest('/orders/create/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getOrders() {
    return await this.makeRequest('/orders/');
  }

  static async getOrder(id) {
    return await this.makeRequest(`/orders/${id}/`);
  }

  // Payment endpoints
  static async createPayment(paymentData) {
    return await this.makeRequest('/payments/create/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  static async getPayment(id) {
    return await this.makeRequest(`/payments/${id}/`);
  }

  // Dashboard endpoints
  static async getCustomerStats() {
    return await this.makeRequest('/dashboard/customer-stats/');
  }

  static async getAdminStats() {
    return await this.makeRequest('/admin/dashboard-stats/');
  }

  // Admin endpoints
  static async getAdminMeals() {
    return await this.makeRequest('/admin/meals/');
  }

  static async createMeal(mealData) {
    return await this.makeRequest('/admin/meals/', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  static async updateMeal(id, mealData) {
    return await this.makeRequest(`/admin/meals/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(mealData),
    });
  }

  static async deleteMeal(id) {
    return await this.makeRequest(`/admin/meals/${id}/`, {
      method: 'DELETE',
    });
  }

  static async getAdminOrders() {
    return await this.makeRequest('/admin/orders/');
  }

  static async updateOrder(id, orderData) {
    return await this.makeRequest(`/admin/orders/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(orderData),
    });
  }

  static async getAdminPayments() {
    return await this.makeRequest('/admin/payments/');
  }

  static async verifyPayment(id, paymentData) {
    return await this.makeRequest(`/admin/payments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData),
    });
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }

  // Check if user is admin
  static isAdmin() {
    const user = this.getUser();
    return user && user.is_kitchen_admin;
  }
}

export default ApiService;