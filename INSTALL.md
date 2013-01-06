#[loginCtrl](https://github.com/SimonWaldherr/loginCtrl)

##loginCtrl install process

###1. download script

download the repo with all submodules.
the best way to do this is:

```bash
git clone git://github.com/jquery/jquery.git
```

###2. rename files (mysql/sqlite)

in the folders ```/confirm/``` and ```/database/``` are the files ```mysql.php``` and ```sqlite.php```, you can choose which database type you want to use by renaming the respective files to ```index.php```.

###3. *```mysql``` database config*

if you use mysql, you have to configure the file ```mysql-config.php``` in the ```/database/``` dir.

###4. sendmail config

to allow loginCtrl Script to send emails you have to configure the ```sendmail.php``` file.

###5. upload script

upload all files to your server.

###6. *```sqlite``` database file chmod*

if you use sqlite as database, change the chmod privileges of the sqlite file in ```/database/sqlite/user.sqlite``` to 0600 or higher.

```bash
chmod 0600 path/to/script/database/sqlite/user.sqlite
```
