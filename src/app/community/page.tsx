"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
    AlertCircle,
    Users,
    MessageSquare,
    Heart,
    Share2,
    Plus,
    TrendingUp,
    Trophy,
    Bell,
    Home,
    Search,
    Bookmark,
    User,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCampuses,
    fetchPosts,
    fetchUserProfile,
    fetchNotifications,
    fetchTrendingTags,
    fetchLeaderboard,
    leaveCampus,
    fetchCampusRooms,
    fetchRoomMessages,
    sendRoomMessage,
    setSelectedCampus,
    setSelectedRoom,
    handleNewMessage,
    addOnlineUser,
    removeOnlineUser,
    updateOnlineUsers
} from '@/store/features/communitySlice';
import { SOMALI_UI_TEXT, Campus, CampusRoom } from '@/types/community';
import { CommunityWebSocket } from '@/services/community';
import { getMediaUrl } from '@/lib/utils';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CommunityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        campuses,
        rooms,
        messages,
        selectedCampus,
        selectedRoom,
        userProfile,
        leaderboard,
        loading
    } = useSelector((state: RootState) => state.community);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Local state
    const [wsConnection, setWsConnection] = useState<CommunityWebSocket | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isMemberListOpen, setIsMemberListOpen] = useState(true);

    // Initialize data and WebSocket connection
    useEffect(() => {
        if (!isAuthenticated) return;

        const initializeData = async () => {
            dispatch(fetchCampuses({}));
            dispatch(fetchUserProfile());
            dispatch(fetchNotifications({ reset: true }));
            dispatch(fetchTrendingTags("week"));
            dispatch(fetchLeaderboard());

            const ws = new CommunityWebSocket();
            ws.connect((data) => {
                console.log('WebSocket message received:', data);
                if (data.type === 'new_message') {
                    dispatch(handleNewMessage(data.message));
                } else if (data.type === 'user_status') {
                    if (data.status === 'online') {
                        dispatch(addOnlineUser(data.user_id));
                    } else {
                        dispatch(removeOnlineUser(data.user_id));
                    }
                } else if (data.type === 'initial_presence') {
                    dispatch(updateOnlineUsers(data.users));
                }
            });
            setWsConnection(ws);
        };

        initializeData();

        return () => {
            if (wsConnection) wsConnection.disconnect();
        };
    }, [dispatch, isAuthenticated]);

    // Fetch rooms when campus changes
    useEffect(() => {
        if (selectedCampus?.slug) {
            dispatch(fetchCampusRooms(selectedCampus.slug));
        }
    }, [dispatch, selectedCampus]);

    // Fetch messages when room changes
    useEffect(() => {
        if (selectedRoom?.uuid) {
            dispatch(fetchRoomMessages(selectedRoom.uuid));
        }
    }, [dispatch, selectedRoom]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedRoom) return;

        try {
            await dispatch(sendRoomMessage({
                room: selectedRoom.id.toString(), // Needs to be UUID based on service, but room.id is number in types
                content: messageInput
            }));
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleCreatePost = async () => {
        try {
            await dispatch(createPost(postForm));
            setShowCreatePost(false);
            setPostForm({
                title: '',
                content: '',
                room_id: 1,
                language: 'so',
                post_type: 'discussion'
            });
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleCampusAction = async (slug: string, action: 'join' | 'leave') => {
        try {
            if (action === 'join') {
                await dispatch(joinCampus(slug));
            } else {
                await dispatch(leaveCampus(slug));
            }
        } catch (error) {
            console.error(`Failed to ${action} campus:`, error);
        }
    };

    if (loading.campuses || loading.profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Ma leha galid</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Waa inaad galato si aad u isticmaasho adeeggan</p>
                    <Button onClick={() => window.location.href = '/login'}>Tag bogga galidda</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-black overflow-hidden select-none">
            {/* 1. Global Campus Rail (72px) */}
            <div className="w-[72px] flex flex-col items-center py-3 bg-[#E3E5E8] dark:bg-[#1E1F22] z-10">
                <TooltipProvider>
                    <div className="flex flex-col items-center space-y-2 w-full">
                        {/* Home/General Icon */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all bg-white dark:bg-[#313338] p-0 flex items-center justify-center overflow-hidden group"
                                    onClick={() => dispatch(clearSelectedCampus())}
                                >
                                    <Home className="h-6 w-6 text-green-500 group-hover:text-white group-hover:bg-green-500 w-full h-full p-3 transition-colors" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Guriga</TooltipContent>
                        </Tooltip>

                        <Separator className="w-8 bg-gray-300 dark:bg-gray-700 h-[2px]" />

                        {/* Campus Icons */}
                        <ScrollArea className="flex-1 w-full px-3">
                            <div className="flex flex-col items-center space-y-2 py-2">
                                {campuses.map((campus) => (
                                    <Tooltip key={campus.id}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => dispatch(setSelectedCampus(campus))}
                                                className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all p-0 overflow-hidden relative group ${selectedCampus?.id === campus.id ? 'rounded-[16px] bg-blue-500' : 'bg-white dark:bg-[#313338]'
                                                    }`}
                                            >
                                                {selectedCampus?.id === campus.id && (
                                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
                                                )}
                                                <div className="w-full h-full flex items-center justify-center font-bold text-sm">
                                                    {campus.name_somali.substring(0, 2).toUpperCase()}
                                                </div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">{campus.name_somali}</TooltipContent>
                                    </Tooltip>
                                ))}

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all bg-white dark:bg-[#313338] hover:bg-green-500 hover:text-white p-0 text-green-500">
                                            <Plus className="h-6 w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Mid cusub ku biir</TooltipContent>
                                </Tooltip>
                            </div>
                        </ScrollArea>
                    </div>
                </TooltipProvider>
            </div>

            {/* 2. Room Sidebar (240px) */}
            <div className="w-60 flex flex-col bg-[#F2F3F5] dark:bg-[#2B2D31] select-none">
                <div className="h-12 px-4 flex items-center shadow-sm border-b border-black/10 font-bold dark:hover:bg-[#35373C] cursor-pointer transition-colors relative">
                    <span className="truncate">{selectedCampus?.name_somali || "Bulshada Garaad"}</span>
                    <MoreHorizontal className="absolute right-4 h-4 w-4" />
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-4">
                        {/* Rooms List */}
                        {selectedCampus ? (
                            <div className="space-y-0.5">
                                <div className="px-2 py-1 flex items-center justify-between group cursor-pointer">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Channels</span>
                                    <Plus className="h-3 w-3 text-gray-500 hidden group-hover:block" />
                                </div>
                                {rooms.map((room) => (
                                    <Button
                                        key={room.id}
                                        variant="ghost"
                                        className={`w-full justify-start h-8 px-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-[#D9DADD] dark:hover:bg-[#35373C] hover:text-gray-900 dark:hover:text-white group ${selectedRoom?.id === room.id ? 'bg-[#D9DADD] dark:bg-[#35373C] text-gray-900 dark:text-white' : ''
                                            }`}
                                        onClick={() => dispatch(setSelectedRoom(room))}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="truncate">{room.name_somali}</span>
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="px-3 py-2">
                                    <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-400">
                                        <TrendingUp className="h-5 w-5 mr-3" />
                                        Waxyaabaha caanka ah
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-400">
                                        <Trophy className="h-5 w-5 mr-3" />
                                        Horyaalada
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* User Status Bar */}
                <div className="h-[52px] bg-[#EBEDEF] dark:bg-[#232428] px-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer flex-1 min-w-0">
                        <div className="relative">
                            <AuthenticatedAvatar
                                src={getMediaUrl(userProfile?.user.profile_picture, 'profile_pics')}
                                alt="User"
                                size="sm"
                                fallback={userProfile?.user.first_name?.[0] || 'U'}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#EBEDEF] dark:border-[#232428]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate leading-none mb-0.5 dark:text-white">
                                {userProfile?.user.first_name || "Garaad"}
                            </p>
                            <p className="text-xs text-gray-500 truncate leading-none">
                                #{(userProfile?.user.id || 0).toString().padStart(4, '0')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:hover:text-white">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 3. Main Chat Content */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#313338] relative min-w-0">
                {/* Chat Top Bar */}
                <div className="h-12 px-4 flex items-center justify-between shadow-sm border-b border-black/10">
                    <div className="flex items-center min-w-0">
                        <MessageSquare className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="font-bold dark:text-white truncate">
                            {selectedRoom?.name_somali || (selectedCampus ? "Welcome" : "Feed")}
                        </span>
                        <Separator orientation="vertical" className="h-6 mx-4 bg-gray-300 dark:bg-gray-700" />
                        <span className="text-sm text-gray-500 truncate">{selectedRoom?.description_somali}</span>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-200" />
                        <Bookmark className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-200" />
                        <Users
                            className={`h-5 w-5 cursor-pointer hover:text-gray-200 ${isMemberListOpen ? 'text-white' : 'text-gray-400'}`}
                            onClick={() => setIsMemberListOpen(!isMemberListOpen)}
                        />
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <Input
                                placeholder="Raadi..."
                                className="h-6 w-36 bg-gray-100 dark:bg-[#1E1F22] border-none text-xs rounded"
                            />
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {messages && messages.length > 0 ? messages.map((msg) => (
                            <div key={msg.id} className="group flex space-x-4 py-1 hover:bg-black/5 dark:hover:bg-black/10 -mx-4 px-4 transition-colors">
                                <div className="flex-shrink-0 mt-1">
                                    <AuthenticatedAvatar
                                        src={getMediaUrl(msg.user.profile_picture, 'profile_pics')}
                                        alt={msg.user.first_name}
                                        fallback={msg.user.first_name?.[0] || 'U'}
                                        size="md"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold hover:underline cursor-pointer dark:text-white">
                                            {msg.user.first_name} {msg.user.last_name}
                                        </span>
                                        <span className="text-[10px] text-gray-500">maanta at 4:20 PM</span>
                                    </div>
                                    <p className="text-sm dark:text-[#DBDEE1] whitespace-pre-wrap">{msg.content}</p>

                                    {/* Message Actions (appearing on hover) */}
                                    <div className="absolute right-4 -top-4 bg-white dark:bg-[#313338] border dark:border-[#1E1F22] rounded shadow-lg hidden group-hover:flex items-center p-1 space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Heart className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><MessageSquare className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Share2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-20">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">Ma jiraan masiibooyin halkan</h3>
                                <p className="text-sm">Noqo qofka ugu horreeya ee qoraal soo dhiga!</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Message Input Box */}
                <div className="px-4 pb-6 pt-2">
                    <div className="bg-[#EBEDEF] dark:bg-[#383A40] rounded-lg px-4 py-2 flex items-center gap-4">
                        <div className="w-6 h-6 bg-gray-400/20 rounded-full flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-400/40">
                            <Plus className="h-4 w-4" />
                        </div>
                        <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={`Ku qor # ${selectedRoom?.name_somali || "channel"}`}
                            className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0 h-10 text-sm"
                        />
                        <div className="flex items-center gap-3 text-gray-400">
                            <TrendingUp className="h-5 w-5 cursor-pointer hover:text-gray-200" />
                            <Heart className="h-5 w-5 cursor-pointer hover:text-gray-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Member List Sidebar (240px) */}
            {isMemberListOpen && (
                <div className="w-60 bg-[#F2F3F5] dark:bg-[#2B2D31] flex flex-col border-l border-black/5">
                    <div className="h-12 px-4 flex items-center font-semibold text-xs text-gray-500 uppercase">
                        Xubnaha Jooga — 1
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            <div className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-1">Online</div>
                            <div className="flex items-center gap-2 p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer group">
                                <div className="relative">
                                    <AuthenticatedAvatar
                                        src={getMediaUrl(userProfile?.user.profile_picture, 'profile_pics')}
                                        size="sm"
                                        fallback={userProfile?.user.first_name?.[0] || 'U'}
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#F2F3F5] dark:border-[#2B2D31]" />
                                </div>
                                <span className="text-sm font-medium dark:text-[#DBDEE1] group-hover:text-white truncate">
                                    {userProfile?.user.first_name} {userProfile?.user.last_name}
                                </span>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}