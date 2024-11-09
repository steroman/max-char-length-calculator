# 📐 Maximum character length calculator for UI elements

**Live Demo:** [https://max-char-length-calculator.netlify.app](https://max-char-length-calculator.netlify.app)

This tool calculates the maximum allowable character length for UI elements like buttons and labels, based on real data. It is designed to help UX/UI designers optimize text lengths for readability and consistency across languages and screen sizes. The calculator is based on the formula and approach detailed in [this article](https://uxcontent.com/a-formula-for-defining-maximum-character-lengths/).

## Table of Contents

- [Formula overview](#formula-overview)
- [Getting started](#getting-started)
- [Tech stack](#tech-stack)
- [Data sources](#data-sources)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Formula overview

The calculation formula is:
`MAX LENGTH = BUTTON WIDTH / AVERAGE CHARACTER WIDTH``

Here, the **average character width** is derived by averaging the widths of all characters in a dataset, weighted by their frequency of use.

## Getting started

To complete the calculation, users should provide:

1. **Dataset as a JSON file** – Supply character frequency and width data in JSON format.
   - Supports [flat](https://docs.lokalise.com/en/articles/1400771-json-flat-json) and [structured](https://docs.lokalise.com/en/articles/3229161-structured-json) JSON files
   - Alternatively, use the default generic dataset (Note: currently supports only English as the source language).
2. **UI Element Width** – Input the width of the target UI element in pixels, minus any padding or margin.
3. **Character Widths** – Specify the width in pixels for each character.
4. **Additional Localizations** (optional) – Include extra JSON files for other languages to adjust maximum character lengths according to language expansion rates.

### Dataset customization

When using custom datasets, users can apply the following filters:

- **Ignore capital letters** – Treats uppercase and lowercase as the same character (e.g., `A` and `a`).
- **Ignore numbers** – Excludes numeric characters (`1`, `2`, etc.).
- **Ignore symbols** – Removes non-alphabetic symbols (e.g., `!`, `?`).
- **Ignore spaces** – Omits spaces from the dataset.

## Tech stack

This application is built using modern web development tools:

- **[Vite](https://vitejs.dev/)** – Fast build tool and development environment
- **[Vue](https://vuejs.org/)** – Reactive JavaScript framework
- **[TailwindCSS](https://tailwindcss.com/)** – Utility-first CSS framework
- **[Pinia](https://pinia.vuejs.org/)** – State management library for Vue
- **[Vue Router](https://router.vuejs.org/)** – Official router for Vue
- **[Netlify](https://www.netlify.com/)** – Platform for deployment and hosting
- **[EmailJS](https://www.emailjs.com/)** – For feedback form emails
- **[OpenType.js](https://opentype.js.org/)** – For automatic character width calculation (more info)

### Data sources

The app leverages reliable sources for linguistic data and UI standards:

- **Code built with Bolt** – [Bolt](https://www.bolt.new)
- **Language list** – [Provided by eddieoz on GitHub](https://gist.github.com/eddieoz/63d839c8a20ef508cfa4fa9562632a21)
- **Text expansion rates** – [Andiamo.co.uk](https://www.andiamo.co.uk/resources/expansion-and-contraction-factors/)

### Automatic character width calculation

The app can automatically calculate the width of each character in the dataset using the [OpenType.js](https://opentype.js.org/) library.

> ℹ️ The OpenType.js library and your design tool render fonts differently, so the character widths may differ slightly.

#### Font metrics

- Each font file contains a property called unitsPerEm (units per em square)
- This is the grid size the font was designed on (typically 1000 or 2048 units)
- Each glyph (character) has an advanceWidth property measured in these units

#### Width calculation process

For example, if:

- Font size is 16px
- unitsPerEm is 1000
- A character's advanceWidth is 500 units

Then:

- pixelsPerUnit = 16/1000 = 0.016
- Final width = 500 * 0.016 = 8 pixels

#### Additional factors

- We apply a 1.05 multiplier to account for font rendering differences
- The result is rounded to the nearest pixel since screens can't display partial pixels
- Some fonts include extra spacing in their metrics for better rendering
- This calculation gives us the actual space a character occupies in the specified font size, including its sidebearings (spacing on either side of the visible glyph).

## Usage

### Installation

To install dependencies, run:

```sh
npm install
```

### Development

To compile and hot-reload for development:

```sh
npm run dev
```

### Production build

To type-check, compile, and minify for production:

```sh
npm run build
```

## Contributing

Contributions are welcome! If you find an issue or have an idea for improvement, feel free to open an issue or submit a pull request.

Thank you for using the Max Character Length Calculator! We hope this tool makes it easier to design scalable and language-flexible UI elements.

## License

This project is licensed under the [MIT License](LICENSE).