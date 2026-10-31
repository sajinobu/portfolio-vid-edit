"""Generate web copies and posters. Originals are never changed.

Usage: python scripts/prepare-media.py --source PATH --ffmpeg PATH --ffprobe PATH
"""
import argparse, json, subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SELECTION = [
    ('akon', 'BILF - Akon Drama.mp4', 2.9),
    ('electric-cars', 'The-Fake-Sound-of-Electric-Cars.mp4', 7.2),
    ('deep-blue', 'deep-blue-vertical-animated-fixed.mp4', 25.8),
    ('akon-paycheck', "BILF - Akon's Paycheck.mp4", 0.8),
    ('kevin-hart', 'KevinHartReel.mp4', 3.5),
    ('voxlearn', 'VoxLearn-Promo-20s.mp4', 2.4),
    ('voynich', 'voynich-vertical.mp4', 5.6),
    ('puzzle', 'PuzzleMindset.mp4', 6.6),
    ('miyagi', 'MiyagiRetentionShort.mp4', 17.8),
    ('chris', 'ChrisReel.mp4', 1.6),
    ('break-the-pattern', 'BREAK-THE-PATTERN.mp4', 1),
    ('hairpeps-ugc', 'HairPeps-UGC.mp4', 3),
    ('make-it-move', 'MAKE-IT-MOVE.mp4', 5),
    ('mini-humidifier', 'mini-humidifier-ad.mp4', 5),
]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--ffmpeg', default='ffmpeg')
    parser.add_argument('--ffprobe', default='ffprobe')
    parser.add_argument('--refresh', nargs='*', default=[], help='Project IDs whose web copies should be replaced')
    args = parser.parse_args()
    destination = ROOT / 'public/media'
    destination.mkdir(parents=True, exist_ok=True)

    def prepare(item):
        slug, filename, poster_time = item
        source = args.source / filename
        meta = json.loads(subprocess.check_output([args.ffprobe, '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height', '-of', 'json', str(source)]))
        stream = next(s for s in meta['streams'] if s['codec_type'] == 'video')
        max_width = 1280 if stream['width'] > stream['height'] else 720
        width = min(stream['width'], max_width)
        target = destination / f'{slug}.mp4'
        if not target.exists() or slug in args.refresh:
            subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-map', '0:v:0', '-map', '0:a?', '-vf', f'scale={width}:-2', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-threads', '4', str(target)], check=True)
        subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(poster_time), '-i', str(source), '-frames:v', '1', '-vf', f'scale={width}:-2', '-q:v', '3', str(destination / f'{slug}.jpg')], check=True)
        result = dict(id=slug, source=filename, duration=float(meta['format']['duration']), width=stream['width'], height=stream['height'], bytes=target.stat().st_size)
        print(json.dumps(result), flush=True)
        return result

    with ThreadPoolExecutor(max_workers=2) as pool:
        records = list(pool.map(prepare, SELECTION))
    (destination / 'manifest.json').write_text(json.dumps(records, indent=2))

if __name__ == '__main__':
    main()
