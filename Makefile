
# Variables.
DUO = node_modules/.bin/duo --quiet --copy
MYTH = node_modules/.bin/myth

# Install Plato on your machine.
install: node_modules
	@npm link
	@echo
	@echo "\x1B[97m  plato \x1B[90m·\x1B[39m Successfully installed Plato!"
	@echo "\x1B[97m        \x1B[90m·\x1B[39m Run \`plato\` for a list of commands."
	@echo

# Install node modules with npm.
node_modules: package.json
	@npm install
	@touch node_modules

# Build Javascript and CSS.
support: support/index.js support/index.css

# Build Javascript files with Duo.
support/%.js: node_modules index.js $(shell find client -name '*.js')
	@$(DUO) --output support index.js > $@

# Build CSS files with Duo and Myth.
support/%.css: node_modules index.css $(shell find client)
	@$(DUO) --output support index.css | $(MYTH) > $@

# Preview the test blog.
test: support node_modules
	@bin/plato preview --directory test --rebuild

# Build the test blog.
test-build: support node_modules
	@bin/plato build --directory test

# Phony targets.
.PHONY: install
.PHONY: test