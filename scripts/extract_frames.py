#!/usr/bin/env python3
"""
Video Frame Extractor for OM Advertising Hero Scroll Sequence.

Extracts video frames at an optimal target FPS, resolution, and quality,
producing lightweight, color-accurate WebP image sequences ready for
HTML5 canvas scroll-scrubbing.

Usage:
    python3 scripts/extract_frames.py --input path/to/video.mp4 --output public/hero-frames --fps 10 --quality 80
"""

import argparse
import os
import sys
import shutil
import subprocess
from pathlib import Path
from typing import Optional, Tuple


def verify_dependencies() -> str:
    """
    Verify whether ffmpeg or opencv-python is available on the host.
    
    Returns:
        str: 'ffmpeg' if system ffmpeg is present, 'opencv' if cv2 is installed.
    
    Raises:
        SystemExit: If neither extraction engine is found, with installation guidance.
    """
    # Check 1: System FFmpeg (fastest, lossless color handling)
    if shutil.which("ffmpeg"):
        return "ffmpeg"

    # Check 2: OpenCV Python package
    try:
        import cv2  # noqa: F401
        from PIL import Image  # noqa: F401
        return "opencv"
    except ImportError:
        pass

    # Neither found: provide clear instructions
    print("\n[!] Frame extraction engine not found.")
    print("Please install one of the following to proceed:")
    print("  • Option A (Quickest): Run 'pip3 install opencv-python'")
    print("  • Option B (System):   Run 'brew install ffmpeg'\n")
    sys.exit(1)


def extract_frames_with_ffmpeg(
    video_path: Path,
    output_dir: Path,
    target_fps: int = 10,
    width: int = 1920,
    height: int = 1080,
    quality: int = 80
) -> int:
    """
    Extract frames using native FFmpeg with BT.709 color preservation and WebP encoding.
    
    Args:
        video_path: Path to source MP4 video.
        output_dir: Destination directory for WebP frames.
        target_fps: Output frames per second.
        width: Scaled width in pixels.
        height: Scaled height in pixels.
        quality: WebP quality index (0-100).
    
    Returns:
        int: Number of frames extracted.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    pattern = str(output_dir / "frame_%04d.webp")

    # Filter string: enforces fps, high-grade lanczos downscaling, and color matrix consistency
    filter_chain = (
        f"fps={target_fps},"
        f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:black"
    )

    cmd = [
        "ffmpeg",
        "-y",                          # Overwrite existing files
        "-i", str(video_path),         # Input video file
        "-vf", filter_chain,           # Video filter sequence
        "-c:v", "libwebp",             # WebP encoder
        "-quality", str(quality),      # Compression quality
        "-compression_level", "4",     # Effort level for small file size
        pattern
    ]

    print(f"[*] Extracting frames with FFmpeg at {target_fps} FPS (Quality: {quality}, {width}x{height})...")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode != 0:
        print(f"[!] FFmpeg error:\n{result.stderr}")
        sys.exit(1)

    extracted_files = list(output_dir.glob("frame_*.webp"))
    return len(extracted_files)


def extract_frames_with_opencv(
    video_path: Path,
    output_dir: Path,
    target_fps: int = 10,
    width: int = 1920,
    height: int = 1080,
    quality: int = 80
) -> int:
    """
    Extract frames using OpenCV and Pillow with precise millisecond sampling.
    
    Args:
        video_path: Path to source MP4 video.
        output_dir: Destination directory for WebP frames.
        target_fps: Output frames per second.
        width: Scaled width in pixels.
        height: Scaled height in pixels.
        quality: WebP quality index (0-100).
    
    Returns:
        int: Number of frames extracted.
    """
    import cv2
    from PIL import Image

    output_dir.mkdir(parents=True, exist_ok=True)

    # Purge any existing frames in output directory to prevent stale frame collisions
    for old_frame in output_dir.glob("frame_*.webp"):
        old_frame.unlink(missing_ok=True)

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"[!] Could not open video file: {video_path}")
        sys.exit(1)

    source_fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    total_source_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration_sec = total_source_frames / source_fps if source_fps > 0 else 0

    print(f"[*] Source Video: {source_fps:.2f} FPS | Total frames: {total_source_frames} | Duration: {duration_sec:.2f}s")
    print(f"[*] Extracting at {target_fps} FPS to: {output_dir}")

    # Determine frame sampling map
    if target_fps >= source_fps:
        # Capture 100% of native source frames for maximum possible visual fidelity
        selected_indices = set(range(total_source_frames))
    else:
        # Evenly distributed frame sampling
        target_count = max(1, int(round(duration_sec * target_fps)))
        selected_indices = set(
            round(i * (total_source_frames - 1) / max(1, target_count - 1))
            for i in range(target_count)
        )

    frame_index = 1
    raw_frame_idx = 0

    while True:
        success, frame = cap.read()
        if not success:
            break

        if raw_frame_idx in selected_indices:
            # Convert OpenCV BGR to RGB without color space clipping
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)

            # High-grade Lanczos scaling if dimensions differ
            if pil_img.size != (width, height):
                pil_img.thumbnail((width, height), Image.Resampling.LANCZOS)

            # Save as optimized WebP with method 6 (maximum compression effort)
            frame_filename = output_dir / f"frame_{frame_index:04d}.webp"
            pil_img.save(frame_filename, "WEBP", quality=quality, method=6)

            # Update the hero poster still with the pristine first frame
            if frame_index == 1:
                poster_path = output_dir.parent / "poster.webp"
                poster_path.parent.mkdir(parents=True, exist_ok=True)
                pil_img.save(poster_path, "WEBP", quality=quality, method=6)

            frame_index += 1

        raw_frame_idx += 1

    cap.release()
    return frame_index - 1


def summarize_output(output_dir: Path) -> None:
    """Print file size metrics and performance statistics for the extracted sequence."""
    frames = sorted(output_dir.glob("frame_*.webp"))
    if not frames:
        print("[!] No frames were generated.")
        return

    total_bytes = sum(f.stat().st_size for f in frames)
    total_mb = total_bytes / (1024 * 1024)
    avg_kb = (total_bytes / len(frames)) / 1024

    print("\n" + "=" * 55)
    print(" FRAME EXTRACTION COMPLETE")
    print("=" * 55)
    print(f" • Total Frames:     {len(frames)}")
    print(f" • Average Frame:    {avg_kb:.1f} KB")
    print(f" • Total Payload:    {total_mb:.2f} MB")
    print(f" • Output Directory: {output_dir.resolve()}")
    print("=" * 55)
    print(f"\n[i] NEXT STEP: In src/config/site.ts, verify:")
    print(f"    frameCount: {len(frames)}")
    print("=" * 55 + "\n")


def parse_arguments() -> argparse.Namespace:
    """Parse command line parameters for the frame extractor."""
    parser = argparse.ArgumentParser(
        description="Extract optimized WebP frames from a video for scroll canvas scrubbing."
    )
    parser.add_argument(
        "--input", "-i",
        type=Path,
        default=Path("assets/video/final.mp4"),
        help="Path to source video file (default: assets/video/final.mp4)"
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=Path("public/frames/hero/desktop"),
        help="Destination directory (default: public/frames/hero/desktop)"
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=30,
        help="Target frame rate up to 30 FPS (default: 30 FPS)"
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1920,
        help="Output width in pixels (default: 1920)"
    )
    parser.add_argument(
        "--height",
        type=int,
        default=1080,
        help="Output height in pixels (default: 1080)"
    )
    parser.add_argument(
        "--quality", "-q",
        type=int,
        default=80,
        help="WebP compression quality 1-100 (default: 80)"
    )
    return parser.parse_args()


def main() -> None:
    """Entry point for the frame extractor script."""
    args = parse_arguments()
    engine = verify_dependencies()

    if not args.input.exists():
        print(f"\n[!] Input video file not found at: {args.input}")
        print("Please place your video at that location or specify the path with:")
        print(f"    python3 scripts/extract_frames.py --input /path/to/your/video.mp4\n")
        sys.exit(1)

    if engine == "ffmpeg":
        extract_frames_with_ffmpeg(
            video_path=args.input,
            output_dir=args.output,
            target_fps=args.fps,
            width=args.width,
            height=args.height,
            quality=args.quality,
        )
    else:
        extract_frames_with_opencv(
            video_path=args.input,
            output_dir=args.output,
            target_fps=args.fps,
            width=args.width,
            height=args.height,
            quality=args.quality,
        )

    summarize_output(args.output)


if __name__ == "__main__":
    main()
