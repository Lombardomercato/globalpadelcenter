"""Keep all eight static pages in sync with partials/footer.html.
Run python3 scripts/sync-footer.py after editing the shared footer.
Run with --check to verify without changing files.
"""
from pathlib import Path
import re
import sys
root = Path(__file__).resolve().parent.parent
source = (root / 'partials/footer.html').read_text().strip()
pages = ['index.html'] + [f'{name}/index.html' for name in ['eventos', 'viandas', 'bar', 'padel', 'privacidad', 'cookies', 'terminos']]
errors = []
for name in pages:
    path = root / name
    text = path.read_text()
    matches = re.findall(r'<footer\b.*?</footer>', text, re.S)
    if len(matches) != 1:
        errors.append(f'{name}: expected exactly one footer')
        continue
    if '--check' in sys.argv:
        if matches[0] != source:
            errors.append(f'{name}: footer differs')
    else:
        path.write_text(re.sub(r'<footer\b.*?</footer>', lambda _: source, text, count=1, flags=re.S))
if errors:
    raise SystemExit('\n'.join(errors))
print('Footer idéntico en las ocho páginas.')
