#!/bin/bash

serverRootRemote=/home/monikazi
webRootRelativeRemote=www/www.wink.ch/staging2
wpContentFolderLocationLocal=wp-app/wp-content

migrationDbDumpFolderLocationLocal=migration
domainNameProduction=https://www.wink.ch/staging2
migrationDbDumpFolderLocationRemote=${serverRootRemote}/${webRootRelativeRemote}/migration
prodServerSsh=monikazi@wink.ch

wp-files_sync_plugins() {

    echo "******* Do you wish to create Zip Archive from plugins Folder?"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            cd ${wpContentFolderLocationLocal}/plugins
            zip -r ../plugins.zip plugins
            cd ../../../
            break
            ;;
        No) break ;;
        esac
    done
    if test -f "${wpContentFolderLocationLocal}/plugins.zip"; then
        echo "******* plugins.zip exists. ********"

    else
        echo "******* could not create plugins.zip. ********"
    fi

    echo "******* Do you wish to upload the plugins.zip File to Production Server and extract it?"
    SCRIPT="cd ${webRootRelativeRemote}/wp-content; unzip plugins.zip"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            scp ${wpContentFolderLocationLocal}/plugins.zip ${prodServerSsh}:${serverRootRemote}/${webRootRelativeRemote}/wp-content
            ssh ${prodServerSsh} "${SCRIPT}"
            break
            ;;
        No) break ;;
        esac
    done
}

wp-files_sync_uploads() {
    echo "******* Do you wish to create Zip Archive from uploads Folder?"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            cd ${wpContentFolderLocationLocal}
            zip -r uploads.zip uploads
            cd ../../
            break
            ;;
        No) break ;;
        esac
    done
    if test -f "${wpContentFolderLocationLocal}/uploads.zip"; then
        echo "******* uploads.zip exists. ********"

    else
        echo "******* could not create uploads.zip. ********"
    fi
    echo "******* Do you wish to upload the uploads.zip File to Production Server and extract it?"
    SCRIPT="cd ${webRootRelativeRemote}/wp-content; unzip uploads.zip"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            scp ${wpContentFolderLocationLocal}/uploads.zip ${prodServerSsh}:${serverRootRemote}/${webRootRelativeRemote}/wp-content
            ssh ${prodServerSsh} "${SCRIPT}"
            break
            ;;
        No) break ;;
        esac
    done

}

wp-files_sync() {
    echo "******* Do you wish to sync Uploads Folder?"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            wp-files_sync_uploads
            break
            ;;
        No) break ;;
        esac
    done
    echo "******* Do you wish to sync Plugins Folder?"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            wp-files_sync_plugins
            break
            ;;
        No) exit ;;
        esac
    done
}

wp-database_sync() {
    echo "******* Do you wish to export db-dump to ${migrationDbDumpFolderLocationLocal}/export.sql.gz File?"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            docker-compose run --rm wpcli db export --add-drop-table - | gzip >${migrationDbDumpFolderLocationLocal}/export.sql.gz
            break
            ;;
        No) break ;;
        esac
    done
    if test -f "${migrationDbDumpFolderLocationLocal}/export.sql.gz"; then
        echo "******* db dump file export.sql.gz exists. ********"

    else
        echo "******* Could not create db dump file export.sql.gz. ********"
    fi
    echo "******* Do you wish to upload db-dump export.sql.gz to Production Server?"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            scp ${migrationDbDumpFolderLocationLocal}/export.sql.gz ${prodServerSsh}:${migrationDbDumpFolderLocationRemote}
            break
            ;;
        No) break ;;
        esac
    done
    echo "******* Do you wish to import db-dump to DB on Production Server?"
    SCRIPT="gunzip -k ${migrationDbDumpFolderLocationRemote}/export.sql.gz;
    cd ${migrationDbDumpFolderLocationRemote}
    php ${serverRootRemote}/wp-cli.phar db import export.sql
    php ${serverRootRemote}/wp-cli.phar search-replace 'http://localhost' '${domainNameProduction}' --skip-columns=guid --skip-tables=wp_users
    rm export.sql
    "
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            ssh ${prodServerSsh} "${SCRIPT}"
            break
            ;;
        No) exit ;;
        esac
    done

}

echo "******* Do you wish to sync Database?"
select yn in "Yes" "No"; do
    case $yn in
    Yes)
        wp-database_sync
        break
        ;;
    No) break ;;
    esac
done

echo "******* Do you wish to sync Zip Files (uploads, plugins)?"
select yn in "Yes" "No"; do
    case $yn in
    Yes)
        wp-files_sync
        break
        ;;
    No) exit ;;
    esac
done
