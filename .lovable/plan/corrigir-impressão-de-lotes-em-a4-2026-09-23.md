# Corrigir impressão de lotes em A4

## Objetivo
- Corrigir o erro atual que faz os números da tela divergirem durante o carregamento.
- Reduzir cada caixa de lote para imprimir até 6 lotes diferentes por folha A4, em uma grade de 2 colunas por 3 linhas.

## Alterações
- Carregar os dados salvos somente depois que a tela estiver pronta, evitando diferença entre o conteúdo inicial e o conteúdo exibido.
- Atualizar as duas formas de impressão de vários lotes para paginar de 6 em 6.
- Compactar margens, espaçamentos, textos e códigos de barras sem remover código do produto, lote, validade ou quantidade.
- Atualizar os textos da janela e da folha de impressão de “4/A4” para “6/A4”.

## Validação
- Confirmar que a página abre sem o erro de carregamento.
- Simular seis lotes e conferir visualmente a folha A4 em 2 × 3, sem cortes ou sobreposição.
- Confirmar que o próximo lote cria uma nova folha.
