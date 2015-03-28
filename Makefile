
# Variables.
DUO = node_modules/.bin/duo --quiet --copy
MYTH = node_modules/.bin/myth

# Build Javascript and CSS.
support: support/index.js support/index.css

# Build Javascript files with Duo.
support/%.js: index.js $(shell find client -name '*.js')
	@$(DUO) --output support --stdout index.js > $@

# Build CSS files with Duo and Myth.
support/%.css: index.css $(shell find client)
	@$(DUO) --output support --stdout index.css | $(MYTH) > $@

# Install node modules with npm.
node_modules: package.json
	@npm install
	@touch node_modules

# Preview the test blog.
test: support node_modules
	@bin/plato preview --directory test --rebuild

# Build the test blog.
test-build: support node_modules
	@bin/plato build --directory test

# Phony targets.
.PHONY: test