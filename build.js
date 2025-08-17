// --> Include Libraries
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const esbuild = require('esbuild');

// --> Set path constants
const worktDir = __dirname;
const srcDir = path.join(worktDir, 'src/');
const distDir = path.join(worktDir, 'dist/');
const swiperDir = path.join(worktDir, 'node_modules/swiper/');
const outputFile = path.join(distDir, 'swiper.plugin.min.js');

// --> Load template
const templateContent = fs.readFileSync(path.join(srcDir, 'jscripts/swiper-template.js'), 'utf8');

// --> Copy and compile CSS
fs.copyFileSync(path.join(swiperDir, 'swiper-bundle.css'), path.join(srcDir, 'styles/partials/_swiper.scss'));
const cssContent = sass.compile(path.join(srcDir, 'styles/styles.scss'), { style: 'compressed', sourceMap: false}).css;

// --> Load Swiper JS
const swiperContent = fs.readFileSync(path.join(swiperDir, 'swiper-bundle.min.js'), 'utf8').replace(/\/\/#.*?\.map$/i, '');

// --> Load Plugin JS
const pluginContent = fs.readFileSync(path.join(srcDir, 'jscripts/swiper-pxdoc.js'), 'utf8');

// --> Load Banner Content
const bannerContent = fs.readFileSync(path.join(srcDir, 'banner.txt'), 'utf8');

// --> Bundle all files
const bundleContent = templateContent
    .replace(/###CSSCONTENT###/i, cssContent)
    .replace(/###SWIPERCONTENT###/i, swiperContent)
    .replace(/###PLUGINCONTENT###/i, pluginContent);

// --> Build final plugin
esbuild.build({
    stdin: { contents: bundleContent },
    banner: { js: bannerContent },
    outfile: outputFile,
    legalComments: 'none',
    treeShaking: true,
    bundle: false,
    minify: true,
    target: 'es2020',
}).then(() => {
    console.log(`✅ Bundle final généré: ${outputFile}`);
}).catch((err) => {
    console.error('❌ Erreur ESBuild :', err.message);
    process.exit(1);
});
