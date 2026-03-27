# Prompt Template: Survival-Trust Axis Overview SVG

Generate a polished SVG infographic for the Awareness topic report below.

## Topic

- slug: `survival-trust-axis`
- language: `{{lang}}`
- title: `{{title}}`

## Intent

This SVG should function as a single high-quality overview graphic placed directly after section 1 of the public report.
It should help a reader grasp:

1. The two axes: survival and trust / intersubjectivity
2. The difference between the two directions of interpretation
3. The current findings:
   - developmental basis
   - internalized relational resources
   - repairability as a candidate route to observability
   - the central term remains unsettled

## Layout requirements

- canvas: `viewBox="0 0 1200 800"`
- one self-contained SVG file only
- clean editorial design, not hand-drawn
- no gradients that reduce readability
- no decorative clutter
- no charts that imply fake numerical precision
- use a refined light background
- emphasize the two-axis structure clearly
- include one compact findings panel
- all text must be legible at normal browser size

## Visual direction

- background: warm off-white
- typography:
  - Japanese: `"Hiragino Sans", "Noto Sans JP", sans-serif`
  - English: `"Inter", "Helvetica Neue", sans-serif`
- style: calm, analytic, publication-quality
- use distinct but restrained colors for survival and trust
- survival should feel threat / defense / protection oriented
- trust should feel relational / repairable / connective

## Content constraints

- do not invent claims not present in the report
- do not add citations
- do not mention issue numbers, repo names, internal workflow, or file paths
- do not use emojis
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
