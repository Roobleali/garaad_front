'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Reward {
    id: string;
    reward_type: string;
    reward_name: string;
    value: number;
    awarded_at: string;
}

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await fetch('/api/lms/rewards/');
                const data = await response.json();
                setRewards(data.results);
            } catch (error) {
                console.error('Error fetching rewards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRewards();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // Group rewards by type
    const groupedRewards = rewards.reduce((acc, reward) => {
        if (!acc[reward.reward_type]) {
            acc[reward.reward_type] = [];
        }
        acc[reward.reward_type].push(reward);
        return acc;
    }, {} as Record<string, Reward[]>);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Your Achievements</h1>

            <div className="grid gap-8">
                {Object.entries(groupedRewards).map(([type, rewards]) => (
                    <Card key={type} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl capitalize">{type.replace('_', ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rewards.map((reward) => (
                                    <div key={reward.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{reward.reward_name}</h3>
                                            <Badge variant="secondary">{reward.value} pts</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Awarded on {format(new Date(reward.awarded_at), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 