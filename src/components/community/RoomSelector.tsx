"use client";

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CampusRoom } from '@/types/community';
import { Lock, Users, MessageCircle, AlertCircle } from 'lucide-react';
import communityService from '@/services/community';

interface RoomSelectorProps {
    campusSlug: string | null;
    selectedRoomId: number | null;
    onRoomSelect: (roomId: number) => void;
    disabled?: boolean;
    placeholder?: string;
    showDescription?: boolean;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
    campusSlug,
    selectedRoomId,
    onRoomSelect,
    disabled = false,
    placeholder = "Dooro qolka",
    showDescription = false
}) => {
    const [rooms, setRooms] = useState<CampusRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            if (!campusSlug) {
                setRooms([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const roomsData = await communityService.campus.getCampusRooms(campusSlug);
                setRooms(roomsData);
            } catch (error: unknown) {
                setError('Cillad ayaa dhacday qolalka soo rarida');
                console.error('Failed to fetch rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [campusSlug]);

    const getRoomIcon = (roomType: string) => {
        switch (roomType) {
            case 'general':
                return '💬';
            case 'qa':
                return '❓';
            case 'announcements':
                return '📢';
            case 'projects':
                return '🚀';
            default:
                return '💬';
        }
    };

    const selectedRoom = rooms.find(room => room.id === selectedRoomId);

    if (!campusSlug) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Marka hore campus dooro si aad u aragto qolalka
                </AlertDescription>
            </Alert>
        );
    }

    if (error) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-2">
            <Select
                value={selectedRoomId?.toString() || ''}
                onValueChange={(value) => onRoomSelect(parseInt(value))}
                disabled={disabled || loading}
            >
                <SelectTrigger className={loading ? 'opacity-50' : ''}>
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            <span>Waa la soo raraya qolalka...</span>
                        </div>
                    ) : (
                        <SelectValue placeholder={placeholder} />
                    )}
                </SelectTrigger>
                <SelectContent>
                    {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                            <div className="flex items-center space-x-3 py-1">
                                <span className="text-lg">{getRoomIcon(room.room_type)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{room.name_somali}</span>
                                        {room.is_private && (
                                            <Lock className="h-3 w-3 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                        <div className="flex items-center space-x-1">
                                            <Users className="h-3 w-3" />
                                            <span>{room.member_count}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="h-3 w-3" />
                                            <span>{room.post_count}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs px-1 py-0">
                                            {room.room_type_display}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Selected Room Description */}
            {showDescription && selectedRoom && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div className="flex items-start space-x-3">
                        <span className="text-xl">{getRoomIcon(selectedRoom.room_type)}</span>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm">{selectedRoom.name_somali}</h4>
                                {selectedRoom.is_private && (
                                    <Badge variant="secondary" className="text-xs">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Gaar
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                    {selectedRoom.room_type_display}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {selectedRoom.description_somali}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>{selectedRoom.member_count} xubnood</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MessageCircle className="h-3 w-3" />
                                    <span>{selectedRoom.post_count} qoraal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Room Guidelines */}
            {selectedRoom && selectedRoom.room_type === 'announcements' && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                        Qolkan wuxuu u gaar yahay ogeysiisyada muhiimka ah. Kaliya maamulayaashu way qoraya kari.
                    </AlertDescription>
                </Alert>
            )}

            {selectedRoom && selectedRoom.room_type === 'qa' && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                        Qolkan wuxuu u gaar yahay su&apos;aalaha iyo jawaabaha. Fadlan su&apos;aalaha cad oo muhiim ah iska soo gali.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}; 