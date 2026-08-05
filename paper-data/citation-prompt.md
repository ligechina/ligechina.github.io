# Prompt: Render `papers.json` entries as homepage-style citation strings

Paste this prompt (together with the relevant entries from `papers.json`) into an LLM to get citation strings that exactly match the formatting used on Ge Li's homepage.

---

You will be given one or more JSON objects that conform to `papers.schema.json`. Each object describes one publication and has a `"type"` field of `"arxiv"`, `"conference"`, or `"journal"`. Render each object as a single plain-text citation line using EXACTLY the template for its type below. Do not add, omit, or reorder punctuation. Do not invent data that isn't in the JSON — if an optional field is `null`, omit the segment it belongs to (and the delimiter/space that would have followed it) rather than printing "null" or leaving a stray space.

## Shared building blocks

- **Author list**: join `authors` with `", "`, then end the list with `"; "` (semicolon + space) before the title. Do not bold/mark any particular author.
- **`(Cited by N)`**: if `citedBy` is not null, append a space then `(Cited by N)` at the very end of the line. If `citedBy` is null, omit this entirely (no trailing space).
- **Month abbreviations**: use the 3-letter form already stored in the JSON followed by a period, e.g. `"Apr"` → `"Apr."`.

## Type: `arxiv`

Template:
```
[arXiv {year}] {authors joined by ", "}; {title}; arXiv preprint, arXiv:{arxivId}, {year}. (Cited by {citedBy})
```

Rules:
- Bracket label is always `arXiv {year}`.
- After the author list's trailing `;`, one space, then the title, then `;`.
- Then `" arXiv preprint, arXiv:{arxivId}, {year}."` — note the arXiv id has no space after the colon.
- Append `(Cited by N)` per the shared rule above (omit if `citedBy` is null).

Example:
```json
{"type":"arxiv","year":2025,"authors":["Hao Zhu","Jia Li","Cuiyun Gao","Jiaru Qian","Yihong Dong","Huanyu Liu","Lecheng Wang","Ziliang Wang","Xiaolong Hu","Ge Li"],"title":"Specification-Guided Vulnerability Detection with Large Language Models","arxivId":"2511.04014","citedBy":7}
```
→
```
[arXiv 2025] Hao Zhu, Jia Li, Cuiyun Gao, Jiaru Qian, Yihong Dong, Huanyu Liu, Lecheng Wang, Ziliang Wang, Xiaolong Hu, Ge Li; Specification-Guided Vulnerability Detection with Large Language Models; arXiv preprint, arXiv:2511.04014, 2025. (Cited by 7)
```

## Type: `conference`

Template:
```
[{venueShort} {year}] {authors joined by ", "}; {title}; {venueFull} ({venueShort} {year}), {location.city}, {location.country}, {dateStart.month}. {dateStart.day} - {dateEnd.month if dateEnd.month != dateStart.month, else omit}{". " if dateEnd.month != dateStart.month else ""}{dateEnd.day}, {eventYear}. (Cited by {citedBy})
```

Rules for the date range specifically (this is the fiddly part):
- If `dateStart.month == dateEnd.month`: `"{month}. {startDay} - {endDay}, {eventYear}."` — e.g. `"Apr. 12 - 18, 2026."`
- If the months differ (a range crossing a month boundary): `"{startMonth}. {startDay} - {endMonth}. {endDay}, {eventYear}."` — e.g. `"Jul. 27 - Aug. 1, 2025."`
- If `dateStart`/`dateEnd` are null (date wasn't parseable), just print `"{eventYear}."` on its own.
- If `location` is null, omit the location segment (and its trailing comma) entirely.
- If `location.country` is missing (some entries only have a city), print just the city followed by `", "`.
- If `award` is not null, insert `" 【{award}】."` immediately after the date sentence, before the citation/PDF links.
- If `note` is not null (e.g. `"Findings Paper"`), insert `", ({note})"` right before the final period of the date sentence.

Example:
```json
{"type":"conference","year":2026,"authors":["Kechi Zhang","Huangzhao Zhang","Ge Li","Jinliang You","Jia Li","Yunfei Zhao","Zhi Jin"],"title":"SEAlign: Alignment Training for Software Engineering Agent","venueShort":"ICSE","venueFull":"Proceedings of the 48th IEEE/ACM International Conference on Software Engineering","location":{"city":"Rio de Janeiro","country":"Brazil"},"dateStart":{"month":"Apr","day":12},"dateEnd":{"month":"Apr","day":18},"eventYear":2026,"award":"ACM SIGSOFT Distinguished Paper Award","citedBy":6}
```
→
```
[ICSE 2026] Kechi Zhang, Huangzhao Zhang, Ge Li, Jinliang You, Jia Li, Yunfei Zhao, Zhi Jin; SEAlign: Alignment Training for Software Engineering Agent; Proceedings of the 48th IEEE/ACM International Conference on Software Engineering (ICSE 2026), Rio de Janeiro, Brazil, Apr. 12 - 18, 2026. 【ACM SIGSOFT Distinguished Paper Award】. (Cited by 6)
```

## Type: `journal`

Template:
```
[{venueShort}, {year}] {authors joined by ", "}; {title}; {venueFull}; Vol. {volume}, Iss. {issue}, {pubDate.month}. {pubDate.day}, {pubDate.year}, pp.{pages.start}-{pages.end}. (Cited by {citedBy})
```

Rules:
- Bracket label always has a comma: `"{venueShort}, {year}"`.
- If `volume` is null, omit the `"Vol. N, "` segment. Same for `issue` → omit `"Iss. N, "` if null.
- If `articleNumber` is not null, use it in place of the Vol./Iss. page position where the source does so — i.e. print `"Vol. {volume}, No. {issue}, Article {N}, {pubDate.month}. {pubDate.year}."` (articleNumber papers generally don't also have a `pages` range).
- Date: if `pubDate.day` is present print `"{month}. {day}, {year},"`; if `pubDate.day` is null print `"{month}. {year},"`; if `pubDate.month` is also null print just `"{year},"`.
- Pages: if `pages` is present use `"pp.{start}-{end}."`. If `pages` is null but `pagesText` is present, use `"pp.{pagesText}."`. If both are null, omit the pages segment and end the venue sentence with a period after the date instead.
- If `note` equals `"Accepted"`, append `"(Accepted)"` immediately after the year in the bracket-label sentence area, matching the source style `"..., 2025.(Accepted)"` — i.e. glue it directly after the venue name's year with no space, before any PDF/citation links.

Example:
```json
{"type":"journal","year":2025,"authors":["Jia Li","Chongyang Tao","Jia Li","Ge Li","Zhi Jin","Huangzhao Zhang","Zheng Fang","Fang Liu"],"title":"Large language Model-aware in-Context Learning for Code Generation","venueShort":"TOSEM","venueFull":"ACM Transactions on Software Engineering and Methodology","volume":34,"issue":7,"pubDate":{"month":"Aug","day":14,"year":2025},"pages":{"start":1,"end":33},"citedBy":92}
```
→
```
[TOSEM, 2025] Jia Li, Chongyang Tao, Jia Li, Ge Li, Zhi Jin, Huangzhao Zhang, Zheng Fang, Fang Liu; Large language Model-aware in-Context Learning for Code Generation; ACM Transactions on Software Engineering and Methodology; Vol. 34, Iss. 7, Aug. 14, 2025, pp.1-33. (Cited by 92)
```

## Output instructions

- Render one line per JSON object, in the order given, with no numbering or bullets unless asked.
- If asked for a specific subset (e.g. "only 2025 papers", "only journal papers"), filter on the relevant field (`year`, `type`) before rendering — don't render entries that don't match.
- If asked for BibTeX or another format instead of this plain-text style, ignore the templates above and use that format's own conventions, but still source every field from the JSON object rather than guessing.
