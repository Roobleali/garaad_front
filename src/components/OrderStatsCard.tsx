"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Clock,
    CheckCircle,
    CreditCard,
    Calendar,
    Loader2,
    AlertCircle,
} from "lucide-react";
import OrderService from "@/services/orders";
import { OrderStatsResponse } from "@/types/order";

interface OrderStatsCardProps {
    className?: string;
}

export function OrderStatsCard({ className }: OrderStatsCardProps) {
    const [stats, setStats] = useState<OrderStatsResponse["data"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderService = OrderService.getInstance();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await orderService.getOrderStats();

            if (response.success) {
                setStats(response.data);
            } else {
                setError("Ku guuldaraystay in la soo raro xisaabaadka dalashada");
            }
        } catch (err) {
            console.error("Error loading order stats:", err);
            setError("Khalad ayaa dhacay. Fadlan mar kale isku day.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: string | number) => {
        return orderService.formatCurrency(amount, "USD");
    };

    const getPaymentMethodName = (method: string) => {
        return orderService.getPaymentMethodName(method, "so");
    };

    if (loading) {
        return (
            <Card className={className}>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">La soo rarayo...</span>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="py-6">
                    <Alert className="border-red-200 bg-red-50 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Orders */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Dalashada Guud
                                </p>
                                <p className="text-2xl font-bold">{stats.total_orders}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Amount */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Qiimaha Guud
                                </p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.total_amount)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Completed Orders */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Dalashada Dhammaystiran
                                </p>
                                <p className="text-2xl font-bold">{stats.completed_orders}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Dalashada Sugitaanka
                                </p>
                                <p className="text-2xl font-bold">{stats.pending_orders}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Stats */}
            {stats.monthly_stats && stats.monthly_stats.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Xisaabaadka Bishii
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.monthly_stats.slice(0, 6).map((monthStat, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{monthStat.month}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{monthStat.orders} dalashad</div>
                                        <div className="text-sm text-gray-600">
                                            {formatCurrency(monthStat.amount)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Method Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Habka Bixinta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.payment_method_stats).map(([method, count]) => (
                                <div key={method} className="flex items-center justify-between">
                                    <span className="text-sm">{getPaymentMethodName(method)}</span>
                                    <Badge variant="secondary">{count}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Currency Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Lacag ahaan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.currency_stats).map(([currency, data]) => (
                                <div key={currency} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{currency}</span>
                                        <Badge variant="outline">{data.count} dalashad</Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Wadarta: {formatCurrency(data.total)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            {stats.recent_orders && stats.recent_orders.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Dalashada Ugu Dambeeyay
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recent_orders.slice(0, 5).map((order, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 bg-gray-100 rounded">
                                            <ShoppingBag className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{order.order_number}</div>
                                            <div className="text-xs text-gray-600">
                                                {orderService.formatOrderDate(order.created_at, "so")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-sm">
                                            {formatCurrency(order.total_amount)}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs bg-${orderService.getOrderStatusColor(order.status)}-100 text-${orderService.getOrderStatusColor(order.status)}-800 border-${orderService.getOrderStatusColor(order.status)}-200`}
                                        >
                                            {order.status_somali}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default OrderStatsCard; 