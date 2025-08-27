// --> Include Libraries
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const esbuild = require('esbuild');
const swiper = require('swiper/package.json');


// --> Set path constants
const worktDir = __dirname;
const srcDir = path.join(worktDir, 'src/');
const distDir = path.join(worktDir, 'dist/');
const swiperDir = path.join(worktDir, 'node_modules/swiper/');
const outputFile = path.join(distDir, 'swiper.plugin.min.js');


// --> Get Now date
const d = new Date();
const pad = n => String(n).padStart(2, '0');
const now = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;


// --> Load template
const templateContent = fs.readFileSync(path.join(srcDir, 'jscripts/swiper-template.js'), 'utf8');


// --> Copy and compile CSS
fs.copyFileSync(path.join(swiperDir, 'swiper-bundle.css'), path.join(srcDir, 'styles/partials/_swiper.scss'));
const cssContent = sass.compile(path.join(srcDir, 'styles/styles.scss'), { style: 'compressed', sourceMap: false}).css;


// --> Load Swiper JS
const swiperContent = fs.readFileSync(path.join(swiperDir, 'swiper-bundle.js'), 'utf8')
    .replace(/(\/\*\s*eslint-disable\s*\*\/[\s\S]*?`)([\s\S]*?)(`[\s\S]*?\/\*\s*eslint-enable\s*\*\/)/g, (m, pre, body, post) => pre + body.replace(/[\r\n\t ]+/g, ' ').trim() + post)
    .replace(/\/\/#.*?\.map$/i, '');


// --> Load Plugin JS
const pluginContent = fs.readFileSync(path.join(srcDir, 'jscripts/swiper-pxdoc.js'), 'utf8');


// --> Load Banner Content
const bannerContent = fs.readFileSync(path.join(srcDir, 'banner.txt'), 'utf8')
    .replace(/###VERSION###/i, swiper.version)
    .replace(/###DATETIME###/i, now);


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
