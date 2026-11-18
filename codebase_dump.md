# Codebase Dump



---
## FILE: package-lock.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "server",
      "version": "1.0.0",
      "dependencies": {
        "cors": "^2.8.6",
        "dotenv": "^18.0.9",
        "express": "^5.3.0",
        "mongoose": "^9.11.4"
      },
      "devDependencies": {
        "@types/cors": "^2.8.19",
        "@types/express": "^5.0.6",
        "@types/node": "^26.6.6",
        "tsx": "^4.23.15",
        "typescript": "^7.0.2"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@mongodb-js/saslprep": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/@mongodb-js/saslprep/-/saslprep-1.6.1.tgz",
      "integrity": "sha512-D4CQtk9IwjCLAvCf1xvHEod3960q8XMUzfmdRU9qjUNlHnesGuTOvJcOTaPm9koZ1caUKA2aTbszZiAkcmSgmg==",
      "license": "MIT",
      "dependencies": {
        "sparse-bitfield": "^3.0.3"
      }
    },
    "node_modules/@standard-schema/spec": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
      "license": "MIT"
    },
    "node_modules/@types/body-parser": {
      "version": "1.19.6",
      "resolved": "https://registry.npmjs.org/@types/body-parser/-/body-parser-1.19.6.tgz",
      "integrity": "sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/connect": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/connect": {
      "version": "3.4.38",
      "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.38.tgz",
      "integrity": "sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/cors": {
      "version": "2.8.19",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
      "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/express": {
      "version": "5.0.6",
      "resolved": "https://registry.npmjs.org/@types/express/-/express-5.0.6.tgz",
      "integrity": "sha512-sKYVuV7Sv9fbPIt/442koC7+IIwK5olP1KWeD88e/idgoJqDm3JV/YUiPwkoKK92ylff2MGxSz1CSjsXelx0YA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/body-parser": "*",
        "@types/express-serve-static-core": "^5.0.0",
        "@types/serve-static": "^2"
      }
    },
    "node_modules/@types/express-serve-static-core": {
      "version": "5.1.3",
      "resolved": "https://registry.npmjs.org/@types/express-serve-static-core/-/express-serve-static-core-5.1.3.tgz",
      "integrity": "sha512-dPfW8NFiOF4wOHc7+N/QSxlY9cfSsenewGbAz8C8U/MULPd/YZ27LvJUIlzaXie7e6Ove9YunJGgC9tbHD2cKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "@types/qs": "*",
        "@types/range-parser": "*",
        "@types/send": "*"
      }
    },
    "node_modules/@types/http-errors": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@types/http-errors/-/http-errors-2.0.5.tgz",
      "integrity": "sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "26.6.6",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-26.6.6.tgz",
      "integrity": "sha512-MzQj+8Kx3XI40OmUAE6Qoh58ZMNstNNMwn2nfd3qWsfe7nDNSqJNzes4njhz6AHwrSHOffSLwXU6yb474Q4aog==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~8.9.0"
      }
    },
    "node_modules/@types/qs": {
      "version": "6.15.1",
      "resolved": "https://registry.npmjs.org/@types/qs/-/qs-6.15.1.tgz",
      "integrity": "sha512-GZHUBZR9hckSUhrxmp1nG6NwdpM9fCunJwyThLW1X3AyHgd9IlHb6VANpQQqDr2o/qQp6McZ3y/IA2rVzKzSbw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/range-parser": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.7.tgz",
      "integrity": "sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-1.2.1.tgz",
      "integrity": "sha512-arsCikDvlU99zl1g69TcAB3mzZPpxgw0UQnaHeC1Nwb015xp8bknZv5rIfri9xTOcMuaVgvabfIRA7PSZVuZIQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/serve-static": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@types/serve-static/-/serve-static-2.2.0.tgz",
      "integrity": "sha512-8mam4H1NHLtu7nmtalF7eyBH14QyOASmcxHhSfEoRyr0nP/YdoesEtU+uSRvMe96TW/HPTtkoKqQLl53N7UXMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/http-errors": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/webidl-conversions": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/@types/webidl-conversions/-/webidl-conversions-7.0.3.tgz",
      "integrity": "sha512-CiJJvcRtIgzadHCYXw7dqEnMNRjhGZlYK05Mj9OyktqV8uVT8fD2BFOB7S1uwBE3Kj2Z+4UyPmFw/Ixgw/LAlA==",
      "license": "MIT"
    },
    "node_modules/@types/whatwg-url": {
      "version": "13.0.0",
      "resolved": "https://registry.npmjs.org/@types/whatwg-url/-/whatwg-url-13.0.0.tgz",
      "integrity": "sha512-N8WXpbE6Wgri7KUSvrmQcqrMllKZ9uxkYWMt+mCSGwNc0Hsw9VQTW7ApqI4XNrx6/SaM2QQJCzMPDEXE058s+Q==",
      "license": "MIT",
      "dependencies": {
        "@types/webidl-conversions": "*"
      }
    },
    "node_modules/@typescript/typescript-aix-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-aix-ppc64/-/typescript-aix-ppc64-7.0.2.tgz",
      "integrity": "sha512-MTKKkWB7p/0E9xi1d1tHtZ5PiLkGEMIq88pK2CubZjOsLtYTLqhgIgi6zepFa+9GHZ6h05NMCkQxGKiPXMxXtQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-arm64/-/typescript-darwin-arm64-7.0.2.tgz",
      "integrity": "sha512-gowzar9MwS/aRWp6f3a4KUqzRjAZjOsmGNCM6LcTgXum+dBfgsBVMN+AgvOCCbguXyick6LJhpBszxMebJ8syA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-x64/-/typescript-darwin-x64-7.0.2.tgz",
      "integrity": "sha512-SZ9xZInqApNlNGc9s0W1VSsktYSOe9cFqNOIqmN1Gs8SmkjKZYFt017G4VwPxASInODuAdbTW7sXiFUf893RgA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-arm64/-/typescript-freebsd-arm64-7.0.2.tgz",
      "integrity": "sha512-W5NH4y/J0plIIS5b2xvTEkU7JFxyqdMAOgf+Ilhl0vHQXKO5dZoxd+C/jEtq56c4F3wk71RB4BMRQ2XdI+bwYQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-x64/-/typescript-freebsd-x64-7.0.2.tgz",
      "integrity": "sha512-UMGDx5sTpzNw3WiPebH7l90IWfJggEd+egHt/q6p7/Cm3zqoV7VxkGXt+3DxPIw8CcmvAB0j3sVVfbhX+M4Tpw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm/-/typescript-linux-arm-7.0.2.tgz",
      "integrity": "sha512-gffT3xPz9sR7j/YJExkyPntrI0P2EP9XbOyWzth2/Gs0RstK+90RBcO0ncXoXy/beYll1SXw846Nf2zdnEz0QQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm64/-/typescript-linux-arm64-7.0.2.tgz",
      "integrity": "sha512-Qh4eU4/y3yDjnfjjyPYihMj5/ODIlmt+Bzu17OI+fiSRDW57QmU5SiN63exPRNJPKUzcc1INa1NXdrJ+MqHjUQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-loong64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-loong64/-/typescript-linux-loong64-7.0.2.tgz",
      "integrity": "sha512-uEHck9i8hoAzXPiYRib1O7miOnz23SxIeVl6F4LXox+qov1K35jHcEW6VHKvZI+pyvl7fZEP4MCU5LYvIq1GuQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-mips64el": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-mips64el/-/typescript-linux-mips64el-7.0.2.tgz",
      "integrity": "sha512-R4KvAMnE43W5Qeqb0Ly56O3mWMWIAgsMyz36DCaycd5nbg/9kzm0liw3JocfRqyJY0KPmzFjbswozXyW0DnIYA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-ppc64/-/typescript-linux-ppc64-7.0.2.tgz",
      "integrity": "sha512-DORx5b3sd/4S7eayxm4FQv+A7CrkUIGRaHiwI8oiHTAI1fAPWhF4J0vAlkC8biAlHSVVwxMQ3tjZ2/DVbnQiiA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-riscv64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-riscv64/-/typescript-linux-riscv64-7.0.2.tgz",
      "integrity": "sha512-wf0jqEDOjrPRnKwYRyyJDRo11KMbvMFrU+q4zqKyChODBzvlkbhNQfKvLxQCcwTpdDaXSHZTVuh0JoCrKCUMHQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-s390x": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-s390x/-/typescript-linux-s390x-7.0.2.tgz",
      "integrity": "sha512-IkwJc3L7yhytWd/ewjyxNDfOmswCm9GWMJT/ue/dU4aZNbwZeYAetq42VyLmsmSjvoX7z74X6ZaYCtzAr0EuGw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-x64/-/typescript-linux-x64-7.0.2.tgz",
      "integrity": "sha512-EYdf2cNg7rgCWJnxCdJ+F3V39O8ihb37eHAu1LK8oAFizgTQbPOK7zHHXbPt8rX24COqODXeI3sIf0fCXG7H/A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-arm64/-/typescript-netbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-+polYF4MF04aPpO5FTkHran9yUQDSXqy5GiSDKpsll5jy3l3+g9QLhpf39T+ePtefhXLOGrLl0QIjkQP6VnelA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-x64/-/typescript-netbsd-x64-7.0.2.tgz",
      "integrity": "sha512-8YIT0EHM/3dq10ZOVF/A7pc/YSMtbcecct4rWtexrnSCHOPcpC2KTLXfTCR6vDpnSiY12heNb1GiN/wu+T/FyA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-arm64/-/typescript-openbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-APT8+ClYnuYm1u9+kgGXoMj2VzWzcymwh2gNSQVySHfkRDGOTVkoWLjCmOQSaO+PoqQ57B0flRp9SA+7GnnkzQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-x64/-/typescript-openbsd-x64-7.0.2.tgz",
      "integrity": "sha512-yX7s+Q0Dln0Dt9tEzZsAjXXR/+ytBM7AlglaqyeMPxQszJ1JhlJdZ6jLA+IzldHtflX81em7lDao1xXu+aRRkg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-sunos-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-sunos-x64/-/typescript-sunos-x64-7.0.2.tgz",
      "integrity": "sha512-dLJDGaLZ1D4HPQn62u1n8mBDkJREwMsAkCdkwd4Ieqw+x3TUyTsqY0YiBCtE6H6OzzgGk3iuZ3vFWRS+E8/d1g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-arm64/-/typescript-win32-arm64-7.0.2.tgz",
      "integrity": "sha512-Gyl1Vy6OsWesLzmq+EP0Fb7b4Nid5232AvcA2SFcdYreldpNtYFFofPjnt62y9hQy7VTaZp65ICJjuAQRaVcIQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-x64/-/typescript-win32-x64-7.0.2.tgz",
      "integrity": "sha512-0BQ3HkAHHlKLSp1qRvf3SUhGpGsDuhB/jgFw75guyqbxJqEaS0Cw/VFO8i2nHglJUzQCRtMMR/IBAKE3ETMC4g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/body-parser": {
      "version": "2.4.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.4.0.tgz",
      "integrity": "sha512-Ifk1KcLrxaGt1occQagQNFNNOqRt1LFuehEnHHzB8Z6cRgIxRU1TBaiIsUiCdA+gy5PL7Y1IX31DNKkRmxtXjQ==",
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^2.1.0",
        "debug": "^4.4.3",
        "http-errors": "^2.0.1",
        "iconv-lite": "^0.7.3",
        "on-finished": "^2.4.1",
        "qs": "^6.16.1",
        "raw-body": "^3.0.2",
        "type-is": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/bson": {
      "version": "7.3.3",
      "resolved": "https://registry.npmjs.org/bson/-/bson-7.3.3.tgz",
      "integrity": "sha512-oz3LwE3qGEhTCSyhzQRLY3Bj1NLOsjFMf6tcmY5J8M+3R7EVcmoBfSHWvjUK3yXCLDUsGpIuB3aQL4nDZ1EV/g==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/content-disposition": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-2.0.1.tgz",
      "integrity": "sha512-e+H0ZXHSWYrENhQzw1LPuP4oF5MzVKmDU6d3hxlvaPEYLLg62MxtQNPRx4SYSuYJSBUgnQIG4HIN2tEtNv7Dog==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/dotenv": {
      "version": "18.0.9",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-18.0.9.tgz",
      "integrity": "sha512-3fVOW4cB02R066PUSwn8O4TJyz9NckQl7F81blIbaq9jKBm2tSmOKky7ZHIXzGvkVPXCSn6jkpziBPZdGFs8Tw==",
      "license": "BSD-2-Clause",
      "bin": {
        "dotenv": "dist/index.cjs"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.1.tgz",
      "integrity": "sha512-Ev/hIyePLZtpL98x562lvPtenrUfGr0lfaf44HFZ+hDEwso7ccV9QAZrEVLg0hxNAzygaAFxy2dYaAKKM0G06A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/express": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/express/-/express-5.3.0.tgz",
      "integrity": "sha512-qCqy1xSoaugxOD4IVHb1ZWdkvCF2W3aE2okKouWj8VwJ+ztskSiXoBnCSJqfKT+cVPJhuJqe9YLbY425+Zh00g==",
      "license": "MIT",
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.3.0",
        "content-disposition": "^2.0.1",
        "content-type": "^2.0.0",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.8",
        "qs": "^6.16.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.1.0",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.1.tgz",
      "integrity": "sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.3.tgz",
      "integrity": "sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "license": "MIT"
    },
    "node_modules/kareem": {
      "version": "3.4.1",
      "resolved": "https://registry.npmjs.org/kareem/-/kareem-3.4.1.tgz",
      "integrity": "sha512-UlgCAFNAdk/HLSsbfkmbH8pJqpEN52Ek8RG53Ys1i3Q3gbCQruSrWpplZlgIGyDHX/LNoLW97ei3OG43s7UhUA==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.1.tgz",
      "integrity": "sha512-yz3xRaG20c6/BOzvYoDaGtPmGscs7YivItZEEqe6GbwNfHuxu9YNmvnEkMzKldAGY4/80pRcQRZSEnhquk9XuQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/memory-pager": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/memory-pager/-/memory-pager-1.5.0.tgz",
      "integrity": "sha512-ZS4Bp4r/Zoeq6+NLJpP+0Zzm0pR8whtGPf1XExKLJBAczGMnSi3It14OiNCStjQjM6NU1okjQGSxgEZN8eBYKg==",
      "license": "MIT"
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/mongodb": {
      "version": "7.7.0",
      "resolved": "https://registry.npmjs.org/mongodb/-/mongodb-7.7.0.tgz",
      "integrity": "sha512-XG1xXEqyouAV8GCb3PuRaujofeXKpAJAPvXYWZgHl6Dz4QHSJ1nRLl0+GpqaLTwKvC0RFE9truOur34RNFY1nw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@mongodb-js/saslprep": "^1.5.0",
        "bson": "^7.3.2",
        "mongodb-connection-string-url": "^7.0.2"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "peerDependencies": {
        "@aws-sdk/credential-providers": "^3.806.0",
        "@mongodb-js/zstd": "^7.0.0",
        "gcp-metadata": "^7.0.1",
        "kerberos": "^7.0.0",
        "mongodb-client-encryption": "^7.2.0",
        "snappy": "^7.3.2",
        "socks": "^2.8.6"
      },
      "peerDependenciesMeta": {
        "@aws-sdk/credential-providers": {
          "optional": true
        },
        "@mongodb-js/zstd": {
          "optional": true
        },
        "gcp-metadata": {
          "optional": true
        },
        "kerberos": {
          "optional": true
        },
        "mongodb-client-encryption": {
          "optional": true
        },
        "snappy": {
          "optional": true
        },
        "socks": {
          "optional": true
        }
      }
    },
    "node_modules/mongodb-connection-string-url": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/mongodb-connection-string-url/-/mongodb-connection-string-url-7.0.2.tgz",
      "integrity": "sha512-ZoS07RoFqpKYQwAk59qmrx8+jJHNHU30UjlU96QktiGn1ltvDr+vCznLX5DiUBLEpMAHatHNWV1nM/74ul66kA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@types/whatwg-url": "^13.0.0",
        "whatwg-url": "^14.1.0"
      },
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/mongoose": {
      "version": "9.11.4",
      "resolved": "https://registry.npmjs.org/mongoose/-/mongoose-9.11.4.tgz",
      "integrity": "sha512-+xME0fduXl1sWF+NZpJHZaNcwQSt+X2vbJ/h7GRSZ/ltLycAkGZSEABhzic0+q3IMF66KqF0viEE5+frchKCAQ==",
      "license": "MIT",
      "dependencies": {
        "@standard-schema/spec": "^1.1.0",
        "kareem": "3.4.1",
        "mongodb": "~7.7",
        "mpath": "0.9.0",
        "mquery": "6.0.1",
        "ms": "2.1.3",
        "sift": "17.1.3"
      },
      "engines": {
        "node": ">=20.19.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mongoose"
      }
    },
    "node_modules/mpath": {
      "version": "0.9.0",
      "resolved": "https://registry.npmjs.org/mpath/-/mpath-0.9.0.tgz",
      "integrity": "sha512-ikJRQTk8hw5DEoFVxHG1Gn9T/xcjtdnOKIU1JTmGjZZlg9LST2mBLmcX3/ICIbgJydT2GOc15RnNy5mHmzfSew==",
      "license": "MIT",
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/mquery": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/mquery/-/mquery-6.0.1.tgz",
      "integrity": "sha512-/Nijmq3JcpHwDM+5CwBp5yEl6fUa6jLsIhPsoQywlGXU/ZrKIvSpBzfaGnW9BLqcne/CoUwd1ch7MRqptDgFTA==",
      "license": "MIT",
      "engines": {
        "node": ">=20.19.0"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/negotiator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.1.0.tgz",
      "integrity": "sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.2.tgz",
      "integrity": "sha512-ATWUv387i+nLD49EiDoOft5scf32Vsdz3ktrQJG9bi7jRFmaXTssvyvj1EmeKVVgvesbqUtvQQvaS2TpTukAZQ==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "8.4.2",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.4.2.tgz",
      "integrity": "sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.8.tgz",
      "integrity": "sha512-5nnx0yGyVUcY6t9RnWcARWtwT9F1D8O9rt08htPvnd49W1IgZtmLkhu9WfMzQj1cFxjHIO6connUNVW5k7AVyQ==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/qs": {
      "version": "6.17.1",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.17.1.tgz",
      "integrity": "sha512-jd3COkaKVgGUW+ZHyEHCG9bH7RoaaiWuMgzsIBjUMVjLAaWGWpoUAVwljVvBHxRu/2qEHnadLGZrkutYUBPQJA==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "es-define-property": "^1.0.1",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.3.0.tgz",
      "integrity": "sha512-hek2mFQpPuI4E1BBKrSto+BU3e3x4xuarsbiwr3+lf7p44juvFMV0XFWQAP3xUyqXA4RrXLIoaSUGbSt056ZMw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.2.tgz",
      "integrity": "sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.7.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.1.tgz",
      "integrity": "sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.1",
        "mime-types": "^3.0.2",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.1.tgz",
      "integrity": "sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/sift": {
      "version": "17.1.3",
      "resolved": "https://registry.npmjs.org/sift/-/sift-17.1.3.tgz",
      "integrity": "sha512-Rtlj66/b0ICeFzYTuNvX/EF1igRbbnGSvEyT79McoZa/DeGhMyC5pWKOEsZKnpkqtSeovd5FL/bjHWC3CIIvCQ==",
      "license": "MIT"
    },
    "node_modules/sparse-bitfield": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/sparse-bitfield/-/sparse-bitfield-3.0.3.tgz",
      "integrity": "sha512-kvzhi7vqKTfkh0PZU+2D2PIllw2ymqJKujUcyPMd9Y75Nv4nPbGJZXNhxsgdQab2BmlDct1YnfQCguEvHr7VsQ==",
      "license": "MIT",
      "dependencies": {
        "memory-pager": "^1.0.2"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tr46": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-5.1.1.tgz",
      "integrity": "sha512-hdF5ZgjTqgAntKkklYw0R03MG2x/bSzTtkxmIRw/sTNV8YXsCJ1tfLAX23lhxhHJlEf3CRCOCGGWw3vI3GaSPw==",
      "license": "MIT",
      "dependencies": {
        "punycode": "^2.3.1"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tsx": {
      "version": "4.23.15",
      "resolved": "https://registry.npmjs.org/tsx/-/tsx-4.23.15.tgz",
      "integrity": "sha512-Yiex1Ovn8z2xPpOWckIiysV1SSyRMY9BkLF++q0yKiDxCqRhosKfMg3janKkiLBwZ5c/YryloKwGZcrEmtwxKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "~0.28.0"
      },
      "bin": {
        "tsx": "dist/cli.mjs"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      }
    },
    "node_modules/type-is": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.1.0.tgz",
      "integrity": "sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.0.0",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/typescript": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-7.0.2.tgz",
      "integrity": "sha512-8FYau96o3NKOhbjKi/qNvG/W5jhzxkbdm5sj9AbZ/5T5sWqn3hJgLfGx27sRKZWTvyzCP8dLRBTf5tBTSRVUNA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc"
      },
      "engines": {
        "node": ">=16.20.0"
      },
      "optionalDependencies": {
        "@typescript/typescript-aix-ppc64": "7.0.2",
        "@typescript/typescript-darwin-arm64": "7.0.2",
        "@typescript/typescript-darwin-x64": "7.0.2",
        "@typescript/typescript-freebsd-arm64": "7.0.2",
        "@typescript/typescript-freebsd-x64": "7.0.2",
        "@typescript/typescript-linux-arm": "7.0.2",
        "@typescript/typescript-linux-arm64": "7.0.2",
        "@typescript/typescript-linux-loong64": "7.0.2",
        "@typescript/typescript-linux-mips64el": "7.0.2",
        "@typescript/typescript-linux-ppc64": "7.0.2",
        "@typescript/typescript-linux-riscv64": "7.0.2",
        "@typescript/typescript-linux-s390x": "7.0.2",
        "@typescript/typescript-linux-x64": "7.0.2",
        "@typescript/typescript-netbsd-arm64": "7.0.2",
        "@typescript/typescript-netbsd-x64": "7.0.2",
        "@typescript/typescript-openbsd-arm64": "7.0.2",
        "@typescript/typescript-openbsd-x64": "7.0.2",
        "@typescript/typescript-sunos-x64": "7.0.2",
        "@typescript/typescript-win32-arm64": "7.0.2",
        "@typescript/typescript-win32-x64": "7.0.2"
      }
    },
    "node_modules/undici-types": {
      "version": "8.9.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-8.9.0.tgz",
      "integrity": "sha512-KTDyRTYX8sWmKXAikPHHSyc63CRPETMctyjKFupcC6OBLXT3xsN0e9aF7m+mIXutFWpUXuedtowG7iLOzp0kQg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/webidl-conversions": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-7.0.0.tgz",
      "integrity": "sha512-VwddBukDzu71offAQR975unBIGqfKZpM+8ZX6ySk8nYhVoo5CYaZyzt3YBvYtRtO+aoGlqxPg/B87NGVZ/fu6g==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/whatwg-url": {
      "version": "14.2.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-14.2.0.tgz",
      "integrity": "sha512-De72GdQZzNTUBBChsXueQUnPKDkg/5A5zp7pFDuQAj5UFoENpiACU0wlCvzpAGnTkj++ihpKwKyYewn/XNUbKw==",
      "license": "MIT",
      "dependencies": {
        "tr46": "^5.1.0",
        "webidl-conversions": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    }
  }
}

```


---
## FILE: package.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test-plan-agent": "node --import tsx --test src/modules/plan-agent/tests/*.test.ts",
    "test-learn-agent": "node --import tsx --test src/modules/learn-agent/tests/learn-agent.test.ts",
    "test-full-loop": "node --import tsx --test src/modules/learn-agent/tests/full-loop.test.ts",
    "runner": "tsx src/modules/plan-agent/runner/plan-runner.ts"
  },
  "keywords": [],
  "type": "module",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^18.0.9",
    "express": "^5.3.0",
    "mongoose": "^9.11.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^26.6.6",
    "tsx": "^4.23.15",
    "typescript": "^7.0.2"
  }
}

```


---
## FILE: random-notes.md

```md
## to run a test for the plan agent module

```
    node --import tsx --test src/modules/plan-agent/tests/plan-agent.test.tss
```

```


---
## FILE: src/app.ts

```ts
import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/routes/auth-routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!"
  });
});

export default app;

```


---
## FILE: src/config/db.ts

```ts
import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Opens the shared Mongoose connection used by the backend. Keeping connection
 * lifecycle code outside models ensures persistence setup is not coupled to
 * schema definitions or LLM/agent logic.
 */
export async function connectToDatabase(
  uri: string | undefined = env.MONGODB_URI,
): Promise<typeof mongoose> {
  if (!uri?.trim()) {
    const message =
      "[Database] Connection cannot start: MONGODB_URI is missing or empty.";
    console.error(message);
    throw new Error(message);
  }

  if (mongoose.connection.readyState === 1) {
    console.log(
      `[Database] Connection already established (database: ${mongoose.connection.name || "unknown"}). Reusing it.`,
    );
    return mongoose;
  }

  console.log(
    "[Database] Starting MongoDB connection attempt with the configured MONGODB_URI...",
  );

  try {
    await mongoose.connect(uri);
    console.log(
      `[Database] MongoDB connection established successfully (host: ${mongoose.connection.host || "unknown"}, database: ${mongoose.connection.name || "unknown"}).`,
    );
    return mongoose;
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    console.error(
      `[Database] MongoDB connection failed. Verify the URI, network access, and database availability. Details: ${details}`,
    );
    throw error;
  }
}

/** Closes the shared connection cleanly during shutdown or test teardown. */
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    console.log("[Database] Disconnect requested, but no connection is open.");
    return;
  }

  console.log("[Database] Closing the MongoDB connection...");
  try {
    await mongoose.disconnect();
    console.log("[Database] MongoDB connection closed successfully.");
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    console.error(
      `[Database] Failed to close the MongoDB connection. Details: ${details}`,
    );
    throw error;
  }
}

export default connectToDatabase;
```


---
## FILE: src/config/env.ts

```ts
import dotenv from "dotenv";

dotenv.config();

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export const env = {
  MONGODB_USERNAME: getOptionalEnv("MONGODB_USERNAME"),
  MONGODB_PASSWORD: getOptionalEnv("MONGODB_PASSWORD"),
  MONGODB_URI: getOptionalEnv("MONGODB_URI"),
  GEMINI_API_KEY: getOptionalEnv("GEMINI_API_KEY"),
  BETTER_AUTH_SECRET: getOptionalEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getOptionalEnv("BETTER_AUTH_URL"),
  PORT: getOptionalEnv("PORT"),
} as const;

export type EnvironmentConfig = typeof env;

function isCompleteMongoUri(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "mongodb:" || parsed.protocol === "mongodb+srv:") &&
      parsed.hostname.length > 0
    );
  } catch {
    return false;
  }
}

export function validateEnv(config: EnvironmentConfig = env): EnvironmentConfig {
  if (!isCompleteMongoUri(config.MONGODB_URI)) {
    const missing = [
      !config.MONGODB_USERNAME ? "MONGODB_USERNAME" : undefined,
      !config.MONGODB_PASSWORD ? "MONGODB_PASSWORD" : undefined,
    ].filter((key): key is string => key !== undefined);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variable(s): ${missing.join(", ")}. Provide a complete MONGODB_URI to omit these credentials.`,
      );
    }
  }
  return config;
}
```


---
## FILE: src/modules/auth/docs/AUTH_AND_PERSONALIZATION.md

```md
# Authentication and Personalization

## Account Model

`User` stores a normalized, unique email address, an optional display name, a
scrypt password hash, and Mongoose timestamps. Passwords are never stored or
returned in plaintext. Password hashes use a per-user random salt and the
Node.js `scrypt` key-derivation function. The hash field is excluded from
ordinary Mongoose queries; login explicitly selects it for verification.

## Token Lifecycle

Registration and login return `{ user, sessionToken }`. The token is a
signed, base64url-encoded set of claims containing the user ObjectId, configured
`BETTER_AUTH_URL` issuer, issue time, and expiration time. It is authenticated
with HMAC-SHA-256 using `BETTER_AUTH_SECRET` and expires after seven days.
`verifySessionToken` checks the signature in constant time, issuer, claim
types, issue time, and expiry, then returns the user ID. The API middleware
also confirms that the referenced account still exists before authorizing a
request.

The current token is stateless: there is no server-side refresh or revocation
store. Logging out means deleting the client token; a token already issued
remains usable until expiry unless the user's account is removed or the signing
secret is rotated. Keep the secret private and consistent across server
instances. `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and `MONGODB_URI` must be
configured in the server environment.

## API Authorization

The app mounts `/api/auth/register` and `/api/auth/login` for account creation
and sign-in. Both accept JSON with `email` and `password`; registration also
accepts `name`. These endpoints return the public user shape and session token.
Protected endpoints use `requireAuth` and accept:

```http
Authorization: Bearer <sessionToken>
```

The middleware verifies the token, resolves the User record, and attaches
`req.user = { userId, email }`. Missing, malformed, expired, or invalid tokens
receive `401 Unauthorized`. Route handlers must use `req.user.userId` as their
ownership boundary and must not accept a client-supplied owner ID.

## User-Scoped Plan Data

`Plan.userId` is a required ObjectId reference to `User`. Plan creation checks
that the authenticated user ID is a valid ObjectId and that the account exists
before graph generation or persistence. Each DAG node references its plan by
`planId`; therefore, plan ownership is the ownership boundary for all its
nodes. Diagnostic selection and answer processing require both plan/node IDs
and the authenticated user ID, then verify the plan owner before reading or
mutating nodes.

Clarification state is stored in `UserLearningSlots`, with one unique record
per user. `evaluateUserIntent(userId, message, apiKey)` loads that user's saved
slots, evaluates the new message, and persists the resulting slot values.
`getUserLearningSlots(userId)` retrieves only the requested account's state.
This keeps separate users' goals independent across API calls and process
restarts.

## Terminal Runner

Run `npm run runner`. The CLI connects through `config/db.ts`, validates a
session token stored in `~/.plan-agent-session.json`, and asks the user to log
in or register if the local token is missing or invalid. The token file is
written with owner-only permissions. The runner lists only the signed-in
user's active plans, persists clarification turns for that account, creates a
user-owned plan and DAG, and passes the same user ID to each diagnostic read
and write. Remove the local session file to sign out; server-side token expiry
and secret rotation work the same as for API clients.

The Gemini integration additionally requires `GEMINI_API_KEY`. The CLI should
be run in a trusted local environment; its password prompt uses the terminal's
standard input, so use a private terminal session.
```


---
## FILE: src/modules/auth/middleware/auth-middleware.ts

```ts
import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User.js";
import { verifySessionToken } from "../services/auth-service.js";

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) {
    console.warn("[Auth] Rejected protected request: missing bearer token.");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const userId = verifySessionToken(match[1]);
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Session token contains an invalid user id.");
    }
    const user = await User.findById(userId).select("email");
    if (!user) throw new Error("Session user no longer exists.");

    req.user = { userId: user._id.toString(), email: user.email };
    console.log(`[Auth] Authorized ${req.method} ${req.path} for ${req.user.userId}.`);
    next();
  } catch (error) {
    console.warn(
      `[Auth] Rejected protected request: ${error instanceof Error ? error.message : "invalid token"}.`,
    );
    res.status(401).json({ error: "Unauthorized" });
  }
}
```


---
## FILE: src/modules/auth/models/User.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  capacityThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserModel = Model<UserDocument>;

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true },
    capacityThreshold: { type: Number, default: 0.70, min: 0.45, max: 0.90 },
  },
  { timestamps: true, versionKey: false },
);

export const User: UserModel =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<UserDocument, UserModel>("User", UserSchema);

export default User;
```


---
## FILE: src/modules/auth/routes/auth-routes.ts

```ts
import { Router } from "express";
import { requireAuth } from "../middleware/auth-middleware.js";
import { loginUser, registerUser } from "../services/auth-service.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    res.status(201).json(await registerUser(email, password, typeof name === "string" ? name : undefined));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    const status = message.includes("already exists") ? 409 : 400;
    res.status(status).json({ error: message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  try {
    res.json(await loginUser(email, password));
  } catch {
    res.status(401).json({ error: "Invalid email or password." });
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default authRouter;
```


---
## FILE: src/modules/auth/services/auth-service.ts

```ts
import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { env } from "../../../config/env.js";
import { User } from "../models/User.js";

const scrypt = promisify(scryptCallback);
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

interface SessionClaims {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface PublicUser {
  userId: string;
  email: string;
  name?: string;
}

function getTokenConfig(): { secret: string; issuer: string } {
  const secret = env.BETTER_AUTH_SECRET;
  const issuer = env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
  }
  if (!issuer) {
    throw new Error("BETTER_AUTH_URL must be configured.");
  }
  return { secret, issuer };
}

function publicUser(user: { _id: unknown; email: string; name?: string }): PublicUser {
  return {
    userId: String(user._id),
    email: user.email,
    ...(user.name ? { name: user.name } : {}),
  };
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, saltText, hashText] = storedHash.split("$");
  if (algorithm !== "scrypt" || !saltText || !hashText) return false;

  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(hashText, "base64url");
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function signClaims(claims: SessionClaims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function createSessionToken(userId: string): string {
  const { secret, issuer } = getTokenConfig();
  const issuedAt = Math.floor(Date.now() / 1000);
  return signClaims(
    { sub: userId, iss: issuer, iat: issuedAt, exp: issuedAt + SESSION_TTL_SECONDS },
    secret,
  );
}

export async function registerUser(
  email: string,
  password: string,
  name?: string,
): Promise<{ user: PublicUser; sessionToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("A valid email address is required.");
  }
  if (password.length < 10) {
    throw new Error("Password must be at least 10 characters long.");
  }
  getTokenConfig();

  if (await User.exists({ email: normalizedEmail })) {
    throw new Error("An account with this email already exists.");
  }

  try {
    const createdUser = await User.create({
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      ...(name?.trim() ? { name: name.trim() } : {}),
    });
    console.log(`[Auth] Registered user ${createdUser._id.toString()} (${normalizedEmail}).`);
    return {
      user: publicUser(createdUser),
      sessionToken: createSessionToken(createdUser._id.toString()),
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      throw new Error("An account with this email already exists.");
    }
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: PublicUser; sessionToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    console.warn(`[Auth] Rejected login for ${normalizedEmail || "empty email"}.`);
    throw new Error("Invalid email or password.");
  }

  console.log(`[Auth] Login validated for user ${user._id.toString()}.`);
  return {
    user: publicUser(user),
    sessionToken: createSessionToken(user._id.toString()),
  };
}

export function verifySessionToken(token: string): string {
  const { secret, issuer } = getTokenConfig();
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra !== undefined) {
    throw new Error("Invalid session token format.");
  }

  const expectedSignature = createHmac("sha256", secret).update(payload).digest();
  let actualSignature: Buffer;
  try {
    actualSignature = Buffer.from(suppliedSignature, "base64url");
  } catch {
    throw new Error("Invalid session token signature.");
  }
  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    throw new Error("Invalid session token signature.");
  }

  let claims: SessionClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionClaims;
  } catch {
    throw new Error("Invalid session token payload.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    typeof claims.sub !== "string" ||
    typeof claims.iss !== "string" ||
    claims.iss !== issuer ||
    !Number.isInteger(claims.iat) ||
    !Number.isInteger(claims.exp) ||
    claims.iat > now + 60 ||
    claims.exp <= now
  ) {
    throw new Error("Session token is expired or has invalid claims.");
  }

  console.log(`[Auth] Session token verified for user ${claims.sub}.`);
  return claims.sub;
}
```


---
## FILE: src/modules/common/utils/normalize-concept-name.ts

```ts
export function normalizeConceptName(conceptName: string): string {
  return conceptName.trim().toLowerCase().replace(/\s+/g, " ");
}
```


---
## FILE: src/modules/common/utils/retry.ts

```ts
const TRANSIENT_HTTP_STATUSES = new Set([429, 502, 503, 504]);

function getTransientResponseStatus(value: unknown): number | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof value.status === "number" &&
    "ok" in value &&
    value.ok === false &&
    TRANSIENT_HTTP_STATUSES.has(value.status)
  ) {
    return value.status;
  }
  return undefined;
}

function describeFailure(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 2000,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const result = await fn();
      const status = getTransientResponseStatus(result);
      if (status === undefined) {
        return result;
      }
      throw new Error(`HTTP ${status}`);
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(
        `[Retry] Request failed: ${describeFailure(error)}. Retrying attempt ${attempt + 1}/${retries} in ${Math.round(delayMs)}ms.`,
      );
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
```


---
## FILE: src/modules/learn-agent/docs/MICRO_TUTOR_AND_SYSTEM2.md

```md
# Micro-Tutor and System 2

## Node-Scoped Micro-Tutor

The Micro-Tutor teaches one selected `PlanNode` at a time. Its prompt names the
node's concept and Bloom level, while the parent plan topic is used only to
disambiguate terminology. Lesson generation returns a compact explanation, a
single check question, and criteria used to evaluate the learner's response.
Remediation prompts include the previous answer and feedback so the tutor can
address the identified misconception without replaying the full lesson.

## System 1 Overload Gatekeeper

Before a lesson is shown, System 1 assesses the combined explanation and check
question against intrinsic and extrinsic working-memory load. If the result is
overloaded, the lesson is regenerated once with the assessment's scaffolding
directives. The revised lesson is assessed again and the resulting WML metrics
are returned to the runner; there is no unbounded regeneration loop.

## System 2 Cognitive Efficiency

After each learner answer, System 2 combines performance on the current
attempt with average assessed WML using normalized Paas cognitive-efficiency
scoring. Successful mastery can raise the future WML capacity threshold when
efficiency is high, or lower it when efficiency indicates significant effort.
The threshold is bounded to `[0.45, 0.90]` and is maintained for the duration
of the interactive learning session.

## Durable UserMastery Contract

On mastery, the node becomes `MASTERED` and the service upserts
`UserMastery` using `{ userId, conceptName }` as its key. The stored score is
the greater of the existing score and the durable score for the attempt count:
`0.95` on the first attempt, `0.90` on the second, and `0.86` thereafter.
Every score remains at or above the prior-plan credit threshold of `0.85`;
later plans can reconcile that evidence case-insensitively against their node
names without reducing an existing mastery score.
```


---
## FILE: src/modules/learn-agent/docs/SYSTEM1_WML_AND_OUTER_FRINGE.md

```md
# System 1 WML and KST Outer Fringe

## KST Selection Invariant

The Outer Fringe contains only `PENDING` or `IN_PROGRESS` plan nodes whose
immediate prerequisites are all in a satisfied state: `PASSED_IN_DIAGNOSTIC`
or `MASTERED`. A node without prerequisites is immediately eligible. Selection
is deterministic: continue `IN_PROGRESS` work first, then choose the lowest
Bloom level, then sort by concept name. The plan is completed when every node
is either passed in diagnostics or mastered.

Before selection, `syncPriorUserMastery` reconciles unresolved nodes against
durable, cross-plan `UserMastery` records. A score of at least `0.85` credits
the matching plan node as `MASTERED`; the plan owner is verified before any
plan-node read or mutation.

## Synchronous Working Memory Load

System 1 computes load locally without an LLM call. Every component is clamped
to `[0, 1]`:

- Intrinsic: `0.50 * bloomFactor + 0.30 * directPrereqFactor + 0.20 * transitiveDepthFactor`.
- Bloom factor: `(bloomLevel - 1) / 5`.
- Direct prerequisite factor: `directPrerequisiteCount / 4`.
- Transitive depth factor: `transitiveAncestorCount / 8`.
- Extrinsic: `0.30 * sentenceLengthFactor + 0.30 * lexicalDensityFactor + 0.20 * codeDensityFactor + 0.20 * novelTermFactor`.
- Total WML: `0.55 * intrinsic.score + 0.45 * extrinsic.score`.

Sentence length is normalized against 25 words; lexical density against a
complex-word ratio of `0.45`; code density against a code ratio of `0.35`; and
novel unmastered concepts against three mentioned concepts. The default learner
capacity threshold is `0.70` and can be overridden per assessment.

## Pedagogical Gatekeeper

`assessNodeTurnWml` evaluates a proposed turn before it reaches the Micro-Tutor
prompt. Its `scaffoldingDirectives` are constraints for that prompt: high or
overloaded turns receive the applicable atomic-step, analogy, brevity, code,
and novel-term restrictions; overloaded turns additionally end with one
low-friction check-for-understanding question. Low-load turns instead invite a
concise synthesis and an applied micro-problem. The caller should inject these
directives into the Micro-Tutor instruction context before generation.

Structured `[Learn Agent][KST]` and `[Learn Agent][System 1]` logs report
frontier candidates, load scores, classification, and active scaffolding so
thresholds can be calibrated from runtime behavior.
```


---
## FILE: src/modules/learn-agent/services/micro-tutor.ts

```ts
import { Types } from "mongoose";
import { fetchWithRetry } from "../../common/utils/retry.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { User } from "../../auth/models/User.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import type {
  GeneratedTutorTurn,
  LearnerEvaluationPromptInput,
  LearnerTurnEvaluation,
  MicroLessonPayload,
} from "../types/tutor.js";
import type { WmlAssessment } from "../types/wml.js";
import { calculateCognitiveEfficiency } from "../utils/cognitive-efficiency.js";
import { DEFAULT_WML_CAPACITY } from "../utils/wml-calculator.js";
import { countTransitiveAncestors } from "../utils/outer-fringe-selector.js";
import {
  getLearnerEvaluationPrompt,
  getMicroLessonPrompt,
} from "../utils/tutor-prompts.js";
import { assessNodeTurnWml, preGateIntrinsicLoad } from "./wml-interceptor.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

export async function loadLearningNodeState(
  planId: string,
  userId: string,
  nodeId: string,
): Promise<{
  capacityThreshold: number;
  attemptCount: number;
  wmlSamples: number[];
  previousAttempt?: string;
  tutorFeedback?: string;
}> {
  const [plan, learner, node] = await Promise.all([
    Plan.findOne({ _id: planId, userId }),
    User.findById(userId).select("capacityThreshold"),
    PlanNode.findOne({ _id: nodeId, planId }),
  ]);
  if (!plan || !learner || !node) {
    throw new Error("Learning state could not be loaded for the authenticated plan owner.");
  }
  const latestFailedAttempt = [...(node.attempts ?? [])].reverse().find((attempt) => !attempt.passed);
  const previousAttempt = latestFailedAttempt?.learnerAnswer ?? node.lastAttempt;
  const tutorFeedback = latestFailedAttempt?.tutorFeedback ?? node.lastTutorFeedback;
  return {
    capacityThreshold: learner.capacityThreshold ?? plan.capacityThreshold ?? DEFAULT_WML_CAPACITY,
    attemptCount: node.attemptCount ?? 0,
    wmlSamples: [...(node.wmlSamples ?? [])],
    ...(previousAttempt !== undefined ? { previousAttempt } : {}),
    ...(tutorFeedback !== undefined ? { tutorFeedback } : {}),
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

function parseJsonObject(text: string, context: string): Record<string, unknown> {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Gemini returned invalid JSON for ${context}.`, { cause: error });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Gemini ${context} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

async function requestGeminiJson(
  prompt: string,
  apiKey: string,
  context: string,
): Promise<Record<string, unknown>> {
  if (!apiKey.trim()) throw new Error("GEMINI_API_KEY is required for the Micro-Tutor.");
  const response = await fetchWithRetry(() =>
    fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
  );
  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini ${context} request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }
  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini returned no ${context} content.`);
  return parseJsonObject(text, context);
}

function parseLesson(payload: Record<string, unknown>): MicroLessonPayload {
  const fields = ["explanation", "checkQuestion", "expectedCriteria"] as const;
  for (const field of fields) {
    if (typeof payload[field] !== "string" || !payload[field].trim()) {
      throw new Error(`Gemini lesson must include a non-empty ${field} string.`);
    }
  }
  return {
    explanation: (payload.explanation as string).trim(),
    checkQuestion: (payload.checkQuestion as string).trim(),
    expectedCriteria: (payload.expectedCriteria as string).trim(),
  };
}

async function generateLesson(
  params: Parameters<typeof getMicroLessonPrompt>[0],
  apiKey: string,
): Promise<MicroLessonPayload> {
  return parseLesson(
    await requestGeminiJson(getMicroLessonPrompt(params), apiKey, "micro-lesson"),
  );
}

async function verifyPlanAndNode(params: {
  planId: string;
  userId: string;
  nodeId: string;
}) {
  if (!Types.ObjectId.isValid(params.planId)) {
    throw new Error("A valid plan ObjectId is required for the Micro-Tutor.");
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    throw new Error("A valid authenticated user ObjectId is required for the Micro-Tutor.");
  }
  if (!Types.ObjectId.isValid(params.nodeId)) {
    throw new Error("A valid plan node ObjectId is required for the Micro-Tutor.");
  }
  const planExists = await Plan.exists({ _id: params.planId, userId: params.userId });
  if (!planExists) throw new Error("Plan not found for the authenticated user.");
  const [plan, node] = await Promise.all([
    Plan.findOne({ _id: params.planId, userId: params.userId }),
    PlanNode.findOne({ _id: params.nodeId, planId: params.planId }),
  ]);
  if (!plan) throw new Error("Plan not found for the authenticated user.");
  if (!node) throw new Error("Plan node not found in the authenticated user's plan.");
  return { plan, node };
}

export async function prepareNodeLesson(params: {
  planId: string;
  userId: string;
  nodeId: string;
  apiKey: string;
  capacityThreshold?: number;
  previousAttempt?: string;
  tutorFeedback?: string;
  scaffoldingDirectives?: string[];
}): Promise<GeneratedTutorTurn> {
  const { plan, node } = await verifyPlanAndNode(params);
  const effectiveCapacity =
    params.capacityThreshold ?? plan.capacityThreshold ?? DEFAULT_WML_CAPACITY;
  if (node.status === "PENDING") {
    node.status = "IN_PROGRESS";
    await node.save();
  }

  const latestFailedAttempt = [...(node.attempts ?? [])].reverse().find((attempt) => !attempt.passed);
  const previousAttempt = params.previousAttempt ?? latestFailedAttempt?.learnerAnswer;
  const tutorFeedback = params.tutorFeedback ?? latestFailedAttempt?.tutorFeedback;

  const planNodes = await PlanNode.find({ planId: params.planId });
  const graphNodes = planNodes.map((candidate) => ({
    nodeId: candidate._id.toString(),
    conceptName: candidate.conceptName,
    bloomLevel: candidate.bloomLevel,
    status: candidate.status,
    prerequisiteIds: candidate.prerequisites.map((id) => id.toString()),
  }));
  const unmasteredPrerequisites = node.prerequisites
    .map((prerequisiteId) => planNodes.find(
      (candidate) => candidate._id.toString() === prerequisiteId.toString(),
    ))
    .filter(
      (prerequisite): prerequisite is NonNullable<typeof prerequisite> =>
        prerequisite !== undefined &&
        prerequisite.status !== "MASTERED" &&
        prerequisite.status !== "PASSED_IN_DIAGNOSTIC",
    )
    .map((prerequisite) => prerequisite.conceptName);
  const preGate = preGateIntrinsicLoad({
    bloomLevel: node.bloomLevel,
    directPrerequisiteCount: node.prerequisites.length,
    transitiveAncestorCount: countTransitiveAncestors(node._id.toString(), graphNodes),
    unmasteredPrerequisites,
    capacityThreshold: effectiveCapacity,
  });
  console.log(
    `[Learn Agent][System 1 Pre-Gate] Node="${node.conceptName}" bloom=${node.bloomLevel} IL=${preGate.intrinsicLoad.toFixed(2)} budget=${preGate.extrinsicBudget.toFixed(2)} mode=${preGate.mode}`,
  );

  const remediation = previousAttempt !== undefined && tutorFeedback !== undefined;
  const initialDirectives = [...new Set([
    ...(remediation
      ? [
        "Use high scaffolding: isolate the learner's misconception, explain one small step, and provide a concrete example.",
        "Keep the explanation concise and do not introduce adjacent concepts.",
      ]
      : preGate.proactiveDirectives),
    ...(params.scaffoldingDirectives ?? []),
    ...(preGate.intrinsicLoad >= 0.65
      ? ["Decompose the concept into one atomic sub-step and anchor it in a concrete real-world analogy before introducing formal rules."]
      : []),
  ])];
  const promptParams = {
    topic: plan.topic,
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    scaffoldingDirectives: initialDirectives,
    preGateResult: preGate,
    ...(remediation
      ? {
          previousAttempt,
          tutorFeedback,
        }
      : {}),
  };
  console.log(
    `[Learn Agent][Micro-Tutor] Generating ${remediation ? "remediation" : "initial"} lesson for "${node.conceptName}" (Bloom ${node.bloomLevel}).`,
  );

  let lesson = await generateLesson(promptParams, params.apiKey);
  let wmlAssessment: WmlAssessment = await assessNodeTurnWml({
    planId: params.planId,
    userId: params.userId,
    nodeId: params.nodeId,
    textToMeasure: `${lesson.explanation}\n\n${lesson.checkQuestion}`,
    capacityThreshold: effectiveCapacity,
  });
  let wasRegeneratedForOverload = false;

  const exceedsExtrinsicBudget =
    0.45 * wmlAssessment.extrinsic.score > preGate.extrinsicBudget;
  if (wmlAssessment.isOverloaded && exceedsExtrinsicBudget) {
    console.log(
      `[Learn Agent][Micro-Tutor] WML gatekeeper intervened for "${node.conceptName}"; regenerating once with ${wmlAssessment.scaffoldingDirectives.length} directive(s).`,
    );
    lesson = await generateLesson(
      {
        ...promptParams,
        scaffoldingDirectives: [...initialDirectives, ...wmlAssessment.scaffoldingDirectives],
      },
      params.apiKey,
    );
    wmlAssessment = await assessNodeTurnWml({
      planId: params.planId,
      userId: params.userId,
      nodeId: params.nodeId,
      textToMeasure: `${lesson.explanation}\n\n${lesson.checkQuestion}`,
      capacityThreshold: effectiveCapacity,
    });
    wasRegeneratedForOverload = true;
  }

  return {
    nodeId: node._id.toString(),
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    lesson,
    wmlAssessment,
    preGate,
    regenerated: wasRegeneratedForOverload,
    wasRegeneratedForOverload,
  };
}

export async function submitNodeAttempt(params: {
  planId: string;
  userId: string;
  nodeId: string;
  lesson: MicroLessonPayload;
  userAnswer: string;
  attemptCount: number;
  averageWml: number;
  capacityThreshold?: number;
  wmlSamples?: number[];
  apiKey: string;
}): Promise<LearnerTurnEvaluation> {
  const { plan, node } = await verifyPlanAndNode(params);
  const evaluationInput: LearnerEvaluationPromptInput = {
    topic: plan.topic,
    conceptName: node.conceptName,
    bloomLevel: node.bloomLevel,
    checkQuestion: params.lesson.checkQuestion,
    expectedCriteria: params.lesson.expectedCriteria,
    userAnswer: params.userAnswer,
  };
  const result = await requestGeminiJson(
    getLearnerEvaluationPrompt(evaluationInput),
    params.apiKey,
    "learner evaluation",
  );
  if (typeof result.mastered !== "boolean" || typeof result.feedback !== "string") {
    throw new Error("Gemini learner evaluation must include mastered and feedback fields.");
  }
  if (result.hint !== null && typeof result.hint !== "string") {
    throw new Error("Gemini learner evaluation hint must be a string or null.");
  }

  const calculation = calculateCognitiveEfficiency({
    mastered: result.mastered,
    attemptCount: params.attemptCount,
    averageWml: params.averageWml,
    capacityThreshold: params.capacityThreshold ?? DEFAULT_WML_CAPACITY,
  });
  const hint = typeof result.hint === "string" ? result.hint.trim() : "";
  const tutorFeedback = [result.feedback.trim(), hint].filter(Boolean).join(" ");
  await Plan.updateOne({ _id: params.planId, userId: params.userId }, {
    $set: { capacityThreshold: calculation.updatedCapacityThreshold },
  });
  await Promise.all([
    User.updateOne(
      { _id: params.userId },
      { $set: { capacityThreshold: calculation.updatedCapacityThreshold } },
    ),
    PlanNode.updateOne(
      { _id: node._id, planId: params.planId },
      {
        $set: {
          attemptCount: params.attemptCount,
          wmlSamples: params.wmlSamples ?? node.wmlSamples ?? [],
          lastAttempt: params.userAnswer,
          lastTutorFeedback: tutorFeedback,
          status: result.mastered ? "MASTERED" : "IN_PROGRESS",
        },
        $push: {
          attempts: {
            attemptNumber: params.attemptCount,
            learnerAnswer: params.userAnswer,
            wmlScore: params.averageWml,
            tutorFeedback,
            passed: result.mastered,
            createdAt: new Date(),
          },
        },
      },
    ),
  ]);

  if (result.mastered) {
    const conceptKey = normalizeConceptName(node.conceptName);
    await UserMastery.updateOne(
      {
        userId: params.userId,
        conceptKey,
      },
      {
        $setOnInsert: {
          userId: params.userId,
          conceptName: node.conceptName,
          conceptKey,
          canonicalConceptName: normalizeConceptName(node.conceptName),
        },
        $max: { masteryScore: calculation.durableMasteryScore },
      },
      { upsert: true },
    );
  }

  const masteryScore = result.mastered ? calculation.durableMasteryScore : 0.25;
  console.log(
    `[Learn Agent][System 2] Concept="${node.conceptName}" | Mastered=${result.mastered} | Efficiency=${calculation.efficiencyScore.toFixed(2)} | Mastery=${masteryScore.toFixed(2)} | Capacity=${calculation.updatedCapacityThreshold.toFixed(2)}.`,
  );
  return {
    mastered: result.mastered,
    feedback: result.feedback.trim(),
    ...(hint ? { hint } : {}),
    masteryScore,
    updatedCapacityThreshold: calculation.updatedCapacityThreshold,
  };
}
```


---
## FILE: src/modules/learn-agent/services/outer-fringe.ts

```ts
import { Types } from "mongoose";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import type { OuterFringeResult } from "../types/wml.js";
import {
  KNOWLEDGE_FRONTIER_SATISFIED,
  selectOuterFringe,
} from "../utils/outer-fringe-selector.js";

export { KNOWLEDGE_FRONTIER_SATISFIED };
export const PRIOR_MASTERY_THRESHOLD = 0.85;

export async function syncPriorUserMastery(
  planId: string,
  userId: string,
): Promise<number> {
  if (!Types.ObjectId.isValid(planId)) {
    throw new Error("A valid plan ObjectId is required for prior mastery reconciliation.");
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required for prior mastery reconciliation.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");

  const unresolvedNodes = await PlanNode.find({
    planId,
    status: { $in: ["PENDING", "IN_PROGRESS"] },
  });
  if (unresolvedNodes.length === 0) return 0;

  const priorMastery = await UserMastery.find({
    userId,
    conceptKey: {
      $in: unresolvedNodes.map((node) => normalizeConceptName(node.conceptName)),
    },
    masteryScore: { $gte: PRIOR_MASTERY_THRESHOLD },
  }).select("conceptKey");
  if (priorMastery.length === 0) {
    console.log(
      `[Learn Agent][KST] Prior mastery reconciliation: 0 nodes auto-credited for plan ${planId}.`,
    );
    return 0;
  }

  const masteredConceptNames = new Set(
    priorMastery.map((mastery) => normalizeConceptName(mastery.conceptKey)),
  );
  const matchingNodeIds = unresolvedNodes
    .filter((node) => masteredConceptNames.has(normalizeConceptName(node.conceptName)))
    .map((node) => node._id);
  if (matchingNodeIds.length === 0) return 0;
  const result = await PlanNode.updateMany(
    {
      planId,
      _id: { $in: matchingNodeIds },
      status: { $in: ["PENDING", "IN_PROGRESS"] },
    },
    { $set: { status: "MASTERED" } },
  );
  const updatedCount = result.modifiedCount;
  console.log(
    `[Learn Agent][KST] Prior mastery reconciliation: ${updatedCount} nodes auto-credited from durable UserMastery for plan ${planId}.`,
  );
  return updatedCount;
}

export async function getOuterFringe(
  planId: string,
  userId: string,
): Promise<OuterFringeResult> {
  if (!Types.ObjectId.isValid(planId)) {
    throw new Error("A valid plan ObjectId is required to load the Outer Fringe.");
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to load the Outer Fringe.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");

  await syncPriorUserMastery(planId, userId);
  const nodes = await PlanNode.find({ planId });
  const result = selectOuterFringe(
    nodes.map((node) => ({
      nodeId: node._id.toString(),
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: node.status,
      prerequisiteIds: node.prerequisites.map((id) => id.toString()),
    })),
    KNOWLEDGE_FRONTIER_SATISFIED,
  );
  if (result.isPlanCompleted) {
    await Plan.updateOne(
      { _id: planId, userId },
      { $set: { status: "COMPLETED" } },
    );
  }

  console.log(
    `[Learn Agent][KST] Outer Fringe size=${result.unlockedNodes.length} | Candidates=${result.unlockedNodes.map((node) => `${node.conceptName}:${node.status}`).join(", ") || "none"} | nextNodeId=${result.nextNodeId ?? "none"} | remaining=${result.remainingCount} | completed=${result.isPlanCompleted}.`,
  );

  return result;
}
```


---
## FILE: src/modules/learn-agent/services/wml-interceptor.ts

```ts
import { Types } from "mongoose";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { countTransitiveAncestors } from "../utils/outer-fringe-selector.js";
import { evaluateWorkingMemoryLoad } from "../utils/wml-calculator.js";
import type { WmlAssessment } from "../types/wml.js";

export { preGateIntrinsicLoad } from "../utils/wml-calculator.js";

export async function assessNodeTurnWml(params: {
  planId: string;
  userId: string;
  nodeId: string;
  textToMeasure: string;
  capacityThreshold?: number;
}): Promise<WmlAssessment> {
  if (!Types.ObjectId.isValid(params.planId)) {
    throw new Error("A valid plan ObjectId is required for WML assessment.");
  }
  if (!Types.ObjectId.isValid(params.userId)) {
    throw new Error("A valid authenticated user ObjectId is required for WML assessment.");
  }
  if (!Types.ObjectId.isValid(params.nodeId)) {
    throw new Error("A valid plan node ObjectId is required for WML assessment.");
  }
  const plan = await Plan.exists({ _id: params.planId, userId: params.userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");

  const nodes = await PlanNode.find({ planId: params.planId });
  const graphNodes = nodes.map((candidate) => ({
    nodeId: candidate._id.toString(),
    conceptName: candidate.conceptName,
    bloomLevel: candidate.bloomLevel,
    status: candidate.status,
    prerequisiteIds: candidate.prerequisites.map((id) => id.toString()),
  }));
  const node = nodes.find((candidate) => candidate._id.toString() === params.nodeId);
  if (!node) {
    throw new Error("Plan node not found in the authenticated user's plan.");
  }

  const unmasteredConceptNames = nodes
    .filter(
      (candidate) =>
        candidate._id.toString() !== params.nodeId &&
        (candidate.status === "PENDING" || candidate.status === "IN_PROGRESS"),
    )
    .map((candidate) => candidate.conceptName);
  const assessment = evaluateWorkingMemoryLoad({
    bloomLevel: node.bloomLevel,
    directPrerequisiteCount: node.prerequisites.length,
    transitiveAncestorCount: countTransitiveAncestors(params.nodeId, graphNodes),
    text: params.textToMeasure,
    unmasteredConceptNames,
    capacityThreshold: params.capacityThreshold,
  });

  console.log(
    `[Learn Agent][System 1] Concept="${node.conceptName}" | Intrinsic=${assessment.intrinsic.score.toFixed(2)} | Extrinsic=${assessment.extrinsic.score.toFixed(2)} | TotalWML=${assessment.totalWml.toFixed(2)} (${assessment.loadLevel}) | Overloaded=${assessment.isOverloaded}`,
  );
  console.log(
    `[Learn Agent][System 1] Active scaffolding directives: ${assessment.scaffoldingDirectives.join(" | ") || "none"}.`,
  );

  return assessment;
}
```


---
## FILE: src/modules/learn-agent/tests/full-loop.test.ts

```ts
import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { User } from "../../auth/models/User.js";
import { registerUser } from "../../auth/services/auth-service.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserLearningSlots } from "../../plan-agent/models/UserLearningSlots.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { evaluateUserIntent } from "../../plan-agent/services/clarify-service.js";
import { getNextDiagnosticNode } from "../../plan-agent/services/diagnostic-engine.js";
import {
  evaluateDiagnosticResponse,
  generateDiagnosticQuestion,
} from "../../plan-agent/services/diagnostic-questioner.js";
import { processDiagnosticAnswer } from "../../plan-agent/services/diagnostic-evaluator.js";
import { createLearningPlan } from "../../plan-agent/services/plan-service.js";
import { getOuterFringe } from "../services/outer-fringe.js";
import { loadLearningNodeState, prepareNodeLesson, submitNodeAttempt } from "../services/micro-tutor.js";

interface GeminiRequestBody {
  systemInstruction?: { parts?: Array<{ text?: string }> };
  contents?: Array<{ parts?: Array<{ text?: string }> }>;
  [key: string]: unknown;
}

interface CapturedGeminiRequest {
  url: string;
  body: GeminiRequestBody;
  prompt: string;
}

function createFetchHarness() {
  const replies: Array<(request: CapturedGeminiRequest) => unknown> = [];
  const requests: CapturedGeminiRequest[] = [];
  const unexpectedRequests: CapturedGeminiRequest[] = [];

  const fetchMock: typeof fetch = async (input, init) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as GeminiRequestBody;
    const prompt = [
      ...(body.systemInstruction?.parts ?? []).map((part) => part.text ?? ""),
      ...(body.contents ?? []).flatMap((content) =>
        (content.parts ?? []).map((part) => part.text ?? ""),
      ),
    ].join("\n");
    const request = { url: String(input), body, prompt };
    requests.push(request);

    const reply = replies.shift();
    if (!reply) {
      unexpectedRequests.push(request);
      return new Response(JSON.stringify({ error: { message: "Unexpected mock fetch" } }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = reply(request);
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }],
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  return {
    fetchMock,
    requests,
    enqueue(reply: unknown) {
      replies.push(() => reply);
    },
    route(handler: (request: CapturedGeminiRequest) => unknown) {
      replies.push(handler);
    },
    assertDrained() {
      assert.equal(replies.length, 0, "all queued Gemini replies should be consumed");
      assert.deepEqual(unexpectedRequests, [], "no unplanned fetch should be made");
    },
  };
}

interface NodeDefinition {
  conceptName: string;
  bloomLevel: number;
  prerequisites?: string[];
  status?: "PASSED_IN_DIAGNOSTIC" | "PENDING" | "IN_PROGRESS" | "MASTERED";
}

async function createPlanFixture(
  userId: string,
  topic: string,
  definitions: NodeDefinition[],
  status: "DIAGNOSTIC_IN_PROGRESS" | "READY" | "COMPLETED" = "READY",
) {
  const plan = await Plan.create({ userId, topic, targetDepth: 6, status });
  const nodeIds = new Map(
    definitions.map((definition) => [definition.conceptName, new Types.ObjectId()]),
  );
  const nodes = await PlanNode.create(definitions.map((definition) => ({
    _id: nodeIds.get(definition.conceptName),
    planId: plan._id,
    conceptName: definition.conceptName,
    bloomLevel: definition.bloomLevel,
    status: definition.status ?? "PENDING",
    prerequisites: (definition.prerequisites ?? []).map((name) => {
      const prerequisiteId = nodeIds.get(name);
      if (!prerequisiteId) throw new Error(`Unknown fixture prerequisite: ${name}`);
      return prerequisiteId;
    }),
  })));
  return { plan, nodes };
}

const simpleLesson = {
  explanation: "A closure retains access to its lexical scope.",
  checkQuestion: "What does a closure retain?",
  expectedCriteria: "It retains access to lexical scope.",
};

const denseLesson = {
  explanation: "A sophisticated implementation coordinates lexical environments, mutable bindings, and deferred execution.\n```javascript\nconst scope = { value: 1 };\nfunction createClosure() { return () => scope.value; }\n``` Closure Applications reveal how this abstraction preserves contextual references.",
  checkQuestion: "How does the implementation retain its contextual reference?",
  expectedCriteria: "The closure retains access to the lexical environment.",
};

test(
  "Deterministic mocked tests cover the full Plan Agent and Learn Agent loop",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    await connectToDatabase();
    const originalFetch = globalThis.fetch;
    const email = `full-loop-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
    let userId: string | undefined;
    t.after(async () => {
      globalThis.fetch = originalFetch;
      const user = userId
        ? await User.findById(userId).select("_id")
        : await User.findOne({ email }).select("_id");
      if (user) {
        const plans = await Plan.find({ userId: user._id }).select("_id");
        const planIds = plans.map((plan) => plan._id);
        await PlanNode.deleteMany({ planId: { $in: planIds } });
        await Plan.deleteMany({ userId: user._id });
        await UserLearningSlots.deleteMany({ userId: user._id });
        await UserMastery.deleteMany({ userId: user._id.toString() });
        await User.deleteOne({ _id: user._id });
      }
      await disconnectFromDatabase();
    });

    const registration = await registerUser(email, "full-loop-test-password", "Full Loop Test");
    userId = registration.user.userId;
    const harness = createFetchHarness();
    globalThis.fetch = harness.fetchMock;
    t.after(() => {
      globalThis.fetch = originalFetch;
    });
    const apiKey = "deterministic-test-key";

    await t.test("prepareNodeLesson enters progress and only regenerates overload once", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Tutor capacity", [
        { conceptName: "Basic Recall", bloomLevel: 1 },
      ]);
      await Plan.updateOne({ _id: plan._id }, { $set: { capacityThreshold: 0.62 } });
      const requestStart = harness.requests.length;
      harness.enqueue(simpleLesson);
      const turn = await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId: nodes[0]._id.toString(),
        apiKey,
      });
      assert.equal((await PlanNode.findById(nodes[0]._id))?.status, "IN_PROGRESS");
      assert.equal(turn.wasRegeneratedForOverload, false);
      assert.equal(turn.preGate.extrinsicBudget, 0.62);
      assert.equal(turn.wmlAssessment.capacityThreshold, 0.62);
      assert.equal(harness.requests.length - requestStart, 1);
      assert.ok(harness.requests[requestStart].prompt.includes("Basic Recall"));
      const lowLoadDirective = turn.wmlAssessment.scaffoldingDirectives.find((directive) =>
        directive.includes("Learner cognitive load is low"),
      );
      assert.ok(lowLoadDirective, "LOW-load directives should be available to the next tutor turn");
      harness.enqueue(simpleLesson);
      await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId: nodes[0]._id.toString(),
        apiKey,
        capacityThreshold: 0.90,
        scaffoldingDirectives: [lowLoadDirective],
      });
      assert.ok(harness.requests[harness.requests.length - 1].prompt.includes(lowLoadDirective));

      const prerequisiteDefinitions = Array.from({ length: 4 }, (_, index) => ({
        conceptName: `Known prerequisite ${index + 1}`,
        bloomLevel: 1,
        status: "MASTERED" as const,
      }));
      const { plan: overloadPlan, nodes: overloadNodes } = await createPlanFixture(
        userId!,
        "Tutor overload",
        [
          ...prerequisiteDefinitions,
          {
            conceptName: "Advanced Synthesis",
            bloomLevel: 6,
            prerequisites: prerequisiteDefinitions.map((node) => node.conceptName),
          },
        ],
      );
      const overloadNode = overloadNodes[overloadNodes.length - 1];
      const upfrontStart = harness.requests.length;
      harness.enqueue(simpleLesson);
      const proactiveTurn = await prepareNodeLesson({
        planId: overloadPlan._id.toString(),
        userId: userId!,
        nodeId: overloadNode._id.toString(),
        apiKey,
        capacityThreshold: 0.90,
      });
      assert.equal(proactiveTurn.wmlAssessment.isOverloaded, false);
      assert.equal(harness.requests.length - upfrontStart, 1);
      assert.ok(
        harness.requests[upfrontStart].prompt.includes(
          "Decompose the concept into one atomic sub-step",
        ),
      );
      const overloadStart = harness.requests.length;
      harness.enqueue(denseLesson);
      harness.enqueue(denseLesson);
      const overloadedTurn = await prepareNodeLesson({
        planId: overloadPlan._id.toString(),
        userId: userId!,
        nodeId: overloadNode._id.toString(),
        apiKey,
        capacityThreshold: 0.45,
      });
      assert.equal(overloadedTurn.wasRegeneratedForOverload, true);
      assert.equal(overloadedTurn.wmlAssessment.isOverloaded, true);
      assert.equal(harness.requests.length - overloadStart, 2);
      assert.ok(harness.requests[overloadStart + 1].prompt.includes("End with a single"));
      harness.assertDrained();
    });

    await t.test("prepareNodeLesson rejects invalid and unowned identifiers before fetch", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Ownership", [
        { conceptName: "Owned Node", bloomLevel: 1 },
      ]);
      const requestStart = harness.requests.length;
      const validPlanId = plan._id.toString();
      const validNodeId = nodes[0]._id.toString();

      await assert.rejects(
        prepareNodeLesson({ planId: "invalid-plan", userId: userId!, nodeId: validNodeId, apiKey }),
        /valid plan ObjectId/,
      );
      await assert.rejects(
        prepareNodeLesson({ planId: validPlanId, userId: "invalid-user", nodeId: validNodeId, apiKey }),
        /valid authenticated user ObjectId/,
      );
      await assert.rejects(
        prepareNodeLesson({ planId: validPlanId, userId: userId!, nodeId: "invalid-node", apiKey }),
        /valid plan node ObjectId/,
      );
      await assert.rejects(
        prepareNodeLesson({
          planId: validPlanId,
          userId: new Types.ObjectId().toString(),
          nodeId: validNodeId,
          apiKey,
        }),
        /Plan not found for the authenticated user/,
      );
      assert.equal(harness.requests.length, requestStart);
    });

    await t.test("failed attempts retain progress and remediation includes prior answer and feedback", async () => {
      const { plan, nodes } = await createPlanFixture(userId!, "Remediation", [
        { conceptName: "Lexical Scope", bloomLevel: 2, status: "IN_PROGRESS" },
      ]);
      const nodeId = nodes[0]._id.toString();
      harness.enqueue({ mastered: false, feedback: "Distinguish retained scope from copied values.", hint: "Track the outer binding." });
      const failed = await submitNodeAttempt({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        lesson: simpleLesson,
        userAnswer: "It copies the value.",
        attemptCount: 1,
        averageWml: 0.5,
        capacityThreshold: 0.74,
        wmlSamples: [0.5],
        apiKey,
      });
      assert.equal(failed.mastered, false);
      const failedNode = await PlanNode.findById(nodeId);
      assert.equal(failedNode?.status, "IN_PROGRESS");
      assert.equal(failedNode?.attemptCount, 1);
      assert.deepEqual(failedNode?.wmlSamples, [0.5]);
      assert.equal(failedNode?.lastAttempt, "It copies the value.");
      assert.ok(failedNode?.lastTutorFeedback?.includes("Distinguish retained scope"));
      assert.ok(failedNode?.lastTutorFeedback?.includes("Track the outer binding."));
      assert.deepEqual(failedNode?.attempts.map((attempt) => ({
        attemptNumber: attempt.attemptNumber,
        learnerAnswer: attempt.learnerAnswer,
        wmlScore: attempt.wmlScore,
        passed: attempt.passed,
      })), [{
        attemptNumber: 1,
        learnerAnswer: "It copies the value.",
        wmlScore: 0.5,
        passed: false,
      }]);
      const resumed = await loadLearningNodeState(plan._id.toString(), userId!, nodeId);
      assert.equal(resumed.capacityThreshold, 0.74);
      assert.equal((await User.findById(userId))?.capacityThreshold, 0.74);
      assert.equal(resumed.attemptCount, 1);
      assert.deepEqual(resumed.wmlSamples, [0.5]);
      assert.equal(resumed.previousAttempt, "It copies the value.");
      assert.ok(resumed.tutorFeedback?.includes("Distinguish retained scope"));
      assert.equal(await UserMastery.countDocuments({
        userId,
        conceptKey: "lexical scope",
      }), 0);

      const requestStart = harness.requests.length;
      harness.enqueue(simpleLesson);
      await prepareNodeLesson({
        planId: plan._id.toString(),
        userId: userId!,
        nodeId,
        apiKey,
      });
      const remediationPrompt = harness.requests[requestStart].prompt;
      assert.ok(remediationPrompt.includes("It copies the value."));
      assert.ok(remediationPrompt.includes("Distinguish retained scope from copied values."));
      assert.ok(remediationPrompt.includes("Track the outer binding."));
    });

    await t.test("mastery scores upsert by attempt and preserve a higher cross-plan score", async () => {
      const masteryDefinitions = [1, 2, 3].map((attemptCount) => ({
        conceptName: `Attempt ${attemptCount} Mastery`,
        bloomLevel: 2,
      }));
      const { plan, nodes } = await createPlanFixture(userId!, "Durable mastery", masteryDefinitions);
      for (const [index, attemptCount] of [1, 2, 3].entries()) {
        harness.enqueue({ mastered: true, feedback: "Correct.", hint: null });
        const evaluation = await submitNodeAttempt({
          planId: plan._id.toString(),
          userId: userId!,
          nodeId: nodes[index]._id.toString(),
          lesson: simpleLesson,
          userAnswer: "Correct answer.",
          attemptCount,
          averageWml: 0.2,
          capacityThreshold: 0.70,
          apiKey,
        });
        const expectedScore = [0.95, 0.90, 0.86][index];
        assert.equal(evaluation.masteryScore, expectedScore);
        assert.ok(evaluation.updatedCapacityThreshold >= 0.45);
        assert.ok(evaluation.updatedCapacityThreshold <= 0.90);
        const masteredNode = await PlanNode.findById(nodes[index]._id);
        assert.equal(masteredNode?.status, "MASTERED");
        assert.equal(masteredNode?.attempts.at(-1)?.passed, true);
        assert.equal((await UserMastery.findOne({
          userId,
          conceptKey: masteryDefinitions[index].conceptName.trim().toLowerCase(),
        }))?.masteryScore, expectedScore);
      }

      const laterPlan = await createPlanFixture(userId!, "Later mastery", [
        { conceptName: "Attempt 1 Mastery", bloomLevel: 2 },
      ]);
      harness.enqueue({ mastered: true, feedback: "Correct again.", hint: null });
      const laterEvaluation = await submitNodeAttempt({
        planId: laterPlan.plan._id.toString(),
        userId: userId!,
        nodeId: laterPlan.nodes[0]._id.toString(),
        lesson: simpleLesson,
        userAnswer: "Correct answer.",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: 0.70,
        apiKey,
      });
      assert.equal(laterEvaluation.masteryScore, 0.86);
      assert.equal((await UserMastery.findOne({
        userId,
        conceptKey: "attempt 1 mastery",
      }))?.masteryScore, 0.95);
    });

    await t.test("full plan loop diagnoses, teaches, remediates, and credits prior mastery", async () => {
      harness.enqueue({
        slots: { targetLanguageOrTool: null, specificSubdomain: null, targetDepth: null },
        isComplete: false,
        nextQuestion: "Which language and goal do you have in mind?",
      });
      const ambiguous = await evaluateUserIntent(userId!, "I want to learn programming", apiKey);
      assert.equal(ambiguous.isComplete, false);

      harness.enqueue({
        slots: {
          targetLanguageOrTool: "JavaScript",
          specificSubdomain: "closures",
          targetDepth: 3,
        },
        isComplete: true,
        nextQuestion: null,
      });
      const scoped = await evaluateUserIntent(
        userId!,
        "Teach me JavaScript closures at Bloom level 3.",
        apiKey,
      );
      assert.equal(scoped.isComplete, true);

      harness.enqueue([
        { conceptName: "Closure Axiom", bloomLevel: 1, prerequisiteNames: [] },
        { conceptName: "Lexical Scope", bloomLevel: 2, prerequisiteNames: ["Closure Axiom"] },
        { conceptName: "JavaScript Closures", bloomLevel: 3, prerequisiteNames: ["Lexical Scope"] },
        { conceptName: "Closure Applications", bloomLevel: 3, prerequisiteNames: ["Lexical Scope"] },
      ]);
      const plan = await createLearningPlan(userId!, "JavaScript closures", 3, apiKey);
      const planId = plan._id.toString();
      const nodes = await PlanNode.find({ planId });
      assert.equal(nodes.length, 4);
      const nodeByName = new Map(nodes.map((node) => [node.conceptName, node]));

      const middleNode = await getNextDiagnosticNode(planId, userId!);
      assert.equal(middleNode?.conceptName, "Lexical Scope");
      assert.ok(middleNode);
      harness.enqueue({ question: "What does lexical scope retain?", expectedCriteria: "The surrounding lexical environment." });
      const diagnosticQuestion = await generateDiagnosticQuestion(
        plan.topic,
        middleNode.conceptName,
        middleNode.bloomLevel,
        apiKey,
      );
      harness.enqueue({ passed: true, feedback: "Correctly identified the surrounding environment." });
      const diagnosticResult = await evaluateDiagnosticResponse(
        plan.topic,
        middleNode.conceptName,
        middleNode.bloomLevel,
        diagnosticQuestion.question,
        diagnosticQuestion.expectedCriteria,
        "It retains the surrounding lexical environment.",
        apiKey,
      );
      assert.equal(diagnosticResult.passed, true);
      await processDiagnosticAnswer(middleNode._id.toString(), true, userId!);
      assert.equal((await PlanNode.findById(nodeByName.get("Closure Axiom")!._id))?.status, "PASSED_IN_DIAGNOSTIC");
      assert.equal((await PlanNode.findById(middleNode._id))?.status, "PASSED_IN_DIAGNOSTIC");

      let nextDiagnostic = await getNextDiagnosticNode(planId, userId!);
      while (nextDiagnostic) {
        harness.enqueue({ question: `Explain ${nextDiagnostic.conceptName}.`, expectedCriteria: "A correct explanation." });
        const question = await generateDiagnosticQuestion(
          plan.topic,
          nextDiagnostic.conceptName,
          nextDiagnostic.bloomLevel,
          apiKey,
        );
        harness.enqueue({ passed: false, feedback: "This node remains for guided learning." });
        const evaluation = await evaluateDiagnosticResponse(
          plan.topic,
          nextDiagnostic.conceptName,
          nextDiagnostic.bloomLevel,
          question.question,
          question.expectedCriteria,
          "I am not sure.",
          apiKey,
        );
        assert.equal(evaluation.passed, false);
        await processDiagnosticAnswer(nextDiagnostic._id.toString(), false, userId!);
        nextDiagnostic = await getNextDiagnosticNode(planId, userId!);
      }
      assert.equal(await PlanNode.countDocuments({ planId, status: "PENDING" }), 0);
      await Plan.updateOne({ _id: plan._id, userId }, { $set: { status: "READY" } });
      assert.equal((await Plan.findById(plan._id))?.status, "READY");

      let completed = false;
      let learningTurns = 0;
      while (!completed && learningTurns < 8) {
        const fringe = await getOuterFringe(planId, userId!);
        if (fringe.isPlanCompleted) {
          completed = true;
          break;
        }
        assert.ok(fringe.nextNodeId, "an incomplete plan should expose a next node");
        const node = await PlanNode.findById(fringe.nextNodeId);
        assert.ok(node);
        learningTurns += 1;

        if (node.conceptName === "JavaScript Closures") {
          harness.enqueue(simpleLesson);
          const firstTurn = await prepareNodeLesson({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            apiKey,
            capacityThreshold: 0.70,
          });
          harness.enqueue({ mastered: false, feedback: "Explain retained scope rather than copied values.", hint: "Look at the outer binding." });
          const failedAttempt = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: firstTurn.lesson,
            userAnswer: "The closure copies the value.",
            attemptCount: 1,
            averageWml: 0.6,
            capacityThreshold: 0.70,
            apiKey,
          });
          assert.equal(failedAttempt.mastered, false);

          const remediationStart = harness.requests.length;
          harness.enqueue(simpleLesson);
          const remediationTurn = await prepareNodeLesson({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            apiKey,
            capacityThreshold: 0.70,
            previousAttempt: "The closure copies the value.",
            tutorFeedback: failedAttempt.feedback,
          });
          assert.ok(harness.requests[remediationStart].prompt.includes("The closure copies the value."));
          assert.ok(harness.requests[remediationStart].prompt.includes(failedAttempt.feedback));
          harness.enqueue({ mastered: true, feedback: "Correctly described retained scope.", hint: null });
          const mastered = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: remediationTurn.lesson,
            userAnswer: "It retains access to the outer lexical environment.",
            attemptCount: 2,
            averageWml: 0.4,
            capacityThreshold: 0.70,
            apiKey,
          });
          assert.equal(mastered.mastered, true);
          assert.ok(mastered.updatedCapacityThreshold >= 0.45 && mastered.updatedCapacityThreshold <= 0.90);
        } else {
          assert.equal(node.conceptName, "Closure Applications");
          const overloadStart = harness.requests.length;
          harness.enqueue(denseLesson);
          harness.enqueue(denseLesson);
          const overloaded = await prepareNodeLesson({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            apiKey,
            capacityThreshold: 0.40,
          });
          assert.equal(overloaded.wasRegeneratedForOverload, true);
          assert.equal(overloaded.wmlAssessment.isOverloaded, true);
          assert.equal(harness.requests.length - overloadStart, 2);
          assert.ok(harness.requests[overloadStart + 1].prompt.includes("End with a single"));

          harness.enqueue({ mastered: true, feedback: "Correctly applied the closure model.", hint: null });
          const mastered = await submitNodeAttempt({
            planId,
            userId: userId!,
            nodeId: node._id.toString(),
            lesson: overloaded.lesson,
            userAnswer: "The closure can be used to retain and apply scoped state.",
            attemptCount: 1,
            averageWml: 0.2,
            capacityThreshold: 0.40,
            apiKey,
          });
          assert.equal(mastered.mastered, true);
          assert.ok(mastered.updatedCapacityThreshold >= 0.45 && mastered.updatedCapacityThreshold <= 0.90);
        }
      }
      assert.equal(completed, true);
      assert.equal((await Plan.findById(plan._id))?.status, "COMPLETED");
      assert.equal((await getOuterFringe(planId, userId!)).isPlanCompleted, true);

      harness.enqueue([
        { conceptName: "javascript closures", bloomLevel: 3, prerequisiteNames: [] },
      ]);
      const secondPlan = await createLearningPlan(userId!, "Closures review", 3, apiKey);
      const fetchCountBeforeCredit = harness.requests.length;
      const creditedFringe = await getOuterFringe(secondPlan._id.toString(), userId!);
      assert.equal(creditedFringe.isPlanCompleted, true);
      assert.equal(creditedFringe.remainingCount, 0);
      assert.equal(harness.requests.length, fetchCountBeforeCredit);
      assert.equal((await PlanNode.findOne({ planId: secondPlan._id }))?.status, "MASTERED");
      harness.assertDrained();
    });
  },
);
```


---
## FILE: src/modules/learn-agent/tests/learn-agent.test.ts

```ts
import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { normalizeConceptName } from "../../common/utils/normalize-concept-name.js";
import { Plan } from "../../plan-agent/models/Plan.js";
import { PlanNode } from "../../plan-agent/models/PlanNode.js";
import { UserMastery } from "../../plan-agent/models/UserMastery.js";
import { getOuterFringe, syncPriorUserMastery } from "../services/outer-fringe.js";
import { prepareNodeLesson, submitNodeAttempt } from "../services/micro-tutor.js";
import { calculateCognitiveEfficiency } from "../utils/cognitive-efficiency.js";
import { getLearningFringeState, selectOuterFringe } from "../utils/outer-fringe-selector.js";
import {
  calculateExtrinsicLoad,
  calculateIntrinsicLoad,
  evaluateWorkingMemoryLoad,
  preGateIntrinsicLoad,
} from "../utils/wml-calculator.js";

test("Intrinsic pre-gate is deterministic across Bloom levels and learner capacities", () => {
  for (let bloomLevel = 1; bloomLevel <= 6; bloomLevel += 1) {
    for (const capacityThreshold of [0.45, 0.55, 0.70, 0.90]) {
      for (const [directPrerequisiteCount, transitiveAncestorCount] of [[0, 0], [2, 3], [4, 8]]) {
        const result = preGateIntrinsicLoad({
          bloomLevel,
          directPrerequisiteCount,
          transitiveAncestorCount,
          capacityThreshold,
        });
        const intrinsic = calculateIntrinsicLoad(
          bloomLevel,
          directPrerequisiteCount,
          transitiveAncestorCount,
        ).score;
        const weightedIntrinsic = 0.55 * intrinsic;
        const extrinsicBudget = Math.max(0, capacityThreshold - weightedIntrinsic);
        const expectedMode = weightedIntrinsic >= capacityThreshold
          ? "INTRINSIC_OVERLOAD"
          : extrinsicBudget <= 0.25 || weightedIntrinsic >= capacityThreshold * 0.70
            ? "CONSTRAINED"
            : "OPTIMAL";

        assert.equal(result.intrinsicLoad, intrinsic);
        assert.equal(result.weightedIntrinsic, weightedIntrinsic);
        assert.equal(result.extrinsicBudget, extrinsicBudget);
        assert.equal(result.mode, expectedMode);
        assert.equal(
          result.proactiveDirectives.length === 0,
          result.mode === "OPTIMAL",
        );
      }
    }
  }

  const optimal = preGateIntrinsicLoad({ bloomLevel: 1, directPrerequisiteCount: 0, transitiveAncestorCount: 0, capacityThreshold: 0.90 });
  const constrained = preGateIntrinsicLoad({ bloomLevel: 6, directPrerequisiteCount: 4, transitiveAncestorCount: 4, capacityThreshold: 0.70 });
  const overloaded = preGateIntrinsicLoad({ bloomLevel: 6, directPrerequisiteCount: 4, transitiveAncestorCount: 4, capacityThreshold: 0.45 });
  assert.equal(optimal.mode, "OPTIMAL");
  assert.equal(constrained.mode, "CONSTRAINED");
  assert.equal(overloaded.mode, "INTRINSIC_OVERLOAD");
  assert.ok(constrained.proactiveDirectives.some((directive) => directive.includes("14 words")));
  assert.ok(overloaded.proactiveDirectives.some((directive) => directive.includes("atomic intuition chunk")));
});

test("WML calculator scores intrinsic and extrinsic load and produces overload scaffolding", () => {
  const intrinsic = calculateIntrinsicLoad(6, 4, 8);
  assert.equal(intrinsic.score, 1);
  assert.equal(intrinsic.bloomFactor, 1);
  assert.equal(intrinsic.directPrereqFactor, 1);
  assert.equal(intrinsic.transitiveDepthFactor, 1);

  const extrinsic = calculateExtrinsicLoad(
    "A sophisticated explanation introduces unfamiliar terminology and uses {code};",
    ["unfamiliar terminology"],
  );
  assert.ok(extrinsic.score > 0);
  assert.ok(extrinsic.lexicalDensityFactor > 0);
  assert.ok(extrinsic.codeDensityFactor > 0);
  assert.ok(extrinsic.novelTermFactor > 0);

  const shortTerms = calculateExtrinsicLoad("setup and random values", ["Set", "Map", "DOM"]);
  assert.equal(shortTerms.novelTermFactor, 0, "short terms must not match inside longer words");
  const punctuatedTerms = calculateExtrinsicLoad("C++ and Node.js", ["C++", "Node.js"]);
  assert.equal(punctuatedTerms.novelTermFactor, 2 / 3);

  const assessment = evaluateWorkingMemoryLoad({
    bloomLevel: 6,
    directPrerequisiteCount: 4,
    transitiveAncestorCount: 8,
    text: "A short explanation.",
    unmasteredConceptNames: [],
    capacityThreshold: 0.45,
  });
  assert.equal(assessment.isOverloaded, true);
  assert.ok(assessment.scaffoldingDirectives.some((directive) => directive.includes("atomic sub-step")));
  assert.ok(assessment.scaffoldingDirectives.some((directive) => directive.includes("check-for-understanding")));
});

test("Outer Fringe prioritizes in-progress nodes, gates prerequisites, and detects completion", () => {
  const selected = selectOuterFringe([
    { nodeId: "pending-low", conceptName: "A", bloomLevel: 1, status: "PENDING", prerequisiteIds: [] },
    { nodeId: "progress-high", conceptName: "Z", bloomLevel: 5, status: "IN_PROGRESS", prerequisiteIds: [] },
    { nodeId: "tie-z", conceptName: "Zebra", bloomLevel: 2, status: "PENDING", prerequisiteIds: [] },
    { nodeId: "tie-a", conceptName: "Apple", bloomLevel: 2, status: "PENDING", prerequisiteIds: [] },
    { nodeId: "locked", conceptName: "Locked", bloomLevel: 1, status: "PENDING", prerequisiteIds: ["pending-low"] },
  ]);
  assert.equal(selected.nextNodeId, "progress-high");
  assert.deepEqual(selected.unlockedNodes.slice(1, 3).map((node) => node.nodeId), ["pending-low", "tie-a"]);
  assert.equal(selected.unlockedNodes.some((node) => node.nodeId === "locked"), false);
  assert.equal(selected.remainingCount, 5);
  assert.equal(selected.isPlanCompleted, false);

  const completed = selectOuterFringe([
    { nodeId: "passed", conceptName: "Passed", bloomLevel: 1, status: "PASSED_IN_DIAGNOSTIC", prerequisiteIds: [] },
    { nodeId: "mastered", conceptName: "Mastered", bloomLevel: 2, status: "MASTERED", prerequisiteIds: ["passed"] },
  ]);
  assert.equal(completed.isPlanCompleted, true);
  assert.equal(completed.nextNodeId, null);
  assert.equal(completed.remainingCount, 0);
  assert.equal(getLearningFringeState(completed), "COMPLETED");
  assert.equal(
    getLearningFringeState({ isPlanCompleted: false, nextNodeId: null }),
    "BLOCKED",
  );
});

test("System 2 efficiency normalizes Paas scoring, bounds capacity, and preserves durable mastery", () => {
  const firstAttempt = calculateCognitiveEfficiency({
    mastered: true,
    attemptCount: 1,
    averageWml: 0,
    capacityThreshold: 0.89,
  });
  assert.ok(firstAttempt.efficiencyScore > 0.999999);
  assert.equal(firstAttempt.updatedCapacityThreshold, 0.90);
  assert.equal(firstAttempt.durableMasteryScore, 0.95);

  const struggled = calculateCognitiveEfficiency({
    mastered: true,
    attemptCount: 3,
    averageWml: 1,
    capacityThreshold: 0.46,
  });
  assert.equal(struggled.updatedCapacityThreshold, 0.45);
  assert.equal(struggled.durableMasteryScore, 0.86);
  assert.ok(struggled.durableMasteryScore >= 0.85);

  const secondAttempt = calculateCognitiveEfficiency({
    mastered: true,
    attemptCount: 2,
    averageWml: 0.4,
    capacityThreshold: 0.7,
  });
  assert.equal(secondAttempt.durableMasteryScore, 0.90);
});

test("Concept names normalize whitespace and casing for durable mastery keys", async () => {
  assert.equal(normalizeConceptName("  Closures   and   Scope  "), "closures and scope");
  const mastery = new UserMastery({
    userId: new Types.ObjectId().toString(),
    conceptName: "  Closures   and   Scope  ",
    canonicalConceptName: "  Explicit   Canonical   Name ",
    masteryScore: 0.9,
  });
  await mastery.validate();
  assert.equal(mastery.conceptKey, "closures and scope");
  assert.equal(mastery.canonicalConceptName, "explicit canonical name");
});

test(
  "MongoDB reconciles prior mastery case-insensitively and enforces Outer Fringe ownership",
  { skip: !process.env.MONGODB_URI?.trim() },
  async (t) => {
    const userId = new Types.ObjectId().toString();
    const otherUserId = new Types.ObjectId().toString();
    let planId: string | undefined;

    await connectToDatabase();
    t.after(async () => {
      if (planId) {
        await PlanNode.deleteMany({ planId });
        await Plan.deleteOne({ _id: planId });
      }
      await UserMastery.deleteMany({ userId });
      await disconnectFromDatabase();
    });

    const plan = await Plan.create({
      userId,
      topic: "JavaScript arrays",
      targetDepth: 2,
      status: "READY",
    });
    planId = plan._id.toString();
    const node = await PlanNode.create({
      planId: plan._id,
      conceptName: "javascript arrays",
      bloomLevel: 1,
      status: "PENDING",
      prerequisites: [],
    });
    await UserMastery.create({
      userId,
        conceptName: "  JavaScript Arrays  ",
      masteryScore: 0.90,
    });

    assert.equal(await syncPriorUserMastery(planId, userId), 1);
    assert.equal((await PlanNode.findById(node._id))?.status, "MASTERED");

    const closureNodes = await PlanNode.create([
      {
        planId: plan._id,
        conceptName: "Closures",
        bloomLevel: 1,
        status: "IN_PROGRESS",
        prerequisites: [],
      },
      {
        planId: plan._id,
        conceptName: "closures",
        bloomLevel: 1,
        status: "IN_PROGRESS",
        prerequisites: [],
      },
    ]);
    const originalFetch = globalThis.fetch;
    await UserMastery.create({
      userId,
      conceptName: "  CLOSURES  ",
      masteryScore: 0.99,
    });
    globalThis.fetch = async () => new Response(JSON.stringify({
      candidates: [{
        content: { parts: [{ text: JSON.stringify({ mastered: true, feedback: "Correct", hint: null }) }] },
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
    try {
      const lesson = {
        explanation: "A closure retains access to its lexical scope.",
        checkQuestion: "What does a closure retain?",
        expectedCriteria: "It retains access to lexical scope.",
      };
      const firstEvaluation = await submitNodeAttempt({
        planId,
        userId,
        nodeId: closureNodes[0]._id.toString(),
        lesson,
        userAnswer: "Its lexical scope",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: 0.70,
        apiKey: "test-key",
      });
      assert.ok(Math.abs(firstEvaluation.updatedCapacityThreshold - 0.66) < 1e-10);
      assert.ok(Math.abs(((await Plan.findById(plan._id))?.capacityThreshold ?? 0) - 0.66) < 1e-10);

      await submitNodeAttempt({
        planId,
        userId,
        nodeId: closureNodes[1]._id.toString(),
        lesson,
        userAnswer: "Its lexical scope",
        attemptCount: 3,
        averageWml: 1,
        capacityThreshold: firstEvaluation.updatedCapacityThreshold,
        apiKey: "test-key",
      });

      const prerequisiteNodes = await PlanNode.create(
        Array.from({ length: 4 }, (_, index) => ({
          planId: plan._id,
          conceptName: `Mastered prerequisite ${index + 1}`,
          bloomLevel: 1,
          status: "MASTERED" as const,
          prerequisites: [],
        })),
      );
      const gatedNode = await PlanNode.create({
        planId: plan._id,
        conceptName: "Advanced graph reasoning",
        bloomLevel: 6,
        status: "PENDING",
        prerequisites: prerequisiteNodes.map((prerequisite) => prerequisite._id),
      });
      const optimalNode = await PlanNode.create({
        planId: plan._id,
        conceptName: "Basic recall",
        bloomLevel: 1,
        status: "PENDING",
        prerequisites: [],
      });
      const originalConsoleLog = console.log;
      const fetchEvents: string[] = [];
      const requestBodies: Array<{ contents?: Array<{ parts?: Array<{ text?: string }> }> }> = [];
      globalThis.fetch = async (_input, init) => {
        fetchEvents.push("fetch");
        const requestBody = JSON.parse(String(init?.body)) as typeof requestBodies[number];
        requestBodies.push(requestBody);
        const prompt = requestBody.contents?.[0]?.parts?.[0]?.text ?? "";
        const lesson = prompt.includes("INTRINSIC_OVERLOAD")
          ? { explanation: ".", checkQuestion: "?", expectedCriteria: "." }
          : {
              explanation: "map name value",
              checkQuestion: "name value",
              expectedCriteria: "A name to a value.",
            };
        return new Response(JSON.stringify({
          candidates: [{
            content: { parts: [{ text: JSON.stringify(lesson) }] },
          }],
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      };
      console.log = (...values: unknown[]) => {
        if (String(values[0]).includes("[Learn Agent][System 1 Pre-Gate]")) {
          fetchEvents.push("pre-gate");
        }
      };
      try {
        for (const [nodeId, capacityThreshold, expectedMode, expectedPrompt] of [
          [gatedNode._id.toString(), 0.70, "CONSTRAINED", "14 words"],
          [gatedNode._id.toString(), 0.45, "INTRINSIC_OVERLOAD", "atomic intuition chunk"],
          [optimalNode._id.toString(), 0.90, "OPTIMAL", ""],
        ] as const) {
          const eventStart = fetchEvents.length;
          const requestStart = requestBodies.length;
          const turn = await prepareNodeLesson({
            planId,
            userId,
            nodeId,
            apiKey: "test-key",
            capacityThreshold,
          });
          assert.equal(turn.preGate.mode, expectedMode);
          assert.equal(
            turn.regenerated,
            false,
            `${expectedMode}: extrinsic=${turn.wmlAssessment.extrinsic.score}, budget=${turn.preGate.extrinsicBudget}`,
          );
          assert.deepEqual(fetchEvents.slice(eventStart), ["pre-gate", "fetch"]);
          assert.equal(requestBodies.length - requestStart, 1);
          const prompt = requestBodies[requestStart].contents?.[0]?.parts?.[0]?.text ?? "";
          if (expectedPrompt) assert.ok(prompt.includes(expectedPrompt));
          else {
            assert.ok(prompt.includes("mode=OPTIMAL"));
            assert.ok(prompt.includes("No additional pre-gate restrictions apply."));
            assert.ok(!prompt.includes("Treat this budget as a strict constraint."));
          }
        }
      } finally {
        globalThis.fetch = originalFetch;
        console.log = originalConsoleLog;
      }

      await PlanNode.deleteMany({ planId, conceptName: /^(Mastered prerequisite|Advanced graph reasoning|Basic recall)/ });
    } finally {
      globalThis.fetch = originalFetch;
    }
    const closureMastery = await UserMastery.find({ userId, conceptKey: "closures" });
    assert.equal(closureMastery.length, 1);
    assert.equal(closureMastery[0].conceptKey, "closures");
    assert.equal(closureMastery[0].canonicalConceptName, "closures");
    assert.equal(closureMastery[0].masteryScore, 0.99);

    await assert.rejects(
      getOuterFringe(planId, otherUserId),
      /Plan not found for the authenticated user/,
    );
    await assert.rejects(
      getOuterFringe("invalid-plan-id", userId),
      /valid plan ObjectId/,
    );
  },
);
```


---
## FILE: src/modules/learn-agent/types/tutor.ts

```ts
import type { IntrinsicPreGateResult, WmlAssessment } from "./wml.js";

export interface TutorTurnPromptInput {
  topic: string;
  conceptName: string;
  bloomLevel: number;
  scaffoldingDirectives: string[];
  preGateResult: IntrinsicPreGateResult;
  previousAttempt?: string;
  tutorFeedback?: string;
}

export interface MicroLessonPayload {
  explanation: string;
  checkQuestion: string;
  expectedCriteria: string;
}

export interface GeneratedTutorTurn {
  nodeId: string;
  conceptName: string;
  bloomLevel: number;
  lesson: MicroLessonPayload;
  wmlAssessment: WmlAssessment;
  preGate: IntrinsicPreGateResult;
  regenerated: boolean;
  wasRegeneratedForOverload: boolean;
}

export interface LearnerTurnEvaluation {
  mastered: boolean;
  feedback: string;
  hint?: string;
  masteryScore: number;
  updatedCapacityThreshold: number;
}

export interface LearnerEvaluationPromptInput {
  topic: string;
  conceptName: string;
  bloomLevel: number;
  checkQuestion: string;
  expectedCriteria: string;
  userAnswer: string;
}
```


---
## FILE: src/modules/learn-agent/types/wml.ts

```ts
export interface IntrinsicLoadMetrics {
  bloomFactor: number;
  directPrereqFactor: number;
  transitiveDepthFactor: number;
  score: number;
}

export interface ExtrinsicLoadMetrics {
  sentenceLengthFactor: number;
  lexicalDensityFactor: number;
  codeDensityFactor: number;
  novelTermFactor: number;
  score: number;
}

export interface WmlAssessment {
  intrinsic: IntrinsicLoadMetrics;
  extrinsic: ExtrinsicLoadMetrics;
  totalWml: number;
  capacityThreshold: number;
  loadLevel: "LOW" | "OPTIMAL" | "HIGH" | "OVERLOADED";
  isOverloaded: boolean;
  scaffoldingDirectives: string[];
}

export interface IntrinsicPreGateResult {
  mode: "OPTIMAL" | "CONSTRAINED" | "INTRINSIC_OVERLOAD";
  intrinsicLoad: number;
  weightedIntrinsic: number;
  extrinsicBudget: number;
  proactiveDirectives: string[];
}

export interface OuterFringeResult {
  unlockedNodes: Array<{
    nodeId: string;
    conceptName: string;
    bloomLevel: number;
    status: string;
    prerequisiteCount: number;
  }>;
  nextNodeId: string | null;
  remainingCount: number;
  isPlanCompleted: boolean;
}
```


---
## FILE: src/modules/learn-agent/utils/cognitive-efficiency.ts

```ts
const SQRT_TWO = Math.sqrt(2);

function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

export function calculateCognitiveEfficiency(params: {
  mastered: boolean;
  attemptCount: number;
  averageWml: number;
  capacityThreshold: number;
}): {
  efficiencyScore: number;
  updatedCapacityThreshold: number;
  durableMasteryScore: number;
} {
  const attemptCount = Math.max(1, Math.floor(params.attemptCount));
  const performance = !params.mastered
    ? 0.25
    : attemptCount === 1
      ? 1
      : attemptCount === 2
        ? 0.85
        : 0.75;
  const mentalEffort = clamp(params.averageWml, 0, 1);
  const rawEfficiency = (performance - mentalEffort) / SQRT_TWO;
  const efficiencyScore = clamp((rawEfficiency + 1 / SQRT_TWO) / SQRT_TWO, 0, 1);

  let capacityAdjustment = 0;
  if (params.mastered && rawEfficiency > 0.25) capacityAdjustment = 0.03;
  else if (params.mastered && rawEfficiency < -0.10) capacityAdjustment = -0.04;

  const durableMasteryScore = !params.mastered
    ? 0.25
    : attemptCount === 1
      ? 0.95
      : attemptCount === 2
        ? 0.90
        : 0.86;

  return {
    efficiencyScore,
    updatedCapacityThreshold: clamp(
      params.capacityThreshold + capacityAdjustment,
      0.45,
      0.90,
    ),
    durableMasteryScore,
  };
}
```


---
## FILE: src/modules/learn-agent/utils/outer-fringe-selector.ts

```ts
import type { OuterFringeResult } from "../types/wml.js";

export const KNOWLEDGE_FRONTIER_SATISFIED = new Set([
  "PASSED_IN_DIAGNOSTIC",
  "MASTERED",
]);

export interface OuterFringeNode {
  nodeId: string;
  conceptName: string;
  bloomLevel: number;
  status: string;
  prerequisiteIds: string[];
}

export type LearningFringeState = "COMPLETED" | "BLOCKED" | "READY";

export function getLearningFringeState(
  fringe: Pick<OuterFringeResult, "isPlanCompleted" | "nextNodeId">,
): LearningFringeState {
  if (fringe.isPlanCompleted) return "COMPLETED";
  if (!fringe.nextNodeId) return "BLOCKED";
  return "READY";
}

export function selectOuterFringe(
  nodes: OuterFringeNode[],
  satisfiedStatuses: ReadonlySet<string> = KNOWLEDGE_FRONTIER_SATISFIED,
): OuterFringeResult {
  const nodeStatusById = new Map(
    nodes.map((node) => [node.nodeId, node.status] as const),
  );
  const unlockedNodes = nodes
    .filter(
      (node) =>
        (node.status === "IN_PROGRESS" || node.status === "PENDING") &&
        node.prerequisiteIds.every((prerequisiteId) =>
          satisfiedStatuses.has(nodeStatusById.get(prerequisiteId) ?? ""),
        ),
    )
    .sort((left, right) => {
      const statusOrder =
        Number(right.status === "IN_PROGRESS") -
        Number(left.status === "IN_PROGRESS");
      return (
        statusOrder ||
        left.bloomLevel - right.bloomLevel ||
        (left.conceptName < right.conceptName
          ? -1
          : left.conceptName > right.conceptName
            ? 1
            : 0)
      );
    })
    .map((node) => ({
      nodeId: node.nodeId,
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: node.status,
      prerequisiteCount: node.prerequisiteIds.length,
    }));

  const remainingCount = nodes.filter(
    (node) => !satisfiedStatuses.has(node.status),
  ).length;
  const isPlanCompleted = remainingCount === 0;

  return {
    unlockedNodes,
    nextNodeId: unlockedNodes[0]?.nodeId ?? null,
    remainingCount,
    isPlanCompleted,
  };
}

export function countTransitiveAncestors(
  nodeId: string,
  nodes: OuterFringeNode[],
): number {
  const nodesById = new Map(nodes.map((node) => [node.nodeId, node] as const));
  const visited = new Set<string>([nodeId]);

  function visit(current: OuterFringeNode): void {
    for (const prerequisiteId of current.prerequisiteIds) {
      if (visited.has(prerequisiteId)) continue;
      visited.add(prerequisiteId);
      const prerequisite = nodesById.get(prerequisiteId);
      if (prerequisite) visit(prerequisite);
    }
  }

  const node = nodesById.get(nodeId);
  if (node) visit(node);
  return visited.size - 1;
}
```


---
## FILE: src/modules/learn-agent/utils/tutor-prompts.ts

```ts
import type {
  LearnerEvaluationPromptInput,
  TutorTurnPromptInput,
} from "../types/tutor.js";

const BLOOM_LEVEL_NAMES = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

export function getMicroLessonPrompt(input: TutorTurnPromptInput): string {
  const bloomName = BLOOM_LEVEL_NAMES[input.bloomLevel - 1] ?? "Unknown";
  const remediation = input.previousAttempt !== undefined && input.tutorFeedback !== undefined
    ? `\nThe learner's previous attempt was: ${input.previousAttempt}\nTutor feedback identifying the misconception: ${input.tutorFeedback}\nAddress that specific misconception concisely. Do not repeat the full prior lecture.`
    : "";
  const directives = input.scaffoldingDirectives.length
    ? input.scaffoldingDirectives.map((directive) => `- ${directive}`).join("\n")
    : "- Keep the lesson focused and concise; teach only the requested node.";
  const preGate = `\nSystem 1 intrinsic pre-gate: mode=${input.preGateResult.mode}; remaining extrinsic load budget=${input.preGateResult.extrinsicBudget.toFixed(2)}.${input.preGateResult.mode === "OPTIMAL" ? " No additional pre-gate restrictions apply." : ` Treat this budget as a strict constraint.\n${input.preGateResult.proactiveDirectives.map((directive) => `- ${directive}`).join("\n")}`}`;

  return `Act as a node-scoped Micro-Tutor. Teach strictly the concept "${input.conceptName}" at Bloom level ${input.bloomLevel}: ${bloomName}. The topic "${input.topic}" may only be used to disambiguate terminology; do not teach adjacent concepts or other nodes.\n\nMandatory System 1 scaffolding constraints (follow every directive):\n${directives}${preGate}${remediation}\n\nReturn only strict JSON with exactly these string fields: { "explanation": string, "checkQuestion": string, "expectedCriteria": string }.`;
}

export function getLearnerEvaluationPrompt(
  input: LearnerEvaluationPromptInput,
): string {
  const bloomName = BLOOM_LEVEL_NAMES[input.bloomLevel - 1] ?? "Unknown";
  return `Evaluate the learner's response only against the expected criteria for "${input.conceptName}" at Bloom level ${input.bloomLevel}: ${bloomName}. Use topic "${input.topic}" only to disambiguate terminology. Prioritize conceptual and practical accuracy over minor syntax or phrasing flaws.\n\nQuestion: ${input.checkQuestion}\nExpected criteria: ${input.expectedCriteria}\nLearner response: ${input.userAnswer}\n\nReturn only strict JSON with these fields: { "mastered": boolean, "feedback": string, "hint": string | null }.`;
}
```


---
## FILE: src/modules/learn-agent/utils/wml-calculator.ts

```ts
import type {
  ExtrinsicLoadMetrics,
  IntrinsicPreGateResult,
  IntrinsicLoadMetrics,
  WmlAssessment,
} from "../types/wml.js";

export const DEFAULT_WML_CAPACITY = 0.70;

export function preGateIntrinsicLoad(input: {
  bloomLevel: number;
  directPrerequisiteCount: number;
  transitiveAncestorCount: number;
  unmasteredPrerequisites?: string[];
  capacityThreshold?: number;
}): IntrinsicPreGateResult {
  const intrinsicLoad = calculateIntrinsicLoad(
    input.bloomLevel,
    input.directPrerequisiteCount,
    input.transitiveAncestorCount,
  ).score;
  const weightedIntrinsic = 0.55 * intrinsicLoad;
  const capacityThreshold = clamp01(
    input.capacityThreshold ?? DEFAULT_WML_CAPACITY,
  );
  const extrinsicBudget = Math.max(0, capacityThreshold - weightedIntrinsic);
  let mode: IntrinsicPreGateResult["mode"];
  const proactiveDirectives: string[] = [];

  if (weightedIntrinsic >= capacityThreshold) {
    mode = "INTRINSIC_OVERLOAD";
    proactiveDirectives.push(
      "Teach only one atomic intuition chunk: explain the single core mental model in plain language and give one minimal illustrative example. Defer advanced synthesis and edge cases to the next turn.",
    );
  } else if (
    extrinsicBudget <= 0.25 ||
    weightedIntrinsic >= capacityThreshold * 0.70
  ) {
    mode = "CONSTRAINED";
    proactiveDirectives.push(
      "Keep every sentence to 14 words or fewer and the complete lesson to 150 words or fewer.",
      "Use zero unmastered technical jargon; only direct prerequisite terms may appear.",
      "Include exactly one concrete, step-by-step example.",
    );
  } else {
    mode = "OPTIMAL";
  }

  if (mode !== "OPTIMAL" && input.unmasteredPrerequisites?.length) {
    proactiveDirectives.push(
      `Only use these direct prerequisite terms when needed, and define them plainly: ${input.unmasteredPrerequisites.join(", ")}.`,
    );
  }

  return {
    mode,
    intrinsicLoad,
    weightedIntrinsic,
    extrinsicBudget,
    proactiveDirectives,
  };
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function calculateIntrinsicLoad(
  bloomLevel: number,
  directPrerequisiteCount: number,
  transitiveAncestorCount: number,
): IntrinsicLoadMetrics {
  const bloomFactor = clamp01((bloomLevel - 1) / 5);
  const directPrereqFactor = clamp01(directPrerequisiteCount / 4);
  const transitiveDepthFactor = clamp01(transitiveAncestorCount / 8);
  const score = clamp01(
    0.50 * bloomFactor +
      0.30 * directPrereqFactor +
      0.20 * transitiveDepthFactor,
  );

  return { bloomFactor, directPrereqFactor, transitiveDepthFactor, score };
}

export function calculateExtrinsicLoad(
  text: string,
  unmasteredConceptNames: string[],
): ExtrinsicLoadMetrics {
  if (!text.trim()) {
    return {
      sentenceLengthFactor: 0,
      lexicalDensityFactor: 0,
      codeDensityFactor: 0,
      novelTermFactor: 0,
      score: 0,
    };
  }

  const codeBlocks = text.match(/```[\s\S]*?```/g) ?? [];
  const codeBlockCharacters = codeBlocks.reduce(
    (total, block) => total + block.length,
    0,
  );
  const prose = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");
  const sentences = prose
    .split(/[.!?]+(?:\s|$)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const wordPattern = /[\p{L}\p{N}_]+/gu;
  const sentenceWordCounts = sentences.map(
    (sentence) => sentence.match(wordPattern)?.length ?? 0,
  );
  const averageWordsPerSentence = sentenceWordCounts.length
    ? sentenceWordCounts.reduce((total, count) => total + count, 0) /
      sentenceWordCounts.length
    : 0;
  const sentenceLengthFactor = clamp01(averageWordsPerSentence / 25);

  const words = text.match(wordPattern) ?? [];
  const complexWordCount = words.filter(
    (word) =>
      word.length >= 8 ||
      /[a-z][A-Z]/.test(word) ||
      word.includes("_"),
  ).length;
  const lexicalDensityFactor = clamp01(
    (words.length ? complexWordCount / words.length : 0) / 0.45,
  );

  const programmingPunctuationCount =
    text.match(/[{}\[\]();=><|&]/g)?.length ?? 0;
  const codeRatio =
    (codeBlockCharacters + programmingPunctuationCount) / text.length;
  const codeDensityFactor = clamp01(codeRatio / 0.35);

  const matchedConcepts = new Set(
    unmasteredConceptNames
      .filter((name) => name.trim().length > 0)
      .filter((name) => {
        const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(
          `(?<![a-zA-Z0-9_])${escapedName}(?![a-zA-Z0-9_])`,
          "i",
        ).test(text);
      }),
  );
  const novelTermFactor = clamp01(matchedConcepts.size / 3);

  const score = clamp01(
    0.30 * sentenceLengthFactor +
      0.30 * lexicalDensityFactor +
      0.20 * codeDensityFactor +
      0.20 * novelTermFactor,
  );

  return {
    sentenceLengthFactor,
    lexicalDensityFactor,
    codeDensityFactor,
    novelTermFactor,
    score,
  };
}

export function evaluateWorkingMemoryLoad(params: {
  bloomLevel: number;
  directPrerequisiteCount: number;
  transitiveAncestorCount: number;
  text: string;
  unmasteredConceptNames: string[];
  capacityThreshold?: number;
}): WmlAssessment {
  const intrinsic = calculateIntrinsicLoad(
    params.bloomLevel,
    params.directPrerequisiteCount,
    params.transitiveAncestorCount,
  );
  const extrinsic = calculateExtrinsicLoad(
    params.text,
    params.unmasteredConceptNames,
  );
  const totalWml = clamp01(0.55 * intrinsic.score + 0.45 * extrinsic.score);
  const capacityThreshold = clamp01(
    params.capacityThreshold ?? DEFAULT_WML_CAPACITY,
  );
  const loadLevel: WmlAssessment["loadLevel"] =
    totalWml < 0.35
      ? "LOW"
      : totalWml <= capacityThreshold
        ? "OPTIMAL"
        : totalWml <= capacityThreshold + 0.15
          ? "HIGH"
          : "OVERLOADED";
  const isOverloaded = totalWml > capacityThreshold;
  const scaffoldingDirectives: string[] = [];

  if (isOverloaded || loadLevel === "HIGH") {
    if (intrinsic.score >= 0.65) {
      scaffoldingDirectives.push(
        "Decompose the concept into one atomic sub-step and anchor it in a concrete real-world analogy before introducing formal rules.",
      );
    }
    if (extrinsic.score >= 0.60) {
      scaffoldingDirectives.push(
        "Keep explanation under 120 words, use short sentences (under 15 words), and limit code snippets to 5 lines maximum.",
      );
    }
    if (extrinsic.novelTermFactor > 0.33) {
      scaffoldingDirectives.push(
        "Do not introduce unmastered downstream or sibling concepts; define any unavoidable technical term inline in one phrase.",
      );
    }
    if (isOverloaded) {
      scaffoldingDirectives.push(
        "End with a single, low-friction check-for-understanding question testing only this atomic step.",
      );
    }
  }

  if (loadLevel === "LOW") {
    scaffoldingDirectives.push(
      "Learner cognitive load is low; present a concise synthesis and challenge them with an applied micro-problem.",
    );
  }

  return {
    intrinsic,
    extrinsic,
    totalWml,
    capacityThreshold,
    loadLevel,
    isOverloaded,
    scaffoldingDirectives,
  };
}
```


---
## FILE: src/modules/plan-agent/docs/DIAGNOSTIC_ALGORITHM.md

```md
# Adaptive Diagnostic Algorithm

The diagnostic engine selects a pending concept by counting its pending
transitive prerequisites and pending transitive dependents. It minimizes
`abs(pendingAncestors - pendingDescendants)`, choosing a node with a balanced
number of unresolved concepts on either side. Each candidate's counts and
score are logged to make selection debuggable.

This is a count-based approximation of Shannon entropy reduction: if the
possible known/unknown outcomes are treated as similarly likely, a question
that divides the unresolved prerequisite graph into balanced groups is
expected to reduce uncertainty more than one near either end. It is a
heuristic, not an exact entropy calculation; DAG branching and overlapping
closures can make the groups' actual probabilities unequal.

For each selected node, the runner requests one diagnostic question calibrated
to the node's Bloom level and the plan topic. Gemini grades the learner's
free-text response against explicit passing criteria; skips and non-mastery
produce a `false` result. This binary pass/fail observation is passed to the
KST propagation engine, which updates the node and its related concepts.

The propagation rules encode the Knowledge Space Theory assumptions used by
this simplified model:

- Passing a concept marks its pending ancestors as
  `PASSED_IN_DIAGNOSTIC`, because prerequisites of a concept the user knows
  are assumed known as well.
- Failing a concept marks its pending descendants as `IN_PROGRESS`, because a
  concept that depends on something the user does not know is assumed unknown
  and should remain in the learning plan.

Both traversals follow the full plan graph, including already resolved
intermediate nodes, but only alter nodes that are currently `PENDING`.
```


---
## FILE: src/modules/plan-agent/docs/LLM context for plan agent.md

```md
# LLM System Context (For Next Chat Session)

## Project Vision & Architecture
This project is an autonomous Educational Harness built in Node.js/TypeScript. It manages learner memory and pedagogical progression using cognitive science frameworks. The architecture is inspired by Kahneman's Dual-Process Theory:
*   **System 1:** A fast, synchronous interceptor that acts as a Working Memory Load (WML) meter. It calculates Extrinsic Load (text complexity) and Intrinsic Load (graph density) in real-time.
*   **System 2:** An asynchronous analyzer that calculates the Paas & Van Merriënboer Cognitive Efficiency to set baseline capacity and update long-term mastery.

The system is divided into two main agents:
1.  **Plan Agent (Fully Implemented in Backend Services):** Handles intent scoping, curriculum graph generation, and diagnostic testing.
2.  **Learn Agent (Pending):** Executes the actual pedagogical loop by spawning recursive Sub-Agents to teach the nodes generated by the Plan Agent.

## Current Progress: Plan Agent Completion
The Plan Agent has been fully implemented at the service/module level. It relies on the following theoretical implementations:
1.  **Ambiguity Guard (ClarifyAgent):** Uses a slot-tracking module to prevent the LLM from generating a graph for overly broad prompts (requires Language, Subdomain, and Target Depth).
2.  **Absolute Mastery Graph Generation:** Forces the LLM (`gemini-3.1-flash-lite`) to generate a complete Level 6 (Bloom's Taxonomy) Directed Acyclic Graph (DAG), working backward from absolute mastery to foundational axioms.
3.  **Ancestral Subgraph Pruning:** Mathematically prunes the graph down to the user's requested depth, removing orphaned nodes using Graph Theory reachability.
4.  **Database Persistence:** Saves the DAG to MongoDB using a strict Parent-Referencing pattern (`prerequisites` array of ObjectIds) to allow recursive `$graphLookup`.
5.  **Adaptive Diagnostic Engine:** Uses Knowledge Space Theory (KST) and an approximation of Shannon Entropy (Topological Median Search) to ask adaptive questions. Passing a node recursively invalidates pending ancestors as "known"; failing recursively invalidates descendants as "unknown".

## Next Steps for the LLM
1.  **Wire the Plan Agent API:** The core services are written, but they need to be wired together in a central orchestration loop (either Express controllers or a terminal-based REPL loop) to execute the end-to-end flow.
2.  **Begin the Learn Agent:** Once the Plan Agent orchestrator is wired, we must implement Step 6 (NLP Extraction / WML Calculation for System 1) and Step 7 (Async Worker for System 2).
```


---
## FILE: src/modules/plan-agent/docs/PLAN_AGENT_DB_SCHEMA.md

```md
# Plan Agent Database Schema

This document describes the Plan Agent's persisted learning plan, prerequisite
graph, and cross-plan mastery estimate. The schemas live in separate model
files so graph construction, user diagnostics, and database lifecycle code can
evolve independently.

## Model Overview

### `Plan`

`Plan` is the lifecycle record for one requested learning outcome.

| Field | Type | Constraints and purpose |
| --- | --- | --- |
| `userId` | ObjectId reference to `User` | Required authenticated account that owns the plan. |
| `topic` | String | Required, trimmed subject of the plan. |
| `targetDepth` | Number | Required integer from 1 through 6, corresponding to the target Bloom level. |
| `status` | Enum | `DIAGNOSTIC_IN_PROGRESS`, `READY`, or `COMPLETED`; new plans begin in diagnostic. |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps. |

The compound `{ userId, status, updatedAt }` index supports listing a user's
active plans and recent plan history.

### `PlanNode`

`PlanNode` is one concept in a plan's curriculum DAG. `planId` points to its
owning `Plan`, while `prerequisites` contains ObjectIds of the node's immediate
prerequisites. A node with no prerequisites is a foundational concept.

| Field | Type | Constraints and purpose |
| --- | --- | --- |
| `planId` | ObjectId reference to `Plan` | Required owning plan. |
| `conceptName` | String | Required, trimmed concept label. |
| `bloomLevel` | Number | Required integer from 1 through 6. |
| `status` | Enum | `PASSED_IN_DIAGNOSTIC`, `PENDING`, `IN_PROGRESS`, or `MASTERED`; new nodes begin pending. |
| `prerequisites` | ObjectId[] references to `PlanNode` | Immediate prerequisite nodes. Defaults to an empty array. |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps. |

Indexes support listing nodes within a plan by Bloom level and locating nodes
that reference a given prerequisite. Application-level graph creation must
ensure prerequisite IDs belong to the same plan and do not introduce cycles;
MongoDB references do not enforce either invariant automatically.

### `UserMastery`

`UserMastery` stores a durable mastery estimate across plans. It is not tied to
a plan's temporary diagnostic state.

| Field | Type | Constraints and purpose |
| --- | --- | --- |
| `userId` | String | Required external/application identity. |
| `conceptName` | String | Required trimmed concept key. |
| `masteryScore` | Number | Required value from `0.0` through `1.0`. |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps. |

A unique `{ userId, conceptName }` index provides one current mastery estimate
per user and concept and supports deterministic upserts. Callers should use a
consistent spelling/canonicalization strategy for concept names.

## Why Parent Referencing

The DAG is represented with **parent referencing**: each node stores IDs of
its prerequisite nodes. In this educational graph, prerequisites are the
parents of a concept because those concepts must be learned before it.

This representation is preferable to child referencing for this workload:

- Adding a prerequisite relationship updates the dependent concept's own
  document, rather than rewriting the prerequisite document's potentially
  large list of dependents.
- The prerequisite set is the data needed to answer the common planning
  question, "What must be mastered before this concept?"
- MongoDB `$graphLookup` can recursively follow `prerequisites` to retrieve a
  node's transitive prerequisite closure without loading the graph into the
  application first.
- Each edge has one authoritative location, avoiding duplicated parent and
  child edge lists that could become inconsistent.

For example, after matching one node, a graph lookup can walk all prerequisite
ancestors. Restricting the lookup to the same `planId` prevents traversal into
another plan if invalid references are accidentally persisted:

```ts
const nodesWithPrerequisites = await PlanNode.aggregate([
  { $match: { _id: nodeId, planId } },
  {
    $graphLookup: {
      from: PlanNode.collection.name,
      startWith: "$prerequisites",
      connectFromField: "prerequisites",
      connectToField: "_id",
      as: "prerequisiteClosure",
      restrictSearchWithMatch: { planId },
    },
  },
]);
```

The graph lookup follows prerequisites upward from the selected concept. To
find downstream concepts unlocked by a mastered node, query nodes whose
`prerequisites` contains that node ID, or use a reverse traversal pipeline.

## How the Models Interact

1. A user starts a plan. `Plan` records the topic, target Bloom depth, and
   `DIAGNOSTIC_IN_PROGRESS` lifecycle status.
2. The Plan Agent creates `PlanNode` documents for the generated and pruned
   curriculum graph. Each node refers to its owning plan and lists its direct
   prerequisite node IDs.
3. During the diagnostic loop, a node's status records the plan-specific
   result. Passing or failing a diagnostic can update the affected nodes
   without changing the reusable `UserMastery` record automatically.
4. Once diagnostic decisions are resolved, the plan can move to `READY`; after
   the learning work is done, it can move to `COMPLETED`. The application
   should define the exact transition rules.
5. Evidence from a completed diagnostic or learning activity can update the
   user's `UserMastery` estimate. Future plans may consult that record to
   initialize node status or prioritize diagnostics, while retaining their
   own per-plan `PlanNode` state.

The models intentionally do not embed node arrays inside `Plan`. Separately
stored nodes avoid an ever-growing plan document, allow indexing/querying
individual concepts, and make graph traversal possible through references.
```


---
## FILE: src/modules/plan-agent/docs/coding agent context for plan agent.md

```md
# Coding Agent Context (For Next Coding Session)

## Tech Stack & Codebase Rules
*   **Language:** TypeScript (Strict Mode), Node.js, Express 5.3.0
*   **Database:** MongoDB, Mongoose 8.x
*   **LLM API:** `generativelanguage.googleapis.com` (Model: `gemini-3.1-flash-lite`)
*   **Architecture:** Strictly modularized. The `Plan Agent` is isolated in `src/modules/plan-agent/`.

## Current File Tree & Module State
```text
src/
├── app.ts                 (Express setup)
├── server.ts              (Entry point)
├── config/
│   └── db.ts              (Mongoose connection utility)
└── modules/
    └── plan-agent/
        ├── models/
        │   ├── Plan.ts        (Tracks user's learning topic and target depth)
        │   ├── PlanNode.ts    (DAG node, uses `prerequisites: [ObjectId]` for Parent Referencing)
        │   └── UserMastery.ts (Cross-plan durable mastery tracking)
        ├── services/
        │   ├── clarify-service.ts       (Evaluates if user prompt fills all LearningSlots)
        │   ├── graph-generator.ts       (Fetches RawGraphNode[] from Gemini assuming Bloom Level 6)
        │   ├── plan-service.ts          (Prunes graph, maps ObjectIds, and saves to MongoDB)
        │   ├── diagnostic-engine.ts     (Finds topological median: lowest abs(pendingAncestors - pendingDescendants))
        │   └── diagnostic-evaluator.ts  (Updates node statuses and cascades KST logic up/down the DAG)
        ├── types/
        │   ├── graph.ts                 (RawGraphNode interface)
        │   └── slots.ts                 (LearningSlots and SlotEvaluationResult interfaces)
        └── utils/
            ├── clarify-prompts.ts       (System prompt for intent extraction)
            ├── graph-pruner.ts          (Ancestral Subgraph extraction math)
            └── prompt-templates.ts      (System prompt for Absolute Mastery graph)
```


---
## FILE: src/modules/plan-agent/docs/human context for plan agent.md

```md
# Human / Developer Documentation: Plan Agent Module

## Overview

The Plan Agent is the intelligence engine that runs _before_ any actual teaching begins. Its job is to figure out exactly what you want to learn, break it down into a logical map of prerequisites (a Directed Acyclic Graph), and mathematically determine what you already know so you don't waste time relearning it.

## How It Works (The Lifecycle)

### 1. The Ambiguity Guard (`clarify-service.ts`)

If you tell the system "I want to learn Python," that is too broad. The system will not generate a graph. Instead, it uses a Slot Tracker to ask you clarification questions until it knows:

- **Target Subject:** (e.g., Python)
- **Subdomain:** (e.g., Asynchronous Programming)
- **Target Depth:** (e.g., Level 4 / Analyze on Bloom's Taxonomy)

### 2. The Absolute Mastery Generator (`graph-generator.ts`)

Once your goal is clear, the system asks the LLM to generate a curriculum. To prevent the LLM from missing foundational steps, we force it to assume you want to reach **Level 6 Absolute Mastery** of the topic, and it works backward, breaking the topic down into atomic concepts.

### 3. The Pruning Engine (`graph-pruner.ts`)

Because the LLM generated a Level 6 graph, but you only asked for Level 4, the backend mathematically trims the graph. It uses "Ancestral Subgraph" extraction to remove advanced topics while ensuring no foundational "orphan" topics are left behind.

### 4. Database Persistence (`models/` & `plan-service.ts`)

The pruned graph is saved to MongoDB. We use a **Parent-Referencing** database pattern. Each concept points to the specific concepts you must learn _before_ it. This allows the database to easily traverse the graph later.

### 5. The Diagnostic Loop (`diagnostic-engine.ts` & `diagnostic-evaluator.ts`)

Before teaching begins, the system gives you a diagnostic test.

- **Smart Questioning:** Instead of asking you about every single topic, it finds the "Topological Median" of the graph (the concept exactly in the middle of the curriculum).
- **Knowledge Space Theory:** If you pass the middle concept, the system mathematically proves you must already know the basics, and automatically marks all prior prerequisites as "Known". If you fail, it marks all downstream concepts as "Unknown". This acts like a binary search, cutting your test time in half.

```


---
## FILE: src/modules/plan-agent/models/Plan.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { DEFAULT_WML_CAPACITY } from "../../learn-agent/utils/wml-calculator.js";

export const PLAN_STATUSES = [
  "DIAGNOSTIC_IN_PROGRESS",
  "READY",
  "COMPLETED",
] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];

/**
 * Describes a user's requested learning outcome and the lifecycle of the
 * diagnostic/planning workflow that will produce its curriculum graph.
 */
export interface PlanDocument extends Document {
  userId: Types.ObjectId;
  topic: string;
  targetDepth: number;
  capacityThreshold: number;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanModel = Model<PlanDocument>;

const PlanSchema = new Schema<PlanDocument, PlanModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A plan must belong to a user"],
    },
    topic: {
      type: String,
      required: [true, "A plan topic is required"],
      trim: true,
      minlength: [1, "A plan topic cannot be empty"],
    },
    targetDepth: {
      type: Number,
      required: [true, "A target Bloom level is required"],
      min: [1, "Bloom level must be between 1 and 6"],
      max: [6, "Bloom level must be between 1 and 6"],
      validate: {
        validator: Number.isInteger,
        message: "Bloom level must be an integer",
      },
    },
    capacityThreshold: {
      type: Number,
      default: DEFAULT_WML_CAPACITY,
      min: 0.1,
      max: 1.0,
    },
    status: {
      type: String,
      enum: PLAN_STATUSES,
      default: "DIAGNOSTIC_IN_PROGRESS",
      required: true,
    },
  },
  {
    // Lifecycle timestamps make diagnostic and completion events auditable.
    timestamps: true,
    versionKey: false,
  },
);

// Supports a user's active-plan and plan-history queries.
PlanSchema.index({ userId: 1, status: 1, updatedAt: -1 });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const Plan: PlanModel =
  (mongoose.models.Plan as PlanModel | undefined) ??
  mongoose.model<PlanDocument, PlanModel>("Plan", PlanSchema);

export default Plan;
```


---
## FILE: src/modules/plan-agent/models/PlanNode.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const PLAN_NODE_STATUSES = [
  "PASSED_IN_DIAGNOSTIC",
  "PENDING",
  "IN_PROGRESS",
  "MASTERED",
] as const;

export type PlanNodeStatus = (typeof PLAN_NODE_STATUSES)[number];

export interface NodeAttempt {
  attemptNumber: number;
  learnerAnswer: string;
  wmlScore: number;
  tutorFeedback: string;
  passed: boolean;
  createdAt: Date;
}

/**
 * One concept in a plan's prerequisite DAG. Each node stores references to
 * its immediate prerequisite nodes; this is the parent-reference edge model
 * used by MongoDB graph traversals.
 */
export interface PlanNodeDocument extends Document {
  planId: Types.ObjectId;
  conceptName: string;
  bloomLevel: number;
  status: PlanNodeStatus;
  prerequisites: Types.ObjectId[];
  attemptCount: number;
  wmlSamples: number[];
  attempts: NodeAttempt[];
  lastAttempt?: string;
  lastTutorFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanNodeModel = Model<PlanNodeDocument>;

const PlanNodeSchema = new Schema<PlanNodeDocument, PlanNodeModel>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "A plan node must belong to a plan"],
      index: true,
    },
    conceptName: {
      type: String,
      required: [true, "A concept name is required"],
      trim: true,
      minlength: [1, "A concept name cannot be empty"],
    },
    bloomLevel: {
      type: Number,
      required: [true, "A Bloom level is required"],
      min: [1, "Bloom level must be between 1 and 6"],
      max: [6, "Bloom level must be between 1 and 6"],
      validate: {
        validator: Number.isInteger,
        message: "Bloom level must be an integer",
      },
    },
    status: {
      type: String,
      enum: PLAN_NODE_STATUSES,
      default: "PENDING",
      required: true,
    },
    prerequisites: {
      // A concept can have zero or more immediate prerequisites. Keeping
      // references here supports $graphLookup from a node to its ancestors.
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "PlanNode",
        },
      ],
      default: [],
      validate: {
        validator: (references: Types.ObjectId[]): boolean =>
          references.every((reference) => reference instanceof Types.ObjectId),
        message: "Every prerequisite must be a PlanNode ObjectId",
      },
    },
    attemptCount: { type: Number, default: 0, min: 0 },
    wmlSamples: { type: [Number], default: [] },
    attempts: {
      type: [
        {
          _id: false,
          attemptNumber: { type: Number, required: true, min: 1 },
          learnerAnswer: { type: String, required: true },
          wmlScore: { type: Number, required: true, min: 0, max: 1 },
          tutorFeedback: { type: String, required: true },
          passed: { type: Boolean, required: true },
          createdAt: { type: Date, required: true },
        },
      ],
      default: [],
    },
    lastAttempt: { type: String },
    lastTutorFeedback: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// These indexes constrain common plan reads and prerequisite-edge lookups.
PlanNodeSchema.index({ planId: 1, bloomLevel: 1 });
PlanNodeSchema.index({ prerequisites: 1 });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const PlanNode: PlanNodeModel =
  (mongoose.models.PlanNode as PlanNodeModel | undefined) ??
  mongoose.model<PlanNodeDocument, PlanNodeModel>("PlanNode", PlanNodeSchema);

export default PlanNode;
```


---
## FILE: src/modules/plan-agent/models/UserLearningSlots.ts

```ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { LearningSlots } from "../types/slots.js";

export interface UserLearningSlotsDocument extends Document {
  userId: Types.ObjectId;
  targetLanguageOrTool: string | null;
  specificSubdomain: string | null;
  targetDepth: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLearningSlotsModel = Model<UserLearningSlotsDocument>;

const UserLearningSlotsSchema = new Schema<UserLearningSlotsDocument, UserLearningSlotsModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    targetLanguageOrTool: { type: String, default: null, trim: true },
    specificSubdomain: { type: String, default: null, trim: true },
    targetDepth: { type: Number, default: null, min: 1, max: 6 },
  },
  { timestamps: true, versionKey: false },
);

export const UserLearningSlots: UserLearningSlotsModel =
  (mongoose.models.UserLearningSlots as UserLearningSlotsModel | undefined) ??
  mongoose.model<UserLearningSlotsDocument, UserLearningSlotsModel>(
    "UserLearningSlots",
    UserLearningSlotsSchema,
  );

export function toLearningSlots(record: UserLearningSlotsDocument): LearningSlots {
  return {
    targetLanguageOrTool: record.targetLanguageOrTool,
    specificSubdomain: record.specificSubdomain,
    targetDepth: record.targetDepth,
  };
}

export default UserLearningSlots;
```


---
## FILE: src/modules/plan-agent/models/UserMastery.ts

```ts
import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Long-lived evidence of a user's mastery, independent of any one generated
 * plan. User IDs are strings here to support external identity providers.
 */
export interface UserMasteryDocument extends Document {
  userId: string;
  conceptName: string;
  conceptKey: string;
  canonicalConceptName: string;
  masteryScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserMasteryModel = Model<UserMasteryDocument>;

const UserMasterySchema = new Schema<UserMasteryDocument, UserMasteryModel>(
  {
    userId: {
      type: String,
      required: [true, "Mastery evidence must belong to a user"],
      trim: true,
      minlength: [1, "userId cannot be empty"],
    },
    conceptName: {
      type: String,
      required: [true, "A concept name is required"],
      trim: true,
      minlength: [1, "A concept name cannot be empty"],
    },
    conceptKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    canonicalConceptName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    masteryScore: {
      type: Number,
      required: true,
      min: [0, "Mastery score must be at least 0"],
      max: [1, "Mastery score cannot exceed 1"],
    },
  },
  {
    // Updated timestamps let later plans use the latest mastery evidence.
    timestamps: true,
    versionKey: false,
  },
);

UserMasterySchema.pre("validate", function () {
  if (this.conceptName) {
    const normalizedConcept = this.conceptName.trim().replace(/\s+/g, " ");
    this.canonicalConceptName = this.canonicalConceptName
      ? this.canonicalConceptName.trim().replace(/\s+/g, " ")
      : normalizedConcept;
    this.conceptKey = normalizedConcept.toLowerCase();
  }
});

// One current mastery estimate per user/concept key pair.
UserMasterySchema.index({ userId: 1, conceptKey: 1 }, { unique: true });

/** Reuse the compiled model during hot reloads and repeated imports. */
export const UserMastery: UserMasteryModel =
  (mongoose.models.UserMastery as UserMasteryModel | undefined) ??
  mongoose.model<UserMasteryDocument, UserMasteryModel>(
    "UserMastery",
    UserMasterySchema,
  );

export default UserMastery;
```


---
## FILE: src/modules/plan-agent/runner/plan-choice.ts

```ts
export function parsePlanChoice(
  rawChoice: string,
  planCount: number,
): number | undefined {
  const choiceText = rawChoice.trim();
  if (!choiceText) return undefined;

  const choice = Number(choiceText);
  if (!Number.isInteger(choice) || choice < 0 || choice > planCount) {
    return undefined;
  }
  return choice;
}
```


---
## FILE: src/modules/plan-agent/runner/plan-runner.ts

```ts
import { homedir } from "node:os";
import { join } from "node:path";
import { chmod, readFile, unlink, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Types } from "mongoose";
import { env, validateEnv } from "../../../config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { User } from "../../auth/models/User.js";
import {
  loginUser,
  registerUser,
  verifySessionToken,
} from "../../auth/services/auth-service.js";
import { Plan } from "../models/Plan.js";
import { PlanNode, type PlanNodeDocument, type PlanNodeStatus } from "../models/PlanNode.js";
import {
  clearUserLearningSlots,
  getUserLearningSlots,
  evaluateUserIntent,
} from "../services/clarify-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import {
  evaluateDiagnosticResponse,
  generateDiagnosticQuestion,
} from "../services/diagnostic-questioner.js";
import { createLearningPlan } from "../services/plan-service.js";
import { getOuterFringe } from "../../learn-agent/services/outer-fringe.js";
import {
  loadLearningNodeState,
  prepareNodeLesson,
  submitNodeAttempt,
} from "../../learn-agent/services/micro-tutor.js";
import { DEFAULT_WML_CAPACITY } from "../../learn-agent/utils/wml-calculator.js";
import { getLearningFringeState } from "../../learn-agent/utils/outer-fringe-selector.js";
import { parsePlanChoice } from "./plan-choice.js";

const sessionPath = join(homedir(), ".plan-agent-session.json");
const terminal = createInterface({ input: stdin, output: stdout });
const BLOOM_LEVEL_NAMES = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

function printBox(title: string, lines: string[]): void {
  const width = Math.max(title.length, ...lines.map((line) => line.length));
  const divider = `+${"-".repeat(width + 2)}+`;
  console.log(divider);
  console.log(`| ${title.padEnd(width)} |`);
  console.log(divider);
  for (const line of lines) console.log(`| ${line.padEnd(width)} |`);
  console.log(divider);
}

async function printSavedPlan(planId: string, userId: string): Promise<void> {
  const plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Saved plan ${planId} could not be loaded for its owner.`);

  const nodes = await PlanNode.find({ planId: plan._id }).sort({ bloomLevel: 1, conceptName: 1 });
  const conceptNames = new Map(nodes.map((node) => [node._id.toString(), node.conceptName]));
  const graphLines = nodes.flatMap((node, index) => {
    const branch = index === nodes.length - 1 ? "\\--" : "|--";
    const continuation = index === nodes.length - 1 ? "    " : "|   ";
    const prerequisites = node.prerequisites.map((id) => conceptNames.get(id.toString()) ?? id.toString());
    const levelName = BLOOM_LEVEL_NAMES[node.bloomLevel - 1] ?? "Unknown";
    return [
      `${branch} ${node._id.toString()} | ${node.conceptName}`,
      `${continuation}[Level ${node.bloomLevel}: ${levelName}] ${node.status}`,
      `${continuation}Prerequisites: ${prerequisites.length ? prerequisites.join(", ") : "None"}`,
    ];
  });

  printBox("Saved Learning Plan", [
    `Plan ID: ${plan._id.toString()}`,
    `User ID: ${plan.userId.toString()}`,
    `Topic: ${plan.topic}`,
    `Target Bloom Depth: Level ${plan.targetDepth} (${BLOOM_LEVEL_NAMES[plan.targetDepth - 1] ?? "Unknown"})`,
    `Initial Status: ${plan.status}`,
    "",
    "Pruned Curriculum DAG:",
    ...(graphLines.length ? graphLines : ["(no saved concepts)"]),
  ]);
}

async function printDiagnosticSummary(planId: string, userId: string): Promise<void> {
  const nodes = await PlanNode.find({ planId }).sort({ bloomLevel: 1, conceptName: 1 });
  const statuses: PlanNodeStatus[] = [
    "PASSED_IN_DIAGNOSTIC",
    "IN_PROGRESS",
    "MASTERED",
    "PENDING",
  ];
  const grouped = new Map<PlanNodeStatus, PlanNodeDocument[]>(
    statuses.map((status) => [status, []]),
  );
  for (const node of nodes) grouped.get(node.status)?.push(node);

  const passed = grouped.get("PASSED_IN_DIAGNOSTIC")?.length ?? 0;
  const inProgress = grouped.get("IN_PROGRESS")?.length ?? 0;
  const pending = grouped.get("PENDING")?.length ?? 0;
  const mastered = grouped.get("MASTERED")?.length ?? 0;
  const lines = [
    `Plan ID: ${planId}`,
    `User ID: ${userId}`,
    `[Total Concepts: ${nodes.length} | Finished during diagnosis: ${passed} | Queued for Micro-Tutor: ${inProgress + pending} (In Progress: ${inProgress}, Pending: ${pending}) | Mastered: ${mastered}]`,
    "",
  ];
  for (const status of statuses) {
    lines.push(`${status}:`);
    const group = grouped.get(status) ?? [];
    if (group.length === 0) lines.push("  (none)");
    else for (const node of group) lines.push(`  - ${node.conceptName} (${node._id.toString()})`);
    lines.push("");
  }
  printBox("Diagnostic Results Summary", lines);
}

async function authenticate(): Promise<{ userId: string; email: string }> {
  try {
    const saved = JSON.parse(await readFile(sessionPath, "utf8")) as { sessionToken?: unknown };
    if (typeof saved.sessionToken === "string") {
      const userId = verifySessionToken(saved.sessionToken);
      const user = await User.findById(userId).select("email");
      if (user) {
        console.log(`[Runner] Reusing local session for ${user.email}.`);
        return { userId: user._id.toString(), email: user.email };
      }
    }
  } catch {
    console.log("[Runner] No valid local session found; sign-in is required.");
  }
  await unlink(sessionPath).catch(() => undefined);

  while (true) {
    const action = (await terminal.question("[1] Login  [2] Sign Up: ")).trim();
    const email = (await terminal.question("Email: ")).trim();
    const password = await terminal.question("Password: ");
    try {
      const result = action === "2"
        ? await registerUser(email, password, (await terminal.question("Name (optional): ")).trim())
        : await loginUser(email, password);
      await writeFile(sessionPath, JSON.stringify({ sessionToken: result.sessionToken }), {
        encoding: "utf8",
        mode: 0o600,
      });
      await chmod(sessionPath, 0o600);
      console.log(`[Runner] Signed in as ${result.user.email}; local session saved securely.`);
      return { userId: result.user.userId, email: result.user.email };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      console.error(`[Runner] Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function createPlanForUser(userId: string): Promise<string> {
  let evaluation;
  do {
    const message = await terminal.question(
      evaluation?.nextQuestion ? `Clarification: ${evaluation.nextQuestion}\nYou: ` : "Learning goal: ",
    );
    evaluation = await evaluateUserIntent(userId, message, env.GEMINI_API_KEY ?? "");
    if (!evaluation.isComplete && evaluation.nextQuestion) {
      console.log(`[Runner] ${evaluation.nextQuestion}`);
    }
  } while (!evaluation?.isComplete);

  const slots = await getUserLearningSlots(userId);
  if (!slots.targetLanguageOrTool || !slots.specificSubdomain || !slots.targetDepth) {
    throw new Error("Clarification completed without all required learning slots.");
  }
  const topic = `${slots.targetLanguageOrTool}: ${slots.specificSubdomain}`;
  const plan = await createLearningPlan(
    userId,
    topic,
    slots.targetDepth,
    env.GEMINI_API_KEY ?? "",
  );
  await printSavedPlan(plan._id.toString(), userId);
  await clearUserLearningSlots(userId);
  return plan._id.toString();
}

async function runDiagnostics(planId: string, userId: string): Promise<void> {
  const plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be loaded for its owner.`);
  const apiKey = env.GEMINI_API_KEY ?? "";
  const totalNodes = await PlanNode.countDocuments({ planId });
  const maxQuestions = Math.max(5, Math.min(10, Math.ceil(totalNodes * 0.4)));
  let questionsAsked = 0;
  console.log("=== Phase 1: Adaptive Diagnostic ===");
  console.log(`[Runner] Starting diagnostics for plan ${planId} as user ${userId}.`);
  while (true) {
    if (questionsAsked >= maxQuestions) {
      await PlanNode.updateMany(
        { planId, status: "PENDING" },
        { $set: { status: "IN_PROGRESS" } },
      );
      console.log(`[Runner] Diagnostic question budget (${maxQuestions}) reached; remaining pending concepts marked IN_PROGRESS.`);
      break;
    }
    const node = await getNextDiagnosticNode(planId, userId);
    if (!node) break;
    const diagnosticQuestion = await generateDiagnosticQuestion(
      plan.topic,
      node.conceptName,
      node.bloomLevel,
      apiKey,
    );
    const bloomLevelName = BLOOM_LEVEL_NAMES[node.bloomLevel - 1] ?? "Unknown";
    console.log();
    console.log(`[Plan Agent] Concept: ${node.conceptName}`);
    console.log(`[Plan Agent] Bloom level: ${node.bloomLevel} (${bloomLevelName})`);
    console.log(`[Plan Agent] ${diagnosticQuestion.question}`);
    const userAnswer = await terminal.question("Your answer (or 'skip' if unsure): ");
    questionsAsked += 1;
    const evaluation = await evaluateDiagnosticResponse(
      plan.topic,
      node.conceptName,
      node.bloomLevel,
      diagnosticQuestion.question,
      diagnosticQuestion.expectedCriteria,
      userAnswer,
      apiKey,
    );
    console.log(`[${evaluation.passed ? "PASS" : "FAIL"}] ${evaluation.feedback}`);
    await processDiagnosticAnswer(node._id.toString(), evaluation.passed, userId);
    const [passedCount, pendingCount] = await Promise.all([
      PlanNode.countDocuments({ planId, status: "PASSED_IN_DIAGNOSTIC" }),
      PlanNode.countDocuments({ planId, status: "PENDING" }),
    ]);
    const resolvedCount = totalNodes - pendingCount;
    console.log(
      `[Diagnostic Progress] Finished/tested out: ${passedCount} / ${totalNodes} concepts | Diagnostic resolved: ${resolvedCount} / ${totalNodes} (${pendingCount} pending)`,
    );
    console.log();
  }
  await Plan.updateOne(
    { _id: planId, userId },
    { $set: { status: "READY" } },
  );
  console.log("[Runner] No pending diagnostic nodes remain.");
  await printDiagnosticSummary(planId, userId);
}

async function runLearningSession(planId: string, userId: string): Promise<void> {
  const apiKey = env.GEMINI_API_KEY ?? "";
  const plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be loaded for its owner.`);
  const learner = await User.findOne({ _id: userId }).select("capacityThreshold");
  if (!learner) throw new Error("Authenticated user could not be loaded for the learning session.");
  let capacityThreshold = learner.capacityThreshold ?? DEFAULT_WML_CAPACITY;

  console.log("=== Phase 2: Micro-Tutor Learning Session ===");
  while (true) {
    const fringe = await getOuterFringe(planId, userId);
    const totalNodes = await PlanNode.countDocuments({ planId });
    const completedCount = totalNodes - fringe.remainingCount;
    const currentNodeNumber = completedCount + 1;
    const fringeState = getLearningFringeState(fringe);
    if (fringeState === "COMPLETED") {
      const [plan, diagnosticPassedCount, tutoredMasteredCount] = await Promise.all([
        Plan.findOne({ _id: planId, userId }),
        PlanNode.countDocuments({ planId, status: "PASSED_IN_DIAGNOSTIC" }),
        PlanNode.countDocuments({ planId, status: "MASTERED" }),
      ]);
      const totalCompleted = diagnosticPassedCount + tutoredMasteredCount;
      printBox("Plan Completed", [
        `Topic: ${plan?.topic ?? "Unknown"}`,
        `Plan ID: ${planId}`,
        `Total Completed: ${totalCompleted} / ${totalNodes} concepts`,
        `  - Completed during diagnosis: ${diagnosticPassedCount}`,
        `  - Mastered via Micro-Tutor:   ${tutoredMasteredCount}`,
      ]);
      break;
    }
    if (fringeState === "BLOCKED") {
      console.error(
        `[Runner][Graph Deadlock] No unlocked learning nodes remain, but ${fringe.remainingCount} node(s) are unfinished for plan ${planId}.`,
      );
      break;
    }

    const selected = fringe.unlockedNodes.find((node) => node.nodeId === fringe.nextNodeId);
    if (!selected) throw new Error("Outer Fringe selected a node that was not in its candidate list.");
    console.log(
      `[Runner] Outer Fringe candidates: ${fringe.unlockedNodes.length} | Selected: ${selected.conceptName} (Bloom ${selected.bloomLevel}) | Remaining: ${fringe.remainingCount}.`,
    );

    await PlanNode.updateOne(
      { _id: selected.nodeId, planId },
      { $set: { status: "IN_PROGRESS" } },
    );
    const savedState = await loadLearningNodeState(planId, userId, selected.nodeId);
    capacityThreshold = savedState.capacityThreshold;
    let attemptCount = savedState.attemptCount + 1;
    let previousAttempt = savedState.previousAttempt;
    let tutorFeedback = savedState.tutorFeedback;
    let scaffoldingDirectives: string[] = [];
    const wmlSamples = savedState.wmlSamples;
    let shouldExit = false;

    while (true) {
      const turn = await prepareNodeLesson({
        planId,
        userId,
        nodeId: selected.nodeId,
        apiKey,
        capacityThreshold,
        ...(previousAttempt !== undefined ? { previousAttempt } : {}),
        ...(tutorFeedback !== undefined ? { tutorFeedback } : {}),
        ...(scaffoldingDirectives.length > 0 ? { scaffoldingDirectives } : {}),
      });
      scaffoldingDirectives = [...new Set([
        ...scaffoldingDirectives,
        ...turn.wmlAssessment.scaffoldingDirectives,
      ])];
      wmlSamples.push(turn.wmlAssessment.totalWml);
      console.log();
      const bloomLevelName = BLOOM_LEVEL_NAMES[selected.bloomLevel - 1] ?? "Unknown";
      console.log(
        `(${selected.conceptName}: learning node ${currentNodeNumber} out of ${totalNodes} | Bloom ${selected.bloomLevel}: ${bloomLevelName} | ${fringe.remainingCount} remaining)`,
      );
      console.log("---");
      const attemptLabel = attemptCount > 1 ? `Attempt ${attemptCount} - Remediation` : `Attempt ${attemptCount}`;
      const gatekeeperNote = turn.wasRegeneratedForOverload
        ? " (simplified by WML gatekeeper)"
        : "";
      console.log(
        `${attemptLabel} | WML: ${turn.wmlAssessment.totalWml.toFixed(2)} [${turn.wmlAssessment.loadLevel}]${gatekeeperNote}`,
      );
      console.log(`[Micro-Tutor] ${turn.lesson.explanation}`);
      console.log(`[Check] ${turn.lesson.checkQuestion}`);
      const userAnswer = await terminal.question("Your answer (or 'exit' to pause): ");
      if (["exit", "quit"].includes(userAnswer.trim().toLowerCase())) {
        console.log(`[Runner] Pausing with "${selected.conceptName}" saved as IN_PROGRESS.`);
        console.log(
          `Progress saved: ${completedCount} / ${totalNodes} concepts completed. Resume anytime from the main menu.`,
        );
        shouldExit = true;
        break;
      }

      const averageWml = wmlSamples.reduce((sum, score) => sum + score, 0) / wmlSamples.length;
      const evaluation = await submitNodeAttempt({
        planId,
        userId,
        nodeId: selected.nodeId,
        lesson: turn.lesson,
        userAnswer,
        attemptCount,
        averageWml,
        capacityThreshold,
        wmlSamples,
        apiKey,
      });
      capacityThreshold = evaluation.updatedCapacityThreshold;
      if (evaluation.mastered) {
        console.log(`[Mastered] ${evaluation.feedback}`);
        console.log(`[Runner] Updated cognitive capacity threshold: ${capacityThreshold.toFixed(2)}.`);
        break;
      }

      console.log(`[Not yet] ${evaluation.feedback}`);
      if (evaluation.hint) console.log(`[Hint] ${evaluation.hint}`);
      previousAttempt = userAnswer;
      tutorFeedback = [evaluation.feedback, evaluation.hint].filter(Boolean).join(" ");
      attemptCount += 1;
    }

    if (shouldExit) break;
  }
}

async function main(): Promise<void> {
  const config = validateEnv();
  await connectToDatabase(config.MONGODB_URI);
  const { userId, email } = await authenticate();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Authenticated user id is invalid.");

  const activePlans = await Plan.find({
    userId,
    status: { $in: ["DIAGNOSTIC_IN_PROGRESS", "READY"] },
  }).sort({ updatedAt: -1 });
  console.log(`[Runner] ${activePlans.length} active plan(s) for ${email}.`);
  const activePlanProgress = await Promise.all(
    activePlans.map(async (plan) => {
      const [totalNodes, diagnosticPassedCount, tutoredMasteredCount] = await Promise.all([
        PlanNode.countDocuments({ planId: plan._id }),
        PlanNode.countDocuments({ planId: plan._id, status: "PASSED_IN_DIAGNOSTIC" }),
        PlanNode.countDocuments({ planId: plan._id, status: "MASTERED" }),
      ]);
      return {
        totalNodes,
        completedCount: diagnosticPassedCount + tutoredMasteredCount,
      };
    }),
  );
  activePlans.forEach((plan, index) => {
    const progress = activePlanProgress[index];
    console.log(
      `  [${index + 1}] ${plan.topic} (${plan.status} - ${progress?.completedCount ?? 0}/${progress?.totalNodes ?? 0} concepts completed)`,
    );
  });
  console.log("  [0] Start a new plan");

  let choice: number | undefined;
  while (choice === undefined) {
    const rawChoice = await terminal.question("Choose a plan: ");
    choice = parsePlanChoice(rawChoice, activePlans.length);
    if (choice === undefined) {
      console.error("[Runner] Invalid choice. Enter 0 or the number of a listed plan.");
    }
  }
  let planId: string;
  if (choice === 0) {
    planId = await createPlanForUser(userId);
  } else {
    const selected = activePlans[choice - 1];
    if (!selected) throw new Error("Choose one of the listed plans.");
    planId = selected._id.toString();
  }
  let plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be loaded for its owner.`);
  if (plan.status === "DIAGNOSTIC_IN_PROGRESS") {
    await runDiagnostics(planId, userId);
  }
  plan = await Plan.findOne({ _id: planId, userId });
  if (!plan) throw new Error(`Plan ${planId} could not be reloaded for its owner.`);
  if (plan.status === "READY") {
    await runLearningSession(planId, userId);
  }
}

try {
  await main();
} catch (error) {
  console.error(`[Runner] Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  terminal.close();
  await disconnectFromDatabase();
}
```


---
## FILE: src/modules/plan-agent/services/clarify-service.ts

```ts
import { Types } from "mongoose";
import { User } from "../../auth/models/User.js";
import { fetchWithRetry } from "../../common/utils/retry.js";
import { UserLearningSlots, toLearningSlots } from "../models/UserLearningSlots.js";
import { getClarificationSystemPrompt } from "../utils/clarify-prompts.js";
import type { LearningSlots, SlotEvaluationResult } from "../types/slots.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

function parseSlotEvaluation(text: string): SlotEvaluationResult {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON for the slot evaluation.", {
      cause: error,
    });
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Gemini slot evaluation must be a JSON object.");
  }

  const result = parsed as Record<string, unknown>;
  const slots = result.slots;
  if (typeof slots !== "object" || slots === null) {
    throw new Error("Gemini slot evaluation must include a slots object.");
  }

  const slotValues = slots as Record<string, unknown>;
  const { targetLanguageOrTool, specificSubdomain, targetDepth } = slotValues;
  if (
    (targetLanguageOrTool !== null && typeof targetLanguageOrTool !== "string") ||
    (specificSubdomain !== null && typeof specificSubdomain !== "string") ||
    (targetDepth !== null &&
      (typeof targetDepth !== "number" ||
        !Number.isInteger(targetDepth) ||
        targetDepth < 1 ||
        targetDepth > 6))
  ) {
    throw new Error("Gemini slot evaluation contains invalid slot values.");
  }

  if (
    typeof result.isComplete !== "boolean" ||
    (result.nextQuestion !== null && typeof result.nextQuestion !== "string")
  ) {
    throw new Error("Gemini slot evaluation contains invalid completion fields.");
  }

  const validatedSlots: LearningSlots = {
    targetLanguageOrTool,
    specificSubdomain,
    targetDepth,
  };
  const hasAllSlots =
    typeof targetLanguageOrTool === "string" &&
    targetLanguageOrTool.trim().length > 0 &&
    typeof specificSubdomain === "string" &&
    specificSubdomain.trim().length > 0 &&
    typeof targetDepth === "number";

  if (result.isComplete !== hasAllSlots) {
    throw new Error("Gemini slot evaluation has an inconsistent isComplete value.");
  }

  if (
    (result.isComplete && result.nextQuestion !== null) ||
    (!result.isComplete &&
      (typeof result.nextQuestion !== "string" || result.nextQuestion.trim().length === 0))
  ) {
    throw new Error("Gemini slot evaluation has an invalid nextQuestion value.");
  }

  return {
    slots: validatedSlots,
    isComplete: result.isComplete,
    nextQuestion: result.nextQuestion,
  };
}

export async function evaluateUserIntent(
  userId: string | Types.ObjectId,
  userMessage: string,
  apiKey: string,
): Promise<SlotEvaluationResult> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required for clarification.");
  }
  const ownerId = new Types.ObjectId(userId);
  if (!(await User.exists({ _id: ownerId }))) {
    throw new Error(`Cannot evaluate clarification: user ${ownerId.toString()} does not exist.`);
  }
  const state = await UserLearningSlots.findOneAndUpdate(
    { userId: ownerId },
    { $setOnInsert: { userId: ownerId } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  const currentSlots = toLearningSlots(state);
  console.log(`[Plan Agent] Loaded clarification slots for user ${ownerId.toString()}.`);
  console.log("[Plan Agent] Starting Gemini clarification evaluation.");

  const response = await fetchWithRetry(() =>
    fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: getClarificationSystemPrompt(currentSlots) }],
        },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
  );

  console.log(`[Plan Agent] Gemini clarification fetch status: ${response.status}`);

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini clarification request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no slot evaluation content.");
  }

  const evaluation = parseSlotEvaluation(text);
  state.targetLanguageOrTool = evaluation.slots.targetLanguageOrTool;
  state.specificSubdomain = evaluation.slots.specificSubdomain;
  state.targetDepth = evaluation.slots.targetDepth;
  await state.save();
  console.log(`[Plan Agent] Saved clarification slots for user ${ownerId.toString()}.`);
  const missingSlots: string[] = [];
  if (!evaluation.slots.targetLanguageOrTool?.trim()) {
    missingSlots.push("targetLanguageOrTool");
  }
  if (!evaluation.slots.specificSubdomain?.trim()) {
    missingSlots.push("specificSubdomain");
  }
  if (evaluation.slots.targetDepth === null) {
    missingSlots.push("targetDepth");
  }

  console.log(
    `[Plan Agent] Clarification slots missing: ${missingSlots.length > 0 ? missingSlots.join(", ") : "none"}.`,
  );
  console.log(
    `[Plan Agent] Generated clarification question: ${evaluation.nextQuestion ?? "none; slots are complete"}`,
  );

  return evaluation;
}

export async function getUserLearningSlots(
  userId: string | Types.ObjectId,
): Promise<LearningSlots> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to retrieve clarification slots.");
  }
  const ownerId = new Types.ObjectId(userId);
  const record = await UserLearningSlots.findOne({ userId: ownerId });
  return record
    ? toLearningSlots(record)
    : { targetLanguageOrTool: null, specificSubdomain: null, targetDepth: null };
}

export async function clearUserLearningSlots(
  userId: string | Types.ObjectId,
): Promise<void> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to clear clarification slots.");
  }
  const ownerId = new Types.ObjectId(userId);
  await UserLearningSlots.updateOne(
    { userId: ownerId },
    {
      $set: {
        targetLanguageOrTool: null,
        specificSubdomain: null,
        targetDepth: null,
      },
    },
  );
  console.log(`[Plan Agent] Cleared consumed clarification slots for user ${ownerId.toString()}.`);
}
```


---
## FILE: src/modules/plan-agent/services/diagnostic-engine.ts

```ts
import { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([node._id.toString()]);

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): number {
    let count = 0;
    for (const prerequisiteId of prerequisiteIds) {
      const prerequisiteKey = prerequisiteId.toString();
      if (visited.has(prerequisiteKey)) {
        continue;
      }
      visited.add(prerequisiteKey);

      const prerequisite = nodesById.get(prerequisiteKey);
      if (!prerequisite) {
        continue;
      }
      if (prerequisite.status === "PENDING") {
        count += 1;
      }
      count += visit(prerequisite.prerequisites);
    }
    return count;
  }

  return visit(node.prerequisites);
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): number {
  const visited = new Set<string>([nodeId]);

  function visit(parentId: string): number {
    let count = 0;
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (child?.status === "PENDING") {
        count += 1;
      }
      count += visit(childId);
    }
    return count;
  }

  return visit(nodeId);
}

/** Selects the pending node whose known/unknown closure sizes are most balanced. */
export async function getNextDiagnosticNode(
  planId: string,
  userId: string,
): Promise<PlanNodeDocument | null> {
  if (!Types.ObjectId.isValid(planId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Valid plan and authenticated user ObjectIds are required for diagnostics.");
  }
  const plan = await Plan.exists({ _id: planId, userId });
  if (!plan) throw new Error("Plan not found for the authenticated user.");
  console.log(`[Plan Agent] Verified diagnostic plan ${planId} belongs to user ${userId}.`);

  const pendingNodes = await PlanNode.find({ planId, status: "PENDING" }).sort({
    conceptName: 1,
  });

  if (pendingNodes.length === 0) {
    console.log(`[Plan Agent] Diagnostic complete for plan ${planId}: no pending nodes.`);
    return null;
  }

  const allNodes = await PlanNode.find({ planId });
  const nodesById = new Map(
    allNodes.map((node) => [node._id.toString(), node] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const node of allNodes) {
    for (const prerequisiteId of node.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(node._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  let selectedNode: PlanNodeDocument | null = null;
  let lowestScore = Number.POSITIVE_INFINITY;

  for (const node of pendingNodes) {
    const pendingAncestors = collectPendingAncestors(node, nodesById);
    const pendingDescendants = collectPendingDescendants(
      node._id.toString(),
      childrenById,
      nodesById,
    );
    const informationScore = Math.abs(pendingAncestors - pendingDescendants);

    console.log(
      `[Plan Agent] Diagnostic information score: "${node.conceptName}"; pendingAncestors=${pendingAncestors}; pendingDescendants=${pendingDescendants}; score=${informationScore}.`,
    );

    if (informationScore < lowestScore) {
      lowestScore = informationScore;
      selectedNode = node;
    }
  }

  console.log(
    `[Plan Agent] Selected diagnostic node: "${selectedNode?.conceptName ?? "none"}" (score=${lowestScore}).`,
  );
  return selectedNode;
}
```


---
## FILE: src/modules/plan-agent/services/diagnostic-evaluator.ts

```ts
import { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import type { PlanNodeDocument } from "../models/PlanNode.js";

function collectPendingAncestors(
  node: PlanNodeDocument,
  nodesById: Map<string, PlanNodeDocument>,
): string[] {
  const visited = new Set<string>([node._id.toString()]);
  const pendingIds: string[] = [];

  function visit(prerequisiteIds: PlanNodeDocument["prerequisites"]): void {
    for (const prerequisiteId of prerequisiteIds) {
      const prerequisiteKey = prerequisiteId.toString();
      if (visited.has(prerequisiteKey)) {
        continue;
      }
      visited.add(prerequisiteKey);

      const prerequisite = nodesById.get(prerequisiteKey);
      if (!prerequisite) {
        continue;
      }
      if (prerequisite.status === "PENDING") {
        pendingIds.push(prerequisiteKey);
      }
      visit(prerequisite.prerequisites);
    }
  }

  visit(node.prerequisites);
  return pendingIds;
}

function collectPendingDescendants(
  nodeId: string,
  childrenById: Map<string, string[]>,
  nodesById: Map<string, PlanNodeDocument>,
): string[] {
  const visited = new Set<string>([nodeId]);
  const pendingIds: string[] = [];

  function visit(parentId: string): void {
    for (const childId of childrenById.get(parentId) ?? []) {
      if (visited.has(childId)) {
        continue;
      }
      visited.add(childId);

      const child = nodesById.get(childId);
      if (!child) {
        continue;
      }
      if (child.status === "PENDING") {
        pendingIds.push(childId);
      }
      visit(childId);
    }
  }

  visit(nodeId);
  return pendingIds;
}

/** Applies a diagnostic result and invalidates dependent knowledge assumptions. */
export async function processDiagnosticAnswer(
  nodeId: string,
  passed: boolean,
  userId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(nodeId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Valid PlanNode and authenticated user ObjectIds are required.");
  }

  const node = await PlanNode.findById(nodeId);
  if (!node) {
    throw new Error(`PlanNode not found: ${nodeId}`);
  }
  if (!(await Plan.exists({ _id: node.planId, userId }))) {
    throw new Error("PlanNode is not owned by the authenticated user.");
  }
  console.log(`[Plan Agent] Verified diagnostic answer owner ${userId} for node ${nodeId}.`);

  const allNodes = await PlanNode.find({ planId: node.planId });
  const nodesById = new Map(
    allNodes.map((planNode) => [planNode._id.toString(), planNode] as const),
  );
  const childrenById = new Map<string, string[]>();
  for (const planNode of allNodes) {
    for (const prerequisiteId of planNode.prerequisites) {
      const prerequisiteKey = prerequisiteId.toString();
      const children = childrenById.get(prerequisiteKey) ?? [];
      children.push(planNode._id.toString());
      childrenById.set(prerequisiteKey, children);
    }
  }

  const affectedNodeIds = passed
    ? collectPendingAncestors(node, nodesById)
    : collectPendingDescendants(node._id.toString(), childrenById, nodesById);
  const nextStatus = passed ? "PASSED_IN_DIAGNOSTIC" : "IN_PROGRESS";

  node.status = nextStatus;
  await node.save();

  if (affectedNodeIds.length > 0) {
    await PlanNode.updateMany(
      {
        _id: { $in: affectedNodeIds },
        planId: node.planId,
        status: "PENDING",
      },
      { $set: { status: nextStatus } },
    );
  }

  console.log(
    `[Plan Agent] Diagnostic answer ${passed ? "passed" : "failed"} for "${node.conceptName}"; updated ${affectedNodeIds.length} ${passed ? "pending ancestors" : "pending descendants"} to ${nextStatus}.`,
  );
}
```


---
## FILE: src/modules/plan-agent/services/diagnostic-questioner.ts

```ts
import { fetchWithRetry } from "../../common/utils/retry.js";
import type {
  DiagnosticEvaluationResult,
  DiagnosticQuestion,
} from "../types/diagnostic.js";
import {
  getDiagnosticGradingPrompt,
  getDiagnosticQuestionPrompt,
} from "../utils/diagnostic-prompts.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";
const SKIP_ANSWERS = new Set([
  "skip",
  "idk",
  "i dont know",
  "dont know",
  "pass",
  "no",
  "n",
]);

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

function parseJsonObject(text: string, context: string): Record<string, unknown> {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Gemini returned invalid JSON for ${context}.`, { cause: error });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Gemini ${context} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function getResponseText(payload: GeminiResponse, context: string): string {
  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini returned no ${context} content.`);
  return text;
}

async function requestGemini(prompt: string, apiKey: string, context: string): Promise<string> {
  const response = await fetchWithRetry(() =>
    fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
  );
  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini ${context} request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }
  return getResponseText(payload, context);
}

export async function generateDiagnosticQuestion(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  apiKey: string,
): Promise<DiagnosticQuestion> {
  const text = await requestGemini(
    getDiagnosticQuestionPrompt(topic, conceptName, bloomLevel),
    apiKey,
    "diagnostic question",
  );
  const result = parseJsonObject(text, "diagnostic question");
  if (
    typeof result.question !== "string" ||
    result.question.trim().length === 0 ||
    typeof result.expectedCriteria !== "string" ||
    result.expectedCriteria.trim().length === 0
  ) {
    throw new Error("Gemini diagnostic question must include non-empty question and expectedCriteria strings.");
  }
  const diagnosticQuestion = {
    question: result.question.trim(),
    expectedCriteria: result.expectedCriteria.trim(),
  };
  console.log(`[Plan Agent] Generated diagnostic question for "${conceptName}" (Bloom ${bloomLevel}).`);
  return diagnosticQuestion;
}

export async function evaluateDiagnosticResponse(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  question: string,
  expectedCriteria: string,
  userAnswer: string,
  apiKey: string,
): Promise<DiagnosticEvaluationResult> {
  const normalizedAnswer = userAnswer.trim().toLowerCase().replace(/['’.!?]/g, "");
  if (normalizedAnswer.length === 0 || SKIP_ANSWERS.has(normalizedAnswer)) {
    console.log(`[Plan Agent] Diagnostic fast-path skip for "${conceptName}"; marked for learning.`);
    return { passed: false, feedback: "Skipped; marked for learning." };
  }

  const text = await requestGemini(
    getDiagnosticGradingPrompt(
      topic,
      conceptName,
      bloomLevel,
      question,
      expectedCriteria,
      userAnswer,
    ),
    apiKey,
    "diagnostic grading",
  );
  const result = parseJsonObject(text, "diagnostic grading");
  if (
    typeof result.passed !== "boolean" ||
    typeof result.feedback !== "string" ||
    result.feedback.trim().length === 0
  ) {
    throw new Error("Gemini diagnostic grading must include a boolean passed and non-empty feedback string.");
  }
  const evaluation = { passed: result.passed, feedback: result.feedback.trim() };
  console.log(
    `[Plan Agent] Diagnostic verdict for "${conceptName}": ${evaluation.passed ? "PASS" : "FAIL"}.`,
  );
  return evaluation;
}
```


---
## FILE: src/modules/plan-agent/services/graph-generator.ts

```ts
import { getAbsoluteMasterySystemPrompt } from "../utils/prompt-templates.js";
import { fetchWithRetry } from "../../common/utils/retry.js";
import type { RawGraphNode } from "../types/graph.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

function parseGraph(text: string): RawGraphNode[] {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON for the mastery graph.", {
      cause: error,
    });
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini graph output must be a JSON array.");
  }

  for (const [index, node] of parsed.entries()) {
    if (
      typeof node !== "object" ||
      node === null ||
      typeof node.conceptName !== "string" ||
      typeof node.bloomLevel !== "number" ||
      !Number.isInteger(node.bloomLevel) ||
      node.bloomLevel < 1 ||
      node.bloomLevel > 6 ||
      !Array.isArray(node.prerequisiteNames) ||
      !node.prerequisiteNames.every(
        (prerequisiteName: unknown) => typeof prerequisiteName === "string",
      )
    ) {
      throw new Error(`Gemini graph output contains an invalid node at index ${index}.`);
    }
  }

  return parsed as RawGraphNode[];
}

/**
 * Requests the complete Bloom-6 prerequisite graph; pruning and persistence
 * belong to later Plan Agent stages.
 */
export async function generateAbsoluteMasteryGraph(
  topic: string,
  apiKey: string,
): Promise<RawGraphNode[]> {
  console.log(`[Plan Agent] Starting Gemini graph fetch for topic: ${topic}`);

  const response = await fetchWithRetry(() =>
    fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: getAbsoluteMasterySystemPrompt(topic) }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate the absolute mastery prerequisite graph for: ${topic}` }],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }),
  );

  console.log(`[Plan Agent] Gemini graph fetch status: ${response.status}`);

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      `Gemini graph request failed (${response.status}): ${payload.error?.message ?? response.statusText}`,
    );
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no graph content.");
  }

  const graph = parseGraph(text);
  console.log(`[Plan Agent] Gemini graph parsing complete: ${graph.length} concepts.`);
  return graph;
}
```


---
## FILE: src/modules/plan-agent/services/plan-service.ts

```ts
import mongoose, { Types } from "mongoose";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { generateAbsoluteMasteryGraph } from "./graph-generator.js";
import { breakPrerequisiteCycles, pruneGraph } from "../utils/graph-pruner.js";

/**
 * Generates and stores a user's requested learning plan and its prerequisite
 * nodes. Graph generation remains separate from persistence and pruning.
 */
export async function createLearningPlan(
  userId: string | Types.ObjectId,
  topic: string,
  targetDepth: number,
  apiKey: string,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A valid authenticated user ObjectId is required to create a learning plan.");
  }
  const ownerId = new Types.ObjectId(userId);
  const owner = await User.exists({ _id: ownerId });
  if (!owner) {
    throw new Error(`Cannot create a learning plan: user ${ownerId.toString()} does not exist.`);
  }
  console.log(`[Plan Agent] Verified plan owner ${ownerId.toString()}.`);

  console.log(`[Plan Agent] Fetching absolute mastery graph for "${topic}".`);
  const rawGraph = await generateAbsoluteMasteryGraph(topic, apiKey);

  console.log(`[Plan Agent] Pruning graph to Bloom level ${targetDepth}.`);
  const prunedGraph = pruneGraph(rawGraph, targetDepth);
  if (prunedGraph.length === 0) {
    throw new Error(
      `Cannot create learning plan for "${topic}": graph pruning produced 0 valid nodes at targetDepth ${targetDepth}.`,
    );
  }
  console.log(
    `[Plan Agent] Graph pruning complete: ${rawGraph.length} raw nodes, ${prunedGraph.length} retained nodes, ${rawGraph.length - prunedGraph.length} pruned.`,
  );

  const plan = new Plan({
    userId: ownerId,
    topic,
    targetDepth,
    status: "DIAGNOSTIC_IN_PROGRESS",
  });
  const nodeIdsByName = new Map<string, Types.ObjectId>(
    prunedGraph.map((node) => [node.conceptName, new mongoose.Types.ObjectId()]),
  );

  const nodesToInsert = prunedGraph.map((node) => {
    const prerequisites = node.prerequisiteNames.map((prerequisiteName) => {
      const prerequisiteId = nodeIdsByName.get(prerequisiteName);
      if (!prerequisiteId) {
        throw new Error(
          `Prerequisite "${prerequisiteName}" for "${node.conceptName}" was not present in the pruned graph.`,
        );
      }
      return prerequisiteId;
    });

    return {
      _id: nodeIdsByName.get(node.conceptName),
      planId: plan._id,
      conceptName: node.conceptName,
      bloomLevel: node.bloomLevel,
      status: "PENDING" as const,
      prerequisites,
    };
  });

  await plan.save();
  console.log(`[Plan Agent] Plan ${plan._id.toString()} persisted for user ${ownerId.toString()}.`);
  try {
    const acyclicGraph = breakPrerequisiteCycles(prunedGraph);
    const acyclicPrerequisitesById = new Map(
      acyclicGraph.map((node) => [
        nodeIdsByName.get(node.conceptName)!.toString(),
        node.prerequisiteNames.map((name) => {
          const prerequisiteId = nodeIdsByName.get(name);
          if (!prerequisiteId) throw new Error(`Prerequisite "${name}" was not present in the pruned graph.`);
          return prerequisiteId;
        }),
      ]),
    );
    for (const node of nodesToInsert) {
      const prerequisites = acyclicPrerequisitesById.get((node._id as Types.ObjectId).toString());
      if (!prerequisites) throw new Error("A persisted node could not be matched to its graph concept.");
      node.prerequisites = prerequisites;
    }
    await PlanNode.insertMany(nodesToInsert);
    console.log(
      `[Plan Agent] Inserted ${nodesToInsert.length} PlanNode documents for user ${ownerId.toString()}.`,
    );
  } catch (error) {
    await PlanNode.deleteMany({ planId: plan._id });
    await Plan.deleteOne({ _id: plan._id, userId: ownerId });
    throw error;
  }

  return plan;
}
```


---
## FILE: src/modules/plan-agent/tests/graph-pruner.test.ts

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { breakPrerequisiteCycles, pruneGraph } from "../utils/graph-pruner.js";
import type { RawGraphNode } from "../types/graph.js";

function assertRootReachableDag(nodes: RawGraphNode[]): void {
  const dependents = new Map<string, string[]>();
  const prerequisiteCounts = new Map<string, number>();
  for (const node of nodes) {
    prerequisiteCounts.set(node.conceptName, node.prerequisiteNames.length);
    for (const prerequisiteName of node.prerequisiteNames) {
      const current = dependents.get(prerequisiteName) ?? [];
      current.push(node.conceptName);
      dependents.set(prerequisiteName, current);
    }
  }

  const queue = nodes
    .filter((node) => node.prerequisiteNames.length === 0)
    .map((node) => node.conceptName);
  const visited = new Set<string>();
  while (queue.length > 0) {
    const conceptName = queue.shift()!;
    if (visited.has(conceptName)) continue;
    visited.add(conceptName);
    for (const dependent of dependents.get(conceptName) ?? []) {
      const remaining = (prerequisiteCounts.get(dependent) ?? 0) - 1;
      prerequisiteCounts.set(dependent, remaining);
      if (remaining === 0) queue.push(dependent);
    }
  }
  assert.equal(visited.size, nodes.length);
}

test("pruneGraph breaks reachable prerequisite cycles before returning nodes", () => {
  const result = pruneGraph([
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["A"] },
    { conceptName: "Goal", bloomLevel: 3, prerequisiteNames: ["A"] },
  ], 3);

  assertRootReachableDag(result);
  assert.deepEqual(result.map((node) => node.prerequisiteNames), [["B"], [], ["A"]]);
});

test("pruneGraph deduplicates normalized concepts and rewrites prerequisite aliases", () => {
  const result = pruneGraph([
    { conceptName: "Core   Concept", bloomLevel: 1, prerequisiteNames: [] },
    { conceptName: "core concept", bloomLevel: 1, prerequisiteNames: [] },
    { conceptName: "Goal", bloomLevel: 2, prerequisiteNames: [" CORE CONCEPT "] },
  ], 2);

  assert.equal(result.length, 2);
  assert.deepEqual(result.map((node) => node.conceptName), ["Core   Concept", "Goal"]);
  assert.deepEqual(result[1].prerequisiteNames, ["Core   Concept"]);
  assertRootReachableDag(result);
});

test("breakPrerequisiteCycles turns two-node cycles into root-reachable DAGs", () => {
  const input: RawGraphNode[] = [
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["A"] },
  ];
  const result = breakPrerequisiteCycles(input);

  assertRootReachableDag(result);
  assert.deepEqual(result.map((node) => node.prerequisiteNames), [["B"], []]);
  assert.deepEqual(input.map((node) => node.prerequisiteNames), [["B"], ["A"]]);
});

test("breakPrerequisiteCycles deterministically breaks three-node cycles", () => {
  const input: RawGraphNode[] = [
    { conceptName: "A", bloomLevel: 1, prerequisiteNames: ["B"] },
    { conceptName: "B", bloomLevel: 2, prerequisiteNames: ["C"] },
    { conceptName: "C", bloomLevel: 3, prerequisiteNames: ["A"] },
  ];

  const first = breakPrerequisiteCycles(input);
  const second = breakPrerequisiteCycles(input);
  assertRootReachableDag(first);
  assert.deepEqual(first, second);
  assert.deepEqual(first.map((node) => node.prerequisiteNames), [["B"], ["C"], []]);
});
```


---
## FILE: src/modules/plan-agent/tests/plan-agent.test.ts

```ts
import "dotenv/config";
import test from "node:test";
import assert from "node:assert";
import { connectToDatabase, disconnectFromDatabase } from "../../../config/db.js";
import { evaluateUserIntent } from "../services/clarify-service.js";
import { pruneGraph } from "../utils/graph-pruner.js";
import { createLearningPlan } from "../services/plan-service.js";
import { getNextDiagnosticNode } from "../services/diagnostic-engine.js";
import { processDiagnosticAnswer } from "../services/diagnostic-evaluator.js";
import { Plan } from "../models/Plan.js";
import { PlanNode } from "../models/PlanNode.js";
import { User } from "../../auth/models/User.js";
import { UserLearningSlots } from "../models/UserLearningSlots.js";
import { registerUser, verifySessionToken } from "../../auth/services/auth-service.js";
import { env, validateEnv } from "../../../config/env.js";
import { parsePlanChoice } from "../runner/plan-choice.js";

const apiKey = process.env.GEMINI_API_KEY || "";
let testUserId = "";

test("CLI plan choice rejects empty and out-of-range input", () => {
  assert.equal(parsePlanChoice("   ", 2), undefined);
  assert.equal(parsePlanChoice("3", 2), undefined);
  assert.equal(parsePlanChoice("0", 2), 0);
  assert.equal(parsePlanChoice(" 2 ", 2), 2);
});

test("Environment validation allows complete MongoDB URIs without separate credentials", () => {
  assert.doesNotThrow(() => validateEnv({
    ...env,
    MONGODB_URI: "mongodb://localhost:27017/thesis",
    MONGODB_USERNAME: undefined,
    MONGODB_PASSWORD: undefined,
  }));
  assert.throws(() => validateEnv({
    ...env,
    MONGODB_URI: undefined,
    MONGODB_USERNAME: undefined,
    MONGODB_PASSWORD: "secret",
  }), /MONGODB_USERNAME/);
});

test("Plan Agent Integration Test Suite", async (t) => {
  // 1. Ensure Database Connection
  await t.test("Database Connection", async () => {
    await connectToDatabase();
    const registration = await registerUser(
      `plan-agent-test-${Date.now()}@example.test`,
      "integration-test-password",
    );
    testUserId = registration.user.userId;
    assert.strictEqual(verifySessionToken(registration.sessionToken), testUserId);
    assert.strictEqual(true, true, "Database connected successfully");
  });

  // 2. Test Ambiguity Guard (ClarifyService) with light retry logic for 503 spikes
  await t.test("ClarifyService: Handles ambiguous vs scoped queries", async () => {
    if (!apiKey) {
      console.warn("Skipping LLM tests: GEMINI_API_KEY is missing.");
      return;
    }

    let initialEval;
    let attempts = 0;
    while (attempts < 3) {
      try {
        initialEval = await evaluateUserIntent(
          testUserId,
          "I want to learn programming",
          apiKey
        );
        break;
      } catch (err: any) {
        attempts++;
        if (attempts >= 3) throw err;
        console.warn(`[Test] Gemini 503 encountered. Retrying attempt ${attempts + 1}...`);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    assert.strictEqual(initialEval!.isComplete, false, "Ambiguous prompt should not complete slots");
    assert.notStrictEqual(initialEval!.nextQuestion, null, "Should generate a clarification question");

    // Fully scoped prompt
    const finalEval = await evaluateUserIntent(
      testUserId,
      "I want to learn JavaScript DOM manipulation at an application/apply level (Bloom 3)",
      apiKey
    );

    assert.strictEqual(finalEval.isComplete, true, "Fully scoped prompt should complete all slots");
  });

// 3. Test Graph Pruning Math
  await t.test("GraphPruner: Mathematically removes orphans and deep nodes", () => {
    const mockRawGraph = [
      { conceptName: "Variables", bloomLevel: 1, prerequisiteNames: [] },
      { conceptName: "Functions", bloomLevel: 2, prerequisiteNames: ["Variables"] },
      { conceptName: "DOM Events", bloomLevel: 3, prerequisiteNames: ["Functions"] },
      { conceptName: "Custom Framework Architecture", bloomLevel: 6, prerequisiteNames: ["DOM Events"] }, // Pruned: level 6 > target 3
      { conceptName: "Unconnected Basic Math", bloomLevel: 1, prerequisiteNames: ["NonExistentTopic"] } // Pruned: unreachable/orphan
    ];

    const pruned = pruneGraph(mockRawGraph, 3);

    assert.strictEqual(pruned.length, 3, "Should retain exactly 3 reachable connected nodes <= level 3");
    assert.strictEqual(pruned.some(n => n.conceptName === "Custom Framework Architecture"), false, "Level 6 node must be pruned");
    assert.strictEqual(pruned.some(n => n.conceptName === "Unconnected Basic Math"), false, "Unreachable orphan node must be pruned");
  });

  await t.test("PlanService: Rejects a graph with no valid nodes before persistence", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: "[]" }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
    try {
      await assert.rejects(
        createLearningPlan(testUserId, "Empty graph test", 2, "test-key"),
        /graph pruning produced 0 valid nodes at targetDepth 2/,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
    assert.equal(await Plan.countDocuments({ userId: testUserId }), 0);
  });

  // 4. Test End-to-End Plan Creation & Database Ingestion
  let createdPlanId: string;
  await t.test("PlanService: Creates Plan and Parent-Referenced DAG in MongoDB", async () => {
    if (!apiKey) return;

    await Plan.deleteMany({ userId: testUserId });

    const plan = await createLearningPlan(
      testUserId,
      "JavaScript Basics",
      2, 
      apiKey
    );

    createdPlanId = plan._id.toString();
    assert.notStrictEqual(createdPlanId, null, "Plan ID should be generated");
    assert.strictEqual(plan.topic, "JavaScript Basics");

    const nodes = await PlanNode.find({ planId: plan._id });
    assert.strictEqual(nodes.length > 0, true, "Plan nodes must be inserted into MongoDB");
    
    for (const node of nodes) {
      assert.strictEqual(Array.isArray(node.prerequisites), true, "Prerequisites must be an array of ObjectIds");
    }
  });

  // 5. Test Diagnostic Engine & KST Invalidation
  await t.test("DiagnosticEngine & Evaluator: Topological median and KST cascade", async () => {
    if (!createdPlanId) return;

    const diagnosticNode = await getNextDiagnosticNode(createdPlanId, testUserId);
    
    if (diagnosticNode) {
      assert.strictEqual(diagnosticNode.status, "PENDING", "Selected diagnostic node must be pending");

      await processDiagnosticAnswer(diagnosticNode._id.toString(), true, testUserId);

      const updatedNode = await PlanNode.findById(diagnosticNode._id);
      assert.strictEqual(updatedNode?.status, "PASSED_IN_DIAGNOSTIC", "Node status should update to passed");
    }
  });

  // 6. Teardown
  await t.test("Teardown", async () => {
    if (createdPlanId) {
      await Plan.deleteMany({ userId: testUserId });
      await PlanNode.deleteMany({ planId: createdPlanId });
    }
    await UserLearningSlots.deleteMany({ userId: testUserId });
    await User.deleteOne({ _id: testUserId });
    await disconnectFromDatabase();
  });
});

// Helper mock node generators
function variablesNode(name: string, level: number, prereqs: string[]) {
  return { conceptName: name, bloomLevel: level, prerequisiteNames: prereqs };
}
function functionsNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function domNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function advancedNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
function orphanNode(name: string, level: number, prereqs: string[]) {
  return variablesNode(name, level, prereqs);
}
```


---
## FILE: src/modules/plan-agent/types/diagnostic.ts

```ts
export interface DiagnosticQuestion {
  question: string;
  expectedCriteria: string;
}

export interface DiagnosticEvaluationResult {
  passed: boolean;
  feedback: string;
}
```


---
## FILE: src/modules/plan-agent/types/graph.ts

```ts
/** A concept and its direct prerequisites in the unpruned mastery graph. */
export interface RawGraphNode {
  conceptName: string;
  bloomLevel: number;
  prerequisiteNames: string[];
}
```


---
## FILE: src/modules/plan-agent/types/slots.ts

```ts
export interface LearningSlots {
  targetLanguageOrTool: string | null;
  specificSubdomain: string | null;
  targetDepth: number | null;
}

export interface SlotEvaluationResult {
  slots: LearningSlots;
  isComplete: boolean;
  nextQuestion: string | null;
}
```


---
## FILE: src/modules/plan-agent/utils/clarify-prompts.ts

```ts
import type { LearningSlots } from "../types/slots.js";

export function getClarificationSystemPrompt(currentSlots: LearningSlots): string {
  return `You extract the user's learning intent into precise slots so a learning plan can be generated.

The required slots are:
- "targetLanguageOrTool": the language, tool, or subject the user wants to learn (for example, "JavaScript").
- "specificSubdomain": the focused area within that subject (for example, "DOM Manipulation"). Use "Full Overview" only when the user explicitly wants to learn everything or requests a broad overview.
- "targetDepth": the desired learning depth as an integer from 1 to 6.

Current slot values:
${JSON.stringify(currentSlots, null, 2)}

Use the user's conversation and these current values to fill or preserve the slots. Ask one concise, useful clarification question for the most important missing slot. A slot is complete only when the subject and subdomain are non-empty strings and targetDepth is an integer from 1 to 6. If all slots are complete, set "isComplete" to true and "nextQuestion" to null. Otherwise set "isComplete" to false and provide the next question as a non-empty string.

Output strictly as valid JSON matching this shape, with no markdown fences or explanatory text:
{
  "slots": {
    "targetLanguageOrTool": string | null,
    "specificSubdomain": string | null,
    "targetDepth": number | null
  },
  "isComplete": boolean,
  "nextQuestion": string | null
}`;
}
```


---
## FILE: src/modules/plan-agent/utils/diagnostic-prompts.ts

```ts
const BLOOM_LEVELS: Record<number, { name: string; guidance: string }> = {
  1: { name: "Remember", guidance: "Ask for concise recall of a key fact, term, or step." },
  2: { name: "Understand", guidance: "Ask the learner to explain or interpret the concept in their own words." },
  3: { name: "Apply", guidance: "Ask the learner to apply the concept to a small, concrete situation." },
  4: { name: "Analyze", guidance: "Ask the learner to examine relationships, predict behavior, or diagnose a small issue." },
  5: { name: "Evaluate", guidance: "Ask the learner to judge an approach using a clear criterion or trade-off." },
  6: { name: "Create", guidance: "Ask the learner to propose a concise design or solution that uses the concept." },
};

function getBloomLevel(bloomLevel: number): { name: string; guidance: string } {
  return BLOOM_LEVELS[bloomLevel] ?? {
    name: "Unknown",
    guidance: "Ask an appropriately scoped question that checks understanding of the concept.",
  };
}

export function getDiagnosticQuestionPrompt(
  topic: string,
  conceptName: string,
  bloomLevel: number,
): string {
  const level = getBloomLevel(bloomLevel);
  return `Generate one diagnostic question for the concept: "${conceptName}".\n` +
    `The topic is "${topic}" and may be used only to disambiguate terminology if the concept name is ambiguous. ` +
    "It must not broaden the subject or introduce other concepts from the topic. Test strictly the named concept, and do not ask about advanced or related topic material; " +
    `Target Bloom's Taxonomy level ${bloomLevel} (${level.name}): ${level.guidance}\n` +
    "The question must be concise, answerable in a terminal, and assess only this concept at the requested cognitive depth. " +
    "Also provide expectedCriteria describing the essential evidence a passing answer must demonstrate. " +
    'Return only a JSON object matching exactly: { "question": string, "expectedCriteria": string }.';
}

export function getDiagnosticGradingPrompt(
  topic: string,
  conceptName: string,
  bloomLevel: number,
  question: string,
  expectedCriteria: string,
  userAnswer: string,
): string {
  const level = getBloomLevel(bloomLevel);
  return `Evaluate this learner's diagnostic response for the topic "${topic}" and concept "${conceptName}".\n` +
    `Target Bloom's Taxonomy level ${bloomLevel} (${level.name}): ${level.guidance}\n` +
    `Question: ${question}\n` +
    `Passing criteria: ${expectedCriteria}\n` +
    `Learner response: ${userAnswer}\n` +
    "Decide whether the response demonstrates mastery of the concept at the target Bloom level. Be fair: prioritize conceptual and practical accuracy over minor phrasing or formatting flaws. " +
    "Mark vague, off-topic, or non-answers as not passed. Give 1-2 concise sentences of feedback explaining why the learner passed or what key concept was missing. " +
    'Return only a JSON object matching exactly: { "passed": boolean, "feedback": string }.';
}
```


---
## FILE: src/modules/plan-agent/utils/graph-pruner.ts

```ts
import type { RawGraphNode } from "../types/graph.js";

function normalizedConceptKey(conceptName: string): string {
  return conceptName.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Retains the new learning outcomes at the requested Bloom depth and exactly
 * the prerequisite ancestors needed to reach those outcomes.
 */
export function pruneGraph(
  rawGraph: RawGraphNode[],
  targetDepth: number,
): RawGraphNode[] {
  const uniqueNodesByKey = new Map<string, RawGraphNode>();
  for (const node of rawGraph) {
    if (node.bloomLevel > targetDepth) continue;
    const key = normalizedConceptKey(node.conceptName);
    if (!uniqueNodesByKey.has(key)) uniqueNodesByKey.set(key, node);
  }
  const canonicalNamesByKey = new Map(
    [...uniqueNodesByKey].map(([key, node]) => [key, node.conceptName]),
  );
  const filteredNodes = [...uniqueNodesByKey.values()].map((node) => ({
    ...node,
    prerequisiteNames: node.prerequisiteNames.map(
      (name) => canonicalNamesByKey.get(normalizedConceptKey(name)) ?? name,
    ),
  }));
  const nodesByName = new Map(
    filteredNodes.map((node) => [node.conceptName, node]),
  );

  // A node referenced as a prerequisite has a dependent above it, so it is
  // not a finish line. The remaining nodes are sinks in the filtered graph.
  const prerequisiteNames = new Set(
    filteredNodes.flatMap((node) => node.prerequisiteNames),
  );
  const targetSinks = filteredNodes.filter(
    (node) => !prerequisiteNames.has(node.conceptName),
  );

  // Walking prerequisite edges backward from each sink yields its ancestral
  // subgraph; the visited set both deduplicates shared ancestors and stops
  // repeated traversal if malformed input contains a cycle.
  const requiredNames = new Set<string>();
  const visitingNames = new Set<string>();
  const visitAncestors = (conceptName: string): boolean => {
    if (requiredNames.has(conceptName)) {
      return true;
    }
    if (visitingNames.has(conceptName)) {
      return true;
    }

    const node = nodesByName.get(conceptName);
    if (!node) {
      return false;
    }

    visitingNames.add(conceptName);
    for (const prerequisiteName of node.prerequisiteNames) {
      if (!visitAncestors(prerequisiteName)) {
        visitingNames.delete(conceptName);
        return false;
      }
    }
    visitingNames.delete(conceptName);
    requiredNames.add(conceptName);
    return true;
  };

  for (const sink of targetSinks) {
    visitAncestors(sink.conceptName);
  }

  return breakPrerequisiteCycles(
    filteredNodes.filter((node) => requiredNames.has(node.conceptName)),
  );
}

/** Breaks prerequisite back-edges deterministically and verifies the result. */
export function breakPrerequisiteCycles(nodes: RawGraphNode[]): RawGraphNode[] {
  const graph = nodes.map((node) => ({
    ...node,
    prerequisiteNames: [...node.prerequisiteNames],
  }));
  const nodesByName = new Map(graph.map((node) => [node.conceptName, node]));
  const orderedNodes = [...graph].sort(
    (left, right) => left.bloomLevel - right.bloomLevel || left.conceptName.localeCompare(right.conceptName),
  );
  const state = new Map<string, "visiting" | "visited">();

  const visit = (node: RawGraphNode): void => {
    state.set(node.conceptName, "visiting");
    const orderedPrerequisites = [...node.prerequisiteNames].sort((leftName, rightName) => {
      const left = nodesByName.get(leftName);
      const right = nodesByName.get(rightName);
      return (left?.bloomLevel ?? Number.MAX_SAFE_INTEGER)
        - (right?.bloomLevel ?? Number.MAX_SAFE_INTEGER)
        || leftName.localeCompare(rightName);
    });

    for (const prerequisiteName of orderedPrerequisites) {
      if (state.get(prerequisiteName) === "visiting") {
        node.prerequisiteNames = node.prerequisiteNames.filter(
          (name) => name !== prerequisiteName,
        );
        continue;
      }
      const prerequisite = nodesByName.get(prerequisiteName);
      if (prerequisite && state.get(prerequisiteName) !== "visited") visit(prerequisite);
    }
    state.set(node.conceptName, "visited");
  };

  for (const node of orderedNodes) {
    if (!state.has(node.conceptName)) visit(node);
  }

  const dependents = new Map<string, string[]>();
  const unresolvedPrerequisiteCounts = new Map<string, number>();
  for (const node of graph) {
    unresolvedPrerequisiteCounts.set(node.conceptName, node.prerequisiteNames.length);
    for (const prerequisiteName of node.prerequisiteNames) {
      const currentDependents = dependents.get(prerequisiteName) ?? [];
      currentDependents.push(node.conceptName);
      dependents.set(prerequisiteName, currentDependents);
    }
  }

  const roots = graph
    .filter((node) => node.prerequisiteNames.length === 0)
    .map((node) => node.conceptName)
    .sort();
  const queue = [...roots];
  const reachable = new Set<string>();
  let processedCount = 0;
  while (queue.length > 0) {
    const conceptName = queue.shift()!;
    if (reachable.has(conceptName)) continue;
    reachable.add(conceptName);
    processedCount += 1;
    for (const dependentName of dependents.get(conceptName) ?? []) {
      const remaining = (unresolvedPrerequisiteCounts.get(dependentName) ?? 0) - 1;
      unresolvedPrerequisiteCounts.set(dependentName, remaining);
      if (remaining === 0) queue.push(dependentName);
    }
  }

  if (processedCount !== graph.length || reachable.size !== graph.length) {
    throw new Error("Prerequisite cycle breaking failed to produce a root-reachable DAG.");
  }
  return graph;
}
```


---
## FILE: src/modules/plan-agent/utils/prompt-templates.ts

```ts
/**
 * Builds the instruction that anchors graph generation in absolute mastery,
 * so later pruning can select the user's requested learning depth.
 */
export function getAbsoluteMasterySystemPrompt(topic: string): string {
  return `You are generating a prerequisite knowledge graph for the topic: "${topic}".

Assume the user wants Absolute Mastery of this topic, corresponding to Bloom's Taxonomy Level 6 (Create). Work backward from that outcome and include the atomic concepts and foundational prerequisites needed to reach it.

Return a JSON array of concept objects. Every object must have exactly these fields:
- "conceptName": a concise, distinct string naming one atomic concept
- "bloomLevel": an integer from 1 to 6 representing the mastery level for that concept
- "prerequisiteNames": an array of strings containing the exact conceptName values of its direct prerequisites in this array

Include all prerequisite concepts in the same array. Keep the graph compact and cohesive, with 15 to 28 concepts total across Bloom Levels 1 through 6, rather than producing a sprawling disconnected list. Only 1 to 3 true foundational axioms at Bloom Level 1 may have an empty "prerequisiteNames" array. Every other concept, including all non-axiom concepts at Level 1 and every concept at Level 2 or above, must name its direct prerequisites in "prerequisiteNames". Build connected, step-by-step prerequisite chains (for example: "Programming Language Fundamentals" -> "JavaScript Primitive Data Types" -> "JavaScript Control Flow" -> "JavaScript Scope" -> "Asynchronous Programming Concepts" -> "Event-Driven Architecture"). Ensure prerequisite references use exact names from the array and the relationships form a directed acyclic graph. Output strictly valid JSON only, with no markdown fences or explanatory text.`;
}
```


---
## FILE: src/server.ts

```ts
import { validateEnv } from "./config/env.js";
import { connectToDatabase } from "./config/db.js";
import app from "./app.js";

const config = validateEnv();
const PORT = config.PORT ?? "5000";

async function startServer(): Promise<void> {
  await connectToDatabase(config.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

```


---
## FILE: system_architecture_context.md

```md
# AI Educational Harness: System Architecture & Context

## 1. Project Overview
We are building a highly modular, backend-only (terminal-based) AI Educational Harness. The system operates not as a simple chat wrapper, but as an execution environment governed by cognitive and educational theories. 

The harness is divided into two primary agents:
*   **Plan Agent (Current Focus):** Diagnoses the user's intent, creates a mathematically sound curriculum graph (To-Do list), and tests the user's baseline knowledge.
*   **Learn Agent (Future Phase):** Executes the plan using Working Memory Load (WML) constraints and pedagogical gatekeeping.

**Current Objective:** We are exclusively focusing on implementing the **Plan Agent** module from scratch. All user interactions will be simulated or handled via terminal/console outputs for now, without a frontend.

## 2. Tech Stack
*   **Environment:** Node.js, Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB via Mongoose (NoSQL)
*   **LLM API:** Google Gemini (`gemini-3.1-flash-lite`). 
    *   *Crucial Constraint:* We are using the free tier. Do not use the official Google Generative AI SDK. You must make direct HTTP `POST` requests to the REST API using standard `fetch` or similar native HTTP clients.
    *   *Endpoint format:* `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`

## 3. The Plan Agent Flow
The Plan Agent follows a strict 5-step pipeline. It must not generate arbitrary lesson plans; it must construct a mathematically verifiable Directed Acyclic Graph (DAG) of prerequisites.

### Step 1: Ambiguity Check (ClarifyAgent Framework)
*   **Purpose:** Prevent the LLM from hallucinating massive graphs for vague queries like "Learn JavaScript".
*   **Mechanism:** Acts as a slot-tracker. It checks if the user's prompt defines a specific topic and a target depth (Bloom's Taxonomy Level 1-6). If ambiguous, the agent asks targeted follow-up questions in the terminal until the slots are filled.

### Step 2: Ontology Grounding (Simple)
*   **Purpose:** Establish a model-independent "Source of Truth" to prevent the LLM from inventing fake prerequisite structures.
*   **Mechanism:** A very lightweight, low-token step. The system fetches a canonical topic hierarchy (e.g., via a simple structured LLM prompt asking strictly for established domain ontology, or a mocked external fetch for now) to ground the upcoming graph generation.

### Step 3: Graph Generation (Absolute Mastery)
*   **Purpose:** Build the complete curriculum map.
*   **Mechanism:** The LLM is prompted to assume the user wants **Absolute Mastery (Bloom's Level 6)** of the topic. It works backward (Backward Chaining) to generate every prerequisite node down to foundational basics. It outputs a JSON representation of a Directed Acyclic Graph (DAG), assigning a Bloom's Taxonomy level to each node.

### Step 4: Bloom's Pruning (Ancestral Subgraph Extraction)
*   **Purpose:** Cut down the Absolute Mastery graph to match the user's actual desired depth.
*   **Mechanism:** This is pure TypeScript/Graph Theory logic, *not* an LLM call. The system filters out nodes exceeding the target Bloom level, identifies the new "Sinks" (endpoints), and removes any "Orphan" nodes that no longer lead to the target sinks.

### Step 5: Diagnostic Loop (Knowledge Space Theory)
*   **Purpose:** Determine what the user already knows to prune the graph further.
*   **Mechanism:** Using the pruned DAG (a Partially Ordered Set), the agent performs a "Binary Search"-like operation. It selects a median node and asks a diagnostic question. 
    *   If the user passes: All upstream prerequisite nodes are marked as 'Mastered'.
    *   If the user fails: All downstream dependent nodes are marked as 'Unmastered'.
    *   This loop repeats until baseline knowledge is fully mapped, and the final To-Do list is saved to MongoDB.

## 4. Development Guidelines
*   **Strict Modularization:** Separation of concerns is paramount. Every module (Ambiguity Check, Graph Generator, Pruner, DB models) must live in its own file/folder structure.
*   **Extensive Console Logging:** Because this is terminal-based, heavily use `console.log` to track the state. Output the current step, the state of the graph, entropy calculations, and LLM raw outputs to make debugging easy.
*   **Separation of LLM and DB Logic:** Do not mix Mongoose schema saving logic directly inside LLM API call functions. Extract data, parse it, and then pass it to dedicated database service files.
*   **Documentation:** Every file and major function must include comments explaining *why* it exists in the context of the educational theories mentioned above.
```


---
## FILE: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    "rootDir": "./src",
    "outDir": "./dist",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

```
