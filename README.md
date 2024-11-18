## Instalação

### API
Após clonar o repositório da [API](https://github.com/PI-II/api), criar um arquivo dentro da pasta ```src``` com o nome de ```db.js``` e, neste arquivo, inserir as configurações de banco:
 - Usuário;
 - Senha;
 - Host;
 - Schema.
   
Exemplo:
  ```js \
  const db = {
  "user": "root",
  "password": "pwd",
  "host": "localhost",
  "database": "chosenschema"
  }
  ```

Instalar as dependências da API com ```npm install```

Após isso, use ```cd src``` no terminal e inicie a api. Pode-se utilizar ```npx nodemon``` para que a API reinicie automaticamente a cada atualização ou ```node index.js``` para que ela inicie e seja reiniciada manualmente.


# TODO

 - Disponibilizar sessões do usuário em um select
 - Implementar a função de atualizar uma sessão, permitindo o usuário finalizar uma sessão.