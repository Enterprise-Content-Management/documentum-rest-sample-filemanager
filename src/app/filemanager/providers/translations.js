(function(angular) {
    'use strict';
    angular.module('dctmNgFileManager').config(['$translateProvider', function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy(null);

        $translateProvider.translations('en', {
            filemanager: 'File Manager',
            language: 'Language',
            english: 'English',
            spanish: 'Spanish',
            portuguese: 'Portuguese',
            french: 'French',
            german: 'German',
            hebrew: 'Hebrew',
            slovak: 'Slovak',
            chinese:'中文',
            confirm: 'Confirm',
            cancel: 'Cancel',
            close: 'Close',
            upload_files: 'Upload files',
            files_will_uploaded_to: 'Files will be uploaded to',
            select_files: 'Select files',
            uploading: 'Uploading',
            permissions: 'Permissions',
            select_destination_folder: 'Select the destination folder',
            source: 'Source',
            destination: 'Destination',
            copy_file: 'Copy file',
            sure_to_delete: 'Are you sure to delete',
            change_name_move: 'Change name / move',
            enter_new_name_for: 'Enter new name for',
            extract_item: 'Extract item',
            extraction_started: 'Extraction started in a background process',
            compression_started: 'Compression started in a background process',
            enter_folder_name_for_extraction: 'Enter the folder name for the extraction of',
            enter_file_name_for_compression: 'Enter the file name for the compression of',
            toggle_fullscreen: 'Toggle fullscreen',
            edit_file: 'Edit file',
            file_content: 'File content',
            loading: 'Loading',
            filter: 'Filter results',
            search: 'Search',
            create_folder: 'Create folder',
            create: 'Create',
            folder_name: 'Folder name',
            upload: 'Upload',
            change_permissions: 'Change permissions',
            change: 'Change',
            details: 'Details',
            icons: 'Icons',
            list: 'List',
            name: 'Name',
            size: 'Size',
            actions: 'Actions',
            date: 'Date',
            no_files_in_folder: 'No files in this folder',
            no_folders_in_folder: 'This folder not contains children folders',
            select_this: 'Select this',
            go_back: 'Go back',
            wait: 'Wait',
            move: 'Move',
            download: 'Download',
            view_item: 'View item',
            remove: 'Delete',
            edit: 'Edit',
            copy: 'Copy',
            rename: 'Rename',
            extract: 'Extract',
            compress: 'Compress',
            error_authenticating: 'An error occurred authenticating the user',
            error_getting_home_document: 'An error occurred getting home document',
            error_getting_repository_list: 'An error occurred getting repository list',
            error_getting_root_cabinets: 'An error occurred getting cabinets',
            error_getting_folder_children: 'An error occurred getting folder children',
            error_creating_folder: 'An error occurred creating a new folder',
            error_renaming_object: 'An error occurred renaming an object',
            error_executing_search: 'An error occurred executing simple full-text search',
            error_uploading_content: 'An error occurred uploading a contentful object',
            error_deleting_object: 'An error occurred deleting an object',
            error_downloading_content: 'An error occurred downloading content',
            error_editing_content: 'An error occurred editing content',
            error_copying_object: 'An error occurred copying an object',
            error_moving_object: 'An error occurred moving an object',
            error_invalid_filename: 'Invalid filename or already exists, specify another name',
            error_compressing: 'An error occurred compressing the file or folder',
            error_extracting: 'An error occurred extracting the file',
            error_changing_perms: 'An error occurred changing the permissions of the file',
            sure_to_start_compression_with: 'Are you sure to compress',
            owner: 'Owner',
            group: 'Group',
            others: 'Others',
            read: 'Read',
            write: 'Write',
            exec: 'Exec',
            original: 'Original',
            changes: 'Changes',
            recursive: 'Recursive',
            preview: 'Item preview',
            open: 'Open',
            these_elements: 'these {{total}} elements',
            new_folder: 'New folder',
            sign_in: 'Sign In',
            sign_out: 'Sign Out',
            rootcontext: 'REST Services',
            repository: 'Repository',
            username: 'Login Name',
            password: 'Password'
        });

        $translateProvider.translations('he', {
            filemanager: 'מנהל קבצים',
            language: 'שפה',
            english: 'אנגלית',
            spanish: 'ספרדית',
            portuguese: 'פורטוגזית',
            french: 'צרפתית',
            german: 'גרמנית',
            hebrew: 'עברי',
            slovak: 'סלובקי', 
            chinese:'中文',           
            confirm: 'אשר',
            cancel: 'בטל',
            close: 'סגור',
            upload_files: 'העלה קבצים',
            files_will_uploaded_to: 'הקבצים יעלו ל',
            select_files: 'בחר קבצים',
            uploading: 'מעלה',
            permissions: 'הרשאות',
            select_destination_folder: 'בחר תיקיית יעד',
            source: 'מקור',
            destination: 'יעד',
            copy_file: 'העתק קובץ',
            sure_to_delete: 'האם אתה בטוח שברצונך למחוק',
            change_name_move: 'שנה שם / הזז',
            enter_new_name_for: 'הקלד שם חדש עבור',
            extract_item: 'חלץ פריט',
            extraction_started: 'תהליך החילוץ מתבצע ברקע',
            compression_started: 'תהליך הכיווץ מתבצע ברקע',
            enter_folder_name_for_extraction: 'הקלד שם תיקייה לחילוץ עבור',
            enter_file_name_for_compression: 'הזן את שם הקובץ עבור הדחיסה של',
            toggle_fullscreen: 'הפעל/בטל מסך מלא',
            edit_file: 'ערוך קובץ',
            file_content: 'תוכן הקובץ',
            loading: 'טוען',
            filter: 'לְסַנֵן',
            search: 'חפש',
            create_folder: 'צור תיקייה',
            create: 'צור',
            folder_name: 'שם תיקייה',
            upload: 'העלה',
            change_permissions: 'שנה הרשאות',
            change: 'שנה',
            details: 'פרטים',
            icons: 'סמלים',
            list: 'רשימה',
            name: 'שם',
            size: 'גודל',
            actions: 'פעולות',
            date: 'תאריך',
            no_files_in_folder: 'אין קבצים בתיקייה זו',
            no_folders_in_folder: 'התיקייה הזו אינה כוללת תתי תיקיות',
            select_this: 'בחר את זה',
            go_back: 'חזור אחורה',
            wait: 'חכה',
            move: 'הזז',
            download: 'הורד',
            view_item: 'הצג פריט',
            remove: 'מחק',
            edit: 'ערוך',
            copy: 'העתק',
            rename: 'שנה שם',
            extract: 'חלץ',
            compress: 'כווץ',
            error_invalid_filename: 'שם קובץ אינו תקין או קיים, ציין שם קובץ אחר',
            error_modifying: 'התרחשה שגיאה בעת שינוי הקובץ',
            error_deleting: 'התרחשה שגיאה בעת מחיקת הקובץ או התיקייה',
            error_renaming: 'התרחשה שגיאה בעת שינוי שם הקובץ',
            error_copying: 'התרחשה שגיאה בעת העתקת הקובץ',
            error_compressing: 'התרחשה שגיאה בעת כיווץ הקובץ או התיקייה',
            error_extracting: 'התרחשה שגיאה בעת חילוץ הקובץ או התיקייה',
            error_creating_folder: 'התרחשה שגיאה בעת יצירת התיקייה',
            error_getting_content: 'התרחשה שגיאה בעת בקשת תוכן הקובץ',
            error_changing_perms: 'התרחשה שגיאה בעת שינוי הרשאות הקובץ',
            error_uploading_files: 'התרחשה שגיאה בעת העלאת הקבצים',
            sure_to_start_compression_with: 'האם אתה בטוח שברצונך לכווץ',
            owner: 'בעלים',
            group: 'קבוצה',
            others: 'אחרים',
            read: 'קריאה',
            write: 'כתיבה',
            exec: 'הרצה',
            original: 'מקורי',
            changes: 'שינויים',
            recursive: 'רקורסיה',
            preview: 'הצגת פריט',
            open: 'פתח',
            new_folder: 'תיקיה חדשה'
        });

        $translateProvider.translations('pt', {
            filemanager: 'Gerenciador de arquivos',
            language: 'Língua',
            english: 'Inglês',
            spanish: 'Espanhol',
            portuguese: 'Portugues',
            french: 'Francês',
            german: 'Alemão',
            hebrew: 'Hebraico',
            slovak: 'Eslovaco',  
            chinese:'中文',          
            confirm: 'Confirmar',
            cancel: 'Cancelar',
            close: 'Fechar',
            upload_files: 'Carregar arquivos',
            files_will_uploaded_to: 'Os arquivos serão enviados para',
            select_files: 'Selecione os arquivos',
            uploading: 'Carregar',
            permissions: 'Autorizações',
            select_destination_folder: 'Selecione a pasta de destino',
            source: 'Origem',
            destination: 'Destino',
            copy_file: 'Copiar arquivo',
            sure_to_delete: 'Tem certeza de que deseja apagar',
            change_name_move: 'Renomear / mudança',
            enter_new_name_for: 'Digite o novo nome para',
            extract_item: 'Extrair arquivo',
            extraction_started: 'A extração começou em um processo em segundo plano',
            compression_started: 'A compressão começou em um processo em segundo plano',
            enter_folder_name_for_extraction: 'Digite o nome da pasta para a extração de',
            enter_file_name_for_compression: 'Digite o nome do arquivo para a compressão de',
            toggle_fullscreen: 'Ativar/desativar tela cheia',
            edit_file: 'Editar arquivo',
            file_content: 'Conteúdo do arquivo',
            loading: 'Carregando',
            filter: 'Filtro',
            search: 'Localizar',
            create_folder: 'Criar Pasta',
            create: 'Criar',
            folder_name: 'Nome da pasta',
            upload: 'Fazer',
            change_permissions: 'Alterar permissões',
            change: 'Alterar',
            details: 'Detalhes',
            icons: 'Icones',
            list: 'Lista',
            name: 'Nome',
            size: 'Tamanho',
            actions: 'Ações',
            date: 'Data',
            no_files_in_folder: 'Não há arquivos nesta pasta',
            no_folders_in_folder: 'Esta pasta não contém subpastas',
            select_this: 'Selecione esta',
            go_back: 'Voltar',
            wait: 'Espere',
            move: 'Mover',
            download: 'Baixar',
            view_item: 'Veja o arquivo',
            remove: 'Excluir',
            edit: 'Editar',
            copy: 'Copiar',
            rename: 'Renomear',
            extract: 'Extrair',
            compress: 'Comprimir',
            error_invalid_filename: 'Nome do arquivo inválido ou nome de arquivo já existe, especifique outro nome',
            error_modifying: 'Ocorreu um erro ao modificar o arquivo',
            error_deleting: 'Ocorreu um erro ao excluir o arquivo ou pasta',
            error_renaming: 'Ocorreu um erro ao mudar o nome do arquivo',
            error_copying: 'Ocorreu um erro ao copiar o arquivo',
            error_compressing: 'Ocorreu um erro ao comprimir o arquivo ou pasta',
            error_extracting: 'Ocorreu um erro ao extrair o arquivo',
            error_creating_folder: 'Ocorreu um erro ao criar a pasta',
            error_getting_content: 'Ocorreu um erro ao obter o conteúdo do arquivo',
            error_changing_perms: 'Ocorreu um erro ao alterar as permissões do arquivo',
            error_uploading_files: 'Ocorreu um erro upload de arquivos',
            sure_to_start_compression_with: 'Tem certeza que deseja comprimir',
            owner: 'Proprietário',
            group: 'Grupo',
            others: 'Outros',
            read: 'Leitura',
            write: 'Escrita ',
            exec: 'Execução',
            original: 'Original',
            changes: 'Mudanças',
            recursive: 'Recursiva',
            preview: 'Visualização',
            open: 'Abrir',
            these_elements: 'estes {{total}} elements',
            new_folder: 'Nova pasta'
        });

        $translateProvider.translations('es', {
            filemanager: 'Administrador de archivos',
            language: 'Idioma',
            english: 'Ingles',
            spanish: 'Español',
            portuguese: 'Portugues',
            french: 'Francés',
            german: 'Alemán',
            hebrew: 'Hebreo',
            slovak: 'Eslovaco',  
            chinese:'中文',          
            confirm: 'Confirmar',
            cancel: 'Cancelar',
            close: 'Cerrar',
            upload_files: 'Subir archivos',
            files_will_uploaded_to: 'Los archivos seran subidos a',
            select_files: 'Seleccione los archivos',
            uploading: 'Subiendo',
            permissions: 'Permisos',
            select_destination_folder: 'Seleccione la carpeta de destino',
            source: 'Origen',
            destination: 'Destino',
            copy_file: 'Copiar archivo',
            sure_to_delete: 'Esta seguro que desea eliminar',
            change_name_move: 'Renombrar / mover',
            enter_new_name_for: 'Ingrese el nuevo nombre para',
            extract_item: 'Extraer archivo',
            extraction_started: 'La extraccion ha comenzado en un proceso de segundo plano',
            compression_started: 'La compresion ha comenzado en un proceso de segundo plano',
            enter_folder_name_for_extraction: 'Ingrese el nombre de la carpeta para la extraccion de',
            enter_file_name_for_compression: 'Ingrese el nombre del archivo para la compresion de',
            toggle_fullscreen: 'Activar/Desactivar pantalla completa',
            edit_file: 'Editar archivo',
            file_content: 'Contenido del archivo',
            loading: 'Cargando',
            filter: 'Filtrar',
            search: 'Buscar',
            create_folder: 'Crear carpeta',
            create: 'Crear',
            folder_name: 'Nombre de la carpeta',
            upload: 'Subir',
            change_permissions: 'Cambiar permisos',
            change: 'Cambiar',
            details: 'Detalles',
            icons: 'Iconos',
            list: 'Lista',
            name: 'Nombre',
            size: 'Tamaño',
            actions: 'Acciones',
            date: 'Fecha',
            no_files_in_folder: 'No hay archivos en esta carpeta',
            no_folders_in_folder: 'Esta carpeta no contiene sub-carpetas',
            select_this: 'Seleccionar esta',
            go_back: 'Volver',
            wait: 'Espere',
            move: 'Mover',
            download: 'Descargar',
            view_item: 'Ver archivo',
            remove: 'Eliminar',
            edit: 'Editar',
            copy: 'Copiar',
            rename: 'Renombrar',
            extract: 'Extraer',
            compress: 'Comprimir',
            error_invalid_filename: 'El nombre del archivo es invalido o ya existe',
            error_modifying: 'Ocurrio un error al intentar modificar el archivo',
            error_deleting: 'Ocurrio un error al intentar eliminar el archivo',
            error_renaming: 'Ocurrio un error al intentar renombrar el archivo',
            error_copying: 'Ocurrio un error al intentar copiar el archivo',
            error_compressing: 'Ocurrio un error al intentar comprimir el archivo',
            error_extracting: 'Ocurrio un error al intentar extraer el archivo',
            error_creating_folder: 'Ocurrio un error al intentar crear la carpeta',
            error_getting_content: 'Ocurrio un error al obtener el contenido del archivo',
            error_changing_perms: 'Ocurrio un error al cambiar los permisos del archivo',
            error_uploading_files: 'Ocurrio un error al subir archivos',
            sure_to_start_compression_with: 'Esta seguro que desea comprimir',
            owner: 'Propietario',
            group: 'Grupo',
            others: 'Otros',
            read: 'Lectura',
            write: 'Escritura',
            exec: 'Ejecucion',
            original: 'Original',
            changes: 'Cambios',
            recursive: 'Recursivo',
            preview: 'Vista previa',
            open: 'Abrir',
            these_elements: 'estos {{total}} elementos',
            new_folder: 'Nueva carpeta'
        });

        $translateProvider.translations('fr', {
            filemanager: 'Gestionnaire de fichier',
            language: 'Langue',
            english: 'Anglais',
            spanish: 'Espagnol',
            portuguese: 'Portugais',
            french: 'Français',
            german: 'Allemand',
            hebrew: 'Hébreu',
            slovak: 'Slovaque',
            chinese:'中文',
            confirm: 'Confirmer',
            cancel: 'Annuler',
            close: 'Fermer',
            upload_files: 'Télécharger des fichiers',
            files_will_uploaded_to: 'Les fichiers seront uploadé dans',
            select_files: 'Sélectionnez les fichiers',
            uploading: 'Upload en cours',
            permissions: 'Permissions',
            select_destination_folder: 'Sélectionné le dossier de destination',
            source: 'Source',
            destination: 'Destination',
            copy_file: 'Copier le fichier',
            sure_to_delete: 'Êtes-vous sûr de vouloir supprimer',
            change_name_move: 'Renommer / Déplacer',
            enter_new_name_for: 'Entrer le nouveau nom pour',
            extract_item: 'Extraires les éléments',
            extraction_started: 'L\'extraction a démarré en tâche de fond',
            compression_started: 'La compression a démarré en tâche de fond',
            enter_folder_name_for_extraction: 'Entrer le nom du dossier pour l\'extraction de',
            enter_file_name_for_compression: 'Entrez le nom de fichier pour la compression de',
            toggle_fullscreen: 'Basculer en plein écran',
            edit_file: 'Éditer le fichier',
            file_content: 'Contenu du fichier',
            loading: 'Chargement en cours',
            filter: 'Filtre',
            search: 'Recherche',
            create_folder: 'Créer un dossier',
            create: 'Créer',
            folder_name: 'Nom du dossier',
            upload: 'Upload',
            change_permissions: 'Changer les permissions',
            change: 'Changer',
            details: 'Details',
            icons: 'Icons',
            list: 'Liste',
            name: 'Nom',
            size: 'Taille',
            actions: 'Actions',
            date: 'Date',
            no_files_in_folder: 'Aucun fichier dans ce dossier',
            no_folders_in_folder: 'Ce dossier ne contiens pas de dossier',
            select_this: 'Sélectionner',
            go_back: 'Retour',
            wait: 'Patienter',
            move: 'Déplacer',
            download: 'Télécharger',
            view_item: 'Voir l\'élément',
            remove: 'Supprimer',
            edit: 'Éditer',
            copy: 'Copier',
            rename: 'Renommer',
            extract: 'Extraire',
            compress: 'Compresser',
            error_invalid_filename: 'Nom de fichier invalide ou déjà existant, merci de spécifier un autre nom',
            error_modifying: 'Une erreur est survenue pendant la modification du fichier',
            error_deleting: 'Une erreur est survenue pendant la suppression du fichier ou du dossier',
            error_renaming: 'Une erreur est survenue pendant le renommage du fichier',
            error_copying: 'Une erreur est survenue pendant la copie du fichier',
            error_compressing: 'Une erreur est survenue pendant la compression du fichier ou du dossier',
            error_extracting: 'Une erreur est survenue pendant l\'extraction du fichier',
            error_creating_folder: 'Une erreur est survenue pendant la création du dossier',
            error_getting_content: 'Une erreur est survenue pendant la récupération du contenu du fichier',
            error_changing_perms: 'Une erreur est survenue pendant le changement des permissions du fichier',
            error_uploading_files: 'Une erreur est survenue pendant l\'upload des fichiers',
            sure_to_start_compression_with: 'Êtes-vous sûre de vouloir compresser',
            owner: 'Propriétaire',
            group: 'Groupe',
            others: 'Autres',
            read: 'Lecture',
            write: 'Écriture',
            exec: 'Éxécution',
            original: 'Original',
            changes: 'Modifications',
            recursive: 'Récursif',
            preview: 'Aperçu',
            open: 'Ouvrir',
            these_elements: 'ces {{total}} éléments',
            new_folder: 'Nouveau dossier'
        });

        $translateProvider.translations('de', {
            filemanager: 'Dateimanager',
            language: 'Sprache',
            english: 'Englisch',
            spanish: 'Spansisch',
            portuguese: 'Portugiesisch',
            french: 'Französisch',
            german: 'Deutsch',
            hebrew: 'Hebräisch',
            slovak: 'Slowakisch',
            chinese:'中文',
            confirm: 'Bestätigen',
            cancel: 'Abbrechen',
            close: 'Schließen',
            upload_files: 'Hochladen von vateien',
            files_will_uploaded_to: 'Dateien werden hochgeladen nach',
            select_files: 'Wählen Sie die Dateien',
            uploading: 'Lade hoch',
            permissions: 'Berechtigungen',
            select_destination_folder: 'Wählen Sie einen Zielordner',
            source: 'Quelle',
            destination: 'Ziel',
            copy_file: 'Datei kopieren',
            sure_to_delete: 'Sind Sie sicher, dass Sie die Datei löschen möchten?',
            change_name_move: 'Namen ändern / verschieben',
            enter_new_name_for: 'Geben Sie den neuen Namen ein für',
            extract_item: 'Archiv entpacken',
            extraction_started: 'Entpacken hat im Hintergrund begonnen',
            compression_started: 'Komprimierung hat im Hintergrund begonnen',
            enter_folder_name_for_extraction: 'Geben sie den verzeichnisnamen für die entpackung an, von',
            enter_file_name_for_compression: 'Geben sie den dateinamen für die kompression von',
            toggle_fullscreen: 'Vollbild umschalten',
            edit_file: 'Datei bearbeiten',
            file_content: 'Dateiinhalt',
            loading: 'Lade',
            filter: 'Filter',
            search: 'Suche',
            create_folder: 'Ordner erstellen',
            create: 'Erstellen',
            folder_name: 'Verzeichnisname',
            upload: 'Hochladen',
            change_permissions: 'Berechtigungen ändern',
            change: 'Ändern',
            details: 'Details',
            icons: 'Symbolansicht',
            list: 'Listenansicht',
            name: 'Name',
            size: 'Größe',
            actions: 'Aktionen',
            date: 'Datum',
            no_files_in_folder: 'Keine Dateien in diesem Ordner',
            no_folders_in_folder: 'Dieser Ordner enthält keine Unterordner',
            select_this: 'Auswählen',
            go_back: 'Zurück',
            wait: 'Warte',
            move: 'Verschieben',
            download: 'Herunterladen',
            view_item: 'Datei ansehen',
            remove: 'Löschen',
            edit: 'Bearbeiten',
            copy: 'Kopieren',
            rename: 'Umbenennen',
            extract: 'Entpacken',
            compress: 'Komprimieren',
            error_invalid_filename: 'Ungültiger Dateiname oder existiert bereits',
            error_modifying: 'Beim Bearbeiten der Datei ist ein Fehler aufgetreten',
            error_deleting: 'Beim Löschen der Datei oder des Ordners ist ein Fehler aufgetreten',
            error_renaming: 'Beim Umbennenen der Datei ist ein Fehler aufgetreten',
            error_copying: 'Beim Kopieren der Datei ist ein Fehler aufgetreten',
            error_compressing: 'Beim Komprimieren der Datei oder des Ordners ist ein Fehler aufgetreten',
            error_extracting: 'Beim Entpacken der Datei ist ein Fehler aufgetreten',
            error_creating_folder: 'Beim Erstellen des Ordners ist ein Fehler aufgetreten',
            error_getting_content: 'Beim Holen des Dateiinhalts ist ein Fehler aufgetreten',
            error_changing_perms: 'Beim Ändern der Dateiberechtigungen ist ein Fehler aufgetreten',
            error_uploading_files: 'Beim Hochladen der Dateien ist ein Fehler aufgetreten',
            sure_to_start_compression_with: 'Möchten Sie die Datei wirklich komprimieren?',
            owner: 'Besitzer',
            group: 'Gruppe',
            others: 'Andere',
            read: 'Lesen',
            write: 'Schreiben',
            exec: 'Ausführen',
            original: 'Original',
            changes: 'Änderungen',
            recursive: 'Rekursiv',
            preview: 'Dateivorschau',
            open: 'Öffnen',
            these_elements: 'diese {{total}} elemente',
            new_folder: 'Neuer ordner'
        });

        $translateProvider.translations('sk', {
            filemanager: 'Správca súborov',
            language: 'Jazyk',
            english: 'Angličtina',
            spanish: 'Španielčina',
            portuguese: 'Portugalčina',
            french: 'Francúzština',
            german: 'Nemčina',
            hebrew: 'Hebrejčina',
            slovak: 'Slovenčina',
            chinese:'中文',
            confirm: 'Potvrdiť',
            cancel: 'Zrušiť',
            close: 'Zavrieť',
            upload_files: 'Nahrávať súbory',
            files_will_uploaded_to: 'Súbory budú nahrané do',
            select_files: 'Vybrať súbory',
            uploading: 'Nahrávanie',
            permissions: 'Oprávnenia',
            select_destination_folder: 'Vyberte cieľový príečinok',
            source: 'Zdroj',
            destination: 'Cieľ',
            copy_file: 'Kopírovať súbor',
            sure_to_delete: 'Ste si istý, že chcete vymazať',
            change_name_move: 'Premenovať / Premiestniť',
            enter_new_name_for: 'Zadajte nové meno pre',
            extract_item: 'Rozbaliť položku',
            extraction_started: 'Rozbaľovanie začalo v procese na pozadí',
            compression_started: 'Kompresia začala v procese na pzoadí',
            enter_folder_name_for_extraction: 'Zadajte názov priečinka na rozbalenie',
            enter_file_name_for_compression: 'Zadajte názov súboru pre kompresiu',
            toggle_fullscreen: 'Prepnúť režim na celú obrazovku',
            edit_file: 'Upraviť súbor',
            file_content: 'Obsah súboru',
            loading: 'Načítavanie',
            filter: 'Filtrovať',
            search: 'Hľadať',
            create_folder: 'Vytvoriť priečinok',
            create: 'Vytvoriť',
            folder_name: 'Názov priećinka',
            upload: 'Nahrať',
            change_permissions: 'Zmeniť oprávnenia',
            change: 'Zmeniť',
            details: 'Podrobnosti',
            icons: 'Ikony',
            list: 'Zoznam', 
            name: 'Meno',
            size: 'Veľkosť',
            actions: 'Akcie',
            date: 'Dátum',
            no_files_in_folder: 'V tom to priečinku nie sú žiadne súbory',
            no_folders_in_folder: 'Tento priečinok neobsahuje žiadne ďalšie priećinky',
            select_this: 'Vybrať tento',
            go_back: 'Ísť späť',
            wait: 'Počkajte',
            move: 'Presunúť',
            download: 'Stiahnuť',
            view_item: 'Zobraziť položku',
            remove: 'Vymazať',
            edit: 'Upraviť',
            copy: 'Kopírovať',
            rename: 'Premenovať',
            extract: 'Rozbaliť',
            compress: 'Komprimovať',
            error_invalid_filename: 'Neplatné alebo duplicitné meno súboru, vyberte iné meno',
            error_modifying: 'Vyskytla sa chyba pri upravovaní súboru',
            error_deleting: 'Vyskytla sa chyba pri mazaní súboru alebo priečinku',
            error_renaming: 'Vyskytla sa chyba pri premenovaní súboru',
            error_copying: 'Vyskytla sa chyba pri kopírovaní súboru',
            error_compressing: 'Vyskytla sa chyba pri komprimovaní súboru alebo priečinka',
            error_extracting: 'Vyskytla sa chyba pri rozbaľovaní súboru',
            error_creating_folder: 'Vyskytla sa chyba pri vytváraní priečinku',
            error_getting_content: 'Vyskytla sa chyba pri získavaní obsahu súboru',
            error_changing_perms: 'Vyskytla sa chyba pri zmene oprávnení súboru',
            error_uploading_files: 'Vyskytla sa chyba pri nahrávaní súborov',
            sure_to_start_compression_with: 'Ste si istý, že chcete komprimovať',
            owner: 'Vlastník',
            group: 'Skupina',
            others: 'Ostatní',
            read: 'Čítanie',
            write: 'Zapisovanie',
            exec: 'Spúštanie',
            original: 'Originál',
            changes: 'Zmeny',
            recursive: 'Rekurzívne',
            preview: 'Náhľad položky',
            open: 'Otvoriť',
            these_elements: 'týchto {{total}} prvkov',
            new_folder: 'Nový priečinok'
        });
        $translateProvider.translations('zh', {
            filemanager: '文档管理器',
            language: '语言',
            english: '英语',
            spanish: '西班牙语',
            portuguese: '葡萄牙语',
            french: '法语',
            german: '德语',
            hebrew: '希伯来语',
            slovak: '斯洛伐克语',
            chinese:'中文',
            confirm: '确定',
            cancel: '取消',
            close: '关闭',
            upload_files: '上传文件',
            files_will_uploaded_to: '文件将上传到',
            select_files: '选择文件',
            uploading: '上传中',
            permissions: '权限',
            select_destination_folder: '选择目标文件',
            source: '源自',
            destination: '目的地',
            copy_file: '复制文件',
            sure_to_delete: '确定要删除？',
            change_name_move: '改名或移动？',
            enter_new_name_for: '输入新的名称',
            extract_item: '解压',
            extraction_started: '解压已经在后台开始',
            compression_started: '压缩已经在后台开始',
            enter_folder_name_for_extraction: '输入解压的目标文件夹',
            enter_file_name_for_compression: '输入要压缩的文件名',
            toggle_fullscreen: '切换全屏',
            edit_file: '编辑文件',
            file_content: '文件内容',
            loading: '加载中',
            filter: '过滤',
            search: '搜索',
            create_folder: '创建文件夹',
            create: '创建',
            folder_name: '文件夹名称',
            upload: '上传',
            change_permissions: '修改权限',
            change: '修改',
            details: '详细信息',
            icons: '图标',
            list: '列表',
            name: '名称',
            size: '尺寸',
            actions: '操作',
            date: '日期',
            no_files_in_folder: '此文件夹没有文件',
            no_folders_in_folder: '此文件夹不包含子文件夹',
            select_this: '选择此文件',
            go_back: '后退',
            wait: '等待',
            move: '移动',
            download: '下载',
            view_item: '查看子项',
            remove: '删除',
            edit: '编辑',
            copy: '复制',
            rename: '重命名',
            extract: '解压',
            compress: '压缩',
            error_invalid_filename: '非法文件名或文件已经存在, 请指定其它名称',
            error_modifying: '修改文件出错',
            error_deleting: '删除文件或文件夹出错',
            error_renaming: '重命名文件出错',
            error_copying: '复制文件出错',
            error_compressing: '压缩文件或文件夹出错',
            error_extracting: '解压文件出错',
            error_creating_folder: '创建文件夹出错',
            error_getting_content: '获取文件内容出错',
            error_changing_perms: '修改文件权限出错',
            error_uploading_files: '上传文件出错',
            sure_to_start_compression_with: '确定要压缩？',
            owner: '拥有者',
            group: '群组',
            others: '其他',
            read: '读取',
            write: '写入',
            exec: '执行',
            original: '原始',
            changes: '变化',
            recursive: '递归',
            preview: '成员预览',
            open: '打开',
            these_elements: '共 {{total}} 个',
            new_folder: '新文件夹'
        });
    }]);
})(angular);