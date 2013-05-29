#
# BUILD ALL JS AND CSS FILES FOR ./build/
#

dev:
	rm -rf ./build/
	mkdir -p build
	cat ./js-css/info.txt ./repos/baf/css/baf.css ./js-css/style.css ./js-css/popover.css > ./build/style.css
	cat ./js-css/info.txt ./repos/majaX.js/majax.js ./js-css/space.js ./repos/jsHashes/hashes.js ./js-css/space.js ./repos/lightbox.js/tinybox.js ./js-css/space.js ./js-css/script.js > ./build/script.js

#
# BUILDS AND COMPRESS ALL JS AND CSS FILES FOR ./build/
#

min:
	rm -rf ./build/
	mkdir -p build
	sudo sh ./buildjs.sh
	sudo sh ./juicer.sh
	cat ./js-css/info.txt ./build/script.pre.js > ./build/script.js
	cat ./js-css/info.txt ./build/style.pre.css > ./build/style.css
	rm -rf ./build/script.pre.js
	rm -rf ./build/style.pre.css
