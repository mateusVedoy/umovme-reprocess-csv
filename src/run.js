const removeDuplicatesByKey = require('./index');

/**
 * key => Agrupador para retirar repetições
 * file => Arquivo .csv a ser processado
 * reprocessFromStart => Reprocessamento deve ocorrer do início
 * timeBetweenCalls => tempo em milissegundos entre cada chamada
 */


removeDuplicatesByKey('header.alternativeIdentifier','./src/files/file-to-reprocess.csv', false, 10000);
