#!/usr/bin/env python3
"""Build the locally hosted research article bodies used by the website.

The script converts the current PDF library into searchable page text and
imports the three VAISI Substack reports as sanitized HTML with local images.
Run it again whenever one of the source documents changes.
"""

from __future__ import annotations

import json
import io
import mimetypes
import re
import statistics
import sys
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse
from urllib.request import Request, urlopen

import pdfplumber
from lxml import etree, html
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "app" / "research" / "content.generated.json"
ASSET_ROOT = ROOT / "public" / "research" / "articles"

TWO_COLUMN_PDFS = {"dual-framework-ai-chip-smuggling"}

PDFS = {
    "ai-safety-investigation-act": "public/research/policy_briefs/Logan Bradley, Ishan Ajwani - AI Safety Investigation Act Brief.pdf",
    "making-ai-governable-for-americans-act": "public/research/policy_briefs/MAGA_Act_Policy_Brief (3) - Owen Watzlavick.pdf",
    "ai-market-structure-reform-act": "public/research/policy_briefs/AI Policy Hackathon - Ricardo Bruinton FINAL.pdf",
    "digital-letters-of-marque": "public/research/policy_briefs/Revised_Policy_Submission - Leah.pdf",
    "national-ai-security-organization": "public/research/policy_briefs/Binit M FINAL.pdf",
    "modular-risk-based-frontier-ai-regulation": "public/research/policy_briefs/Policy Brief_VAISI AI Policy Hackathon - Aashka Vyas.pdf",
    "dual-framework-ai-chip-smuggling": "public/research/fellowship_projects/A Dual Framework to Combat Large-Scale AI Chip Smuggling – Seth Lifland and Shubhrangshu Debsarkar – 4_17_26.pdf",
    "armenia-compute-diplomacy": "public/research/fellowship_projects/What Armenia’s Tech Emergence Can Teach Us About Compute Diplomacy – Hovsep Seferian – 4_28_26.pdf",
    "virginia-public-contribution-requirements": "public/research/fellowship_projects/Policy Virginia Public Contribution Req – Nia Mucher – 5_12_26.pdf",
    "ai-surveillance-communities": "public/research/fellowship_projects/How AI Enhances Surveillance Against Communities Without Their Knowledge – Rishi Chandra and Shaina Kumar – 5_11_26.pdf",
    "us-china-ai-approaches": "public/research/fellowship_projects/A Comparative Analysis of US-Chinese Approaches to AI – Maeve Myers – 5_6_26.pdf",
    "ai-and-jobs-action-gap": "public/research/fellowship_projects/AI and Jobs_ The Ideas Exist. The Action Doesn_t – Andrew Broughton – 4_27_26.pdf",
    "how-ai-escapes-governance": "public/research/fellowship_projects/How AI Escapes Governance – Kate McCray – 5_1_26 .pdf",
    "ai-evaluations-landscape": "public/research/fellowship_projects/The Current Landscape for AI Evaluations And Where We Need to Land – Mustafa Lonandwala – 5_14_26.pdf",
    "governance-ai-generated-ncii": "public/research/fellowship_projects/Sara Alterazi & Patrick Gilmartin – Opinion Essay – 5_11_26.pdf",
}

POSTS = {
    "emotion-concepts-gemma-2": "https://vaisi.substack.com/p/identifying-and-validating-emotion",
    "hue-saturation-manifold-gemma-2": "https://vaisi.substack.com/p/geometric-concept-representations",
    "cross-model-steering-vectors": "https://vaisi.substack.com/p/a-direction-for-some-not-all-cross",
}

REMOVE_TAGS = {"script", "style", "form", "button", "input", "textarea", "noscript", "svg"}
KEEP_TAGS = {
    "p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i",
    "a", "blockquote", "figure", "figcaption", "img", "pre", "code", "hr",
    "br", "sup", "sub", "table", "thead", "tbody", "tr", "th", "td",
}


def fetch(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 VAISI research importer"})
    with urlopen(request, timeout=45) as response:
        return response.read()


def image_extension(url: str, content_type: str | None) -> str:
    decoded_path = unquote(urlparse(url).path)
    match = re.search(r"\.(png|jpe?g|webp|gif)(?:$|[/?])", decoded_path, re.I)
    if match:
        suffix = match.group(1).lower()
        return ".jpg" if suffix == "jpeg" else f".{suffix}"
    guessed = mimetypes.guess_extension((content_type or "").split(";")[0].strip())
    return guessed or ".jpg"


def has_class(node: etree._Element, class_name: str) -> bool:
    classes = (node.get("class") or "").split()
    return class_name in classes


def sanitize_post(slug: str, url: str) -> dict[str, object]:
    document = html.fromstring(fetch(url), base_url=url)
    matches = document.xpath(
        "//*[contains(concat(' ', normalize-space(@class), ' '), ' body ') and "
        "contains(concat(' ', normalize-space(@class), ' '), ' markup ')]"
    )
    if not matches:
        raise RuntimeError(f"Could not find the article body at {url}")
    body = matches[0]

    for node in list(body.xpath(".//*")):
        classes = node.get("class") or ""
        if "subscription-widget" in classes or "paywall" in classes:
            node.drop_tree()

    asset_dir = ASSET_ROOT / slug
    asset_dir.mkdir(parents=True, exist_ok=True)
    local_images: list[str] = []
    for index, image in enumerate(body.xpath(".//img"), start=1):
        source = image.get("src") or image.get("data-src")
        if not source:
            image.drop_tree()
            continue
        source = urljoin(url, source)
        request = Request(source, headers={"User-Agent": "Mozilla/5.0 VAISI research importer"})
        with urlopen(request, timeout=60) as response:
            content = response.read()
            extension = image_extension(source, response.headers.get("Content-Type"))
        filename = f"figure-{index}{extension}"
        (asset_dir / filename).write_bytes(content)
        public_path = f"/research/articles/{slug}/{filename}"
        local_images.append(public_path)
        alt = (image.get("alt") or "").strip() or f"Figure {index}"
        image.attrib.clear()
        image.set("src", public_path)
        image.set("alt", alt)
        image.set("loading", "lazy")

    for node in list(body.iterdescendants()):
        tag = node.tag.lower() if isinstance(node.tag, str) else ""
        if tag in REMOVE_TAGS:
            node.drop_tree()
            continue
        if tag not in KEEP_TAGS:
            node.drop_tag()
            continue

        attrs: dict[str, str] = {}
        if tag == "a":
            href = node.get("href")
            if href:
                attrs["href"] = urljoin(url, href)
                attrs["target"] = "_blank"
                attrs["rel"] = "noopener noreferrer"
        elif tag == "img":
            attrs = {
                "src": node.get("src", ""),
                "alt": node.get("alt", ""),
                "loading": "lazy",
            }
        elif tag == "ol" and node.get("start"):
            attrs["start"] = node.get("start", "1")
        node.attrib.clear()
        node.attrib.update(attrs)

    body_html = "".join(
        html.tostring(child, encoding="unicode", method="html") for child in body
    ).strip()
    plain_text = " ".join(body.itertext())
    return {
        "format": "html",
        "html": body_html,
        "images": local_images,
        "wordCount": len(re.findall(r"\b[\w'-]+\b", plain_text)),
    }


def normalize_page_text(value: str) -> str:
    value = value.replace("\u00ad", "").replace("\ufb01", "fi").replace("\ufb02", "fl")
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r" *\n *", "\n", value)
    return value.strip()


def extract_page_blocks(
    page: pdfplumber.page.Page,
    page_number: int,
    academic_sections: bool = False,
) -> list[dict[str, object]]:
    """Turn positioned PDF lines into simple semantic reading blocks."""
    lines = page.extract_text_lines(x_tolerance=1.5, y_tolerance=3, return_chars=True)
    if not lines:
        return []

    all_sizes = [float(char.get("size", 0)) for line in lines for char in line.get("chars", [])]
    body_size = statistics.median(all_sizes) if all_sizes else 11
    blocks: list[dict[str, object]] = []
    current_type: str | None = None
    current_text = ""
    current_x = 0.0
    current_top = 0.0
    current_bottom = 0.0
    previous_bottom: float | None = None
    previous_x: float | None = None

    def flush() -> None:
        nonlocal current_type, current_text, current_x, current_top, current_bottom
        text = normalize_page_text(current_text.replace("\n", " "))
        if text:
            blocks.append({
                "type": current_type or "paragraph",
                "text": text,
                "page": page_number,
                "x": current_x,
                "top": current_top,
                "bottom": current_bottom,
            })
        current_type = None
        current_text = ""
        current_x = 0.0
        current_top = 0.0
        current_bottom = 0.0

    for line in lines:
        text = normalize_page_text(line.get("text", ""))
        if not text or (re.fullmatch(r"\d+", text) and float(line.get("top", 0)) > page.height * 0.85):
            continue
        sizes = [float(char.get("size", 0)) for char in line.get("chars", [])]
        line_size = statistics.median(sizes) if sizes else body_size
        top = float(line.get("top", 0))
        bottom = float(line.get("bottom", top + line_size))
        x0 = float(line.get("x0", 0))
        gap = top - previous_bottom if previous_bottom is not None else 999
        previous_bottom = bottom
        bold_line = bool(line.get("chars")) and all(
            "bold" in str(char.get("fontname", "")).lower()
            for char in line.get("chars", [])
            if str(char.get("text", "")).strip()
        )

        if academic_sections and (
            text.lower() in {"abstract", "references", "impact statement"}
            or (len(text) < 120 and re.match(r"^\d+(?:\.\d+)*\.\s+\S", text))
            or (len(text) < 120 and re.match(r"^[A-Z](?:\.\d+)*\.\s+\S", text))
            or (len(text) < 120 and bold_line)
        ):
            flush()
            number = re.match(r"^(\d+(?:\.\d+)*)\.", text)
            appendix = re.match(r"^([A-Z](?:\.\d+)*)\.", text)
            blocks.append({
                "type": "heading" if (
                    (not number or "." not in number.group(1))
                    and (not appendix or "." not in appendix.group(1))
                ) else "subheading",
                "text": text,
                "page": page_number,
            })
            continue

        if line_size >= body_size * 1.32 and len(text) < 180:
            flush()
            blocks.append({
                "type": "heading" if line_size >= body_size * 1.65 else "subheading",
                "text": text,
                "page": page_number,
            })
            continue

        bullet = bool(re.match(r"^(?:[●•▪◦]\s*|\d{1,2}[.)]\s+)", text))
        next_type = "listItem" if bullet else "paragraph"
        starts_indented_paragraph = (
            current_type == "paragraph"
            and next_type == "paragraph"
            and previous_x is not None
            and x0 > previous_x + 20
        )
        continues = (
            (
                current_type == next_type
                or (current_type == "listItem" and next_type == "paragraph" and x0 > current_x + 5)
            )
            and gap <= body_size
            and (next_type != "listItem" or x0 > current_x + 5)
            and not starts_indented_paragraph
        )
        if continues:
            if current_text.endswith("-") and not current_text.endswith(" -"):
                current_text = current_text[:-1] + text
            else:
                current_text += " " + text
        else:
            flush()
            current_type = next_type
            current_text = text
            current_x = x0
            current_top = top
        current_bottom = bottom
        previous_x = x0

    flush()
    return blocks


FRONT_MATTER_BLOCKS = {
    "making-ai-governable-for-americans-act": 0,
    "ai-market-structure-reform-act": 2,
    "digital-letters-of-marque": 1,
    "armenia-compute-diplomacy": 1,
    "virginia-public-contribution-requirements": 2,
    "ai-surveillance-communities": 2,
    "us-china-ai-approaches": 2,
    "ai-and-jobs-action-gap": 1,
    "how-ai-escapes-governance": 2,
    "ai-evaluations-landscape": 3,
    "governance-ai-generated-ncii": 1,
}

SECTION_LABELS = (
    "Policy Proposal and Implementation Mechanics",
    "Implementation and Deployment Considerations",
    "Policy Design and Implementation",
    "Trade-offs and Projected Impacts",
    "Non-binding Safety Recommendations",
    "Mandatory Pre-Deployment Security Certification",
    "Mandatory Labor Displacement Insurance",
    "Resilience to Technological Change",
    "Israel’s Surveillance In The Gaza Strip",
    "How AI Is Revolutionizing Facial Recognition",
    "Compute Diplomacy in Armenia",
    "Projected Data Center Expansions",
    "Cost Burden on State/Local Residents",
    "Limited Long-term Economic Benefit",
    "Policy Recommendation",
    "Policy Recommendation: The AI Safety Investigation Act",
    "Executive Summary",
    "Problem Statement",
    "Strategic Context",
    "Policy Proposal",
    "Implementation",
    "Impacts and Trade-Offs",
    "Revenue Impact",
    "FTC Impact",
    "Durability",
    "Background",
    "Organizational Structure",
    "Risk Standards Board",
    "Tradeoffs and Projected Impacts",
    "Tradeoffs",
    "Firebird Deal",
    "Russia’s Role",
    "Policy Implications",
    "The Elections",
    "Teaching to the Test",
    "The Elicitation Problem",
    "Grading Your Own Work",
    "The Lab-to-Life Gap",
    "Independent Evaluation",
    "Longitudinal Monitoring",
    "Pre-Deployment Access",
    "Transparent Methodology",
    "I. Cosmology",
    "II. Naturalization",
    "Introduction",
    "AI and ICE",
    "Conclusion",
    "Problem",
)

SUPERSCRIPT_DIGITS = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹", "0123456789")


def clean_pdf_text(text: str) -> str:
    exponent_map = {"24": "²⁴", "25": "²⁵", "26": "²⁶"}
    text = re.sub(
        r"\b10(24|25|26)(?=\s+(?:floating|compute|FLOP))",
        lambda match: "10" + exponent_map[match.group(1)],
        text,
        flags=re.I,
    )
    text = text.replace("c · ∆t d ≤ , (2)", "d ≤ c × Δt / 2. (2)")
    for broken, repaired in {
        "gov ernment": "government", "Digit al": "Digital", "ar tificial": "artificial",
        "h ack": "hack", "sch olarship": "scholarship", "Fra mework": "Framework",
        "develo pers": "developers", "offen sive": "offensive", "in telligence": "intelligence",
        "clas sics": "classics", "cen ters": "centers", ". html": ".html",
        "infrastr ucture": "infrastructure", "innovati on": "innovation",
        "t o-know": "to-know", "88d08 9ec": "88d089ec",
        "wpcontent": "wp-content", "Frameworkfor": "Framework-for",
        "netwo rk": "network", "char ged": "charged", "too ls": "tools",
    }.items():
        text = text.replace(broken, repaired)
    text = re.sub(r"(?<=\w)\s+([,.;:])", r"\1", text)
    return text.strip()


def split_source_headings(block: dict[str, object]) -> list[dict[str, object]]:
    """Promote only section labels that appear verbatim in the source."""
    text = str(block.get("text", ""))
    labels = sorted(SECTION_LABELS, key=len, reverse=True)
    label_pattern = "|".join(re.escape(label) for label in labels)
    matches = list(re.finditer(
        rf"(?:^({label_pattern})(?::)?(?=\s|$)|(?<!\w)({label_pattern}):(?=\s|$))",
        text,
    ))
    if not matches:
        return [block]
    result: list[dict[str, object]] = []
    cursor = 0
    for index, match in enumerate(matches):
        if match.start() > cursor:
            before = text[cursor:match.start()].strip()
            if before:
                result.append({**block, "type": "paragraph", "text": before})
        result.append({**block, "type": "heading", "text": match.group(1) or match.group(2)})
        cursor = match.end()
        if index + 1 < len(matches):
            next_start = matches[index + 1].start()
            between = text[cursor:next_start].strip()
            if between:
                result.append({**block, "type": "paragraph", "text": between})
            cursor = next_start
    tail = text[cursor:].strip()
    if tail:
        result.append({**block, "type": "paragraph", "text": tail})
    return result


def merge_page_continuations(blocks: list[dict[str, object]]) -> list[dict[str, object]]:
    merged: list[dict[str, object]] = []
    for block in blocks:
        text = str(block.get("text", ""))
        if (
            merged
            and merged[-1].get("type") == "paragraph"
            and block.get("type") == "paragraph"
            and (
                (
                    merged[-1].get("page") != block.get("page")
                    and (
                        re.match(r"^[a-z]", text)
                        or not re.search(r"[.!?\]\”\’)]$", str(merged[-1].get("text", "")))
                    )
                )
                or (
                    re.match(r"^[a-z]", text)
                )
            )
        ):
            merged[-1]["text"] = clean_pdf_text(
                f"{merged[-1]['text']} {text}"
            )
            for link in block.get("inlineLinks", []):
                merged[-1].setdefault("inlineLinks", []).append(link)
        else:
            merged.append(block)
    return merged


def rebuild_named_bibliography(
    blocks: list[dict[str, object]],
    entry_starts: tuple[str, ...],
    truncate_at: str | None = None,
) -> list[dict[str, object]]:
    ref_index = next(
        (i for i, block in enumerate(blocks) if re.match(r"^(?:references|works cited)\b", str(block["text"]), re.I)),
        -1,
    )
    if ref_index < 0:
        return blocks
    combined = " ".join(str(block["text"]) for block in blocks[ref_index + 1:])
    if truncate_at and truncate_at in combined:
        combined = combined.split(truncate_at, 1)[0].rstrip()
    start_pattern = "|".join(re.escape(start) for start in sorted(entry_starts, key=len, reverse=True))
    markers = list(re.finditer(rf"(?<!\w)({start_pattern})", combined))
    if not markers:
        return blocks
    rebuilt = blocks[:ref_index + 1]
    for index, marker in enumerate(markers):
        end = markers[index + 1].start() if index + 1 < len(markers) else len(combined)
        entry_text = clean_pdf_text(combined[marker.start():end])
        if entry_text.rstrip(".") == marker.group(1).rstrip("."):
            continue
        rebuilt.append({
            "type": "paragraph",
            "text": entry_text,
            "page": blocks[ref_index]["page"],
            "x": 0,
        })
    return rebuilt


def postprocess_pdf(slug: str, blocks: list[dict[str, object]]) -> list[dict[str, object]]:
    for block in blocks:
        block["text"] = clean_pdf_text(str(block.get("text", "")))

    if slug == "ai-safety-investigation-act" and blocks:
        marker = "Executive Summary"
        start = str(blocks[0]["text"]).find(marker)
        if start >= 0:
            blocks[0]["text"] = str(blocks[0]["text"])[start:]
    elif slug == "making-ai-governable-for-americans-act" and blocks:
        marker = "Policy Recommendation"
        start = str(blocks[0]["text"]).find(marker)
        if start >= 0:
            blocks[0]["text"] = str(blocks[0]["text"])[start:]
    elif slug == "national-ai-security-organization" and blocks:
        prefix = "Proposal for the National AI Security Organization (NASO)"
        blocks[0]["text"] = str(blocks[0]["text"]).removeprefix(prefix).strip()
        for block in blocks:
            text = str(block["text"])
            text = text.replace(" Background ", " Background: ")
            text = text.replace(" Implementation ", " Implementation: ")
            text = text.replace(" Tradeoffs ", " Tradeoffs: ")
            text = text.replace(" The Risk Standards Board—", " Risk Standards Board: ")
            block["text"] = text
    else:
        blocks = blocks[FRONT_MATTER_BLOCKS.get(slug, 0):]

    if slug == "modular-risk-based-frontier-ai-regulation":
        blocks = [
            block for block in blocks
            if not str(block.get("text", "")).startswith("FOR: Senator Brian Schatz")
        ]
        if blocks:
            title = "Policy Brief: Regulating Frontier AI Through A Modular Risk-Based Approach"
            blocks[0]["text"] = str(blocks[0]["text"]).removeprefix(title).strip()

        marker_map = {
            "games.i": "games.[1]", "weaponsii": "weapons[2]",
            "operation.iii": "operation.[3]", "AIiv": "AI[4]", "EOsv": "EOs[5]",
            "Actvi": "Act[6]", "SB-53vii": "SB-53[7]", "Actviii": "Act[8]",
            "incidents.ix": "incidents.[9]",
            "techniquesx": "techniques[10]", "FAAC)xi": "FAAC)[11]",
        }
        for block in blocks:
            for source, replacement in marker_map.items():
                block["text"] = str(block["text"]).replace(source, replacement)

        footnote_index = next(
            (i for i, block in enumerate(blocks) if re.match(r"^i\s+Rishi Bommasani", str(block["text"]))),
            -1,
        )
        if footnote_index >= 0:
            combined_notes = " ".join(str(block["text"]) for block in blocks[footnote_index:])
            roman_pattern = re.compile(
                r"(?:^|\s)(xi|ix|iv|viii|vii|vi|iii|ii|x|v|i)\s+(?=[A-Z“\"])",
                re.I,
            )
            note_markers = list(roman_pattern.finditer(combined_notes))
            note_blocks: list[dict[str, object]] = [{
                "type": "heading", "text": "References",
                "page": blocks[footnote_index]["page"], "x": 0,
            }]
            roman_values = {
                "i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5, "vi": 6,
                "vii": 7, "viii": 8, "ix": 9, "x": 10, "xi": 11,
            }
            for note_index, marker in enumerate(note_markers):
                start = marker.end()
                end = note_markers[note_index + 1].start() if note_index + 1 < len(note_markers) else len(combined_notes)
                note_blocks.append({
                    "type": "paragraph",
                    "text": f"[{roman_values[marker.group(1).lower()]}] {combined_notes[start:end].strip()}",
                    "page": blocks[footnote_index]["page"],
                    "x": 0,
                })
            blocks = blocks[:footnote_index] + note_blocks

        roman_section = re.compile(
            r"(?<!\w)((?:VIII|VII|III|VI|IV|IX|II|V|X|I)\.\s+[^:]{2,240}):",
        )
        sectioned: list[dict[str, object]] = []
        for block in blocks:
            text = str(block["text"])
            matches = list(roman_section.finditer(text))
            if not matches:
                sectioned.append(block)
                continue
            cursor = 0
            for match_index, match in enumerate(matches):
                before = text[cursor:match.start()].strip()
                if before:
                    sectioned.append({**block, "type": "paragraph", "text": before})
                sectioned.append({**block, "type": "subheading", "text": match.group(1)})
                cursor = match.end()
                if match_index + 1 < len(matches):
                    middle = text[cursor:matches[match_index + 1].start()].strip()
                    if middle:
                        sectioned.append({**block, "type": "paragraph", "text": middle})
                    cursor = matches[match_index + 1].start()
            tail = text[cursor:].strip()
            if tail:
                sectioned.append({**block, "type": "paragraph", "text": tail})
        blocks = sectioned

    blocks = merge_page_continuations(blocks)

    if slug != "dual-framework-ai-chip-smuggling":
        expanded: list[dict[str, object]] = []
        for block in blocks:
            expanded.extend(split_source_headings(block))
        blocks = expanded

    # Preserve the NASO paper's superscript citations as navigable numbered notes.
    if slug == "national-ai-security-organization":
        for block in blocks:
            block["text"] = re.sub(
                r"(?<!\d)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)",
                lambda match: f"[{match.group(1).translate(SUPERSCRIPT_DIGITS)}]",
                str(block["text"]),
            )
            if str(block["text"]).startswith("composed of AI safety researchers"):
                block["text"] = "Composed" + str(block["text"])[8:]

    if slug == "dual-framework-ai-chip-smuggling":
        cleaned_blocks: list[dict[str, object]] = []
        for block in blocks:
            text = str(block["text"])
            if text == "attack":
                continue
            if text.startswith("(1) where P"):
                block["text"] = (
                    "where P(success) is the probability that smuggled chips remain usable, "
                    "V(compute) is the value derived from their use, C(smuggle) is the cost of "
                    "transporting chips across borders, C(attack) is the cost of bypassing "
                    "technical protections, P(caught) is the probability of being caught by "
                    "U.S. authorities, and C(enforcement) is the cost of being caught. The "
                    "objective is to drive U < 0 for most actors."
                )
            elif text.startswith("2 where c is the speed of light"):
                block["text"] = (
                    "where c is the speed of light in the transmission medium (approximately "
                    "3 × 10⁸ m/s in vacuum, lower in fiber). In practice, propagation occurs "
                    "over network infrastructure with additional latency from routing, switching, "
                    "queuing, and processing."
                )
            elif text.startswith("2d ∆t ="):
                block["text"] = "Δt = 2d/c + δ_net + δ_proc. (3)"
            elif text.startswith("c net proc where δ"):
                block["text"] = (
                    "Here δ_net captures network-induced delays and δ_proc accounts for processing "
                    "overhead. Conservative upper bounds must be estimated empirically or through "
                    "calibration. To tighten the bounds, systems employ:"
                )
            cleaned_blocks.append(block)
        blocks = cleaned_blocks

    # The Virginia memo moves directly from body copy into numbered endnotes.
    if slug == "virginia-public-contribution-requirements":
        first_note = next(
            (i for i, block in enumerate(blocks) if re.match(r"^1\.\s", str(block["text"]))),
            -1,
        )
        if first_note >= 0:
            existing_heading = first_note > 0 and str(blocks[first_note - 1]["text"]).lower() == "endnotes"
            if existing_heading:
                blocks[first_note - 1]["type"] = "heading"
            else:
                blocks.insert(first_note, {
                    "type": "heading", "text": "Endnotes",
                    "page": blocks[first_note]["page"], "x": blocks[first_note].get("x", 0),
                })

    # Rebuild the seven hanging-indent bibliography entries in the surveillance essay.
    if slug == "ai-surveillance-communities":
        ref_index = next((i for i, block in enumerate(blocks) if str(block["text"]).lower() == "works cited"), -1)
        if ref_index >= 0:
            rebuilt = blocks[:ref_index + 1]
            entry: dict[str, object] | None = None
            entry_starts = (
                "Frenkel,", "Hubbard,", "Silberling,", "Stanley,",
                "Questions and Answers:", "“What is AI Surveillance",
            )
            for block in blocks[ref_index + 1:]:
                is_new = entry is None or str(block["text"]).startswith(entry_starts)
                if is_new:
                    if entry is not None:
                        rebuilt.append(entry)
                    entry = {**block, "type": "paragraph"}
                else:
                    entry["text"] = clean_pdf_text(f"{entry['text']} {block['text']}")
            if entry is not None:
                rebuilt.append(entry)
            blocks = rebuilt

    if slug == "armenia-compute-diplomacy":
        image_index = next((i for i, block in enumerate(blocks) if block.get("type") == "image"), -1)
        if image_index >= 0:
            caption_index = next(
                (i for i in range(image_index + 1, len(blocks)) if str(blocks[i]["text"]).startswith("Photo via Nvidia Blog")),
                -1,
            )
            if caption_index >= 0:
                caption_text = str(blocks[caption_index]["text"])
                caption, _, remainder = caption_text.partition(" These kinds of signals")
                blocks[image_index]["caption"] = caption
                blocks[image_index]["alt"] = "NVIDIA's announced AI infrastructure partnerships across Europe"
                if remainder:
                    blocks[caption_index]["text"] = "These kinds of signals" + remainder
                else:
                    blocks.pop(caption_index)

    if slug == "us-china-ai-approaches":
        blocks = rebuild_named_bibliography(blocks, (
            "Afra Wang.", "American Battlefield Trust.", "Barnes,", "Bogel-Burroughs,",
            "Deane,", "Denford,", "Fung,", "Ge,", "Global AI Narratives",
            "Gorelick,", "Kennedy,", "KPMG.", "Sloan,", "Song,", "Tavernise,",
            "Vigers,", "Wang, V.", "Zakaras,", "Zhu,",
        ), truncate_at=(
            "https://mitsloan.mit.edu/press/generative-ais-hidden-cultural-tendencies "
            "https://www.sciencedirect.com"
        ))

    if slug == "how-ai-escapes-governance":
        blocks = rebuild_named_bibliography(blocks, (
            "Andreessen,", "Barthes,", "Baudrillard,", "Berger,", "Bourdieu,", "Browne,",
            "Corporate Europe Observatory.", "DeepLearning.AI.", "DLA Piper.",
            "EU Artificial Intelligence Act.", "Geertz,", "Hao,", "Heikkilä,",
            "Interstate Commerce Act", "Kinkade,", "Meredith,", "Novet,", "OpenSecrets.",
            "Perrigo,", "Picchi,", "Roberts,", "Schmidt,", "Trump, D. J. (2025, December",
            "Trump, D. J. (2025, January", "Zuckerberg,",
        ))

    if slug == "governance-ai-generated-ncii":
        blocks = rebuild_named_bibliography(blocks, (
            "Ding,", "Jingnan,", "“The Work Never Stops", "Tools to Address Known Exploitation",
        ))

    if slug == "virginia-public-contribution-requirements":
        blocks = rebuild_named_bibliography(blocks, (
            "Ahmed,", "Ajuzieogu,", "American Action Forum.", "Besiroglu,", "Clean Virginia.",
            "Good Jobs First.", "GovTech.", "Inside Climate News.",
            "Joint Legislative Audit and Review Commission", "Martin,", "Nature.",
            "Piedmont Environmental Council", "Sastry,", "State Corporation Commission",
            "State Council of Higher Education", "University of Virginia Office of the Provost.",
            "Virginia General Assembly. House Bill 155", "Virginia General Assembly. House Bill 503",
            "Virginia General Assembly. House Bill 897", "Virginia General Assembly. House Bill 1151",
            "Virginia General Assembly. Senate Bill 253", "Virginia General Assembly. Senate Bill 619",
            "Virginia Law. Code of Virginia § 2.2", "Virginia Law. Code of Virginia § 56-580",
            "Virginia Law. Code of Virginia § 58.1", "Wall Street Journal/CNBC.", "VPM News.",
        ))

    # List labels in policy briefs belong with the prose that follows them.
    ref_index = next(
        (i for i, block in enumerate(blocks) if re.match(r"^(?:references|citations|sources|works cited|endnotes)\b", str(block["text"]), re.I)),
        len(blocks),
    )
    merged_lists: list[dict[str, object]] = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        if (
            slug in {
                "ai-safety-investigation-act", "making-ai-governable-for-americans-act",
                "digital-letters-of-marque",
            }
            and index < ref_index
            and block.get("type") == "listItem"
        ):
            while index + 1 < ref_index and blocks[index + 1].get("type") == "paragraph":
                following = blocks[index + 1]
                block["text"] = clean_pdf_text(f"{block['text']} {following['text']}")
                index += 1
            if str(block["text"]).strip() not in {"●", "•"}:
                merged_lists.append(block)
        else:
            merged_lists.append(block)
        index += 1
    return [
        block for block in merged_lists
        if block.get("type") == "image" or str(block.get("text", "")).strip()
    ]


def extract_pdf(
    relative_path: str,
    two_column: bool = False,
    asset_slug: str | None = None,
) -> dict[str, object]:
    path = ROOT / relative_path
    pages: list[str] = []
    blocks: list[dict[str, object]] = []
    links: list[str] = []
    figure_number = 0
    with pdfplumber.open(path) as document:
        for page_number, page in enumerate(document.pages, start=1):
            if two_column and page_number <= 3:
                content_top = 190 if page_number == 1 else 62
                regions = [
                    page.crop((50, content_top, page.width / 2, 653 if page_number == 1 else 745)),
                    page.crop((page.width / 2, content_top, page.width - 50, 745)),
                ]
            elif two_column:
                regions = [page.crop((50, 62, page.width - 50, 745))]
            else:
                regions = [page]

            page_text = []
            page_blocks: list[dict[str, object]] = []
            for region in regions:
                page_text.append(normalize_page_text(
                    region.extract_text(x_tolerance=1.5, y_tolerance=3) or ""
                ))
                region_blocks = extract_page_blocks(
                    region,
                    page_number,
                    academic_sections=two_column,
                )
                if (
                    page_blocks
                    and region_blocks
                    and str(page_blocks[-1]["text"]).endswith("-")
                    and page_blocks[-1]["type"] == "paragraph"
                    and region_blocks[0]["type"] == "paragraph"
                ):
                    page_blocks[-1]["text"] = (
                        str(page_blocks[-1]["text"])[:-1] + str(region_blocks.pop(0)["text"])
                    )
                page_blocks.extend(region_blocks)

            # Preserve the source document's inline hyperlinks. PDF annotations
            # carry both a destination and a rectangle; matching that rectangle
            # to the extracted block lets the website link the original words
            # instead of dumping raw URLs below the article.
            for hyperlink in page.hyperlinks:
                uri = hyperlink.get("uri")
                if not uri:
                    continue
                link_top = float(hyperlink.get("top", 0))
                link_bottom = float(hyperlink.get("bottom", link_top))
                try:
                    label = normalize_page_text(page.crop((
                        max(0, float(hyperlink.get("x0", 0)) - 1),
                        max(0, link_top - 1),
                        min(page.width, float(hyperlink.get("x1", page.width)) + 1),
                        min(page.height, link_bottom + 1),
                    )).extract_text(x_tolerance=1.5, y_tolerance=3) or "")
                except ValueError:
                    label = ""
                if not label:
                    continue
                candidates = [
                    block for block in page_blocks
                    if block.get("type") != "image"
                    and float(block.get("bottom", 0)) >= link_top - 2
                    and float(block.get("top", page.height)) <= link_bottom + 2
                ]
                target = next(
                    (block for block in candidates if label in str(block.get("text", ""))),
                    candidates[0] if len(candidates) == 1 else None,
                )
                if target is not None:
                    target.setdefault("inlineLinks", []).append({"text": label, "url": uri})

            if asset_slug:
                for embedded_image in sorted(page.images, key=lambda item: float(item["top"])):
                    figure_number += 1
                    width, height = embedded_image["srcsize"]
                    asset_directory = ASSET_ROOT / asset_slug
                    asset_directory.mkdir(parents=True, exist_ok=True)
                    asset_path = asset_directory / f"figure-{figure_number}.png"
                    image_data = embedded_image["stream"].get_data()
                    if image_data.startswith((b"\xff\xd8", b"\x89PNG")):
                        with Image.open(io.BytesIO(image_data)) as source_image:
                            source_image.convert("RGB").save(asset_path)
                    else:
                        Image.frombytes("RGB", (width, height), image_data).save(asset_path)
                    caption_index = next(
                        (
                            index for index, block in enumerate(page_blocks)
                            if str(block["text"]).lower().startswith(f"figure {figure_number}.")
                        ),
                        sum(
                            1 for block in page_blocks
                            if float(block.get("bottom", 0)) <= float(embedded_image["top"]) + 2
                        ),
                    )
                    caption = None
                    if page_blocks and caption_index < len(page_blocks):
                        candidate = str(page_blocks[caption_index]["text"])
                        if candidate.lower().startswith(f"figure {figure_number}."):
                            caption = candidate
                            page_blocks.pop(caption_index)
                    page_blocks.insert(caption_index, {
                        "type": "image",
                        "src": f"/research/articles/{asset_slug}/figure-{figure_number}.png",
                        "alt": f"Figure {figure_number} from the original paper",
                        "caption": caption,
                        "width": width,
                        "height": height,
                        "page": page_number,
                        "text": "",
                    })
            blocks.extend(page_blocks)
            pages.append("\n".join(filter(None, page_text)))
            for link in page.hyperlinks:
                uri = link.get("uri")
                if uri and uri not in links:
                    links.append(uri)

    if two_column:
        merged_blocks: list[dict[str, object]] = []
        for block in blocks:
            if (
                merged_blocks
                and merged_blocks[-1]["type"] == "paragraph"
                and block["type"] == "paragraph"
                and not re.search(r"[.!?:;)]$", str(merged_blocks[-1]["text"]))
                and re.match(r"^[a-z]", str(block["text"]))
            ):
                merged_blocks[-1]["text"] = (
                    str(merged_blocks[-1]["text"]) + " " + str(block["text"])
                )
            else:
                merged_blocks.append(block)
        blocks = merged_blocks

        references_index = next(
            (index for index, block in enumerate(blocks) if str(block["text"]).lower() == "references"),
            -1,
        )
        appendix_index = next(
            (index for index, block in enumerate(blocks) if int(block["page"]) >= 4),
            -1,
        )
        if references_index >= 0 and appendix_index > references_index:
            blocks = (
                blocks[:references_index]
                + blocks[appendix_index:]
                + blocks[references_index:appendix_index]
            )

        for block in blocks:
            text = str(block["text"]).replace("locationverification", "location-verification")
            block["text"] = text
            if text.startswith("U = P"):
                block["text"] = (
                    "U = P(success) × V(compute) − C(smuggle) − C(attack) "
                    "− P(caught) × C(enforcement)"
                )
            elif text.startswith("where P is the probability that smuggled chips"):
                block["text"] = (
                    "where P(success) is the probability that smuggled chips remain usable, "
                    "V(compute) is the value derived from their use, C(smuggle) is the cost of "
                    "transporting chips across borders, C(attack) is the cost of bypassing "
                    "technical protections, P(caught) is the probability of being caught by "
                    "U.S. authorities, and C(enforcement) is the cost of being caught. The "
                    "objective is to drive U < 0 for most actors."
                )
            elif text.startswith("• Each verifier measures"):
                block["text"] = "• Each verifier measures Δtᵢ and computes dᵢ(max)."
            elif text.startswith("• The feasible region is"):
                block["text"] = (
                    "• The feasible region is the intersection of "
                    "{x : ‖x − Vᵢ‖ ≤ dᵢ(max)} across all verifiers."
                )
    if asset_slug:
        blocks = postprocess_pdf(asset_slug, blocks)
    plain_text = " ".join(pages)
    for block in blocks:
        block.pop("top", None)
        block.pop("bottom", None)
        block.pop("x", None)
    return {
        "format": "pdf-text",
        "pages": pages,
        "blocks": blocks,
        "links": links,
        "wordCount": len(re.findall(r"\b[\w'-]+\b", plain_text)),
    }


def main() -> None:
    pdf_only = "--pdf-only" in sys.argv[1:]
    content: dict[str, object] = {}
    if pdf_only and OUTPUT.exists():
        existing = json.loads(OUTPUT.read_text(encoding="utf-8"))
        content.update({slug: existing[slug] for slug in POSTS if slug in existing})
    for slug, relative_path in PDFS.items():
        print(f"Extracting {relative_path}")
        content[slug] = extract_pdf(
            relative_path,
            two_column=slug in TWO_COLUMN_PDFS,
            asset_slug=slug,
        )
    if not pdf_only:
        for slug, url in POSTS.items():
            print(f"Importing {url}")
            content[slug] = sanitize_post(slug, url)

    OUTPUT.write_text(
        json.dumps(content, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
