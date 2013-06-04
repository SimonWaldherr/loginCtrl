#
# BUILD ALL JS AND CSS FILES FOR ./build/
#

dev:
	rm -rf ./release/build/
	mkdir -p release/build
	mkdir -p release/config
	mkdir -p release/confirm
	mkdir -p release/database
	mkdir -p release/database/sqlite
	mkdir -p release/img
	mkdir -p release/repos
	mkdir -p release/repos/easySQL
	mkdir -p release/repos/easySQL/examples
	mkdir -p release/repos/smtpclass
	mkdir -p release/salt
	cp ./config/config.php ./release/config/config.php
	cp ./confirm/index.php ./release/confirm/index.php
	cp ./confirm/mysql.php ./release/confirm/mysql.php
	cp ./confirm/sqlite.php ./release/confirm/sqlite.php
	cp ./database/mysql-config.php ./release/database/mysql-config.php
	cp ./database/mysql.php ./release/database/mysql.php
	cp ./database/sqlite.php ./release/database/sqlite.php
	cp ./database/sqlite/user.sqlite ./release/database/sqlite/user.sqlite
	cp ./database/sqlite/.htaccess ./release/database/sqlite/.htaccess
	cp ./salt/index.php ./release/salt/index.php
	cp ./repos/easySQL/easysql_mysql.php ./release/repos/easySQL/easysql_mysql.php
	cp ./repos/easySQL/easysql_postgesql.php ./release/repos/easySQL/easysql_postgresql.php
	cp ./repos/easySQL/easysql_sqlite.php ./release/repos/easySQL/easysql_sqlite.php
	cp ./repos/easySQL/mysql-config.php ./release/repos/easySQL/easysql-config.php
	cp ./repos/easySQL/examples/crypto.php ./release/repos/easySQL/examples/crypto.php
	cp ./repos/smtpclass/SendEmail.php ./release/repos/smtpclass/SendEmail.php
	cp ./checkuserinput.inc.php ./release/checkuserinput.inc.php
	cp ./example.php ./release/example.php
	cp ./gravatar.php ./release/gravatar.php
	cp ./sendmail.php ./release/sendmail.php
	cp ./session.inc.php ./release/session.inc.php
	cat ./js-css/info.txt ./repos/BaF-Framework/css/baf.css ./js-css/style.css ./js-css/popover.css > ./release/build/style.css
	cat ./js-css/info.txt ./repos/majaX.js/majax.js ./js-css/space.js ./repos/cryptofoo/cryptofoo.js ./js-css/space.js ./repos/lightbox.js/tinybox.js ./js-css/space.js ./js-css/script.js > ./release/build/script.js
	chmod 755 release/*

#
# BUILDS AND COMPRESS ALL JS AND CSS FILES FOR ./build/
#

min:
	rm -rf ./release/build/
	mkdir -p release/build
	mkdir -p release/config
	mkdir -p release/confirm
	mkdir -p release/database
	mkdir -p release/database/sqlite
	mkdir -p release/img
	mkdir -p release/repos
	mkdir -p release/repos/easySQL
	mkdir -p release/repos/easySQL/examples
	mkdir -p release/repos/smtpclass
	mkdir -p release/salt
	cp ./config/config.php ./release/config/config.php
	cp ./confirm/index.php ./release/confirm/index.php
	cp ./confirm/mysql.php ./release/confirm/mysql.php
	cp ./confirm/sqlite.php ./release/confirm/sqlite.php
	cp ./database/mysql-config.php ./release/database/mysql-config.php
	cp ./database/mysql.php ./release/database/mysql.php
	cp ./database/sqlite.php ./release/database/sqlite.php
	cp ./database/sqlite/user.sqlite ./release/database/sqlite/user.sqlite
	cp ./database/sqlite/.htaccess ./release/database/sqlite/.htaccess
	cp ./salt/index.php ./release/salt/index.php
	cp ./repos/easySQL/easysql_mysql.php ./release/repos/easySQL/easysql_mysql.php
	cp ./repos/easySQL/easysql_postgesql.php ./release/repos/easySQL/easysql_postgresql.php
	cp ./repos/easySQL/easysql_sqlite.php ./release/repos/easySQL/easysql_sqlite.php
	cp ./repos/easySQL/mysql-config.php ./release/repos/easySQL/easysql-config.php
	cp ./repos/easySQL/examples/crypto.php ./release/repos/easySQL/examples/crypto.php
	cp ./repos/smtpclass/SendEmail.php ./release/repos/smtpclass/SendEmail.php
	cp ./checkuserinput.inc.php ./release/checkuserinput.inc.php
	cp ./example.php ./release/example.php
	cp ./gravatar.php ./release/gravatar.php
	cp ./sendmail.php ./release/sendmail.php
	cp ./session.inc.php ./release/session.inc.php
	sudo sh ./buildjs.sh
	sudo sh ./juicer.sh
	cat ./js-css/info.txt ./release/build/script.pre.js > ./release/build/script.js
	cat ./js-css/info.txt ./release/build/style.pre.css > ./release/build/style.css
	rm -rf ./release/build/script.pre.js
	rm -rf ./release/build/style.pre.css
	chmod 755 release/*
