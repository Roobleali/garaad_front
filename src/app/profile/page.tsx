"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { User } from "@/types/auth";
import AuthService from "@/services/auth";
import { progressService, type UserProgress } from "@/services/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  UserIcon,
  Settings,
  Trophy,
  BookOpen,
  Calendar,
  Mail,
  Edit3,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Header } from "@/components/Header";

// Extend User type to include required fields
interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedUser>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok)
        throw new Error("Ku guuldaraystay in la cusboonaysiiyo profile-ka");

      const updated = await response.json();
      setUser(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("Ku guuldaraystay in la cusboonaysiiyo profile-ka");
    }
  };

  // Load user from AuthService (cookies)
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = AuthService.getInstance().getCurrentUser();
      if (storedUser) {
        setUser(storedUser as ExtendedUser);
        setEditForm({
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          username: storedUser.username,
          email: storedUser.email,
        });
      } else {
        setError("Isticmaalaha lama helin");
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Ku guuldaraystay in la soo raro xogta profile-ka");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch progress once user is loaded
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const data = await progressService.getUserProgress();
        setProgress(data);
      } catch (err) {
        console.error(err);
        setError("Ku guuldaraystay in la soo raro xogta horumarinta");
      }
    };
    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Waa la soo raraya...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="text-destructive bg-card p-6 rounded-lg shadow-lg border">
            <h2 className="text-lg font-semibold mb-2">Khalad ayaa dhacay</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Isticmaalaha lama helin</p>
        </div>
      </div>
    );
  }

  const progressItems = progress?.length || 0;
  const lessonsCompleted =
    progress?.filter((lesson) => lesson.status === "completed").length || 0;

  const completedPercentage =
    progressItems && lessonsCompleted
      ? Math.round((lessonsCompleted / progressItems) * 100)
      : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary rounded-2xl transform -rotate-1 opacity-10"></div>
            <Card className="relative border-0 shadow-xl bg-card rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {user.first_name} {user.last_name}
                      </h1>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Badge variant="secondary" className="text-sm">
                          @{user.username}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-primary/10 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            Horumar
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {completedPercentage}%
                        </p>
                      </div>

                      <div className="bg-green-500/10 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-foreground">
                            Casharrada
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {lessonsCompleted}
                        </p>
                      </div>

                      {/* <div className="bg-purple-500/10 rounded-lg p-4 border col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-foreground">
                          Xubin ka ah
                        </span>
                      </div>
                      <p className="text-lg font-bold text-purple-600">
                        Maanta
                      </p>
                    </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="mb-8 bg-card shadow-sm border rounded-xl p-1 w-full max-w-md mx-auto lg:mx-0">
              <TabsTrigger
                value="progress"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Horumarka
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Dejinta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-6">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Horumarkaaga</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-8 bg-card">
                  {!progress || progress.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">
                        Wax horumar ah maadan samayn
                      </p>
                      <p className="text-muted-foreground/70 text-sm mt-2">
                        Bilow cashar si aad u aragto horumarkaaga
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Progress Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-primary/10 rounded-xl p-6 border">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Horumar Guud
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-3xl font-bold text-primary">
                                {completedPercentage}%
                              </span>
                              <Badge className="bg-primary text-primary-foreground">
                                Dhamaystiran
                              </Badge>
                            </div>
                            <Progress
                              value={completedPercentage}
                              className="h-3"
                            />
                          </div>
                        </div>

                        <div className="bg-green-500/10 rounded-xl p-6 border">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Casharrada la dhameeyay
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-3xl font-bold text-green-600">
                                {lessonsCompleted}
                              </span>
                              <span className="text-green-600 font-medium">
                                ka mid ah {progressItems}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm">
                                Waa ku guulaysatay!
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lessons List */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          Casharradaada
                        </h3>
                        <div className="grid gap-4">
                          {progress.map((item, index) => (
                            <Card
                              key={item.id}
                              className="border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden bg-card"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        item.status === "completed"
                                          ? "bg-green-500"
                                          : "bg-muted"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-foreground">
                                        {item.lesson_title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Cashar #{index + 1}
                                      </p>
                                    </div>
                                  </div>

                                  <Badge
                                    variant={
                                      item.status === "completed"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={`${
                                      item.status === "completed"
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                                    }`}
                                  >
                                    {item.status === "completed" ? (
                                      <>
                                        <CheckCircle2 className="h-3 w-3 mr-1" />{" "}
                                        Dhamaystiran
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="h-3 w-3 mr-1" /> Socda
                                      </>
                                    )}
                                  </Badge>
                                </div>

                                <Progress
                                  value={item.status === "completed" ? 100 : 30}
                                  className="h-2"
                                />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="h-6 w-6" />
                      <h2 className="text-2xl font-bold">Dejinta Profile-ka</h2>
                    </div>
                    <Button
                      onClick={() => setShowEditModal(true)}
                      variant="secondary"
                      className="bg-background text-foreground hover:bg-background/90"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Wax ka badal
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-background rounded-xl p-6 border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Magaca Koowaad
                        </h3>
                        <p className="text-lg font-medium text-foreground">
                          {user.first_name}
                        </p>
                      </div>

                      <div className="bg-background rounded-xl p-6 border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Magaca Dambe
                        </h3>
                        <p className="text-lg font-medium text-foreground">
                          {user.last_name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-background rounded-xl p-6 border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Magaca Isticmaalaha
                        </h3>
                        <p className="text-lg font-medium text-foreground">
                          @{user.username}
                        </p>
                      </div>

                      <div className="bg-background rounded-xl p-6 border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Email-ka
                        </h3>
                        <p className="text-lg font-medium text-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Modal */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="sm:max-w-md rounded-2xl bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Wax ka badal Profile-ka
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-sm font-medium text-foreground"
                    >
                      Magaca Koowaad
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={editForm.first_name || ""}
                      onChange={handleInputChange}
                      className="rounded-lg bg-background"
                      placeholder="Gali magacaaga koowaad"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-sm font-medium text-foreground"
                    >
                      Magaca Dambe
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={editForm.last_name || ""}
                      onChange={handleInputChange}
                      className="rounded-lg bg-background"
                      placeholder="Gali magacaaga dambe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Magaca Isticmaalaha
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={editForm.username || ""}
                      onChange={handleInputChange}
                      className="rounded-lg bg-background"
                      placeholder="Gali magaca isticmaalaha"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email-ka
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editForm.email || ""}
                      onChange={handleInputChange}
                      className="rounded-lg bg-background"
                      placeholder="Gali email-kaaga"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-lg"
                  >
                    Jooji
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Kaydi Isbadalka
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
