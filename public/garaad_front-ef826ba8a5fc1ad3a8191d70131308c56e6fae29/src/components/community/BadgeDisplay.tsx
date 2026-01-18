"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BADGE_LEVELS } from '@/types/community';
import { Star, Trophy, Target, TrendingUp } from 'lucide-react';

interface BadgeDisplayProps {
    badgeLevel: string;
    points: number;
    showProgress?: boolean;
    size?: 'sm' | 'md' | 'lg';
    layout?: 'horizontal' | 'vertical';
    showPointsToNext?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
    badgeLevel,
    points,
    showProgress = false,
    size = 'md',
    layout = 'horizontal',
    showPointsToNext = false
}) => {
    const badge = BADGE_LEVELS[badgeLevel] || BADGE_LEVELS.dhalinyaro;

    // Get next badge level
    const badgeLevels = Object.keys(BADGE_LEVELS);
    const currentIndex = badgeLevels.indexOf(badgeLevel);
    const nextBadge = currentIndex < badgeLevels.length - 1
        ? BADGE_LEVELS[badgeLevels[currentIndex + 1]]
        : null;

    // Calculate progress to next level
    const progressPercentage = nextBadge
        ? Math.min(100, ((points - badge.points_required) / (nextBadge.points_required - badge.points_required)) * 100)
        : 100;

    const pointsToNext = nextBadge ? nextBadge.points_required - points : 0;

    const sizeClasses = {
        sm: {
            emoji: 'text-2xl',
            container: 'w-12 h-12',
            title: 'text-sm',
            points: 'text-xs'
        },
        md: {
            emoji: 'text-3xl',
            container: 'w-16 h-16',
            title: 'text-base',
            points: 'text-sm'
        },
        lg: {
            emoji: 'text-4xl',
            container: 'w-20 h-20',
            title: 'text-lg',
            points: 'text-base'
        }
    };

    const classes = sizeClasses[size];

    if (layout === 'vertical') {
        return (
            <Card className="text-center">
                <CardContent className="p-4">
                    <div
                        className={`${classes.container} mx-auto rounded-full flex items-center justify-center mb-3`}
                        style={{ backgroundColor: `${badge.color}20` }}
                    >
                        <span className={classes.emoji}>{badge.emoji}</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className={`font-semibold text-gray-900 dark:text-white ${classes.title}`}>
                            {badge.display_name}
                        </h3>
                        <div className="flex items-center justify-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className={`font-bold ${classes.points}`} style={{ color: badge.color }}>
                                {points.toLocaleString()} dhibco
                            </span>
                        </div>
                    </div>

                    {showProgress && nextBadge && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Heerka xiga</span>
                                <span>{nextBadge.display_name}</span>
                            </div>
                            <Progress
                                value={progressPercentage}
                                className="h-2"
                                style={{
                                    backgroundColor: `${badge.color}20`,
                                    '--progress-foreground': badge.color
                                } as React.CSSProperties}
                            />
                            {showPointsToNext && pointsToNext > 0 && (
                                <p className="text-xs text-gray-500">
                                    {pointsToNext.toLocaleString()} dhibco oo dheeri ah ayaa loo baahan yahay
                                </p>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">{badge.description}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex items-center space-x-3">
            <div
                className={`${classes.container} rounded-full flex items-center justify-center flex-shrink-0`}
                style={{ backgroundColor: `${badge.color}20` }}
            >
                <span className={classes.emoji}>{badge.emoji}</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-semibold text-gray-900 dark:text-white ${classes.title}`}>
                        {badge.display_name}
                    </h3>
                    <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: badge.color, color: badge.color }}
                    >
                        Heer {currentIndex + 1}
                    </Badge>
                </div>

                <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className={`font-bold ${classes.points}`} style={{ color: badge.color }}>
                        {points.toLocaleString()} dhibco
                    </span>
                </div>

                {showProgress && nextBadge && (
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Heerka xiga: {nextBadge.display_name}</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress
                            value={progressPercentage}
                            className="h-2"
                            style={{
                                backgroundColor: `${badge.color}20`
                            } as React.CSSProperties}
                        />
                        {showPointsToNext && pointsToNext > 0 && (
                            <p className="text-xs text-gray-500">
                                {pointsToNext.toLocaleString()} dhibco oo dheeri ah
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Badge level indicator for small spaces
export const BadgeIcon: React.FC<{ badgeLevel: string; size?: 'sm' | 'md' }> = ({
    badgeLevel,
    size = 'sm'
}) => {
    const badge = BADGE_LEVELS[badgeLevel] || BADGE_LEVELS.dhalinyaro;
    const iconSize = size === 'sm' ? 'w-6 h-6 text-lg' : 'w-8 h-8 text-xl';

    return (
        <div
            className={`${iconSize} rounded-full flex items-center justify-center`}
            style={{ backgroundColor: `${badge.color}20` }}
            title={badge.display_name}
        >
            <span>{badge.emoji}</span>
        </div>
    );
};

// Achievement card component
export const AchievementCard: React.FC<{
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    pointsReward: number;
    unlockedAt?: string;
    progress?: { current: number; total: number };
}> = ({
    title,
    description,
    icon,
    isUnlocked,
    pointsReward,
    unlockedAt,
    progress
}) => {
        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('so-SO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        return (
            <Card className={`transition-all ${isUnlocked ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 opacity-75'}`}>
                <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${isUnlocked ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                            {isUnlocked ? icon : '🔒'}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                                {isUnlocked && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                        <Trophy className="h-3 w-3 mr-1" />
                                        Hel
                                    </Badge>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 text-sm">
                                    <Target className="h-4 w-4 text-yellow-600" />
                                    <span className="font-medium">{pointsReward} dhibco</span>
                                </div>

                                {isUnlocked && unlockedAt && (
                                    <span className="text-xs text-gray-500">
                                        {formatDate(unlockedAt)}
                                    </span>
                                )}
                            </div>

                            {!isUnlocked && progress && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Horumarka</span>
                                        <span>{progress.current}/{progress.total}</span>
                                    </div>
                                    <Progress
                                        value={(progress.current / progress.total) * 100}
                                        className="h-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

// Points indicator for navbar or headers
export const PointsIndicator: React.FC<{ points: number; showTrend?: boolean; trend?: number }> = ({
    points,
    showTrend = false,
    trend = 0
}) => {
    return (
        <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                {points.toLocaleString()}
            </span>
            {showTrend && trend !== 0 && (
                <div className={`flex items-center space-x-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(trend)}</span>
                </div>
            )}
        </div>
    );
}; 