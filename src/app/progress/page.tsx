'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface ProgressItem {
    id: string;
    lesson_title: string;
    module_title: string;
    status: string;
    score: number;
    last_visited_at: string;
    completed_at: string | null;
}

export default function ProgressPage() {
    const [progress, setProgress] = useState<ProgressItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch('/api/lms/progress/');
                const data = await response.json();
                setProgress(data.results);
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Your Learning Progress</h1>

            <div className="grid gap-6">
                {progress.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">{item.lesson_title}</CardTitle>
                            <p className="text-sm text-gray-500">{item.module_title}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Progress</span>
                                    <span className="text-sm text-gray-500">{item.score}%</span>
                                </div>
                                <Progress value={item.score} className="h-2" />

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Last visited: {format(new Date(item.last_visited_at), 'MMM d, yyyy')}</span>
                                    {item.completed_at && (
                                        <span>Completed: {format(new Date(item.completed_at), 'MMM d, yyyy')}</span>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 