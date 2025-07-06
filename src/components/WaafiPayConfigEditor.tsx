"use client";

import React, { useState, useEffect } from 'react';
import { useWaafiPayConfig, WalletTypeConfig } from '@/config/waafipay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Settings, RotateCcw, Save, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PrefixEditorProps {
    walletType: WalletTypeConfig;
    onSave: (key: string, prefixes: string[]) => void;
    onCancel: () => void;
}

function PrefixEditor({ walletType, onSave, onCancel }: PrefixEditorProps) {
    const [prefixes, setPrefixes] = useState<string[]>(walletType.prefixes);
    const [newPrefix, setNewPrefix] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validatePrefix = (prefix: string): boolean => {
        // Basic validation for phone number prefixes
        const prefixRegex = /^\+\d{3,6}$/;
        return prefixRegex.test(prefix);
    };

    const addPrefix = () => {
        const trimmed = newPrefix.trim();
        if (!trimmed) return;

        if (!validatePrefix(trimmed)) {
            setError('Prefix must be in format +XXX or +XXXX (e.g., +252, +25261)');
            return;
        }

        if (prefixes.includes(trimmed)) {
            setError('Prefix already exists');
            return;
        }

        setPrefixes([...prefixes, trimmed]);
        setNewPrefix('');
        setError(null);
    };

    const removePrefix = (index: number) => {
        setPrefixes(prefixes.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (prefixes.length === 0) {
            setError('At least one prefix is required');
            return;
        }
        onSave(walletType.key, prefixes);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addPrefix();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{walletType.label}</h3>
                    <p className="text-sm text-gray-600">Edit prefixes for {walletType.label}</p>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label>Current Prefixes</Label>
                <div className="flex flex-wrap gap-2">
                    {prefixes.map((prefix, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {prefix}
                            <button
                                onClick={() => removePrefix(index)}
                                className="ml-1 hover:text-red-500"
                            >
                                <X size={12} />
                            </button>
                        </Badge>
                    ))}
                    {prefixes.length === 0 && (
                        <p className="text-sm text-gray-500">No prefixes added yet</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Add New Prefix</Label>
                <div className="flex gap-2">
                    <Input
                        value={newPrefix}
                        onChange={(e) => setNewPrefix(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., +25261"
                        className="flex-1"
                    />
                    <Button onClick={addPrefix} size="sm">
                        <Plus size={16} />
                    </Button>
                </div>
                <p className="text-xs text-gray-500">
                    Format: +XXX or +XXXX (e.g., +252, +25261)
                </p>
            </div>

            <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                    <Save size={16} className="mr-2" />
                    Save Changes
                </Button>
                <Button onClick={onCancel} variant="outline" className="flex-1">
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export interface WaafiPayConfigEditorProps {
    trigger?: React.ReactNode;
    onConfigChange?: () => void;
}

export function WaafiPayConfigEditor({ trigger, onConfigChange }: WaafiPayConfigEditorProps) {
    const { config, updateWalletType, resetToDefault } = useWaafiPayConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletTypeConfig | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const handleSavePrefix = (key: string, prefixes: string[]) => {
        const success = updateWalletType(key, { prefixes });
        if (success) {
            setEditingWallet(null);
            setHasChanges(true);
            onConfigChange?.();
        }
    };

    const handleReset = () => {
        const success = resetToDefault();
        if (success) {
            setHasChanges(true);
            onConfigChange?.();
        }
    };

    const defaultTrigger = (
        <Button variant="outline" size="sm">
            <Settings size={16} className="mr-2" />
            Configure Prefixes
        </Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>WaafiPay Prefix Configuration</DialogTitle>
                </DialogHeader>

                {editingWallet ? (
                    <PrefixEditor
                        walletType={editingWallet}
                        onSave={handleSavePrefix}
                        onCancel={() => setEditingWallet(null)}
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Configure phone number prefixes for each wallet type
                            </p>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="sm"
                                className="text-orange-600 hover:text-orange-700"
                            >
                                <RotateCcw size={16} className="mr-2" />
                                Reset to Default
                            </Button>
                        </div>

                        {hasChanges && (
                            <Alert>
                                <AlertDescription>
                                    Changes have been saved successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-4">
                            {config.walletTypes.map((walletType) => (
                                <Card key={walletType.key} className="relative">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{walletType.label}</CardTitle>
                                                <CardDescription>
                                                    Placeholder: {walletType.placeholder}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                onClick={() => setEditingWallet(walletType)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Current Prefixes:</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {walletType.prefixes.map((prefix, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {prefix}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Click "Edit" on any wallet type to modify its prefixes</li>
                                <li>• Add prefixes in the format +XXX or +XXXX (e.g., +252, +25261)</li>
                                <li>• Remove prefixes by clicking the X button</li>
                                <li>• Changes are saved automatically to your browser</li>
                                <li>• Use "Reset to Default" to restore original settings</li>
                            </ul>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 