import json, subprocess
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('C:/Users/jenne/Videos/VideoEditingPortfolioOutputs')
FFMPEG = 'C:/Users/jenne/Documents/ChatGPT/RemotionMotionGraphics/fold-launch-video/node_modules/ffmpeg-static/ffmpeg.exe'
FFPROBE = 'C:/Users/jenne/Documents/ChatGPT/RemotionMotionGraphics/vox-shorts/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
out = ROOT / 'artifacts/media-review'
out.mkdir(parents=True, exist_ok=True)
records = []
for i, file in enumerate(SOURCE.glob('*.mp4')):
    meta = json.loads(subprocess.check_output([FFPROBE, '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height', '-of', 'json', str(file)]))
    video = next(s for s in meta['streams'] if s['codec_type'] == 'video')
    duration = float(meta['format']['duration'])
    records.append(dict(file=file.name, duration=duration, width=video['width'], height=video['height']))
    sheet = Image.new('RGB', (780, 510), '#0B1120')
    draw = ImageDraw.Draw(sheet)
    draw.text((12,12), file.name, fill='white')
    for j, fraction in enumerate([0.12, 0.40, 0.70]):
        frame = out / f'{i:02d}-{j}.jpg'
        subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(duration*fraction), '-i', str(file), '-frames:v', '1', '-vf', 'scale=240:440:force_original_aspect_ratio=decrease', str(frame)], check=True)
        img = Image.open(frame)
        sheet.paste(img, (j*260+(260-img.width)//2, 42+(440-img.height)//2))
        draw.text((j*260+12,488), f'{duration*fraction:.1f}s / {duration:.1f}s', fill='#94A3B8')
    sheet.save(out / f'{i:02d}-sheet.jpg')
(out / 'inventory.json').write_text(json.dumps(records, indent=2))
print(json.dumps(records, indent=2))
