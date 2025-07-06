"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    X,
    Calendar,
    CreditCard,
    User,
    Mail,
    Package,
    Building,
} from "lucide-react";
import { ReceiptData } from "@/types/order";
import OrderService from "@/services/orders";

interface ReceiptViewerProps {
    receiptData: ReceiptData | null;
    isOpen: boolean;
    onClose: () => void;
    onDownload?: () => void;
    isDownloading?: boolean;
}

export function ReceiptViewer({
    receiptData,
    isOpen,
    onClose,
    onDownload,
    isDownloading = false,
}: ReceiptViewerProps) {
    const orderService = OrderService.getInstance();

    if (!receiptData) return null;

    const formatCurrency = (amount: string, currency: string) => {
        return orderService.formatCurrency(amount, currency);
    };

    const formatDate = (dateString: string) => {
        return orderService.formatOrderDate(dateString, "so");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{receiptData.receipt_title}</span>
                        <div className="flex gap-2">
                            {onDownload && (
                                <Button
                                    onClick={onDownload}
                                    disabled={isDownloading}
                                    size="sm"
                                    variant="outline"
                                >
                                    {isDownloading ? (
                                        <>
                                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                            La dajinayo...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Dajin
                                        </>
                                    )}
                                </Button>
                            )}
                            <Button onClick={onClose} size="sm" variant="outline">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="receipt-content bg-white p-6 rounded-lg border" id="receipt-content">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {receiptData.company_name}
                        </h1>
                        <p className="text-gray-600">{receiptData.company_address}</p>
                        <p className="text-gray-600">{receiptData.company_email}</p>
                        {receiptData.company_phone && (
                            <p className="text-gray-600">{receiptData.company_phone}</p>
                        )}
                    </div>

                    <Separator className="my-6" />

                    {/* Receipt Info */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {receiptData.receipt_title}
                        </h2>
                        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(receiptData.receipt_date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>#{receiptData.receipt_number || receiptData.order_number}</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Order Information */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">
                                {receiptData.customer_label}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>{receiptData.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{receiptData.customer_email}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Xogta Bixinta
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">{receiptData.order_label}:</span>
                                    <span className="ml-2 font-mono">{receiptData.order_number}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{receiptData.method_label}:</span>
                                    <span className="ml-2">{receiptData.payment_method_display}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{receiptData.date_label}:</span>
                                    <span className="ml-2">{formatDate(receiptData.paid_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Items */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            {receiptData.items_label}
                        </h3>
                        <div className="space-y-3">
                            {receiptData.items.map((item, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.description}
                                            </p>

                                            {/* Subscription details */}
                                            {item.subscription_type && (
                                                <div className="mt-2 space-y-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {orderService.getSubscriptionName(item.subscription_type, "so")}
                                                    </Badge>
                                                    {item.subscription_start_date && item.subscription_end_date && (
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(item.subscription_start_date)} - {formatDate(item.subscription_end_date)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right ml-4">
                                            <div className="text-sm text-gray-600">
                                                {item.quantity} x {formatCurrency(item.unit_price, receiptData.currency)}
                                            </div>
                                            <div className="font-medium">
                                                {formatCurrency(item.total_price, receiptData.currency)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold">{receiptData.total_label}:</span>
                        <span className="text-lg font-bold">
                            {formatCurrency(receiptData.total_amount, receiptData.currency)}
                        </span>
                    </div>

                    <Separator className="my-6" />

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600">
                        <p className="font-medium mb-2">{receiptData.thank_you_message}</p>
                        {receiptData.notes && (
                            <p className="mb-2">{receiptData.notes}</p>
                        )}
                        {receiptData.terms && (
                            <p className="text-xs">{receiptData.terms}</p>
                        )}
                        {receiptData.footer_text && (
                            <p className="text-xs mt-2">{receiptData.footer_text}</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReceiptViewer; 