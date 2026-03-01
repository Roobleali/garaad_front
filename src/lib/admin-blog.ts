import axios from "axios";
import Cookies from "js-cookie";

const API_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return base.endsWith('/api') ? base : (base.endsWith('/') ? `${base}api` : `${base}/api`);
})();

const getAuthHeader = () => {
    const token = Cookies.get("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const blogAdminApi = {
    getPosts: async () => {
        const res = await axios.get(`${API_URL}/blog/posts/`, {
            headers: getAuthHeader(),
        });
        return res.data;
    },

    getPost: async (slug: string) => {
        const res = await axios.get(`${API_URL}/blog/posts/${slug}/`, {
            headers: getAuthHeader(),
        });
        return res.data;
    },

    createPost: async (data: any) => {
        const res = await axios.post(`${API_URL}/blog/posts/`, data, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    updatePost: async (slug: string, data: any) => {
        const res = await axios.patch(`${API_URL}/blog/posts/${slug}/`, data, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    deletePost: async (slug: string) => {
        const res = await axios.delete(`${API_URL}/blog/posts/${slug}/`, {
            headers: getAuthHeader(),
        });
        return res.data;
    },

    publishPost: async (slug: string) => {
        const res = await axios.post(`${API_URL}/blog/posts/${slug}/publish/`, {}, {
            headers: getAuthHeader(),
        });
        return res.data;
    },

    getTags: async () => {
        const res = await axios.get(`${API_URL}/blog/tags/`, {
            headers: getAuthHeader(),
        });
        return res.data;
    },

    revalidate: async (slug?: string) => {
        try {
            await axios.get(`/api/revalidate?path=/blog`);
            if (slug) {
                await axios.get(`/api/revalidate?path=/blog/${slug}`);
            }
        } catch (error) {
            console.error("Revalidation failed", error);
        }
    }
};
