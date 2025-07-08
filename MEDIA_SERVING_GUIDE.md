# 🖼️ Media File Serving Guide

## Problem
Your frontend uploads profile pictures successfully, but the images don't display because the backend doesn't serve media files.

## Solution
Add a media serving endpoint to your Django backend.

---

## 📋 Step-by-Step Implementation

### Step 1: Create Media Views

Create a new file `media_views.py` in your Django app:

```python
# media_views.py
from django.http import FileResponse, JsonResponse
from django.conf import settings
from django.contrib.auth.decorators import login_required
import os
import mimetypes

@login_required
def serve_media_file(request, file_path):
    """
    Serve media files with authentication
    URL pattern: /api/media/<path:file_path>
    """
    try:
        # Construct the full file path
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        # Security check - ensure the path is within MEDIA_ROOT
        if not os.path.abspath(full_path).startswith(os.path.abspath(settings.MEDIA_ROOT)):
            return JsonResponse({'error': 'Invalid path'}, status=403)
        
        if not os.path.exists(full_path):
            return JsonResponse({'error': 'File not found'}, status=404)
        
        # Determine content type
        content_type, _ = mimetypes.guess_type(full_path)
        if not content_type:
            content_type = 'application/octet-stream'
        
        # Serve the file
        response = FileResponse(open(full_path, 'rb'))
        response['Content-Type'] = content_type
        response['Cache-Control'] = 'public, max-age=31536000, immutable'
        
        return response
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
```

### Step 2: Add URL Pattern

Add this to your main `urls.py`:

```python
# urls.py
from django.urls import path
from . import media_views

urlpatterns = [
    # ... your existing URLs
    path('api/media/<path:file_path>', media_views.serve_media_file, name='serve_media'),
]
```

### Step 3: Update Settings

Make sure your `settings.py` has:

```python
# settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

## 🧪 Testing

### Test the Backend Directly

```bash
# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.garaad.org/api/media/profile_pics/filename.jpg
```

### Test from Frontend

1. Upload a new profile picture
2. Check if the image displays correctly
3. Check browser console for any errors

---

## 🔧 Alternative Solutions

### Option 1: Development Only (Simple)

For development, you can serve media files statically:

```python
# settings.py (for development only)
if DEBUG:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    
    # Add this to your main urls.py
    from django.conf import settings
    from django.conf.urls.static import static
    
    urlpatterns = [
        # ... your existing URLs
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Option 2: Production (CDN)

For production, use a CDN like AWS S3, Cloudinary, or similar.

---

## ✅ Expected Result

After implementing:

1. ✅ **Upload works** (already working)
2. ✅ **Backend serves files** (new implementation)
3. ✅ **Frontend proxy works** (already working)
4. ✅ **Images display correctly** (will work after backend fix)

---

## 🐛 Troubleshooting

### If images still don't load:

1. **Check backend logs** for errors
2. **Verify file exists** in your media directory
3. **Test authentication** - make sure the user is logged in
4. **Check file permissions** - ensure Django can read the files

### Common Issues:

- **404 Error**: File doesn't exist in media directory
- **403 Error**: Authentication required
- **500 Error**: File permission issues

---

## 📝 Notes

- The `@login_required` decorator ensures only authenticated users can access media files
- The security check prevents directory traversal attacks
- The cache headers help with performance
- For production, consider using a CDN for better performance

---

## 🚀 Quick Test

After implementing, test with:

```bash
# Test the endpoint
curl -I https://api.garaad.org/api/media/profile_pics/test.jpg
```

You should get a 401 (Unauthorized) if not authenticated, or 200 if authenticated and file exists. 