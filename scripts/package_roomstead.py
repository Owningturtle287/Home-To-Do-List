"""Build a single-file Roomstead app that can run without a web server."""

import argparse
import base64
from pathlib import Path
import re


def replace_once(page, marker, replacement):
    if page.count(marker) != 1:
        raise ValueError(f"Expected one occurrence of {marker!r} in index.html")
    return page.replace(marker, replacement)


def data_url(path):
    return "data:image/svg+xml;base64," + base64.b64encode(path.read_bytes()).decode()


def package(source, output):
    page = (source / "index.html").read_text(encoding="utf-8")
    css = (source / "styles.css").read_text(encoding="utf-8")
    modules = []
    for filename in ("seed.js", "model.js", "icons.js", "app.js"):
        script = (source / filename).read_text(encoding="utf-8")
        script = re.sub(r"^import .+;\n", "", script, flags=re.MULTILINE)
        modules.append(script)
    javascript = re.sub(r"</script", r"<\\/script", "\n".join(modules), flags=re.IGNORECASE)

    page = replace_once(page, '<link rel="stylesheet" href="./styles.css">', f"<style>\n{css}</style>")
    page = replace_once(page, '<script type="module" src="./app.js"></script>', f'<script type="module">\n{javascript}</script>')
    page = replace_once(page, '  <link rel="manifest" href="./manifest.webmanifest">\n', "")
    page = replace_once(page, '  <link rel="apple-touch-icon" href="./assets/app-icon-192.png">\n', "")
    page = page.replace("./assets/app-icon.svg", data_url(source / "assets/app-icon.svg"))
    page = replace_once(page, "./assets/house.svg", data_url(source / "assets/house.svg"))
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(page, encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    package(args.source, args.output)
