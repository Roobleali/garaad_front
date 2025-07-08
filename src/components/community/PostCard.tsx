"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Post, Comment } from '@/types/community';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import {
    Heart,
    MessageCircle,
    Share2,
    Eye,
    Clock,
    Pin,
    Star,
    MoreHorizontal,
    Send,
    ChevronDown,
    ChevronUp,
    Reply,
    Flag,
    Edit,
    Trash2
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string, content: string) => void;
    onShare?: (postId: string) => void;
    onEdit?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    onReport?: (postId: string) => void;
    showComments?: boolean;
    comments?: Comment[];
    currentUserId?: number;
    loading?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
    onShare,
    onEdit,
    onDelete,
    onReport,
    showComments = false,
    comments = [],
    currentUserId,
    loading = false
}) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [expandedComments, setExpandedComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

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

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || submittingComment) return;

        try {
            setSubmittingComment(true);
            await onComment(post.id, commentText);
            setCommentText('');
            setShowCommentInput(false);
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const isOwnPost = currentUserId === post.user.id;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                {/* Post Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <AuthenticatedAvatar
                                src={getMediaUrl(post.user.profile_picture, 'profile_pics')}
                                alt={post.user.username}
                                fallback={post.user.username[0].toUpperCase()}
                                size="lg"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {post.user.username}
                                    </h4>
                                    {post.is_featured && (
                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                            <Star className="h-3 w-3 mr-1" />
                                            Xuul
                                        </Badge>
                                    )}
                                    {post.is_pinned && (
                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                            <Pin className="h-3 w-3 mr-1" />
                                            Ku dheg
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                        {post.post_type_display}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatTimeAgo(post.created_at)}</span>
                                    <span>•</span>
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
                                    <span>•</span>
                                    <span className="text-xs">{post.room.name_somali}</span>
                                </div>
                            </div>
                        </div>

                        {/* Post Menu */}
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {post.title}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>

                {/* Post Media */}
                {post.image && (
                    <div className="px-6 pb-4">
                        <img
                            src={post.image}
                            alt="Post image"
                            className="w-full rounded-lg object-cover max-h-96"
                        />
                    </div>
                )}

                {post.video_url && (
                    <div className="px-6 pb-4">
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                            <div className="aspect-video">
                                <iframe
                                    src={post.video_url}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                    title="Post video"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Stats */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            {post.likes_count > 0 && (
                                <span>{post.likes_count} jeclaansho</span>
                            )}
                            {post.comments_count > 0 && (
                                <span>{post.comments_count} faallooyinka</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views_count}</span>
                        </div>
                    </div>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onLike(post.id)}
                                disabled={loading}
                                className={`${post.user_has_liked
                                    ? 'text-red-600 hover:text-red-700'
                                    : 'text-gray-500 hover:text-red-600'
                                    } transition-colors`}
                            >
                                <Heart className={`h-5 w-5 mr-2 ${post.user_has_liked ? 'fill-current' : ''}`} />
                                Jeclaansho
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCommentInput(!showCommentInput)}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <MessageCircle className="h-5 w-5 mr-2" />
                                Ka faallee
                            </Button>

                            {onShare && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onShare(post.id)}
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                >
                                    <Share2 className="h-5 w-5 mr-2" />
                                    Wadaag
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {isOwnPost && onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(post.id)}
                                    className="text-gray-500 hover:text-blue-600"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}

                            {isOwnPost && onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(post.id)}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}

                            {!isOwnPost && onReport && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onReport(post.id)}
                                    className="text-gray-500 hover:text-yellow-600"
                                >
                                    <Flag className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comment Input */}
                {showCommentInput && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="flex space-x-3">
                            <AuthenticatedAvatar
                                src={getMediaUrl(currentUserId ? post.user.profile_picture : undefined, 'profile_pics')}
                                alt={currentUserId ? post.user.username : ''}
                                fallback={currentUserId ? post.user.username[0].toUpperCase() : '?'}
                                size="lg"
                            />
                            <div className="flex-1">
                                <Textarea
                                    placeholder="Qor faallada..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setShowCommentInput(false);
                                            setCommentText('');
                                        }}
                                    >
                                        Jooji
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleCommentSubmit}
                                        disabled={!commentText.trim() || submittingComment}
                                    >
                                        {submittingComment ? (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                                        ) : (
                                            <Send className="h-4 w-4 mr-2" />
                                        )}
                                        Soo dir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                {showComments && comments.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedComments(!expandedComments)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                {expandedComments ? (
                                    <ChevronUp className="h-4 w-4 mr-2" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                )}
                                {comments.length} faallooyinka
                            </Button>
                        </div>

                        {expandedComments && (
                            <div className="px-6 pb-4 space-y-4">
                                {comments.slice(0, 3).map((comment) => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <AuthenticatedAvatar
                                            src={getMediaUrl(comment.user.profile_picture, 'profile_pics')}
                                            alt={comment.user.username}
                                            fallback={comment.user.username[0].toUpperCase()}
                                            size="sm"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-medium text-sm">{comment.user.username}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatTimeAgo(comment.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {comment.content}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                <button className="hover:text-red-600 transition-colors">
                                                    <Heart className="h-3 w-3 mr-1 inline" />
                                                    {comment.likes_count}
                                                </button>
                                                <button className="hover:text-blue-600 transition-colors">
                                                    <Reply className="h-3 w-3 mr-1 inline" />
                                                    Ku jawaab
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {comments.length > 3 && (
                                    <Button variant="ghost" size="sm" className="w-full">
                                        Arag faallooyin kale ({comments.length - 3})
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 