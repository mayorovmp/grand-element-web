# Гранд Элемент  
## Требования к окружению
  *  Node.js [node.js](https://nodejs.org/en/download).  
Проверить версию и установку: `node -v`  
  *  Также требуется менеджер пакетов npm, он поумолчанию устанавливается вместе с node.js.  
Проверить версию и установку: `npm -v`  
## Восстановление зависимостей
   *  `npm install` - установка всех необходимых зависимостей(возможны проблемы с сетью, нужно настроить прокси). 
   *  Для локальной разработки установите `npm install -g @angular/cli`, обратите внимание, что может измениться версия. 

## Сборка для рабочего 
После того, как установлены все зависимости необходимо выполнить  
   *  `ng build --prod` собирает сборку на рабочий. Артефакт лежит в `dist/`.
   *  Содержимое папки `dist/`  подсунуть nginx`у.
   *   Конфиг nginx:
```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root /var/www/grand-element;
  index index.html;
  location / {
    try_files $uri $uri/index.html /;
  }
} 
```

## Запуск проекта для разработки
`ng serve` - сборка и запуск приложения. Автоматически обновляет страницу при изменении файлов. Разворачивается на `http://localhost:4200/`
`ng serve --host 192.168.2.97` - приложение станет доступно в локальной сети. `http://192.168.2.97:4200/`  
## GitFlow  
  * backend branch - back  
  * frontend branch - front  
  * develop branch - dev  
  * release branch - master  
## Commit agreement  
  * feature/[component_name]: commit text - normal commit 
  * hotfix/[component_name]: commit text - hotfix commit 
 
```sh
git commit -m "feature/header: add new component header"
git commit -m "hotfix/header: fix app crush"
```

## ToDo
   *  после замены всех классов bootstrap, убрать бутстрап из проекта и поменять классы вида app-btn, app-container на btn, container. 
   *  Реализовать алисы для компонентов и других сущностей.
   *  Возможно заменить css в проекте на less