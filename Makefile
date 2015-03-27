
# Variables.
BIN = ./node_modules/.bin
DUO = $(BIN)/duo --quiet --copy
METALSMITH = node build.js
MYTH = $(BIN)/myth
HTMLLINT = $(BIN)/nu-html-checker

# Build Javascript and CSS.
support: support/index.js support/index.css

# Build Javascript files with Duo.
support/%.js: index.js $(shell find client -name '*.js')
	@$(DUO) --stdout index.js > $@

# Build CSS files with Duo and Myth.
support/%.css: index.css $(shell find client -name '*.css')
	@$(DUO) --stdout index.css | $(MYTH) > $@

# Install node modules with npm.
node_modules: package.json
	@npm install
	@touch node_modules

# Preview the test blog.
test: build node_modules
	@cd test & bin/plato preview