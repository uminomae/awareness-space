# Prompt Template: Four-Layer Model Overview SVG

Generate a polished SVG infographic for the Awareness topic report below.

## Topic

- slug: `four-layers`
- language: `{{lang}}`
- title: `{{title}}`

## Intent

This SVG should function as a single high-quality overview graphic placed directly after section 1 of the public report.
It should help a reader grasp:

1. The four-layer sequence as one flow
2. The distinct role of each layer
3. The relationship between bodily footing, discrepancy, directional interpretation, and revision margin
4. The fact that this is a structural reading, not a final settled theory

## Layout requirements

- canvas: `viewBox="0 0 1200 800"`
- one self-contained SVG file only
- four clearly separated layer panels
- strong left-to-right reading
- each layer should have a clear short label and 1-2 short explanatory lines
- include a compact subtitle describing the whole model
- no fake measurement, no excessive ornament, no dark heavy gradients

## Visual direction

- background: warm off-white
- typography:
  - Japanese: `"Hiragino Sans", "Noto Sans JP", sans-serif`
  - English: `"Inter", "Helvetica Neue", sans-serif`
- style: calm, analytic, publication-quality
- each layer gets its own restrained color family
- arrows or connectors should read as process, not hierarchy of value

## Content constraints

- do not invent claims not present in the report
- do not add citations
- do not mention issue numbers, repo names, internal workflow, or file paths
- do not portray Layer 3 as morally superior
- do not use raster images

## Technical constraints

- required:
  - `<svg ... xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">`
  - `<text>` / `<tspan>` only for text
- forbidden:
  - `<foreignObject>`
  - `<script>`
  - `<animate>`
  - `<animateTransform>`
  - `<animateMotion>`
  - `<image>`
  - `<filter>`
  - `<style>`
- output SVG only, no markdown fences, no explanation

## Report source

{{report_markdown}}
