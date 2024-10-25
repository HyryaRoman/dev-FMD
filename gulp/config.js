// =====================================================================================================================
// ======== Config =====================================================================================================
// =====================================================================================================================

const breakpoints = [
  {
    "name": "mobile",
    "min": "none",
    "max": "480px"
  },
  {
    "name": "tablet",
    "min": "480px",
    "max": "1200px"
  },
  {
    "name": "desktop",
    "min": "1200px",
    "max": "none"
  }
];

const base = {
  source: 'src/',
  build: 'build/',
  templates: 'templates/'
};

const breakpointTemplates = {
  html: {
    src: 'utils/',
    dest: 'utils/',
    ext: ['.html'],
  },

  sass: {
    src: 'sass/utils/',
    dest: 'sass/utils/',
    ext: ['.scss'],
  },
}

const files = {
  fonts: {
    src: 'assets/fonts/',
    dest: 'assets/fonts/',
    ext: ['.woff', '.woff2'],
  },

  img: {
    src: 'assets/img/',
    dest: 'assets/img/',
    ext: ['.png', '.jpg', '.jpeg'],
  },

  js: {
    src: 'assets/js/',
    dest: 'assets/js/',
    ext: ['.js'],
  },

  ts: {
    src: 'assets/ts/',
    dest: 'assets/js/',
    ext: ['.ts'],
  },

  sass: {
    src: 'sass/',
    dest: 'assets/css/',
    ext: ['.scss'],
  },

  html: {
    src: '',
    dest: '',
    ext: ['.html'],
  }
};

const prettier = {
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  singleAttributePerLine: false,
  bracketSameLine: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  printWidth: 120,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  embeddedLanguageFormatting: "auto",
  vueIndentScriptAndStyle: false,
};

const autoprefixer = {
  cascade: false,
  flexbox: "no-2009",
};

const fileinclude = {
  prefix: '@@',
  suffix: '@@',
  basepath: 'src/',
  context: {
    breakpoints: breakpoints,
  }
};

// =====================================================================================================================
// ======== Utility ====================================================================================================
// =====================================================================================================================

function buildBreakpoints() {
  let bps = breakpoints.map((b) => {
    let mediaUp = '';
    let mediaDown = '';
    let mediaExact = '';
    if (b.min !== 'none') {
      mediaUp = mediaExact = `(min-width: ${b.min})`;
    }

    if (b.max !== 'none') {
      let max = parseInt(b.max, 10) - 0.02;
      mediaDown = mediaExact = `(max-width: ${max}px)`;
    }

    if (b.min !== 'none' && b.max !== 'none') {
      mediaExact = `${mediaUp} and ${mediaDown}`;
    }

    return Object.assign(b, {media: {up: mediaUp, down: mediaDown, exact: mediaExact}});
  });

  return bps;
}

function buildTemplates() {
  let res = {};

  for (const name in breakpointTemplates) {
    const t = breakpointTemplates[name];

    res[name] = {
      src: t.ext.flatMap((e) => [base.templates + t.src + '**/*' + e]),
      dest: base.source + t.dest,
    };
  }

  return res;
}

function buildPaths() {
  let res = base;

  for (const name in files) {
    const file = files[name];

    res[name] = {
      src: file.ext.flatMap((e) => [base.source + file.src + '**/*' + e]),
      dest: base.build + file.dest,
    };
  }

  return res;
};

export default {
  breakpoints: buildBreakpoints(),
  templates: buildTemplates(),
  paths: buildPaths(),
  prettier: prettier,
  autoprefixer: autoprefixer,
  fileinclude: fileinclude,
};
