app=dbmicrows
notes="$app for ACCS"
identityDomain=gse00000363
credentials="cloud.admin:myopiC@0RigoR"
#identityDomain=deoracle69725
#credentials="peter.doschkinow@oracle.com:***"
#endpoint=https://apaas.us.oraclecloud.com/paas/service/apaas/api/v1.1/apps
endpoint=https://apaas.europe.oraclecloud.com/paas/service/apaas/api/v1.1/apps

case $1 in
create)
    # create app archive
    tar -czvf $app.tar.gz manifest.json -C .. drawingboard node_modules package.json main.js
    # create container
    curl -v -i -X PUT -u $credentials \
    https://$identityDomain.storage.oraclecloud.com/v1/Storage-$identityDomain/$app
    # put archive in storage container
    curl -v -i -X PUT -u $credentials \
        https://$identityDomain.storage.oraclecloud.com/v1/Storage-$identityDomain/$app/$app.tar.gz \
        -T $app.tar.gz
    # create app
    curl -v -X POST -u $credentials \
        -H "X-ID-TENANT-NAME:$identityDomain" \
        -H "Content-Type: multipart/form-data" \
        -F "name=$app" -F "runtime=node" -F "subscription=Monthly" \
        -F "deployment=@deployment.json" \
        -F "archiveURL=$app/$app.tar.gz" -F "notes=$notes"  \
        $endpoint/$identityDomain
    rm $app.tar.gz
    ;;

update)
    tar -czvf $app.tar.gz manifest.json -C .. drawingboard node_modules package.json main.js
    curl -v -i -X PUT -u $credentials \
        https://$identityDomain.storage.oraclecloud.com/v1/Storage-$identityDomain/$app/$app.tar.gz \
        -T $app.tar.gz
    curl -v -X PUT -u $credentials \
        -H "X-ID-TENANT-NAME:$identityDomain" \
        -H "Content-Type: multipart/form-data" \
        -F "deployment=@deployment.json" \
        -F "archiveURL=$app/$app.tar.gz" -F "notes=$notes"  \
        $endpoint/$identityDomain/$app
    rm $app.tar.gz
    ;;

update-config)
    curl -X PUT -u $credentials \
        -H "X-ID-TENANT-NAME:$identityDomain" \
        -H "Content-Type: multipart/form-data" \
        -F "deployment=@deployment.json" \
        -F "notes=$notes"  \
        $endpoint/$identityDomain/$app
    ;;

delete)
    curl -X DELETE -u $credentials \
        -H "X-ID-TENANT-NAME:$identityDomain" \
        $endpoint/$identityDomain/$app
    ;;
esac
