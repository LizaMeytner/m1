**UNITS**
**Получить все юниты**
curl -X GET http://localhost:3000/
**Получить юнит по id**
curl -X GET http://localhost:3000/3
**Создать новый юнит**
curl -X POST -F "name=Test" -F "img=@D:\maxresdefault.png" http://localhost:3000/
**Обновить юнит**
curl -X PUT -F "name=NewTest" -F "img=@D:\hqdefault.jpg" http://localhost:3000/7
**Удалить юнит по id**
curl -X DELETE http://localhost:3000/5
