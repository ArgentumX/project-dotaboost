![image](https://github.com/user-attachments/assets/5ec812e2-2344-4f78-874e-889ea239c0eb)![антимаг](![image](https://github.com/user-attachments/assets/08b75809-b92b-4a42-9abc-c120f1dfa837)
)


<h1 align="center">Справка по миграциям</h1>

Директория исполнения
> cd server/migration_stuff

Создание миграции
> npx sequelize-cli migration:create --name MIGRATION_NAME

Исполнение всех невыполненных миграций к основной бд
> npx sequelize-cli db:migrate
