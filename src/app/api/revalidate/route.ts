import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const path = request.nextUrl.searchParams.get('path') || '/blog';

    // In a real app, you'd check a secret token here
    // if (secret !== process.env.MY_SECRET_TOKEN) {
    //   return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    // }

    try {
        revalidatePath(path);
        // Also revalidate the tag index if it's a blog path
        if (path.startsWith('/blog')) {
            revalidatePath('/blog');
            revalidatePath('/blog/[slug]', 'page');
        }

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
