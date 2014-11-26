![](http://blog.rivaliq.com/wp-content/uploads/2013/08/Email-Marketing.jpg)

#Upload de imagem

Para criarmos um upload de imagens com Node.js puro é um muito extenso pois você precisaria parsear manualmente o `body` do `POST`, verificar tipo do arquivo entre outras coisas, para facilitar um pouco nossa vida utilizaremos o `formidable` que é uma mão-na-roda para essas situações.

##Formidable

O módulo do [formidable](https://www.npmjs.org/package/formidable) serve especificamente para *parsear* dados de forms, então vamos ao que interessa.

Criamos um servidor http para testar nossa rota de upload:

```
var formidable = require('formidable')
  , http = require('http')
  , fs = require('fs')
  ;

http.createServer(function(req, res){
  if(!((req.url === "/upload") && (req.method === "POST"))){
    home(res);
  }else{
    upload(req, res);
  }
}).listen(3000);
```

Como você pode ver se a rota for `upload` e o método for `POST` executamos a função `home`, se não executamos a `upload`.

Primeiramente vamos criar a função `home` que deverá mostrar um formulário para o envio da imagem:

```
function home(res){
    res.end("<html><body><form action='/upload' method='post' enctype='multipart/form-data'><input name='image' type='file'/><input type='submit'></form></body></html>");
}
```
*Estou passando a string HTML diretamente apenas para fins de exemplo*

Agora vamos criar a função `upload` que deverá receber a imagem do form e salvar na pasta `upload`.

```
function upload(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    var image = files.image
      , image_upload_path_old = image.path
      , image_upload_path_new = './upload/'
      , image_upload_name = image.name
      , image_upload_path_name = image_upload_path_new + image_upload_name
      ;

    if (fs.existsSync(image_upload_path_new)) {
      fs.rename(
        image_upload_path_old,
        image_upload_path_name,
        function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de mover a imagem!');
        }
        var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
        console.log(msg);
        res.end(msg);
      });
    }
    else {
      fs.mkdir(image_upload_path_new, function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de criar o diretório!');
        }
        fs.rename(
          image_upload_path_old,
          image_upload_path_name,
          function(err) {
          var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
          console.log(msg);
          res.end(msg);
        });
      });
    }
  });
}
```

**Mas bah que funçãozona Suisso, não entendi muito bem dá para explicar?**

Claro mas posso explicar sem dar. :p [momento tumdunts]

Vamos começar pelo `IncomingForm`:

```
var form = new formidable.IncomingForm();
```

`new formidable.IncomingForm()` cria uma instância nova de um formulário.

```
form.parse(req, function(err, fields, files){}
```

Executa a função que *parseia* os dados do form vindo do *request*, todos os campos e arquivos são passados para o callback.

Após *parsearmos* os dados começaremos então o processo de mover a image da pasta temporária para o diretório definido no código, para isso utilizaremos o `fs.rename`, porém antes de movermos a imagem precisamos testar se o diretório existe com `fs.existSync`.

```
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    var image = files.image
      , image_upload_path_old = image.path
      , image_upload_path_new = './upload/'
      , image_upload_name = image.name
      , image_upload_path_name = image_upload_path_new + image_upload_name
      ;

    // Testa se o diretório upload existe na pasta atual
    if (fs.existsSync(image_upload_path_new)) {
      fs.rename(
        image_upload_path_old,
        image_upload_path_name,
        function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de mover a imagem!');
        }
        var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
        console.log(msg);
        res.end(msg);
      });
    } // Se não cria o diretório upload
    else {
      fs.mkdir(image_upload_path_new, function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de criar o diretório!');
        }
        fs.rename(
          image_upload_path_old,
          image_upload_path_name,
          function(err) {
          var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
          console.log(msg);
          res.end(msg);
        });
      });
    }
  });
```

Com podemos ver no código acima basicamente precisamos seguir o seguintes passos:

1. *parsear* os dados do form
2. verificar se o diretório para upload existe
3. mover o arquivo da pasta temporária para a de upload
4. ser feliz


##Express

Para criarmos uma função de upload de imagens no Express é bem fácil, vamos começar criando nosso projeto, depois de ter instalado seu gerador globalmente:

```
npm install -g express-generator
express nome-do-meu-projeto
cd nome-do-meu-projeto
npm install
```

Depois de instalada nossas dependiencias locais vamos ao que interessa, abra o `views/index.jade` e vamos criar nosso form deixando o arquivo assim:

```
extends layout

block content
  h1= title
  p Welcome to #{title}

  form(action='/upload', method='post', enctype='multipart/form-data')
    input(name='image', type='file')
    input(type='submit')
```


Rodamos nosso projeto com:

```
npm start
```


Entrando em `localhost:3000` precisamos ver nossa view assim:

![](https://cldup.com/8HHUv85lQ8.png)

Agora vamos criar a rota que vai receber o `POST` em `/routes/index.js`:

```
router.post('/upload', function (req, res) {

});
```

Porém como estamos utilizando o `ectype='multipart/form-data'` o middleware `body-parser` não trabalha com ele então vamos re-usar nossa funcionalidade feita anteriormente com o `formidable`.

```

router.post('/upload', function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    var image = files.image
      , image_upload_path_old = image.path
      , image_upload_path_new = './public/images/'
      , image_upload_name = image.name
      , image_upload_path_name = image_upload_path_new + image_upload_name
      ;

    if (fs.existsSync(image_upload_path_new)) {
      fs.rename(
        image_upload_path_old,
        image_upload_path_name,
        function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de mover a imagem!');
        }
        var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
        console.log(msg);
        res.end(msg);
      });
    }
    else {
      fs.mkdir(image_upload_path_new, function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de criar o diretório!');
        }
        fs.rename(
          image_upload_path_old,
          image_upload_path_name,
          function(err) {
          var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
          console.log(msg);
          res.end(msg);
        });
      });
    }
  });
});
```


Pronto agora rodamos nosso projeto novamente e entramos em `localhost:3000` e selecionamos uma imagem.

![](https://cldup.com/-f1fEK_nAo.png)

Após submetermos a imagem a página retornada deve ser parecida com essa:

![](https://cldup.com/86SjgqPB-J-1200x1200.png)

Podemos verificar como se a imagem realmente foi salva na pasta `public/images/` indo diretamente nela.

![](https://cldup.com/iWlHcmhUmQ.thumb.png)

Ou acessando via navegador.

![](https://cldup.com/RJLaK1caVC.png)

Agora fica a dica para você, esse código é facilmente refatorável para um módulo separado que poderia ser usado nos 2 projetos, para estudar melhor como funcionam as coisas no Node.js pegue o código e vai melhorando ele até chegar em algo utilizável por você.

Por hoje é só :*




