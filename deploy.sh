workingdir=$1
repository=$2
ref=$3
echo "/* "
echo " * deploy.sh script"
echo " * "
echo " * Directory: $workingdir"
echo " * Repository: $repository"
echo " * Ref: $ref"
echo " */ "
echo " "
echo " "

# echo "[START] createBuildFile"
# node "$workingdir/Scripts/createBuildFile.js"
# ret=$?
# if [ $ret -ne 0 ]; then
#     echo "##ERROR[Could not create buildFile]"
#     exit 2;
# fi
# echo "[COMPLETED] createBuildFile"


echo "[START] Build Demo app"
cd "$workingdir"
npm ci
ret=$?
if [ $ret -ne 0 ]; then
    echo "##ERROR[npm ci failed with code $ret]"
    exit 2;
fi

npm run build
ret=$?
if [ $ret -ne 0 ]; then
    echo "##ERROR[npm run build failed with code $ret]"
    exit 2;
fi

echo "[COMPLETED] Build Demo app"

# echo "[START] Stop Service (kestrel-dlid001-api-dlid.service)"
# systemctl stop kestrel-dlid001-api-dlid.service
# ret=$?
# if [ $ret -ne 0 ]; then
#     echo "##ERROR[stop api.dlid.se service failed with code $ret]"
#     exit 2;
# fi
# echo "[COMPLETED] Stop Service (kestrel-dlid001-api-dlid.service)"


echo "[START] Copy ng-common.dlid.se files"
cp -vr "$workingdir/dist/ng-common-demo/." /var/www/ng-common.dlid.se/public_html/
ret=$?
if [ $ret -ne 0 ]; then
    echo "##ERROR[cp exited with code $ret]"
    exit 2;
fi
echo "[COMPLETED] Copy ng-common.dlid.se files"


echo "[START] Copy ng-common.dlid.se .htaccess file"
mv "$workingdir/projects/ng-common-demo/.htaccess" /var/www/ng-common.dlid.se/public_html/.htaccess
ret=$?
if [ $ret -ne 0 ]; then
    echo "##ERROR[mv exited with code $ret]"
    exit 2;
fi
echo "[COMPLETED] Copy ng-common.dlid.se .htaccess file"


# echo "[START] updateAppSettingsBuildDate.js"
# node "$workingdir/Scripts/updateAppSettingBuildDate.js" /var/www/api.dlid.se/public_html/appsettings.Production.json /var/www/apps.dlid.se/public_html/index.html
# ret=$?
# if [ $ret -ne 0 ]; then
#     echo "##ERROR[node exited with code $ret]"
#     exit 2;
# fi
# echo "[COMPLETED] updateAppSettingsBuildDate.js"


# echo "[START] Start service (kestrel-dlid001-api-dlid.service)"
# systemctl start kestrel-dlid001-api-dlid.service
# ret=$?
# if [ $ret -ne 0 ]; then
#     echo "##ERROR[systemctl exited with code $ret]"
#     exit 2;
# fi
# echo "[COMPLETED] Start service (kestrel-dlid001-api-dlid.service)"


echo " "
echo "Deploy script ended"
