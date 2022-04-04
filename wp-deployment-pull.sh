#!/bin/bash

serverRootRemote=/home/monikazi
webRootRelativeRemote=www/www.wink.ch/staging2
wpContentFolderLocationLocal=wp-app/wp-content

migrationDbDumpFolderLocationLocal=migration
domainNameProduction=https://www.wink.ch/staging2
migrationDbDumpFolderLocationRemote=${serverRootRemote}/${webRootRelativeRemote}/migration
prodServerSsh=monikazi@wink.ch

wp-files_sync_plugins() {

    echo "******* Do you wish to create Zip Archive from plugins Folder and download it?"
    SCRIPT="cd ${webRootRelativeRemote}/wp-content; zip -r plugins.zip plugins"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            ssh ${prodServerSsh} "${SCRIPT}"
            scp ${prodServerSsh}:${serverRootRemote}/${webRootRelativeRemote}/wp-content/plugins.zip ${wpContentFolderLocationLocal}
            break
            ;;
        No) break ;;
        esac
    done
    if test -f "${wpContentFolderLocationLocal}/plugins.zip"; then
        echo "******* plugins.zip exists. ********"
        unzip ${wpContentFolderLocationLocal}/plugins.zip -d ./${wpContentFolderLocationLocal}
    else
        echo "******* could not download plugins.zip. ********"
    fi

}

wp-files_sync_uploads() {

    echo "******* Do you wish to create Zip Archive from uploads Folder and download it?"
    SCRIPT="cd ${webRootRelativeRemote}/wp-content; zip -r uploads.zip uploads"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            ssh ${prodServerSsh} "${SCRIPT}"
            scp ${prodServerSsh}:${serverRootRemote}/${webRootRelativeRemote}/wp-content/uploads.zip ${wpContentFolderLocationLocal}
            break
            ;;
        No) break ;;
        esac
    done
    if test -f "${wpContentFolderLocationLocal}/uploads.zip"; then
        echo "******* uploads.zip exists. ********"
        unzip ${wpContentFolderLocationLocal}/uploads.zip -d ./${wpContentFolderLocationLocal}
    else
        echo "******* could not download uploads.zip. ********"
    fi

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
    echo "******* Do you wish to export db-dump to ${migrationDbDumpFolderLocationRemote}/export.sql.gz File and download it?"
    SCRIPT="cd ${migrationDbDumpFolderLocationRemote}
            php ${serverRootRemote}/wp-cli.phar db export --add-drop-table - | gzip >${migrationDbDumpFolderLocationRemote}/export.sql.gz"
    select yn in "Yes" "No"; do
        case $yn in
        Yes)
            ssh ${prodServerSsh} "${SCRIPT}"
            scp ${prodServerSsh}:${migrationDbDumpFolderLocationRemote}/export.sql.gz ${migrationDbDumpFolderLocationLocal}

            break
            ;;
        No) break ;;
        esac
    done
    if test -f "${migrationDbDumpFolderLocationLocal}/export.sql.gz"; then
        echo "******* db dump file export.sql.gz exists. ********"

        echo "******* Do you wish to extract db-dump export.sql.gz and import it to database (incl. search replace domain)?"
        select yn in "Yes" "No"; do
            case $yn in
            Yes)
                gunzip -k ${migrationDbDumpFolderLocationLocal}/export.sql.gz
                docker-compose run --rm wpcli db query <${migrationDbDumpFolderLocationLocal}/export.sql
                docker-compose run --rm wpcli search-replace ${domainNameProduction} 'http://localhost' --all-tables --skip-plugins --skip-packages --verbose --skip-columns=guid --skip-tables=wp_users
                rm ${migrationDbDumpFolderLocationLocal}/export.sql
                break
                ;;
            No) exit ;;
            esac
        done

    else

        echo "******* Could not create db dump file export.sql.gz. ********"
    fi

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
