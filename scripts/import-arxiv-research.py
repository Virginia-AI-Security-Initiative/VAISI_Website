#!/usr/bin/env python3
"""Import pinned arXiv HTML, preserving MathML, citations, tables and local figures.

Run with python3 scripts/import-arxiv-research.py. Only these two content records
are updated; the existing PDF/Substack imports remain untouched.
"""

import base64
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urlparse

from lxml import etree, html

ROOT = Path(__file__).resolve().parents[1]
PAPERS = {
    "simple-features-ai-control-monitors": "2610.41713v1",
    "agentcollabbench": "2605.08647v1",
}


def fetch(url):
    return subprocess.check_output(["curl", "--fail", "--silent", "--show-error", "--location", "--max-time", "60", url])


def import_paper(slug, paper_id):
    url = f"https://arxiv.org/html/{paper_id}"
    document = html.fromstring(fetch(url))
    article = document.xpath("//article")[0]
    # The site supplies the title and complete author list. Start with Abstract.
    abstract = article.xpath('./div[contains(@class,"ltx_abstract")]')[0]
    while article[0] is not abstract:
        article.remove(article[0])
    for node in article.xpath('.//*[contains(@class,"ltx_rdf") or contains(@class,"ltx_pagination")]'):
        node.drop_tree()
    for heading in article.xpath('.//h6'):
        heading.tag = "h2"

    # Prefer the exact plain-text listing supplied by arXiv over hundreds of
    # syntax-highlighting spans, retaining indentation and blank lines.
    for listing in article.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," ltx_listing ")]'):
        downloads = listing.xpath('.//a[starts-with(@href,"data:text/plain;base64,")]')
        if downloads:
            pre = html.Element("pre", id=listing.get("id", ""))
            pre.text = base64.b64decode(downloads[0].get("href").split(",", 1)[1]).decode()
            pre.tail = listing.tail
            listing.getparent().replace(listing, pre)

    asset_dir = ROOT / "public/research/articles" / slug
    asset_dir.mkdir(parents=True, exist_ok=True)
    images = []
    for index, node in enumerate(article.xpath('.//img | .//object'), 1):
        source = urljoin(url, node.get("src") or node.get("data"))
        extension = Path(urlparse(source).path).suffix
        filename = f"figure-{index}{extension}"
        data = fetch(source)
        if extension == ".svg":
            svg = etree.fromstring(data)
            assert not svg.xpath('//*[local-name()="script" or local-name()="foreignObject"]')
            assert not svg.xpath('//@*[starts-with(local-name(),"on")]')
        (asset_dir / filename).write_bytes(data)
        figure = next((a for a in node.iterancestors() if a.tag == "figure"), None)
        caption = figure.xpath('./figcaption') if figure is not None else []
        alt = " ".join(caption[0].text_content().split()) if caption else f"Figure {index}"
        node.tag = "img"
        node.attrib.clear()
        node.set("src", f"/research/articles/{slug}/{filename}")
        node.set("alt", alt)
        node.set("loading", "lazy")
        images.append(node.get("src"))

    # LaTeXML draws code/prompt boxes using SVG foreignObjects. Reflow their
    # actual text as HTML so long prompts and examples stay readable on phones.
    for svg in article.xpath('.//svg[not(ancestor::svg)]'):
        lines = svg.xpath('.//span[contains(concat(" ",normalize-space(@class)," ")," ltx_p ")] | .//pre')
        text = "\n".join(line.text_content() for line in lines)
        box = html.Element("pre", {"class": "paper-example"})
        box.text = re.sub(r"\n{3,}", "\n\n", text.strip())
        box.tail = svg.tail
        svg.getparent().replace(svg, box)

    # LaTeXML emits explicit list markers as well as list elements.
    for marker in article.xpath('.//li/span[contains(@class,"ltx_tag_item")]'):
        marker.drop_tree()

    for node in list(article.iterdescendants()):
        if not isinstance(node.tag, str):
            node.getparent().remove(node)
            continue
        if node.tag in {"script", "style", "iframe", "object", "form", "button"}:
            node.drop_tree()
            continue
        # Keep semantic MathML attributes, IDs and a small set of layout classes;
        # discard fixed print widths, inline fonts and all event attributes.
        allowed = {"id", "class", "href", "src", "alt", "loading", "colspan", "rowspan",
                   "display", "mathvariant", "stretchy", "fence", "separator", "encoding",
                   "accent", "accentunder", "columnalign", "rowalign", "columnspacing",
                   "rowspacing", "linethickness", "lspace", "rspace", "start"}
        for attr in list(node.attrib):
            if attr not in allowed:
                del node.attrib[attr]
        href = node.get("href")
        if href and not href.startswith("#"):
            resolved = urljoin(url, href)
            if urlparse(resolved).scheme not in {"http", "https", "mailto"}:
                del node.attrib["href"]
            else:
                node.set("href", resolved)
                node.set("target", "_blank")
                node.set("rel", "noopener noreferrer")

    # Table overflow belongs to the table, never the whole article/page.
    for table in article.xpath('.//table[not(ancestor::table)]'):
        wrapper = html.Element("div", {"class": "paper-table-scroll", "tabindex": "0",
                                       "role": "region", "aria-label": "Scrollable paper table"})
        table.addprevious(wrapper)
        wrapper.append(table)
    body = html.Element("div", {"class": "arxiv-paper"})
    for child in list(article):
        body.append(child)
    attribution = html.Element("p", {"class": "paper-attribution"})
    attribution.text = "Reproduced from the authors’ arXiv HTML, including references and appendices. "
    link = etree.SubElement(attribution, "a", href=url)
    link.text = f"Source: arXiv:{paper_id}"
    license_link = document.xpath('//a[contains(@href,"creativecommons.org") or contains(@href,"licenses/")]')
    if license_link:
        license_node = etree.SubElement(attribution, "a", href=license_link[0].get("href"))
        link.tail = " · "
        license_node.text = "Source license"
    body.append(attribution)
    # Ignore TeX annotations when estimating reading time.
    plain = " ".join(body.xpath('.//text()[not(ancestor::annotation)]'))
    return {"format": "html", "html": html.tostring(body, encoding="unicode"),
            "images": images, "wordCount": len(re.findall(r"\b[\w'-]+\b", plain))}


if __name__ == "__main__":
    path = ROOT / "app/research/content.generated.json"
    content = json.loads(path.read_text())
    for slug, paper_id in PAPERS.items():
        content[slug] = import_paper(slug, paper_id)
        print(f"Imported {slug}: {content[slug]['wordCount']} words, {len(content[slug]['images'])} figures")
    path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n")
