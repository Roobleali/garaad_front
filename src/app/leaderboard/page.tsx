'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface LeaderboardItem {
    id: string;
    username: string;
    points: number;
    time_period: string;
    last_updated: string;
    user_info: {
        email: string;
        first_name: string;
        last_name: string;
        stats: {
            total_points: number;
            completed_lessons: number;
            enrolled_courses: number;
            current_streak: number;
            badges_count: number;
        };
        badges: Array<{
            id: string;
            reward_name: string;
            value: number;
            awarded_at: string;
        }>;
    };
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('/api/lms/leaderboard/');
                const data = await response.json();
                setLeaderboard(data.results);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

            <div className="grid gap-6">
                {leaderboard.map((item, index) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl font-bold text-gray-400 w-8 text-center">
                                        {index + 1}
                                    </div>
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`} />
                                        <AvatarFallback>{item.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{item.username}</CardTitle>
                                        <p className="text-sm text-gray-500">
                                            {item.user_info.first_name} {item.user_info.last_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{item.points}</div>
                                    <p className="text-sm text-gray-500">points</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-semibold">{item.user_info.stats.completed_lessons}</div>
                                    <p className="text-sm text-gray-500">Lessons</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold">{item.user_info.stats.enrolled_courses}</div>
                                    <p className="text-sm text-gray-500">Courses</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold">{item.user_info.stats.current_streak}</div>
                                    <p className="text-sm text-gray-500">Day Streak</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold">{item.user_info.stats.badges_count}</div>
                                    <p className="text-sm text-gray-500">Badges</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm font-semibold mb-2">Recent Badges</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.user_info.badges.slice(0, 3).map((badge) => (
                                        <Badge key={badge.id} variant="secondary">
                                            {badge.reward_name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 