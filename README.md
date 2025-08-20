> # ***FinanControl***

# Registro de Gastos com Crédito e Débito

## Índice

- [Registro de Valores](#registro-de-valores)
- [Registro de Gastos](#registro-de-gastos)
- [Cálculo de Valor Disponível](#cálculo-de-valor-disponível)
- [Acompanhamento de Parcelas Futuras](#acompanhamento-de-parcelas-futuras)
- [Aviso de Vencimento de Fatura](#aviso-de-vencimento-de-fatura)
- [Cálculo Automático de Fatura Futura](#cálculo-automático-de-fatura-futura)
- [Classificação de Compras](#classificação-de-compras)
- [Metas de Gasto por Categoria](#metas-de-gasto-por-categoria)
- [Alertas ao Ultrapassar Limite](#alertas-ao-ultrapassar-limite)
- [Definição de Metas de Economia Mensal](#definição-de-metas-de-economia-mensal)
- [Gráficos de Desempenho em Metas](#gráficos-de-desempenho-em-metas)
- [Lembretes de pagamentos futuros](#lembretes-de-pagamentos-futuros)
- [Registro de despesas e receitas recorrentes (ex: aluguel, salário)](#registro-de-despesas-e-receitas-recorrentes-ex-aluguel-salário)
- [Funcionalidades Adicionais](#funcionalidades-adicionais)
- [Relacionamento entre Funcionalidades](#relacionamento-entre-funcionalidades)

---

## Registro de Valores

**Funções:**
- Dinheiro poupado (saldos)
- Investimentos
- Valores emprestados
- Trocas por dinheiro físico
- Cashback de cartões
- Limite de crédito por cartão

**Relacionamento:**  
O Registro de Valores influencia diretamente o **Cálculo de Valor Disponível** e a **Definição de Metas de Economia Mensal**, pois o saldo inicial e investimentos impactam o quanto pode ser economizado ou gasto.

---

## Registro de Gastos

**Função:**  
Registrar manualmente um gasto de uma compra específica, com a possibilidade de escolher o método de pagamento utilizado: débito, crédito, crédito parcelado, Pix, Pix parcelado, empréstimo ou outras formas de pagamento.

**A tela deve conter:**
- Campo valor do gasto
- Campo descrição/observação
- Campo data
- Seleção da forma de pagamento (débito, crédito, crédito parcelado, Pix, Pix parcelado, empréstimo, outros)
- Campo quantidade de parcelas (se parcelado)
- Notas por transação (fotos de comprovantes, etiquetas)
- Botão salvar/registrar
- Botão cancelar/voltar

**Relacionamento:**  
O Registro de Gastos está diretamente ligado ao **Cálculo de Valor Disponível**, **Classificação de Compras**, **Metas de Gasto por Categoria**, **Alertas ao Ultrapassar Limite**, **Acompanhamento de Parcelas Futuras**, **Cálculo Automático de Fatura Futura** e **Baixa de Fatura Mensal**, pois os gastos registrados alimentam todos esses módulos.

---

**Função:**  
Registrar as quantidades de parcelas de determinado gasto, seja Pix parcelado ou crédito parcelado.

**Relacionamento:**  
Os gastos parcelados alimentam o **Acompanhamento de Parcelas Futuras** e o **Cálculo Automático de Fatura Futura**.

---

## Baixa de Fatura Mensal

**Função:**  
O sistema deve mostrar o total da fatura mensal e confirmar se foi pago ou não (baixa da fatura). Permite exportar tal fatura mensal dos cartões de crédito em PDF.

**Relacionamento:**  
A **Baixa de Fatura Mensal** depende dos dados de **Registro de Gastos**, **Acompanhamento de Parcelas Futuras** e **Cálculo Automático de Fatura Futura**.

---

## Cálculo de Valor Disponível

**Funções:**  
- Calcular o valor disponível para gastar na semana atual e na seguinte (próximos 14 dias, incluindo hoje)
- Calcular o valor disponível para gastar no dia atual e amanhã
- Calcular o valor disponível para gastar no mês atual e no seguinte

**Relacionamento:**  
O **Cálculo de Valor Disponível** utiliza informações do **Registro de Gastos**, **Registro de Valores**, **Lembretes de pagamentos futuros** e **Registro de despesas e receitas recorrentes** para determinar quanto pode ser gasto.

---

## Acompanhamento de Parcelas Futuras

**Função:**  
Acompanhar o valor “comprometido” em parcelas futuras (parcelas que já estão no cartão).

**Relacionamento:**  
Depende dos dados de **Registro de Gastos** (especialmente gastos parcelados) e se relaciona com **Cálculo Automático de Fatura Futura**, **Aviso de Vencimento de Fatura** e **Baixa de Fatura Mensal**.

---

## Aviso de Vencimento de Fatura

**Função:**  
Notificar sobre o vencimento das faturas dos cartões.

**Relacionamento:**  
Utiliza informações de **Registro de Gastos**, **Acompanhamento de Parcelas Futuras** e **Cálculo Automático de Fatura Futura** para notificar o usuário.

---

## Cálculo Automático de Fatura Futura

**Função:**  
Projeção automática da fatura futura considerando parcelas (com a opção de dar baixa à fatura fechada — Item [Baixa de Fatura Mensal](#baixa-de-fatura-mensal)).

**Relacionamento:**  
Depende dos dados de **Registro de Gastos** e **Acompanhamento de Parcelas Futuras** e se conecta com **Aviso de Vencimento de Fatura** e **Baixa de Fatura Mensal**.

---

## Classificação de Compras

**Função:**  
Classificar compras por tipo (ex: essenciais, supérfluos).

**Relacionamento:**  
Trabalha em conjunto com **Metas de Gasto por Categoria** e utiliza dados do **Registro de Gastos**.

---

## Metas de Gasto por Categoria

**Função:**  
Criar metas de gasto por categoria (ex: alimentação, transporte).  
Limitar dinheiro gasto para cada categoria.

**Relacionamento:**  
Depende da **Classificação de Compras** e do **Registro de Gastos** para monitorar e limitar gastos em cada categoria.

---

## Alertas ao Ultrapassar Limite

**Função:**  
Notificar quando foi ultrapassado o limite dos cartões individualmente.

**Relacionamento:**  
Utiliza informações do **Registro de Gastos**, **Acompanhamento de Parcelas Futuras** e **Cálculo Automático de Fatura Futura**.

---

## Definição de Metas de Economia Mensal

**Função:**  
Permitir ao usuário definir um valor específico que deseja economizar a cada mês.

- Exibir o valor da meta mensal de economia.
- Mostrar em tempo real quanto já foi poupado no mês atual.
- Indicar quanto ainda falta para atingir a meta.
- Notificar o usuário ao atingir ou ultrapassar a meta de economia.
- Histórico das metas e resultados dos meses anteriores.

**Relacionamento:**  
Utiliza dados do **Registro de Valores** e **Registro de Gastos** e se conecta com **Gráficos de Desempenho em Metas**.

---

## Gráficos de Desempenho em Metas

**Função:**  
Exibir gráficos visuais que mostram o progresso mensal em relação às metas de economia definidas. Permitir acompanhar quanto já foi poupado no mês, quanto falta para atingir a meta e o histórico de desempenho em meses anteriores.

- Indicador visual de atingimento da meta (ex: percentual alcançado).
- Comparativo entre meses para análise de desempenho.

**Relacionamento:**  
Exibe o progresso das **Metas de Economia Mensal** utilizando dados do **Registro de Valores** e **Registro de Gastos**.

---

## Lembretes de pagamentos futuros
**Função:**  
Permitir ao usuário cadastrar lembretes para pagamentos futuros, como contas, assinaturas ou parcelas a vencer.

- Cadastro de lembrete com valor, descrição, data de vencimento e categoria.
- Opção de recorrência (mensal, semanal, anual).
- Notificações automáticas antes do vencimento (personalizáveis).
- Visualização de todos os lembretes em uma lista ou calendário.
- Marcação de lembrete como pago ou adiado.
- Histórico de lembretes pagos e pendentes.
- Integração com alertas do sistema e notificações por email/push.

**Relacionamento:**  
Se relaciona com **Registro de despesas e receitas recorrentes** e alimenta o **Cálculo de Valor Disponível** e notificações do sistema.

---

## Registro de despesas e receitas recorrentes (ex: aluguel, salário)

**Função:**  
Permitir o cadastro de despesas e receitas recorrentes, como aluguel, salário, assinaturas e contas fixas.

- Cadastro de valor, descrição, data de início, frequência (mensal, semanal, anual) e categoria.
- Opção de definir data de término ou recorrência indefinida.
- Lançamento automático das transações recorrentes no fluxo financeiro.
- Possibilidade de editar, pausar ou cancelar recorrências.
- Visualização de todas as despesas e receitas recorrentes em lista.
- Notificações de lançamentos futuros e vencimentos.
- Histórico de alterações e lançamentos realizados.
- Relatórios específicos para acompanhamento de receitas e despesas recorrentes.

**Relacionamento:**  
Trabalha em conjunto com **Lembretes de pagamentos futuros** e alimenta o **Cálculo de Valor Disponível** e relatórios do sistema.

---

## Funcionalidades Adicionais

- Comparativo de meses anteriores
- Relatórios exportáveis (PDF, Excel)
- Notificações por push/email
- Registro de dívidas e simulação de pagamento

- Importação de extratos de cartão (OFX, CSV, PDF)
- Conexão com contas bancárias (via Open Finance ou scraping)
- Conciliação bancária (importar extratos e categorizar automaticamente)
- Lançamentos automáticos com base em histórico (inteligência preditiva)
- Análise de comportamento de consumo
- Backup na nuvem (Google Drive)
- Registro de contas em conjunto (ex: casal ou sócios)
- IA para sugestão de economia
- Sincronização entre dispositivos
- Modo “confidencial” com senha ou biometria
- Comparativo de cartão (melhor cashback, menor fatura, etc.)
- Registro de money traps (serviços que você paga e não usa)

**Relacionamento:**  
Essas funcionalidades se integram a praticamente todos os módulos, fornecendo suporte, análise, integração de dados, notificações e segurança.

---

## Relacionamento entre Funcionalidades

Abaixo estão os principais relacionamentos entre as funcionalidades descritas:

- **Registro de Gastos** está diretamente ligado ao **Cálculo de Valor Disponível**, **Classificação de Compras**, **Metas de Gasto por Categoria**, **Alertas ao Ultrapassar Limite**, **Acompanhamento de Parcelas Futuras**, **Cálculo Automático de Fatura Futura** e **Baixa de Fatura Mensal**, pois os gastos registrados alimentam todos esses módulos.

- **Registro de Valores** influencia o **Cálculo de Valor Disponível** e a **Definição de Metas de Economia Mensal**, já que o saldo inicial e investimentos impactam o quanto pode ser economizado ou gasto.

- **Acompanhamento de Parcelas Futuras** e **Cálculo Automático de Fatura Futura** dependem dos dados de **Registro de Gastos** (especialmente gastos parcelados) e se relacionam com **Aviso de Vencimento de Fatura** e **Baixa de Fatura Mensal**.

- **Aviso de Vencimento de Fatura** e **Alertas ao Ultrapassar Limite** utilizam informações de **Registro de Gastos**, **Acompanhamento de Parcelas Futuras** e **Cálculo Automático de Fatura Futura** para notificar o usuário.

- **Metas de Gasto por Categoria** e **Classificação de Compras** trabalham juntas para limitar e monitorar gastos em cada categoria, usando dados do **Registro de Gastos**.

- **Definição de Metas de Economia Mensal** e **Gráficos de Desempenho em Metas** estão conectados, pois os gráficos exibem o progresso das metas definidas, utilizando dados de **Registro de Valores** e **Registro de Gastos**.

- **Lembretes de pagamentos futuros** e **Registro de despesas e receitas recorrentes** se relacionam, pois ambos gerenciam obrigações futuras e recorrentes, podendo alimentar o **Cálculo de Valor Disponível** e gerar notificações.

- **Funcionalidades Adicionais** como relatórios, comparativos, importação de extratos, conciliação bancária, notificações e backup na nuvem se integram a praticamente todos os módulos, fornecendo suporte, análise e integração de dados.

### Resumo visual dos principais relacionamentos

- Registro de Gastos → [Cálculo de Valor Disponível, Classificação de Compras, Metas de Gasto, Alertas, Parcelas Futuras, Fatura]
- Registro de Valores → [Cálculo de Valor Disponível, Metas de Economia]
- Parcelas Futuras ↔ Fatura Futura ↔ Aviso de Vencimento ↔ Baixa de Fatura
- Classificação de Compras ↔ Metas de Gasto por Categoria
- Metas de Economia ↔ Gráficos de Desempenho
- Lembretes ↔ Despesas/Receitas Recorrentes ↔ Cálculo de Valor Disponível
- Funcionalidades Adicionais ↔ Todos os módulos

Esses relacionamentos garantem que o sistema funcione de forma integrada, proporcionando uma visão completa e automatizada das finanças do usuário.

## Fluxo de Uso (User Journey)

### 1. Cadastro e Configuração Inicial
- O usuário cria uma conta e define preferências básicas (moeda, notificações, contas bancárias, cartões).
- Informa saldos iniciais, limites de crédito e principais fontes de receita/despesa recorrente.

### 2. Registro de Valores e Receitas
- Adiciona saldos, investimentos, valores emprestados e cashback.
- Cadastra receitas recorrentes (ex: salário) e eventuais.

### 3. Registro de Gastos
- Ao realizar uma compra, acessa o app e registra o gasto, escolhendo forma de pagamento (débito, crédito, Pix, etc.).
- Se for parcelado, informa número de parcelas.
- Pode anexar comprovantes e adicionar observações.

### 4. Acompanhamento Diário e Notificações
- Visualiza o saldo disponível para gastar no dia, semana e mês.
- Recebe alertas de vencimento de fatura, limites ultrapassados e lembretes de pagamentos futuros.
- Notificações de metas de economia atingidas ou próximas.

### 5. Gestão de Parcelas e Faturas
- Consulta as parcelas futuras de compras realizadas.
- Visualiza a projeção da fatura do cartão e recebe aviso de vencimento.
- Ao pagar a fatura, registra a baixa e pode exportar o comprovante.

### 6. Metas e Classificação de Gastos
- Define metas de economia mensal e metas de gasto por categoria.
- Classifica gastos (essenciais, supérfluos, etc.) para melhor acompanhamento.
- Recebe alertas ao se aproximar ou ultrapassar limites de categoria.

### 7. Lembretes e Despesas/Receitas Recorrentes
- Cadastra lembretes de pagamentos futuros (contas, assinaturas).
- Gerencia despesas e receitas recorrentes, com lançamentos automáticos e notificações.

### 8. Análise e Relatórios
- Acompanha gráficos de desempenho das metas de economia.
- Visualiza relatórios mensais, comparativos e exporta dados (PDF, Excel).
- Analisa histórico de gastos, receitas e evolução financeira.

### 9. Funcionalidades Avançadas
- Importa extratos bancários e de cartões para conciliação automática.
- Utiliza sugestões de economia baseadas em IA.
- Sincroniza dados entre dispositivos e faz backup na nuvem.
- Ativa modo confidencial para proteger informações sensíveis.

### 10. Ajustes e Suporte
- Edita ou exclui lançamentos, metas e lembretes conforme necessário.
- Acessa suporte, tutoriais e configurações avançadas.

---

Esse fluxo garante que o usuário tenha controle total sobre suas finanças, desde o registro inicial até o acompanhamento detalhado e análise de resultados, com automação e notificações para facilitar a gestão financeira.

## MVP (Produto Mínimo Viável)

O MVP do FinanControl deve conter as seguintes funcionalidades essenciais para permitir o controle financeiro básico e validar a proposta do sistema:

### Funcionalidades do MVP

- **Registro de Gastos**
    - Cadastro manual de gastos com valor, descrição, data e forma de pagamento (débito, crédito, Pix).
    - Suporte a gastos parcelados (informar número de parcelas).
    - Anexar observações ou comprovantes (opcional).

- **Registro de Valores**
    - Cadastro de saldos iniciais e limites de crédito dos cartões.

- **Cálculo de Valor Disponível**
    - Exibição do valor disponível para gastar no mês e na semana, considerando os gastos registrados.

- **Acompanhamento de Parcelas Futuras**
    - Visualização das parcelas futuras de compras parceladas.

- **Baixa de Fatura Mensal**
    - Marcação de fatura como paga e exibição do total da fatura do mês.

- **Aviso de Vencimento de Fatura**
    - Notificação simples de vencimento das faturas dos cartões.

- **Classificação de Compras**
    - Permitir ao usuário classificar os gastos em categorias básicas (ex: alimentação, transporte, lazer).

- **Metas de Gasto por Categoria**
    - Definir limite de gasto para pelo menos uma categoria e alertar ao ultrapassar.

### Fluxo Básico do MVP

1. **Cadastro Inicial:** Usuário informa saldos, limites de crédito e categorias principais.
2. **Registro de Gastos:** Usuário adiciona gastos diários, podendo parcelar e classificar.
3. **Acompanhamento:** Usuário visualiza saldo disponível, parcelas futuras e status das faturas.
4. **Alertas:** Sistema notifica sobre vencimento de fatura e ultrapassagem de limite de categoria.

### O que fica de fora do MVP

- Integração bancária automática
- Relatórios avançados e gráficos
- Backup em nuvem e sincronização entre dispositivos
- Funcionalidades de IA e sugestões automáticas
- Importação de extratos e conciliação automática
- Lembretes de pagamentos futuros e receitas/despesas recorrentes

---

O MVP deve ser simples, funcional e focado no registro e acompanhamento básico dos gastos, permitindo ao usuário ter uma visão clara do seu saldo, limites e compromissos financeiros imediatos.

## Modelo Entidade-Relacionamento (ER)

O diagrama ER a seguir representa as principais entidades e relacionamentos do sistema FinanControl:

[![Diagrama ER do FinanControl](https://www.plantuml.com/plantuml/png/hLVDZXCv4Bv7oZluWZYmit0bOX536b2adT5eVgIz8SUk9DQuxLwt6qt4y2vmGd3V9yYBRRdTITkEINg0M_kpNVxgSxcg-bLjgR5DASbReQYQQcMDbk_VNBu_qnpaUFIO8BOGoyRGpTVDVr2FHol1WJ1Xc8JngBuLggA6baGA1NPT0T76hlHuD1w1iiAkoKqDXdmSZmXv8lY4tDpC2ZTGj8G9kR96gAKRGqc5384LhLVXc1cW5lYfdP02Fwv52GvkAhuFVmhEFsLCDyfcA3J8R1QC7VtjYUJ52wS6HV-DGKj0df8BtLHKRRvI_9xgXO6NBzssELMtvuatT0cAhS-RSWucmZsP_OavbLGnj5404oML3XFr5Lr0ntz2NcijWQfM2oukm31mSBS12NTGWmEkoRIO_K7WRaAU_VcS_4MUFtlawVwiZbDg-00HEmzd1wuwrTbild5XDQfQRBxD_TUPgAtU4SRflqKfR2GF1iWKOsHEsMqiJWUc2hLpKjTuQa7N4p9Jra6yWN18cHKV83RuaugzkQj0rJ10D8RQ7X6HGysCgApGAWgeqWT7u6D5roKoE0DyXppG-MBsZmlSdDg5K2iGfXFSkULzyb4uKvWcf2mXYKBHurFFejDGu7inKCUqbBPGJyWrtDbV4JKWan4MlEI7j0rORv_XzkhtjMo38rHZBgGChLNK7H-8qgaVxchf1-_8mbARzO2ScDKe4s69oOm8JrYtf0T3Ew_HgmoVLBeIC-9g9zSQQA-TrIZgQIuOZ-ipmD5tckO8xh-Zr4k2XGaJHuRP0MUEqZdNLYm4deQlyO65fJqQwXehH0ZXYVnuqWavN09hZDj-RQYgNTfwC1TC2WNK5TIkeg4z49Rw591x2la4X6NmtyOLkz2es7mnmYMMAoph2gyE4pg699NUUjjrn140YYSXaRdAeRavAl_MKhOQdYuQ4tKX2o7XEhc-ffAQyaE7Ne6rJehZrt4Bwz3q1ogRXwK0ro8KK65P6zBY98K5x-eI5c0stnKJb6m-4zOsFQplRdAH45tK3-BYA77iJpA4Ozl6ZtOTpYF2VMWTQ6NYdiMt0WDoMoOKCgxxNgJuBGBC5DFbaExWbxe1VlHL3IdC8UystoooJVt2wF9qdwtL6V3t1zQsqx-_FpdH7tkU4_md4Kie3wt0m_35jlyjxGzBjwBR48Ek4uwHhWx7eAjPCHAMZNWcbypZ5LrAIS3-ySSJFhOoedZk2RXTdS0xhn8yEdKyQdyCkYdNICJ8paW8Rj-bsxxjadTSTktPtboVo_UcaaveRxu_CMmWF-cJa_lxZhMZsFLHFpAQBl1NdABvoqnNzLVq2eiV_eEFH_y3)](https://www.planttext.com?text=hLVDZXCv4Bv7oZluWZYmit0bOX536b2adT5eVgIz8SUk9DQuxLwt6qt4y2vmGd3V9yYBRRdTITkEINg0M_kpNVxgSxcg-bLjgR5DASbReQYQQcMDbk_VNBu_qnpaUFIO8BOGoyRGpTVDVr2FHol1WJ1Xc8JngBuLggA6baGA1NPT0T76hlHuD1w1iiAkoKqDXdmSZmXv8lY4tDpC2ZTGj8G9kR96gAKRGqc5384LhLVXc1cW5lYfdP02Fwv52GvkAhuFVmhEFsLCDyfcA3J8R1QC7VtjYUJ52wS6HV-DGKj0df8BtLHKRRvI_9xgXO6NBzssELMtvuatT0cAhS-RSWucmZsP_OavbLGnj5404oML3XFr5Lr0ntz2NcijWQfM2oukm31mSBS12NTGWmEkoRIO_K7WRaAU_VcS_4MUFtlawVwiZbDg-00HEmzd1wuwrTbild5XDQfQRBxD_TUPgAtU4SRflqKfR2GF1iWKOsHEsMqiJWUc2hLpKjTuQa7N4p9Jra6yWN18cHKV83RuaugzkQj0rJ10D8RQ7X6HGysCgApGAWgeqWT7u6D5roKoE0DyXppG-MBsZmlSdDg5K2iGfXFSkULzyb4uKvWcf2mXYKBHurFFejDGu7inKCUqbBPGJyWrtDbV4JKWan4MlEI7j0rORv_XzkhtjMo38rHZBgGChLNK7H-8qgaVxchf1-_8mbARzO2ScDKe4s69oOm8JrYtf0T3Ew_HgmoVLBeIC-9g9zSQQA-TrIZgQIuOZ-ipmD5tckO8xh-Zr4k2XGaJHuRP0MUEqZdNLYm4deQlyO65fJqQwXehH0ZXYVnuqWavN09hZDj-RQYgNTfwC1TC2WNK5TIkeg4z49Rw591x2la4X6NmtyOLkz2es7mnmYMMAoph2gyE4pg699NUUjjrn140YYSXaRdAeRavAl_MKhOQdYuQ4tKX2o7XEhc-ffAQyaE7Ne6rJehZrt4Bwz3q1ogRXwK0ro8KK65P6zBY98K5x-eI5c0stnKJb6m-4zOsFQplRdAH45tK3-BYA77iJpA4Ozl6ZtOTpYF2VMWTQ6NYdiMt0WDoMoOKCgxxNgJuBGBC5DFbaExWbxe1VlHL3IdC8UystoooJVt2wF9qdwtL6V3t1zQsqx-_FpdH7tkU4_md4Kie3wt0m_35jlyjxGzBjwBR48Ek4uwHhWx7eAjPCHAMZNWcbypZ5LrAIS3-ySSJFhOoedZk2RXTdS0xhn8yEdKyQdyCkYdNICJ8paW8Rj-bsxxjadTSTktPtboVo_UcaaveRxu_CMmWF-cJa_lxZhMZsFLHFpAQBl1NdABvoqnNzLVq2eiV_eEFH_y3)

> [Clique aqui para editar ou visualizar o diagrama no PlantText](https://www.planttext.com?text=hLVDZXCv4Bv7oZluWZYmit0bOX536b2adT5eVgIz8SUk9DQuxLwt6qt4y2vmGd3V9yYBRRdTITkEINg0M_kpNVxgSxcg-bLjgR5DASbReQYQQcMDbk_VNBu_qnpaUFIO8BOGoyRGpTVDVr2FHol1WJ1Xc8JngBuLggA6baGA1NPT0T76hlHuD1w1iiAkoKqDXdmSZmXv8lY4tDpC2ZTGj8G9kR96gAKRGqc5384LhLVXc1cW5lYfdP02Fwv52GvkAhuFVmhEFsLCDyfcA3J8R1QC7VtjYUJ52wS6HV-DGKj0df8BtLHKRRvI_9xgXO6NBzssELMtvuatT0cAhS-RSWucmZsP_OavbLGnj5404oML3XFr5Lr0ntz2NcijWQfM2oukm31mSBS12NTGWmEkoRIO_K7WRaAU_VcS_4MUFtlawVwiZbDg-00HEmzd1wuwrTbild5XDQfQRBxD_TUPgAtU4SRflqKfR2GF1iWKOsHEsMqiJWUc2hLpKjTuQa7N4p9Jra6yWN18cHKV83RuaugzkQj0rJ10D8RQ7X6HGysCgApGAWgeqWT7u6D5roKoE0DyXppG-MBsZmlSdDg5K2iGfXFSkULzyb4uKvWcf2mXYKBHurFFejDGu7inKCUqbBPGJyWrtDbV4JKWan4MlEI7j0rORv_XzkhtjMo38rHZBgGChLNK7H-8qgaVxchf1-_8mbARzO2ScDKe4s69oOm8JrYtf0T3Ew_HgmoVLBeIC-9g9zSQQA-TrIZgQIuOZ-ipmD5tckO8xh-Zr4k2XGaJHuRP0MUEqZdNLYm4deQlyO65fJqQwXehH0ZXYVnuqWavN09hZDj-RQYgNTfwC1TC2WNK5TIkeg4z49Rw591x2la4X6NmtyOLkz2es7mnmYMMAoph2gyE4pg699NUUjjrn140YYSXaRdAeRavAl_MKhOQdYuQ4tKX2o7XEhc-ffAQyaE7Ne6rJehZrt4Bwz3q1ogRXwK0ro8KK65P6zBY98K5x-eI5c0stnKJb6m-4zOsFQplRdAH45tK3-BYA77iJpA4Ozl6ZtOTpYF2VMWTQ6NYdiMt0WDoMoOKCgxxNgJuBGBC5DFbaExWbxe1VlHL3IdC8UystoooJVt2wF9qdwtL6V3t1zQsqx-_FpdH7tkU4_md4Kie3wt0m_35jlyjxGzBjwBR48Ek4uwHhWx7eAjPCHAMZNWcbypZ5LrAIS3-ySSJFhOoedZk2RXTdS0xhn8yEdKyQdyCkYdNICJ8paW8Rj-bsxxjadTSTktPtboVo_UcaaveRxu_CMmWF-cJa_lxZhMZsFLHFpAQBl1NdABvoqnNzLVq2eiV_eEFH_y3)

---

## Tecnologias utilizadas:

- **Node.js**: com Express para gerenciamento de rotas, bcrypt para autenticação de senhas e jsonwebtoken (JWT) para proteção e autenticação da API.
- **Sequelize**: utilizado como ORM para comunicação com o banco de dados.
- **Zod**: para definição e validação de schemas.
- **PostgreSQL**: banco de dados principal.
- **Railway**: hospedagem do banco e do servidor.
- **Postman**: para realização de testes.
- **GitHub**: repositório de versionamento do código.

---
