#
# BUILD ALL JS AND CSS FILES FOR ./build/
#

dev:
	rm -rf ./build/
	mkdir -p build
	cat ./repos/baf/css/baf.css ./js-css/style.css ./js-css/popover.css > ./build/style.css
	cat ./repos/majaX.js/majax.js ./repos/jsHashes/hashes.js ./repos/lightbox.js/tinybox.js ./js-css/script.js > ./build/script.js

#
# BUILDS AND COMPRESS ALL JS AND CSS FILES FOR ./build/
#

min:
	rm -rf ./build/
	mkdir -p build
	sudo sh ./buildjs.sh
	sudo sh ./juicer.sh
