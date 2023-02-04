# umovme-reprocess-csv
Script usado para separar actionIds por um identificador válido e removendo duplicatas para posteriormente rodar política de reprocessamento automático.

### OBS:
Este script como parte de um mecanismo privado, não cotempla total contexto do cenário, mas é uma parte autônoma e 100% independente.

## Tecnologias
- JavaScript

## Como rodar
- Baixando dependências:
```
npm i
```

- Rodando script
```
npm run start
```

## Regras
1. Primeiramente é preciso adicionar um arquivo **.csv** dentro da pasta *files*.
2. O arquivo deve conter um cabeçalho como abaixo. Porém, os valores de cada coluna ficam a critério da necessidade.
```
"@timestamp","header.status","header.alternativeIdentifier","header.serviceName","header.actionId"
```
3. Deve-se obrigatoriamente usar o separador de célula **vírgula**.
4. A política de reprocessamento enviará lotes de 500 registros por requisição e aguardará um intervalo de tempo determinado por parâmetro entre cada chamada.
5. Ao fim do processo será gerado um arquivo no diretório *./files/result* com um arquivo .txt de todos os actionId enviados para reprocessamento.
6. Em caso de erro de comunicação com a API do Sentinel, o processo será interrompido e um arquivo com os actionIds que não foram enviados será gerado no diretório *./files/error*
7. No arquivo run.js há um comentário explicando cada um dos parâmetros necessários para rodar o script.

## Casos de exceção
1. Ao informar arquivo não existente no diretório.
2. Ao informar agrupador como sendo coluna inexistente no arquivo .csv.
3. Ao retornar erro de requisição ao endpoint do Sentinel.
