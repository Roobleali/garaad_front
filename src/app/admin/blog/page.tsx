"use client";

import { useEffect, useState } from "react";
import { blogAdminApi } from "@/lib/admin-blog";
import { BlogPost } from "@/types/blog";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    MoreVertical,
    Loader2,
    Search
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await blogAdminApi.getPosts();
            setPosts(data);
        } catch (error) {
            toast.error("Waa lagu fashilmay in la soo saaro qoraalada");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (slug: string) => {
        if (confirm("Ma hubtaa inaad tirtirto qoraalkan?")) {
            try {
                await blogAdminApi.deletePost(slug);
                toast.success("Qoraalka waa la tirtiray");
                fetchPosts();
            } catch (error) {
                toast.error("Waa lagu fashilmay tirtirista qoraalka");
            }
        }
    };

    const handlePublishToggle = async (post: BlogPost) => {
        try {
            if (!post.is_published) {
                await blogAdminApi.publishPost(post.slug);
                toast.success("Qoraalka waa la daabacay");
            } else {
                await blogAdminApi.updatePost(post.slug, { is_published: false });
                toast.success("Qoraalka waa laga noqday daabacaadiisa");
            }
            fetchPosts();
        } catch (error) {
            toast.error("Waa lagu fashilmay beddelidda heerka daabacaadda");
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Maareynta Blog-ga</h1>
                    <p className="text-slate-500 text-sm">Abuur, wax ka beddel ama tirtir qoraalada blog-ga.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Qoraal Cusub
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Raadi qoraal..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-slate-500">Wax qoraal ah looma helin.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cinwaanka</TableHead>
                                <TableHead>Qoraaga</TableHead>
                                <TableHead>Taariikhda</TableHead>
                                <TableHead>Heerka</TableHead>
                                <TableHead className="text-right">Waxqabad</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        {post.title}
                                    </TableCell>
                                    <TableCell>{post.author_name}</TableCell>
                                    <TableCell>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString()
                                            : "Lama daabacin"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={post.is_published ? "default" : "secondary"}>
                                            {post.is_published ? "Daabacan" : "Qabyo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center">
                                                        <Eye className="mr-2 h-4 w-4" /> Fiiri
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/blog/${post.slug}/edit`} className="flex items-center text-blue-600">
                                                        <Edit className="mr-2 h-4 w-4" /> Wax ka beddel
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handlePublishToggle(post)}
                                                    className="flex items-center"
                                                >
                                                    {post.is_published ? (
                                                        <><XCircle className="mr-2 h-4 w-4" /> Ka noqo daabacaadda</>
                                                    ) : (
                                                        <><CheckCircle className="mr-2 h-4 w-4" /> Daabac</>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(post.slug)}
                                                    className="flex items-center text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Tirtir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
