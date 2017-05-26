
.PHONY: setup clean lint

all: setup clean build

setup:
	@echo -e '\033[1;30mInstall prerequisites\033[0m'
	@if [ -z $$(which node) ] ; then echo 'Abort: You need `node` to build ngx-store. Try `sudo man apt-get install nodejs nodejs-legacy`'; exit 1; fi
	@if [ -z $$(which npm) ] ; then echo 'Abort: You need `npm` to build ngx-store. See: https://www.npmjs.com/'; exit 1; fi
	@npm install

clean:
	@echo -e '\033[1;30mCleaning up\033[0m'
	@rm -rf dist

lint:
	@npm run lint

build:
	@npm run tsc
