const BASE_URL = "https://api.garaad.org/api/community/api/";

// Helper function for making authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const config: RequestInit = {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: response.statusText,
      data: errorData,
    };
  }

  return response.json();
};

// Campus Management APIs
export const campusService = {
  // List all campuses with optional filters
  getCampuses: async (
    filters: {
      subject_tag?: string;
      search?: string;
      page?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return apiCall(`campuses/?${params}`);
  },

  // Get campus details by slug
  getCampusDetails: async (slug: string) => {
    return apiCall(`campuses/${slug}/`);
  },

  // Join a campus
  joinCampus: async (slug: string) => {
    return apiCall(`campuses/${slug}/join/`, {
      method: "POST",
    });
  },

  // Leave a campus
  leaveCampus: async (slug: string) => {
    return apiCall(`campuses/${slug}/leave/`, {
      method: "POST",
    });
  },

  // Get campus rooms
  getCampusRooms: async (slug: string) => {
    return apiCall(`campuses/${slug}/rooms/`);
  },
};

// Post Management APIs
export const postService = {
  // List posts with filters
  getPosts: async (
    filters: {
      room?: number;
      campus?: string;
      post_type?: string;
      search?: string;
      page?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return apiCall(`posts/?${params}`);
  },

  // Create a new post
  createPost: async (postData: {
    title: string;
    content: string;
    room_id: number;
    language: "so" | "en";
    post_type: "question" | "discussion" | "announcement" | "poll";
    image?: File | null;
    video_url?: string;
  }) => {
    // Handle file upload if image is provided
    if (postData.image) {
      const formData = new FormData();
      Object.entries(postData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return apiCall("posts/", {
        method: "POST",
        headers: {
          // Remove Content-Type to let browser set it for FormData
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });
    } else {
      const { image, ...jsonData } = postData;
      return apiCall("posts/", {
        method: "POST",
        body: JSON.stringify(jsonData),
      });
    }
  },

  // Get post details
  getPostDetails: async (postId: string) => {
    return apiCall(`posts/${postId}/`);
  },

  // Like/unlike a post
  togglePostLike: async (postId: string) => {
    return apiCall(`posts/${postId}/like/`, {
      method: "POST",
    });
  },

  // Delete a post
  deletePost: async (postId: string) => {
    return apiCall(`posts/${postId}/`, {
      method: "DELETE",
    });
  },

  // Update a post
  updatePost: async (
    postId: string,
    postData: Partial<{
      title: string;
      content: string;
      language: "so" | "en";
      post_type: string;
    }>
  ) => {
    return apiCall(`posts/${postId}/`, {
      method: "PATCH",
      body: JSON.stringify(postData),
    });
  },
};

// Comment Management APIs
export const commentService = {
  // Create a comment
  createComment: async (commentData: {
    content: string;
    post_id: string;
    parent_comment_id?: string;
    language: "so" | "en";
  }) => {
    return apiCall("comments/", {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  },

  // Like/unlike a comment
  toggleCommentLike: async (commentId: string) => {
    return apiCall(`comments/${commentId}/like/`, {
      method: "POST",
    });
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    return apiCall(`comments/${commentId}/`, {
      method: "DELETE",
    });
  },

  // Update a comment
  updateComment: async (commentId: string, content: string) => {
    return apiCall(`comments/${commentId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },
};

// User Profile & Gamification APIs
export const profileService = {
  // Get current user profile
  getUserProfile: async () => {
    return apiCall("profiles/me/");
  },

  // Get leaderboard
  getLeaderboard: async (campusSlug?: string) => {
    const params = campusSlug ? `?campus=${campusSlug}` : "";
    return apiCall(`profiles/leaderboard/${params}`);
  },

  // Update profile settings
  updateProfile: async (profileData: {
    preferred_language?: "so" | "en";
    email_notifications?: boolean;
    mention_notifications?: boolean;
  }) => {
    return apiCall("profiles/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },

  // Get user's activity stats
  getUserStats: async (userId?: number) => {
    const endpoint = userId
      ? `profiles/${userId}/stats/`
      : "profiles/me/stats/";
    return apiCall(endpoint);
  },
};

// Notification APIs
export const notificationService = {
  // Get notifications
  getNotifications: async (page?: number) => {
    const params = page ? `?page=${page}` : "";
    return apiCall(`notifications/${params}`);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: number) => {
    return apiCall(`notifications/${notificationId}/mark_read/`, {
      method: "POST",
    });
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return apiCall("notifications/mark_all_read/", {
      method: "POST",
    });
  },

  // Get unread notification count
  getUnreadCount: async () => {
    return apiCall("notifications/unread_count/");
  },
};

// Search APIs
export const searchService = {
  // Global search across posts and campuses
  globalSearch: async (
    query: string,
    filters: {
      content_type?: "posts" | "campuses" | "users";
      campus?: string;
      language?: "so" | "en";
    } = {}
  ) => {
    const params = new URLSearchParams({ q: query });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    return apiCall(`search/?${params}`);
  },

  // Get trending tags
  getTrendingTags: async (period: "day" | "week" | "month" = "week") => {
    return apiCall(`search/trending/?period=${period}`);
  },
};

// Analytics APIs (for moderators/admins)
export const analyticsService = {
  // Get campus analytics
  getCampusAnalytics: async (
    campusSlug: string,
    period: "day" | "week" | "month" = "week"
  ) => {
    return apiCall(`analytics/campus/${campusSlug}/?period=${period}`);
  },

  // Get user engagement metrics
  getUserEngagement: async (period: "day" | "week" | "month" = "week") => {
    return apiCall(`analytics/engagement/?period=${period}`);
  },
};

// Error handling helper
export const handleApiError = (error: any) => {
  console.error("API Error:", error);

  switch (error.status) {
    case 400:
      return {
        type: "validation",
        message:
          "Macluumaadka waxay ku jiraan qalad. Fadlan hubi oo dib u day.",
        errors: error.data,
      };
    case 401:
      return {
        type: "auth",
        message: "Waa inaad galato si aad u isticmaasho adeeggan.",
      };
    case 403:
      return {
        type: "permission",
        message: "Ma lehe ogolaansho inaad tan samayso.",
      };
    case 404:
      return {
        type: "notFound",
        message: "Wixii aad raadinaysay lama helin.",
      };
    case 500:
      return {
        type: "server",
        message: "Cillad ayaa ka dhacday server-ka. Fadlan dib u day.",
      };
    default:
      return {
        type: "unknown",
        message: "Cillad aan la aqoon ayaa dhacday. Fadlan dib u day.",
      };
  }
};

// WebSocket connection for real-time updates (future implementation)
export class CommunityWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(onMessage: (data: any) => void) {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      this.ws = new WebSocket(
        `wss://api.garaad.org/ws/community/?token=${token}`
      );

      this.ws.onopen = () => {
        console.log("Community WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("Community WebSocket disconnected");
        this.attemptReconnect(onMessage);
      };

      this.ws.onerror = (error) => {
        console.error("Community WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect to Community WebSocket:", error);
    }
  }

  private attemptReconnect(onMessage: (data: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect(onMessage);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// Default export with all services
export default {
  campus: campusService,
  post: postService,
  comment: commentService,
  profile: profileService,
  notification: notificationService,
  search: searchService,
  analytics: analyticsService,
  handleApiError,
  CommunityWebSocket,
};
