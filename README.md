We stand in solidarity with Palestine against the ongoing [genocide](https://twitter.com/A_Abdelrahman0/status/1720100566368743555) and the brutal [occupation](https://twitter.com/A_Abdelrahman0/status/1732448343639327122).

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/protibimbok)

# Django Vite Plugin

[![PyPI version](https://badge.fury.io/py/django-vite-plugin.svg)](https://badge.fury.io/py/django-vite-plugin)
[![npm version](https://img.shields.io/npm/v/django-vite-plugin)](https://www.npmjs.com/package/django-vite-plugin)
[![npm downloads](https://img.shields.io/npm/dt/django-vite-plugin)](https://www.npmjs.com/package/django-vite-plugin)
[![Licence](https://img.shields.io/npm/l/django-vite-plugin)](https://www.npmjs.com/package/django-vite-plugin)

## Introduction

[Vite](https://vitejs.dev) is a modern frontend build tool that offers a very fast development experience and bundles your code for production. This plugin sets up Vite for use with a Django backend.

## Installation

Install the Django app with pip and then install the Vite plugin via npm:

```sh
# Install the Django package
pip install django_vite_plugin

# Install the Vite plugin
npm install django-vite-plugin
```

## Feature Highlights

1. Simple and elegant  
2. Static file lookup  
3. Auto reload  
4. JavaScript import helpers  
5. JS import autocompletions  
6. Production testing

## Usage

### Django

Add `django_vite_plugin` to the `INSTALLED_APPS` list in your project's `settings.py` file:

```python
INSTALLED_APPS = [
    # Other apps
    'django_vite_plugin',
    # More apps
]
```

Use the following code in your Django templates to load assets:

```django
{% vite '<app_name>/<path>/<to>/<css>/styles.css' %}
```

To output additional attributes in the HTML, do this:

```django
{% vite '---.css' '--.js' crossorigin='anonymus' integrity='some-sha' %}
```

This produces:

```html
<link rel="stylesheet" type="text/css" crossorigin="anonymus" integrity="some-sha" href="---.css"/>
<script src="---.js" type="module" crossorigin="anonymus" integrity="some-sha"></script>
```

Notice that the `<script>` tag automatically includes `type="module"`. You may change this behavior from the settings.

Assume your `home` app has two files arranged as follows:

```bash
└── home
    └── static
        └── home
            ├── css
            │   └── styles.css
            └── js
                └── main.js
```

Your template should look like this:

```django
{% load vite %}
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Other head elements -->
    <!-- Vite dev client for hot module reload (only used in development) -->
    {% vite %}
    {% vite 'home/css/styles.css' 'home/js/main.js' %}
</head>
<body>
    <!-- Page content -->
</body>
</html>
```

Notice that instead of using `home/static/home/*/*`, we simply use `home/*/*`. By default the plugin adds `static/<app_name>` after the first segment of the path. This behavior can be adjusted via settings.

#### With React

To use React, add this in your template file:

```django
<head>
    <!-- Other head elements -->
    {% vite 'react' %}
    {% vite 'home/css/styles.css' 'home/js/main.js' %}
</head>
```

Or combine them in a single statement:

```django
<head>
    <!-- Other head elements -->
    {% vite 'react' 'home/css/styles.css' 'home/js/main.js' %}
</head>
```

### Vite

In your `vite.config.js`, include the `django-vite-plugin`:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { djangoVitePlugin } from 'django-vite-plugin'

export default defineConfig({
    plugins: [
        djangoVitePlugin([
            'home/js/app.js',
            'home/css/style.css',
        ])
    ],
});
```

The argument may be a string or an array of strings passed to `build.rollupOptions.input`.

> Note: The automatic addition of `static/<app_name>` applies here too.  
> **All entry points used with `{% vite '...' %}` must be included here.**

Run these commands in separate terminals:

```sh
# Start the Django development server
python manage.py runserver

# Start the Vite development server
npm run dev
```

For production builds, run:

```sh
npm run build
```

> Make sure you run all commands that are related to `django-vite-plugin` from the same python environment as your django project.

## Configuration

`django_vite_plugin` requires no extra configuration for development or building your project. Customizations are done in your `settings.py` file.

The default configuration is as follows:

```python
DJANGO_VITE_PLUGIN = {
    'WS_CLIENT': '@vite/client',
    'DEV_MODE': getattr(settings, 'DEBUG', True),
    'BUILD_DIR': getattr(settings, 'STATIC_ROOT') or 'static',
    'MANIFEST': '<BUILD_DIR>/.vite/manifest.json',
    'BUILD_URL_PREFIX': getattr(settings, 'STATIC_URL'),
    'JS_ATTRS': {
        'type': 'module'
    },
    'CSS_ATTRS': {
        'rel': 'stylesheet',
        'type': 'text/css'
    },
    'STATIC_LOOKUP': True
}
```

- **WS_CLIENT**: The Vite client script relative to the dev server URL. In most cases you do not need to change this.  
- **DEV_MODE**: When `True`, the Vite dev server links assets; otherwise build files are used.  
- **BUILD_DIR**: The directory where Vite outputs build assets. If you serve assets from another server (for example a CDN), keep the same structure.  
- **MANIFEST**: The path to the `manifest.json` file. The default is `<BUILD_DIR>/.vite/manifest.json` as per Vite v5. The manifest must remain in this location even if assets are served from another server.  
- **BUILD_URL_PREFIX**: The URL prefix used in production. If `DEV_MODE` is `False` then all assets listed in `<BUILD_DIR>/manifest.json` receive this prefix. Use this to specify a different server address if needed.  
- **STATIC_LOOKUP**: If enabled, the plugin inserts `static/<app_name>` after the first segment of the asset path. For example, `<app_name>/file` becomes `<app_name>/static/<app_name>/file`. Set this to `False` to disable the behavior.  
- **JS_ATTRS**: Attributes added by default to all `<script>` tags.  
- **JS_ATTRS_BUILD**: Customize JavaScript attributes for production files (for instance, adding `defer` or changing the type).  
- **CSS_ATTRS**: Attributes added by default to all `<link rel="stylesheet">` tags.

### Javascript Options

The JavaScript configuration options include:

```typescript
{
    input: string | string[],
    root?: string,
    addAliases?: boolean,
    pyPath?: string,
    pyArgs?: string[],
    reloader?: boolean | (file: string) => boolean,
    watch?: string[],
    delay?: number,
}
```

- **input**: The entry points for JavaScript/CSS. Every file used with `{% vite '...' %}` should be listed here.  
- **root**: The relative path from your `vite.config.js` to your project root. If they are the same, you can omit this.  
- **addAliases**: Determines whether to add the aliases `@s:<app>` and `@t:<app>` in `jsconfig.json`. If set to `true`, the file is created if it does not exist. The default is to add aliases only if `jsconfig.json` already exists.  
- **pyPath**: The path to your Python executable (default is `python`).  
- **pyArgs**: Additional arguments for `manage.py` commands.  
- **reloader**: Enables browser reload when HTML or Python files change. You may supply a function to check file changes. The default behavior checks for `.html` and `.py` files.  
- **watch**: A list of extra files to monitor for browser reload. By default, the plugin detects changes in Python files within your apps.  
- **delay**: The delay in milliseconds before reloading after a file change.

Suppose your `vite.config.js` is inside a `frontend` directory and your project structure is:

```bash
|-- home
|   └-- static
|       └-- home
|           ├── css
|           │   └── styles.css
|           └── js
|               └── main.js
└-- frontend
    └-- vite.config.js
```

Your `vite.config.js` would then be:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { djangoVitePlugin } from 'django-vite-plugin'

export default defineConfig({
    plugins: [
        djangoVitePlugin({
            input: [
                // Your entry points
            ],
            root: '..' // The parent directory
        })
    ],
});
```

## Features

### 1. Simple and Elegant

You do not need a separate setup to use Vite. Install the packages, add the configurations, and you are ready to go.

### 2. Static File Lookup

Django recommends placing static files and templates in `app_name/static/app_name` and `app_name/templates/app_name`. When `STATIC_LOOKUP` is enabled, you can skip the `static/app_name` part in import paths.

For example, instead of writing:

```django
{% vite 'app_name/static/app_name/path/to/asset' %}
```

You write:

```django
{% vite 'app_name/path/to/asset' %}
```

The behavior of this setting is as follows:

| Vite Argument             | Resulting Asset Path                  |
|---------------------------|---------------------------------------|
| app_name/script.js        | app_name/static/app_name/script.js    |
| app_name/static/script.js | app_name/static/script.js             |
| static/script.js          | static/script.js                      |

To disable this behavior, set `STATIC_LOOKUP` to `False`.

> Note: This feature uses Django's built-in static file finder.

### 3. Auto Reload

The plugin automatically reloads your browser whenever a relevant file is changed.

### 4. JS Import Helpers

Similar to STATIC_LOOKUP, helpers are available for JavaScript imports. Vite's alias feature is used under the hood. The default aliases are:

| Alias         | Maps to                         |
|---------------|---------------------------------|
| @             | &lt;project root&gt;            |
| @s:<app_name> | <app_path>/static/<app_name>     |
| @t:<app_name> | <app_path>/templates/<app_name>  |

If you set `STATIC_LOOKUP` to `False`, the aliases change as follows:

| Alias         | Maps to                    |
|---------------|----------------------------|
| @             | &lt;project root&gt;       |
| @s:<app_name> | <app_path>/static          |
| @t:<app_name> | <app_path>/templates       |

### 5. JS Import Autocompletions

Enable autocompletions for these import aliases in IDEs that support `jsconfig.json`. Simply add a `jsconfig.json` file in your project's root or alongside `vite.config.js`.

If you use TypeScript, the paths are added automatically when you run the development command.

### 6. Production Testing

To verify that your build files work before deploying to production:

1. In your project's `urls.py`, add:

    ```python
    urlpatterns = [
        # Other URL patterns
        path('', include('django_vite_plugin.urls')),
        # More URL patterns
    ]
    ```

2. In `settings.py`, configure:

    ```python
    STATICFILES_DIRS = [
        BASE_DIR / 'build'
    ]

    DJANGO_VITE_PLUGIN = {
        # Other options
        'DEV_MODE': False,
        'BUILD_DIR': 'build'
    }
    ```

    Replace `build` with your build directory. Ensure this directory is different from `STATIC_ROOT` if it is set.

3. If your `BUILD_URL_PREFIX` contains `http://` or `https://`, comment it out.

4. Run `npm run build` to build your assets and enjoy the results.
