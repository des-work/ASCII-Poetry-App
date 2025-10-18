# 🎨 ASCII Art Poetry

A modern, feature-rich web application for converting text, images, and poetry into beautiful ASCII art with advanced color, animation, and layout options.

## ✨ Features

### 📝 Text to ASCII
- **24+ Font Styles**: A massive collection of fonts including `standard`, `block`, `bubble`, `3d`, `pixel`, and many more.
- **Advanced Colors**: Multiple solid colors plus `rainbow` and `gradient` effects.
- **Dynamic Animations**: `Glow`, `wave`, `fade`, and `typewriter` effects to bring your art to life.

### 🖼️ Image to ASCII
- **Easy Upload**: Supports all common image formats (`jpg`, `png`, `webp`, `gif`).
- **Customizable Output**: Adjust character width and choose from multiple character sets for different styles.
- **Accurate Aspect Ratio**: Intelligent conversion produces well-proportioned art.

### 📜 Poetry Art
- **Keyword Highlighting**: Transform specific words in your poem into ASCII art using special fonts.
- **Auto-Detect Keywords**: Intelligently finds and suggests significant keywords from your poem.
- **Layouts & Decorations**: Choose from multiple layouts and add decorative borders like `flowers`, `stars`, or `hearts`.

### 💎 User Experience
- **Sleek, Modern UI**: A cyberpunk-inspired interface with a dark theme and neon accents.
- **Rich Feedback**: Animated loading indicators and toast notifications for all actions.
- **Export Options**: Easily copy to clipboard or download your creation as a `.txt` file.
- **Responsive Design**: Flawless experience on both desktop and mobile devices.
- **Theme Support**: Switch between dark and light themes, with your preference saved locally.

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server to run the application (due to JavaScript module usage).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/des-work/ASCII-Poetry-App.git
   cd ASCII-Art-Poetry
   ```

2. **Start a local web server.** This project uses JavaScript modules and APIs that require it to be served from a web server. **Do not open the `index.html` file directly in your browser.**

   Here are a few easy ways to start a server. Choose one:

   **Option A: Using Node.js (Recommended)**
   If you have Node.js installed, this is the simplest method.
   ```bash
   npx serve
   ```
   This will start a server and give you a local URL (like `http://localhost:3000`).

   **Option B: Using Python**
   If you have Python installed, you can use its built-in web server.
   ```bash
   # For Python 3
   python -m http.server

   # For Python 2
   python -m SimpleHTTPServer
   ```
   This will typically start a server at `http://localhost:8000`.

3. **Open the application in your browser.**
   Navigate to the URL provided by your local server (e.g., `http://localhost:3000` or `http://localhost:8000`). The application should now load correctly.

## 📖 Usage

### Text Mode
1. Select the "Text" mode.
2. Enter your text in the input field
3. Choose your preferred font, color, and animation from the "Options" panel.
4. Click "Generate ASCII Art".

### Image Mode
1. Select the "Image" mode.
2. Upload an image file.
3. Adjust the width and character set.
4. Click "Generate ASCII Art".

### Poetry Mode
1. Select the "Poetry" mode.
2. Enter your poem.
3. Add keywords manually or use the "Auto-Detect" button.
4. Choose a font, layout, and decoration.
5. Click "Generate ASCII Art".

## 🎨 Font Styles

The application includes over 24 fonts, from classic `block` and `standard` styles to artistic and decorative ones like `elegant`, `gothic`, and `star`.

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+)**: No frameworks, pure modular JavaScript
- **Canvas API**: For image processing
- **File API**: For file uploads
- **Clipboard API**: For copy functionality

### File Structure
```
ASCII-Poetry-App/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- ASCII art fonts inspired by various figlet implementations
- Modern CSS techniques from the web development community
- JavaScript best practices from MDN and modern web standards

## 🔮 Future Enhancements

- [ ] Additional font styles
- [ ] More animation effects
- [ ] Batch processing for multiple images
- [ ] Custom character set creation
- [ ] ASCII art gallery
- [ ] Social sharing features
- [ ] Mobile app version

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the maintainers

---

Made with ❤️ by the ASCII Art Generator team
