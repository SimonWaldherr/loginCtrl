#[loginCtrl](https://github.com/SimonWaldherr/loginCtrl)

##loginCtrl install process

###1. download script

download the repo with all submodules.

###2. rename files (mysql/sqlite)

in the folders ```/confirm/``` and ```/database/``` are the files ```mysql.php``` and ```sqlite.php```, you can choose wich database type you want to use by renaming the respective files to ```index.php```.

###3. *```mysql``` database config*

if you use mysql, you have to configurate the file ```mysql-config.php``` in the ```/database/``` dir.

###4. upload script

upload all files to your server.

###5. *```sqlite``` database file chmod*

if you use sqlite as database, change the chmod privileges of the sqlite file in ```/database/sqlite/user.sqlite```.
