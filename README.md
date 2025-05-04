# Parkbad Website

Die offizielle Webseite des Parkbads Gütersloh.

## Performance Optimization

### Video Optimization Instructions

To improve the Largest Contentful Paint (LCP) metric on the homepage, we've implemented lazy loading for the large header video. For optimal performance, you'll need to create smaller versions of the video for different devices:

1. **Install FFmpeg** (if not already installed):

   ```bash
   # macOS (using Homebrew)
   brew install ffmpeg
   
   # Ubuntu/Debian
   sudo apt-get install ffmpeg
   
   # Windows (using Chocolatey)
   choco install ffmpeg
   ```

2. **Create optimized versions of the header video**:

   Run these commands from the project root to create optimized versions:

   ```bash
   # Create directory if it doesn't exist
   mkdir -p public/videos

   # Create a 480p WebM version (for mobile)
   ffmpeg -i public/Header_BG_II_big_webm_bigger.mp4 -vf scale=854:480 -c:v libvpx-vp9 -b:v 1M -c:a libopus -b:a 128k public/videos/header-480p.webm
   
   # Create a 480p MP4 version (for mobile)
   ffmpeg -i public/Header_BG_II_big_webm_bigger.mp4 -vf scale=854:480 -c:v libx264 -b:v 1M -c:a aac -b:a 128k public/videos/header-480p.mp4
   
   # Create a 720p WebM version (optional, for tablets)
   ffmpeg -i public/Header_BG_II_big_webm_bigger.mp4 -vf scale=1280:720 -c:v libvpx-vp9 -b:v 2M -c:a libopus -b:a 128k public/videos/header-720p.webm
   
   # Create a 720p MP4 version (optional, for tablets)
   ffmpeg -i public/Header_BG_II_big_webm_bigger.mp4 -vf scale=1280:720 -c:v libx264 -b:v 2M -c:a aac -b:a 128k public/videos/header-720p.mp4
   ```

3. **Generate a high-quality poster image**:

   ```bash
   # Extract a frame from the video to use as poster (at 3 seconds)
   ffmpeg -i public/Header_BG_II_big_webm_bigger.mp4 -ss 00:00:03 -vframes 1 -q:v 2 public/video-bg-hq.png
   
   # Optimize the poster image using compression tool like ImageOptim or TinyPNG
   ```

The optimized video loading strategy:

- Uses a high-quality static image as initial placeholder (important for LCP)
- Defers video loading until content is in viewport
- Serves smaller video files to mobile devices
- Implements proper lazy loading to avoid blocking main thread

## Video Optimization

### New Video Placeholder Image

The site now requires a higher quality placeholder image taken from a later frame in the video. To generate this:

1. **Extract frame from the video** (requires ffmpeg):
   ```bash
   # Extract a frame from the 3-second mark of the video
   ffmpeg -i public/Header_BG_II_big_webm_bigger.mp4 -ss 00:00:03 -vframes 1 -q:v 2 public/video-bg-later.png
   ```

2. **Or manually create the image**:
   If ffmpeg isn't available, you can:
   - Open the video in a media player
   - Navigate to the 3-second mark
   - Take a screenshot
   - Save as `public/video-bg-later.png`
   - Optimize the image for web using tools like ImageOptim or TinyPNG

The improved header video now:
- Shows the placeholder image for 2.5 seconds even after the video loads
- Uses a frame from later in the video as the placeholder
- Has smoother transitions between the placeholder and the video

## Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
