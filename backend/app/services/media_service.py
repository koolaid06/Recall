import asyncio
import os
import re
import subprocess


def _run_cmd(command: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(command, capture_output=True, text=True, check=True)


async def get_duration(file_path: str) -> float | None:
    """Extracts media duration asynchronously using ffprobe."""
    command = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file_path,
    ]
    try:
        result = await asyncio.to_thread(_run_cmd, command)
        return float(result.stdout.strip())
    except Exception:
        return None


async def is_audio_noisy(input_path: str) -> bool:
    """Inspects audio statistics asynchronously to check for background noise."""
    command = [
        "ffmpeg",
        "-i",
        input_path,
        "-af",
        "astats=metadata=1:reset=1",
        "-f",
        "null",
        "-",
    ]
    try:
        result = await asyncio.to_thread(_run_cmd, command)
        stderr = result.stderr

        rms_match = re.search(r"RMS level dB:\s*(-?\d+\.\d+)", stderr)
        peak_match = re.search(r"Peak level dB:\s*(-?\d+\.\d+)", stderr)

        if rms_match and peak_match:
            rms_db = float(rms_match.group(1))
            peak_db = float(peak_match.group(1))
            return (peak_db - rms_db) < 12.0

        return False
    except Exception:
        return False


async def preprocess_media(input_path: str, mime_type: str) -> str:
    """Processes media asynchronously (compressing & optional denoising) off the main thread."""
    base_path, _ = os.path.splitext(input_path)
    noisy = await is_audio_noisy(input_path)

    audio_filter = []
    if noisy:
        audio_filter.append("highpass=f=80,lowpass=f=3500,afftdn=nr=12:nf=-30")

    if mime_type.startswith("audio/"):
        output_path = f"{base_path}_processed.mp3"
        command = ["ffmpeg", "-y", "-i", input_path]

        if audio_filter:
            command.extend(["-af", ",".join(audio_filter)])

        command.extend(["-ac", "1", "-ar", "16000", "-b:a", "64k", output_path])

    else:
        output_path = f"{base_path}_processed.mp4"
        command = ["ffmpeg", "-y", "-i", input_path]

        video_filter = "scale=-2:480,fps=1"
        command.extend(["-vf", video_filter])

        if audio_filter:
            command.extend(["-af", ",".join(audio_filter)])

        command.extend([
            "-c:v", "libx264",
            "-crf", "30",
            "-preset", "veryfast",
            "-ac", "1",
            "-ar", "16000",
            "-b:a", "64k",
            output_path,
        ])

    try:
        await asyncio.to_thread(
            subprocess.run,
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )
        return output_path
    except Exception:
        return input_path