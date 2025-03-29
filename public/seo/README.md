# SEO Text Optimization Tool

This tool generates optimized titles and descriptions for your website content using both fallback methods and LLM-based optimization.

## Features

- Processes all content types (publications, projects, talks, blog posts, teaching)
- Generates fallback shortened texts using smart truncation
- Supports LLM-based optimization (configurable)
- Preserves original texts alongside optimized versions
- Handles both BibTeX and JSON content sources

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure the tool:
   - Edit `config.json` to set your preferences
   - For LLM support, add your API key and enable the feature

## Usage

Run the optimization:

```bash
npm start
```

This will:

1. Process all content from your website
2. Generate fallback shortened texts
3. If LLM is enabled, generate LLM-optimized texts
4. Save results to `shortened-texts.json`

## Output Format

The tool generates a `shortened-texts.json` file with the following structure:

```json
{
  "items": {
    "publications/example-paper": {
      "id": "example-paper",
      "type": "publication",
      "title": {
        "original": "Original Long Title",
        "fallback": "Shortened Title",
        "llm": "LLM Optimized Title" // Only if LLM is enabled
      },
      "description": {
        "original": "Original Long Description",
        "fallback": "Shortened Description",
        "llm": "LLM Optimized Description" // Only if LLM is enabled
      }
    }
  }
}
```

## Configuration

Edit `config.json` to customize:

- Target lengths for titles and descriptions
- Fallback truncation settings
- LLM provider settings (if enabled)
- Common suffixes to remove from titles

## Integration with Website

The website can use the generated `shortened-texts.json` to:

1. Use LLM-optimized texts if available
2. Fall back to simple truncation if LLM texts are not available
3. Use original texts as a last resort

## Development

To add LLM support:

1. Enable LLM in `config.json`
2. Add your API key
3. Configure the LLM provider settings
4. Run the tool to generate LLM-optimized texts
