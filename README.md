# 🎨 ASCII Art Generator

A modern, feature-rich web application for converting text and images into beautiful ASCII art with color and animation options.

## ✨ Features

### Text to ASCII Art
- **Multiple Font Styles**: 9 different ASCII fonts including Standard, Block, Bubble, Lean, Mini, Script, Slant, Small, and Big
- **Color Options**: 8 color choices plus rainbow effect
- **Animations**: Blink, scroll, wave, and glow effects
- **Real-time Preview**: See your ASCII art as you type

### Image to ASCII Art
- **File Upload**: Support for all common image formats
- **Customizable Width**: Adjustable character width (20-200 characters)
- **Character Sets**: 5 different character sets for various styles
- **Color Modes**: Grayscale, full color, invert, and no color options

### User Experience
- **Modern UI**: Clean, responsive design with dark/light theme toggle
- **Export Options**: Copy to clipboard or download as text file
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Theme Support**: Dark and light themes with persistent settings

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required - runs entirely in the browser

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/des-work/ASCII-Poetry-App.git
   cd ASCII-Poetry-App
   ```

2. Open `index.html` in your web browser or serve it using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000` in your browser

## 📖 Usage

### Text to ASCII Art
1. Select the "Text to ASCII" tab
2. Enter your text in the input field
3. Choose your preferred font style
4. Select a color (optional)
5. Pick an animation effect (optional)
6. Click "Generate ASCII Art"
7. Copy or download your result

### Image to ASCII Art
1. Select the "Image to ASCII" tab
2. Upload an image file
3. Adjust the width slider for desired size
4. Choose a character set
5. Select color mode
6. Click "Generate ASCII Art"
7. Copy or download your result

## 🎨 Font Styles

- **Standard**: Classic block letters
- **Block**: Bold, thick characters
- **Bubble**: Rounded, friendly style
- **Lean**: Italic, slanted letters
- **Mini**: Compact, small characters
- **Script**: Cursive, flowing style
- **Slant**: Angled characters
- **Small**: Smaller standard style
- **Big**: Large, bold characters

## 🌈 Color Options

- **No Color**: Plain text
- **Red, Green, Blue**: Primary colors
- **Yellow, Purple, Cyan, Magenta**: Secondary colors
- **Rainbow**: Multi-color gradient effect

## ✨ Animations

- **None**: Static display
- **Blink**: Flashing effect
- **Scroll**: Moving text animation
- **Wave**: Wavy motion
- **Glow**: Pulsing glow effect

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **Canvas API**: For image processing
- **File API**: For file uploads
- **Clipboard API**: For copy functionality

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

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
