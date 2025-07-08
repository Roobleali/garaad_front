"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import AuthenticatedImage from '@/components/ui/authenticated-image';

import {
    Heart,
    MessageCircle,
    Share2,
    TrendingUp,
    Hash,
    Clock,
    Send,
    BookOpen,
    Trophy,
    Search,
    Plus,
    Bell,
    MoreHorizontal,
    Eye,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCampuses,
    fetchPosts,
    fetchUserProfile,
    fetchNotifications,
    fetchTrendingTags,
    fetchLeaderboard,
    joinCampus,
    leaveCampus,
    createPost,
    togglePostLike,
    setFilters,
    handleNewPost,
    handleNewComment,
    handleLikeUpdate,
    handleNewNotification,
    clearErrors,
    markNotificationRead
} from '@/store/features/communitySlice';
import { setUser } from '@/store/features/authSlice';
import { Campus, CreatePostData, BADGE_LEVELS, SOMALI_UI_TEXT } from '@/types/community';
import { CommunityWebSocket } from '@/services/community';
import { getMediaUrl } from '@/lib/utils';
import { AuthService } from '@/services/auth';

// Define Room interface
interface Room {
    id: number;
    name_somali: string;
    campus_slug: string;
}

export default function CommunityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        campuses,
        posts,
        userProfile,
        notifications,
        trendingTags,
        leaderboard,
        loading,
        errors,
        filters,
        pagination,
        unreadNotifications
    } = useSelector((state: RootState) => state.community);

    // Local state
    const [activeTab, setActiveTab] = useState('all');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [postForm, setPostForm] = useState<Partial<CreatePostData>>({
        title: '',
        content: '',
        room_id: undefined,
        language: 'so',
        post_type: 'discussion'
    });
    const [postFormErrors, setPostFormErrors] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [wsConnection, setWsConnection] = useState<CommunityWebSocket | null>(null);

    // Initialize data and WebSocket connection
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch initial data in parallel
                await Promise.all([
                    dispatch(fetchCampuses({})),
                    dispatch(fetchPosts({ reset: true })),
                    dispatch(fetchUserProfile()),
                    dispatch(fetchNotifications({ reset: true })),
                    dispatch(fetchTrendingTags("week")),
                    dispatch(fetchLeaderboard())
                ]);

                // Initialize WebSocket connection
                const ws = new CommunityWebSocket();
                ws.connect((data) => {
                    switch (data.type) {
                        case 'new_post':
                            dispatch(handleNewPost(data.data));
                            break;
                        case 'new_comment':
                            dispatch(handleNewComment(data.data));
                            break;
                        case 'like_update':
                            dispatch(handleLikeUpdate(data.data));
                            break;
                        case 'notification':
                            dispatch(handleNewNotification(data.data));
                            break;
                    }
                });
                setWsConnection(ws);
            } catch (error) {
                console.error('Failed to initialize community data:', error);
            }
        };

        initializeData();

        // Cleanup WebSocket on unmount
        return () => {
            if (wsConnection) {
                wsConnection.disconnect();
            }
        };
    }, [dispatch, wsConnection]);

    // Handle campus selection
    const handleCampusSelect = useCallback(async (campus: Campus) => {
        dispatch(setFilters({ campus: campus.slug }));
        dispatch(fetchPosts({ filters: { campus: campus.slug }, reset: true }));

        // Fetch campus rooms
        try {
            const response = await fetch(`https://api.garaad.org/api/community/campuses/${campus.slug}/rooms/`);
            const roomsData = await response.json();
            setRooms(roomsData);
        } catch (error) {
            console.error('Failed to fetch campus rooms:', error);
        }
    }, [dispatch]);

    // Handle campus join/leave
    const handleCampusJoinLeave = useCallback(async (campus: Campus) => {
        try {
            if (campus.user_is_member) {
                await dispatch(leaveCampus(campus.slug)).unwrap();
            } else {
                await dispatch(joinCampus(campus.slug)).unwrap();
            }
        } catch (error) {
            console.error('Failed to join/leave campus:', error);
        }
    }, [dispatch]);

    // Handle post creation
    const handleCreatePost = useCallback(async () => {
        if (!postForm.title || !postForm.content || !postForm.room_id) {
            setPostFormErrors({
                title: !postForm.title ? 'Ciwaanka waa lagama maarmaan' : '',
                content: !postForm.content ? 'Qoraalka waa lagama maarmaan' : '',
                room_id: !postForm.room_id ? 'Qolka waa lagama maarmaan' : ''
            });
            return;
        }

        try {
            await dispatch(createPost(postForm as CreatePostData)).unwrap();
            setPostForm({
                title: '',
                content: '',
                room_id: undefined,
                language: 'so',
                post_type: 'discussion'
            });
            setPostFormErrors({});
            setShowCreatePost(false);
        } catch (error: unknown) {
            const errorObj = error as { type?: string; errors?: Record<string, string> };
            if (errorObj.type === 'validation') {
                setPostFormErrors(errorObj.errors || {});
            }
        }
    }, [dispatch, postForm]);

    // Handle post like
    const handlePostLike = useCallback(async (postId: string) => {
        try {
            await dispatch(togglePostLike(postId)).unwrap();
        } catch (error) {
            console.error('Failed to toggle post like:', error);
        }
    }, [dispatch]);

    // Handle search
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            dispatch(setFilters({ search: query }));
            dispatch(fetchPosts({ filters: { search: query }, reset: true }));
        } else {
            dispatch(setFilters({ search: undefined }));
            dispatch(fetchPosts({ reset: true }));
        }
    }, [dispatch]);

    // Handle load more posts
    const handleLoadMore = useCallback(() => {
        if (pagination.posts.hasMore && !loading.posts) {
            dispatch(fetchPosts({ filters }));
        }
    }, [dispatch, pagination.posts.hasMore, loading.posts, filters]);

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'hadda';
        if (diffInMinutes < 60) return `${diffInMinutes} daqiiqad kahor`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} saacadood kahor`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} maalin kahor`;

        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} bilood kahor`;
    };

    // Get badge info
    const getBadgeInfo = (level: string) => {
        return BADGE_LEVELS[level] || BADGE_LEVELS.dhalinyaro;
    };

    // Handle profile picture update
    const handleProfilePictureUpdate = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('profile_picture', file);

            const response = await fetch('https://api.garaad.org/api/auth/upload-profile-picture/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthService.getInstance().getToken()}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Profile picture update failed:', response.status, errorText);
                throw new Error(`Failed to update profile picture: ${response.status}`);
            }

            const data = await response.json();
            console.log('Profile picture update response:', data);

            // Update the user profile in Redux store
            if (data.user) {
                dispatch(setUser(data.user));
            }

            // Show success message
            console.log('Profile picture updated successfully');
        } catch (error) {
            console.error('Failed to update profile picture:', error);
        }
    };

    if (loading.campuses || loading.posts || loading.profile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="flex items-center justify-center pt-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">{SOMALI_UI_TEXT.loading}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Error Display */}
                    {(errors.campuses || errors.posts || errors.profile) && (
                        <Alert className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {errors.campuses || errors.posts || errors.profile}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => dispatch(clearErrors())}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Dib u day
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Search and Filter Bar */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Raadi posts, campuses, ama users..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={activeTab} onValueChange={setActiveTab}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Dhammaan</SelectItem>
                                        <SelectItem value="questions">Su&apos;aalaha</SelectItem>
                                        <SelectItem value="discussions">Doodaha</SelectItem>
                                        <SelectItem value="announcements">Ogeysiisyada</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => setShowCreatePost(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Samee Post
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-3">
                            {/* User Profile Summary */}
                            {userProfile && (
                                <Card className="mb-6">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <AuthenticatedAvatar
                                                src={getMediaUrl(userProfile.user.profile_picture, 'profile_pics')}
                                                alt={userProfile.user.username}
                                                fallback={userProfile.user.username[0].toUpperCase()}
                                                size="xl"
                                                editable={true}
                                                onImageUpdate={handleProfilePictureUpdate}
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {userProfile.user.username}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">
                                                        {getBadgeInfo(userProfile.badge_level).emoji}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {userProfile.badge_level_display}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Dhibcaha:</span>
                                                <span className="font-semibold">{userProfile.community_points}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Posts:</span>
                                                <span className="font-semibold">{userProfile.total_posts}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Comments:</span>
                                                <span className="font-semibold">{userProfile.total_comments}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Trending Tags */}
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center">
                                        <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                                        Tags Trending
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="space-y-2">
                                        {trendingTags.slice(0, 5).map((tag, index) => (
                                            <div key={tag.tag} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-500 mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <Hash className="h-3 w-3 text-gray-400 mr-1" />
                                                    <span className="text-sm">{tag.tag}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600">
                                                    {tag.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Popular Campuses */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                        Campusyada Caanka ah
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="space-y-3">
                                        {campuses.slice(0, 5).map((campus) => (
                                            <div key={campus.id} className="flex items-center justify-between">
                                                <div
                                                    className="flex items-center cursor-pointer flex-1"
                                                    onClick={() => handleCampusSelect(campus)}
                                                >
                                                    <span className="text-lg mr-3">{campus.icon}</span>
                                                    <div>
                                                        <h4 className="font-medium text-sm">{campus.name_somali}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {campus.member_count} xubnood
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={campus.user_is_member ? "outline" : "default"}
                                                    onClick={() => handleCampusJoinLeave(campus)}
                                                    className="text-xs"
                                                >
                                                    {campus.user_is_member ? 'Ka bax' : 'Ku biir'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-6">
                            {/* Create Post Modal/Form */}
                            {showCreatePost && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Samee Post Cusub</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Input
                                                placeholder="Ciwaanka post-ka..."
                                                value={postForm.title || ''}
                                                onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                                            />
                                            {postFormErrors.title && (
                                                <p className="text-red-500 text-sm mt-1">{postFormErrors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Textarea
                                                placeholder="Qor macluumaadka post-ka..."
                                                value={postForm.content || ''}
                                                onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                                                rows={4}
                                            />
                                            {postFormErrors.content && (
                                                <p className="text-red-500 text-sm mt-1">{postFormErrors.content}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Select
                                                    value={postForm.room_id?.toString() || ''}
                                                    onValueChange={(value) => setPostForm(prev => ({ ...prev, room_id: parseInt(value) }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Dooro qolka" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rooms.map((room) => (
                                                            <SelectItem key={room.id} value={room.id.toString()}>
                                                                {room.name_somali}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {postFormErrors.room_id && (
                                                    <p className="text-red-500 text-sm mt-1">{postFormErrors.room_id}</p>
                                                )}
                                            </div>

                                            <Select
                                                value={postForm.post_type || 'discussion'}
                                                onValueChange={(value) => setPostForm(prev => ({ ...prev, post_type: value as 'discussion' | 'question' | 'announcement' | 'poll' }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="discussion">Dood</SelectItem>
                                                    <SelectItem value="question">Su&apos;aal</SelectItem>
                                                    <SelectItem value="announcement">Ogeysiis</SelectItem>
                                                    <SelectItem value="poll">Codbixin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowCreatePost(false)}
                                            >
                                                Jooji
                                            </Button>
                                            <Button onClick={handleCreatePost}>
                                                <Send className="h-4 w-4 mr-2" />
                                                Soo Geli
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Posts Feed */}
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <Card key={post.id} className="overflow-hidden">
                                        <CardContent className="p-6">
                                            {/* Post Header */}
                                            <div className="flex items-start space-x-3 mb-4">
                                                <AuthenticatedAvatar
                                                    src={getMediaUrl(post.user.profile_picture, 'profile_pics')}
                                                    alt={post.user.username}
                                                    fallback={post.user.username[0].toUpperCase()}
                                                    size="lg"
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-semibold">{post.user.username}</h4>
                                                        {post.is_featured && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                ⭐ Xuul
                                                            </Badge>
                                                        )}
                                                        {post.is_pinned && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                📌 Ku dheg
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatTimeAgo(post.created_at)}</span>
                                                    </div>
                                                </div>

                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Post Content */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                                                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>

                                                {/* Campus/Room Info */}
                                                <div className="flex items-center space-x-4 mt-3">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                        style={{
                                                            borderColor: post.room.campus.color_code,
                                                            color: post.room.campus.color_code
                                                        }}
                                                    >
                                                        {post.room.campus.name_somali}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {post.room.name_somali}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {post.post_type_display}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Post Image */}
                                            {post.image && (
                                                <div className="mb-4">
                                                    <AuthenticatedImage
                                                        src={getMediaUrl(post.image, 'community_posts')}
                                                        alt="Post image"
                                                        width={800}
                                                        height={600}
                                                        className="w-full rounded-lg object-cover max-h-96"
                                                    />
                                                </div>
                                            )}

                                            {/* Post Actions */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center space-x-6">
                                                    <button
                                                        onClick={() => handlePostLike(post.id)}
                                                        className={`flex items-center space-x-2 text-sm ${post.user_has_liked
                                                            ? 'text-red-600'
                                                            : 'text-gray-500 hover:text-red-600'
                                                            } transition-colors`}
                                                    >
                                                        <Heart className={`h-5 w-5 ${post.user_has_liked ? 'fill-current' : ''}`} />
                                                        <span>{post.likes_count}</span>
                                                    </button>

                                                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                                        <MessageCircle className="h-5 w-5" />
                                                        <span>{post.comments_count}</span>
                                                    </button>

                                                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                                                        <Share2 className="h-5 w-5" />
                                                        <span>Wadaag</span>
                                                    </button>

                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{post.views_count}</span>
                                                    </div>
                                                </div>

                                                <Button variant="outline" size="sm">
                                                    Arag Faahfaahin
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Load More Button */}
                                {pagination.posts.hasMore && (
                                    <div className="text-center">
                                        <Button
                                            onClick={handleLoadMore}
                                            variant="outline"
                                            disabled={loading.posts}
                                        >
                                            {loading.posts ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Waa la soo raraya...
                                                </>
                                            ) : (
                                                'Soo raray posts dheeraad ah'
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {posts.length === 0 && !loading.posts && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <MessageCircle className="h-12 w-12 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Ma jiraan posts
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            Weli ma jiraan posts halkan. Noqo kan ugu horeya oo sameeya!
                                        </p>
                                        <Button onClick={() => setShowCreatePost(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Samee Post
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-3">
                            {/* Notifications */}
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center">
                                        <Bell className="h-4 w-4 mr-2 text-blue-600" />
                                        Ogeysiisyada
                                        {unreadNotifications > 0 && (
                                            <Badge className="ml-2 bg-red-500">
                                                {unreadNotifications}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {notifications.slice(0, 5).map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 rounded-lg cursor-pointer transition-colors ${notification.is_read
                                                    ? 'bg-gray-50 dark:bg-gray-700'
                                                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                                    }`}
                                                onClick={() => {
                                                    if (!notification.is_read) {
                                                        dispatch(markNotificationRead(notification.id));
                                                    }
                                                }}
                                            >
                                                <div className="flex items-start space-x-2">
                                                    <span className="text-sm">
                                                        {notification.notification_type === 'post_like' && '👍'}
                                                        {notification.notification_type === 'comment_like' && '💬'}
                                                        {notification.notification_type === 'post_comment' && '💭'}
                                                        {notification.notification_type === 'comment_reply' && '↩️'}
                                                        {notification.notification_type === 'mention' && '@'}
                                                        {notification.notification_type === 'new_campus_member' && '👋'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatTimeAgo(notification.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {notifications.length > 5 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <Button variant="outline" size="sm" className="w-full">
                                                Arag dhammaantood
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Leaderboard */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center">
                                        <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                                        Tartanka
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="space-y-3">
                                        {leaderboard.slice(0, 5).map((entry, index) => (
                                            <div key={entry.user.id} className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    {index === 0 && <span className="text-lg">🥇</span>}
                                                    {index === 1 && <span className="text-lg">🥈</span>}
                                                    {index === 2 && <span className="text-lg">🥉</span>}
                                                    {index > 2 && (
                                                        <span className="text-sm font-medium text-gray-500 w-6 text-center">
                                                            {index + 1}
                                                        </span>
                                                    )}
                                                </div>
                                                <AuthenticatedAvatar
                                                    src={getMediaUrl(entry.user.profile_picture, 'profile_pics')}
                                                    alt={entry.user.username}
                                                    fallback={entry.user.username[0].toUpperCase()}
                                                    size="sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {entry.user.username}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {entry.community_points} dhibco
                                                    </p>
                                                </div>
                                                <span className="text-sm">
                                                    {getBadgeInfo(entry.badge_level).emoji}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 