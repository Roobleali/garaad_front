"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Campus } from '@/types/community';
import { Users, MessageCircle, Star, Clock } from 'lucide-react';

interface CampusCardProps {
    campus: Campus;
    onJoinLeave: (campus: Campus) => void;
    onSelect?: (campus: Campus) => void;
    loading?: boolean;
    showDetails?: boolean;
}

export const CampusCard: React.FC<CampusCardProps> = ({
    campus,
    onJoinLeave,
    onSelect,
    loading = false,
    showDetails = true
}) => {
    const handleCardClick = () => {
        if (onSelect) {
            onSelect(campus);
        }
    };

    const handleJoinLeaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onJoinLeave(campus);
    };

    return (
        <Card
            className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${onSelect ? 'cursor-pointer hover:border-blue-300' : ''
                }`}
            onClick={handleCardClick}
            style={{
                borderTopColor: campus.color_code,
                borderTopWidth: '3px'
            }}
        >
            <CardContent className="p-6">
                {/* Campus Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${campus.color_code}20` }}
                        >
                            {campus.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {campus.name_somali}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                    style={{
                                        borderColor: campus.color_code,
                                        color: campus.color_code
                                    }}
                                >
                                    {campus.subject_display_somali}
                                </Badge>
                                {campus.user_is_member && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                        ✓ Xubin
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant={campus.user_is_member ? "outline" : "default"}
                        onClick={handleJoinLeaveClick}
                        disabled={loading}
                        className={`${campus.user_is_member
                                ? 'border-red-300 text-red-600 hover:bg-red-50'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        ) : (
                            campus.user_is_member ? 'Ka bax' : 'Ku biir'
                        )}
                    </Button>
                </div>

                {/* Campus Description */}
                {showDetails && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {campus.description_somali}
                    </p>
                )}

                {/* Campus Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{campus.member_count.toLocaleString()} xubnood</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{campus.post_count.toLocaleString()} qoraal</span>
                        </div>
                    </div>

                    {showDetails && (
                        <div className="flex items-center space-x-1 text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                                Wuxuu dhacay {new Date(campus.created_at).toLocaleDateString('so-SO')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Recent Activity Indicator */}
                {campus.post_count > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Firfircoonida dhowaan</span>
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full ${i < Math.min(5, Math.floor(campus.post_count / 10))
                                                ? 'bg-green-500'
                                                : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 