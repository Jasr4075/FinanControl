# 🔧 FinanControl - Backend API

API REST completa para sistema de controle financeiro pessoal desenvolvida com Node.js, TypeScript e PostgreSQL.

## 🎯 Objetivo

Desenvolver uma API robusta e escalável que forneça todos os endpoints necessários para um sistema de controle financeiro pessoal, incluindo gestão de usuários, contas bancárias, cartões de crédito, transações financeiras, metas de economia, notificações e relatórios detalhados.

## 🚀 Stack Tecnológico

- **Node.js** + **TypeScript**
- **Express.js** (Framework web)
- **PostgreSQL** (Banco de dados)
- **Sequelize** (ORM)
- **Redis** (Cache e sessões)
- **JWT** (Autenticação)
- **Zod** (Validação)
- **MercadoPago** (Pagamentos)
- **bcrypt** (Criptografia de senhas)

## 📁 Estrutura do Projeto

```
📦 FinanControl/                           # Backend API
├─ 📄 package.json                         # Dependências e scripts
├─ 📄 tsconfig.json                        # Configuração TypeScript
└─ 📁 src/                                 # Código fonte
   ├─ 🚀 app.ts                            # Configuração Express
   ├─ 🌐 server.ts                         # Servidor principal
   ├─ 🔴 redisClient.ts                    # Cliente Redis
   │
   ├─ ⚙️ config/                           # Configurações
   │  └─ config.ts                         # Config da aplicação
   │
   ├─ 🎮 controllers/                      # Controladores MVC
   │  ├─ 🔐 AuthController.ts              # Autenticação
   │  ├─ 👤 UsuarioController.ts           # Usuários
   │  ├─ 💳 CartaoController.ts            # Cartões de crédito
   │  ├─ 🏦 ContaController.ts             # Contas bancárias
   │  ├─ 📉 DespesaController.ts           # Despesas/gastos
   │  ├─ 📈 ReceitaController.ts           # Receitas/ingresos
   │  ├─ 🔄 TransferenciaController.ts     # Transferências
   │  ├─ 📄 FaturaController.ts            # Faturas
   │  ├─ 📊 ParcelaController.ts           # Parcelas
   │  ├─ 🎯 MetaController.ts              # Metas financeiras
   │  ├─ 🔔 NotificacaoController.ts       # Notificações
   │  ├─ 🏷️ CategoryController.ts          # Categorias
   │  ├─ 💰 CashbackController.ts          # Sistema cashback
   │  ├─ 🔁 TransacoesRecorrentesController.ts # Transações recorrentes
   │  ├─ ⚙️ SettingController.ts           # Configurações
   │  └─ 🔄 RefreshTokenController.ts      # Refresh tokens
   │
   ├─ 🗄️ database/                         # Configuração BD
   │  └─ index.ts                          # Setup Sequelize
   │
   ├─ 🤝 helpers/                          # Utilitários
   │  └─ redisCache.ts                     # Cache Redis
   │
   ├─ 🛡️ middlewares/                      # Middlewares
   │  ├─ autenticacao.ts                   # Middleware JWT
   │  ├─ errorHandler.ts                   # Handler de erros
   │  └─ validate.ts                       # Validação Zod
   │
   ├─ 📊 models/                           # Modelos Sequelize
   │  ├─ 🏗️ BaseModel.ts                  # Modelo base
   │  ├─ 👤 Usuario.ts                     # Usuários
   │  ├─ 💳 Cartao.ts                      # Cartões
   │  ├─ 🏦 Conta.ts                       # Contas
   │  ├─ 📉 Despesa.ts                     # Despesas
   │  ├─ 📈 Receita.ts                     # Receitas
   │  ├─ 🔄 Transferencia.ts               # Transferências
   │  ├─ 📄 Fatura.ts                      # Faturas
   │  ├─ 📊 Parcela.ts                     # Parcelas
   │  ├─ 🎯 Meta.ts                        # Metas
   │  ├─ 🔔 Notificacao.ts                 # Notificações
   │  ├─ 🏷️ Category.ts                    # Categorias
   │  ├─ 💰 Cashback.ts                    # Cashback
   │  ├─ 🔁 TransacoesRecorrentes.ts       # Transações recorrentes
   │  ├─ ⚙️ Setting.ts                     # Configurações
   │  ├─ 🔄 RefreshToken.ts                # Refresh tokens
   │  ├─ 🔗 associations.ts                # Relacionamentos
   │  └─ 📋 index.ts                       # Exportações
   │
   ├─ 🛣️ routes/                           # Rotas da API
   │  ├─ 🔐 auth.routes.ts                 # /api/auth
   │  ├─ 👤 usuario.routes.ts              # /api/usuarios
   │  ├─ 💳 cartao.routes.ts               # /api/cartoes
   │  ├─ 🏦 conta.routes.ts                # /api/contas
   │  ├─ 📉 despesa.routes.ts              # /api/despesas
   │  ├─ 📈 receitas.routes.ts             # /api/receitas
   │  ├─ 🔄 transferencia.routes.ts        # /api/transferencias
   │  ├─ 📄 fatura.routes.ts               # /api/faturas
   │  ├─ 📊 parcela.routes.ts              # /api/parcelas
   │  ├─ 🎯 meta.routes.ts                 # /api/metas
   │  ├─ 🔔 notificacao.routes.ts          # /api/notificacoes
   │  ├─ 🏷️ category.routes.ts             # /api/categorias
   │  ├─ 💰 cashback.routes.ts             # /api/cashback
   │  ├─ 🔁 transacoesRecorrentes.routes.ts # /api/transacoes-recorrentes
   │  ├─ ⚙️ setting.routes.ts              # /api/settings
   │  ├─ 🔄 refreshToken.routes.ts         # /api/token
   │  └─ 📋 index.ts                       # Router principal
   │
   ├─ 🔧 services/                         # Lógica de negócio
   │  ├─ 👤 UsuarioService.ts              # Serviços de usuário
   │  ├─ 💳 CartaoService.ts               # Serviços de cartão
   │  ├─ 🏦 ContaService.ts                # Serviços de conta
   │  ├─ 📉 DespesaService.ts              # Serviços de despesa
   │  ├─ 📈 ReceitaService.ts              # Serviços de receita
   │  ├─ 🔄 TransferenciaService.ts        # Serviços de transferência
   │  ├─ 📄 FaturaService.ts               # Serviços de fatura
   │  ├─ 📊 ParcelaService.ts              # Serviços de parcela
   │  ├─ 🎯 MetaService.ts                 # Serviços de meta
   │  ├─ 🔔 NotificacaoService.ts          # Serviços de notificação
   │  ├─ 🏷️ CategoryService.ts             # Serviços de categoria
   │  ├─ 💰 CashbackService.ts             # Serviços de cashback
   │  ├─ 🔁 TransacoesRecorrentesService.ts # Serviços recorrentes
   │  ├─ ⚙️ SettingService.ts              # Serviços de configuração
   │  └─ 🔑 TokenService.ts                # Serviços de token
   │
   └─ ✅ validators/                        # Esquemas Zod
      ├─ usuario.schema.ts                 # Validação usuário
      ├─ cartao.schema.ts                  # Validação cartão
      ├─ conta.schema.ts                   # Validação conta
      ├─ despesa.schema.ts                 # Validação despesa
      ├─ receita.schema.ts                 # Validação receita
      ├─ meta.schema.ts                    # Validação meta
      ├─ cashback.schema.ts                # Validação cashback
      └─ transacoesRecorrentes.schema.ts   # Validação recorrentes
```

## 📋 Requisitos Funcionais

### 🔐 Autenticação e Autorização
- **RF001**: Sistema de login com email e senha
- **RF002**: Registro de novos usuários
- **RF003**: Recuperação de senha
- **RF004**: Autenticação JWT com refresh tokens
- **RF005**: Middleware de autorização para rotas protegidas

### 💳 Gestão de Cartões e Contas
- **RF006**: CRUD de cartões de crédito
- **RF007**: CRUD de contas bancárias
- **RF008**: Vinculação de cartões às contas
- **RF009**: Gestão de limites de crédito
- **RF010**: Cálculo de saldos disponíveis

### 💰 Transações Financeiras
- **RF011**: Registro de despesas com diferentes formas de pagamento
- **RF012**: Registro de receitas
- **RF013**: Transferências entre contas
- **RF014**: Gestão de parcelas (crédito e Pix parcelado)
- **RF015**: Sistema de categorização de transações
- **RF016**: Transações recorrentes automatizadas

### 📊 Cálculos e Projeções
- **RF017**: Cálculo de valor disponível (diário, semanal, mensal)
- **RF018**: Projeção automática de faturas futuras
- **RF019**: Acompanhamento de parcelas pendentes
- **RF020**: Cálculos de metas de economia
- **RF021**: Sistema de cashback

### 🔔 Notificações e Alertas
- **RF022**: Avisos de vencimento de faturas
- **RF023**: Alertas de limites ultrapassados
- **RF024**: Lembretes de pagamentos futuros
- **RF025**: Notificações de metas atingidas

### 📈 Relatórios e Análises
- **RF026**: Geração de relatórios mensais
- **RF027**: Exportação de dados (PDF, Excel)
- **RF028**: Comparativos entre períodos
- **RF029**: Análise de gastos por categoria
- **RF030**: Relatórios de desempenho de metas

## 📊 Requisitos Não Funcionais

### 🔒 Segurança
- **RNF001**: Criptografia de senhas com bcrypt
- **RNF002**: Tokens JWT com expiração configurável
- **RNF003**: Rate limiting para prevenir ataques
- **RNF004**: Headers de segurança com Helmet
- **RNF005**: Validação rigorosa de entrada de dados

### ⚡ Performance
- **RNF006**: Cache Redis para consultas frequentes
- **RNF007**: Otimização de queries do banco de dados
- **RNF008**: Paginação para listas grandes
- **RNF009**: Compressão de respostas HTTP
- **RNF010**: Connection pooling do PostgreSQL

### 📏 Escalabilidade
- **RNF011**: Arquitetura modular com separação de responsabilidades
- **RNF012**: Padrão MVC com Services
- **RNF013**: Configuração via variáveis de ambiente
- **RNF014**: Logs estruturados para monitoramento
- **RNF015**: Deployment containerizável

### 🧪 Qualidade
- **RNF016**: Cobertura de testes unitários
- **RNF017**: Validação de tipos com TypeScript
- **RNF018**: Documentação de API
- **RNF019**: Padrões de código com ESLint
- **RNF020**: Versionamento semântico

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Instalação
```bash
# Clonar o repositório
git clone <repository-url>

# Navegar para a pasta do backend
cd FinanControl

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações do banco
npm run migrate

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Servidor de produção
npm run test     # Executar testes
npm run migrate  # Executar migrações
```

## 🛠️ Regras de Negócio (Backend)

### 💰 Gestão de Valores e Cálculos
- **RN001**: Valor disponível = Saldo + Limite de crédito - Gastos pendentes - Parcelas futuras
- **RN002**: Faturas de cartão são calculadas considerando período de fechamento e vencimento
- **RN003**: Parcelas são distribuídas automaticamente pelos meses subsequentes
- **RN004**: Cashback é calculado automaticamente baseado no percentual do cartão
- **RN005**: Saldos de contas correntes podem ser negativos até o limite autorizado
- **RN006**: Limites de cartão de crédito não podem ser ultrapassados sem autorização

### 🔄 Processamento de Transações
- **RN007**: Transações recorrentes são processadas automaticamente na data programada
- **RN008**: Falhas em transações recorrentes geram logs e notificações
- **RN009**: Sistema verifica disponibilidade de saldo antes de processar débitos
- **RN010**: Transferências entre contas são processadas atomicamente (tudo ou nada)
- **RN011**: Parcelamentos no cartão são registrados como múltiplas parcelas
- **RN012**: Juros de parcelamento são aplicados conforme configuração do cartão

### 📊 Cálculos de Metas e Projeções
- **RN013**: Metas de economia são avaliadas em tempo real a cada transação
- **RN014**: Progresso de metas é calculado baseado no período definido (mensal/anual)
- **RN015**: Projeção de fatura futura considera parcelas pendentes e gastos do período
- **RN016**: Alertas de limite são disparados quando 80% do limite é atingido
- **RN017**: Valor comprometido inclui parcelas futuras confirmadas

### 🔔 Sistema de Notificações
- **RN018**: Notificações são enviadas via Redis Queue para processamento assíncrono
- **RN019**: Avisos de vencimento são enviados 7, 3 e 1 dia antes da data
- **RN020**: Alertas de meta atingida são enviados imediatamente
- **RN021**: Tentativas de reenvio de notificação falha são limitadas a 3x
- **RN022**: Usuários podem configurar preferências de notificação

### 🔐 Segurança e Validação
- **RN023**: Todas as operações financeiras requerem autenticação JWT válida
- **RN024**: Valores monetários são validados com precisão de 2 casas decimais
- **RN025**: Operações críticas (exclusões, grandes transferências) requerem confirmação
- **RN026**: Logs de auditoria são mantidos para todas as operações financeiras
- **RN027**: Sessões expiram automaticamente após período de inatividade

### 📈 Relatórios e Exportações
- **RN028**: Relatórios incluem apenas dados do usuário autenticado
- **RN029**: Dados são agregados por categoria, período e tipo de transação
- **RN030**: Exportações mantêm formatação monetária e cálculos precisos
- **RN031**: Comparativos consideram períodos equivalentes (mesmo número de dias)
- **RN032**: Cache de relatórios complexos é mantido por 1 hora

## 🔗 Endpoints Principais da API

### 🔐 Autenticação
```
POST /api/auth/login          # Login de usuário
POST /api/auth/register       # Registro de usuário
POST /api/auth/forgot         # Recuperação de senha
POST /api/token/refresh       # Renovar token JWT
DELETE /api/auth/logout       # Logout (invalidar token)
```

### 👤 Usuários
```
GET  /api/usuarios/profile    # Perfil do usuário
PUT  /api/usuarios/profile    # Atualizar perfil
DELETE /api/usuarios/account  # Excluir conta
GET  /api/usuarios/settings   # Configurações do usuário
PUT  /api/usuarios/settings   # Atualizar configurações
```

### 💳 Cartões e Contas
```
GET  /api/cartoes             # Listar cartões
POST /api/cartoes             # Criar cartão
GET  /api/cartoes/:id         # Obter cartão
PUT  /api/cartoes/:id         # Atualizar cartão
DELETE /api/cartoes/:id       # Excluir cartão
GET  /api/cartoes/:id/fatura  # Fatura atual do cartão

GET  /api/contas              # Listar contas
POST /api/contas              # Criar conta
GET  /api/contas/:id          # Obter conta
PUT  /api/contas/:id          # Atualizar conta
DELETE /api/contas/:id        # Excluir conta
GET  /api/contas/:id/saldo    # Saldo atual da conta
```

### 💰 Transações
```
GET  /api/despesas            # Listar despesas
POST /api/despesas            # Criar despesa
GET  /api/despesas/:id        # Obter despesa
PUT  /api/despesas/:id        # Atualizar despesa
DELETE /api/despesas/:id      # Excluir despesa
GET  /api/despesas/categoria/:id # Despesas por categoria

GET  /api/receitas            # Listar receitas
POST /api/receitas            # Criar receita
GET  /api/receitas/:id        # Obter receita
PUT  /api/receitas/:id        # Atualizar receita
DELETE /api/receitas/:id      # Excluir receita

GET  /api/transferencias      # Listar transferências
POST /api/transferencias      # Criar transferência
GET  /api/transferencias/:id  # Obter transferência
DELETE /api/transferencias/:id # Cancelar transferência
```

### 📊 Análises e Relatórios
```
GET  /api/faturas             # Listar faturas
GET  /api/faturas/:id         # Obter fatura
POST /api/faturas/:id/baixa   # Marcar fatura como paga
GET  /api/faturas/:id/export  # Exportar fatura (PDF)

GET  /api/metas               # Listar metas
POST /api/metas               # Criar meta
GET  /api/metas/:id           # Obter meta
PUT  /api/metas/:id           # Atualizar meta
DELETE /api/metas/:id         # Excluir meta
GET  /api/metas/:id/progress  # Progresso da meta

GET  /api/parcelas            # Listar parcelas pendentes
GET  /api/parcelas/futuras    # Parcelas futuras (próximos meses)

GET  /api/categorias          # Listar categorias
POST /api/categorias          # Criar categoria
PUT  /api/categorias/:id      # Atualizar categoria
DELETE /api/categorias/:id    # Excluir categoria

GET  /api/cashback            # Histórico de cashback
GET  /api/cashback/total      # Total de cashback acumulado
```

### 🔔 Notificações e Configurações
```
GET  /api/notificacoes        # Listar notificações
PUT  /api/notificacoes/:id/read # Marcar como lida
DELETE /api/notificacoes/:id  # Excluir notificação
POST /api/notificacoes/mark-all-read # Marcar todas como lidas

GET  /api/settings            # Configurações do sistema
PUT  /api/settings            # Atualizar configurações
GET  /api/settings/notifications # Preferências de notificação
PUT  /api/settings/notifications # Atualizar preferências

GET  /api/transacoes-recorrentes # Listar transações recorrentes
POST /api/transacoes-recorrentes # Criar transação recorrente
PUT  /api/transacoes-recorrentes/:id # Atualizar transação recorrente
DELETE /api/transacoes-recorrentes/:id # Excluir transação recorrente
POST /api/transacoes-recorrentes/:id/pause # Pausar transação recorrente
```

## 📊 Modelo de Dados (Principais Entidades)

```sql
-- Usuários
Usuario {
  id: UUID PRIMARY KEY
  nome: VARCHAR(100) NOT NULL
  email: VARCHAR(100) UNIQUE NOT NULL
  senha_hash: VARCHAR(255) NOT NULL
  ativo: BOOLEAN DEFAULT TRUE
  ultimo_acesso: TIMESTAMP
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Contas Bancárias
Conta {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  nome: VARCHAR(100) NOT NULL
  tipo: ENUM('corrente', 'poupanca', 'investimento') NOT NULL
  banco: VARCHAR(100)
  agencia: VARCHAR(10)
  numero_conta: VARCHAR(20)
  saldo_inicial: DECIMAL(10,2) DEFAULT 0
  saldo_atual: DECIMAL(10,2) DEFAULT 0
  limite_overdraft: DECIMAL(10,2) DEFAULT 0
  ativa: BOOLEAN DEFAULT TRUE
  cor: VARCHAR(7) -- Hex color
  icone: VARCHAR(50)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Cartões de Crédito
Cartao {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  conta_id: UUID FK(Conta.id)
  nome: VARCHAR(100) NOT NULL
  bandeira: VARCHAR(50)
  ultimos_digitos: VARCHAR(4)
  limite_total: DECIMAL(10,2) NOT NULL
  limite_disponivel: DECIMAL(10,2) NOT NULL
  dia_fechamento: INTEGER CHECK (dia_fechamento BETWEEN 1 AND 28)
  dia_vencimento: INTEGER CHECK (dia_vencimento BETWEEN 1 AND 28)
  cashback_percentual: DECIMAL(3,2) DEFAULT 0
  anuidade: DECIMAL(8,2) DEFAULT 0
  ativo: BOOLEAN DEFAULT TRUE
  cor: VARCHAR(7)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Categorias
Category {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  nome: VARCHAR(100) NOT NULL
  tipo: ENUM('receita', 'despesa') NOT NULL
  cor: VARCHAR(7)
  icone: VARCHAR(50)
  orcamento_mensal: DECIMAL(10,2) DEFAULT 0
  ativa: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT NOW()
}

-- Transações Financeiras (Despesas)
Despesa {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  conta_id: UUID FK(Conta.id)
  cartao_id: UUID FK(Cartao.id)
  categoria_id: UUID FK(Category.id) NOT NULL
  valor: DECIMAL(10,2) NOT NULL
  descricao: TEXT NOT NULL
  observacoes: TEXT
  data_transacao: DATE NOT NULL
  forma_pagamento: ENUM('dinheiro', 'debito', 'credito', 'pix', 'transferencia') NOT NULL
  status: ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'confirmada'
  numero_parcelas: INTEGER DEFAULT 1
  parcela_atual: INTEGER DEFAULT 1
  recorrente_id: UUID FK(TransacoesRecorrentes.id)
  comprovante_url: VARCHAR(500)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Receitas
Receita {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  conta_id: UUID FK(Conta.id) NOT NULL
  categoria_id: UUID FK(Category.id) NOT NULL
  valor: DECIMAL(10,2) NOT NULL
  descricao: TEXT NOT NULL
  observacoes: TEXT
  data_transacao: DATE NOT NULL
  fonte: VARCHAR(100)
  status: ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'confirmada'
  recorrente_id: UUID FK(TransacoesRecorrentes.id)
  comprovante_url: VARCHAR(500)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Metas Financeiras
Meta {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  categoria_id: UUID FK(Category.id)
  nome: VARCHAR(100) NOT NULL
  tipo: ENUM('economia', 'gasto', 'receita') NOT NULL
  valor_objetivo: DECIMAL(10,2) NOT NULL
  valor_atual: DECIMAL(10,2) DEFAULT 0
  periodo: ENUM('mensal', 'anual', 'personalizado') NOT NULL
  data_inicio: DATE NOT NULL
  data_fim: DATE NOT NULL
  status: ENUM('ativa', 'pausada', 'finalizada') DEFAULT 'ativa'
  notificar_progresso: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Faturas
Fatura {
  id: UUID PRIMARY KEY
  cartao_id: UUID FK(Cartao.id) NOT NULL
  mes_referencia: INTEGER NOT NULL
  ano_referencia: INTEGER NOT NULL
  data_fechamento: DATE NOT NULL
  data_vencimento: DATE NOT NULL
  valor_total: DECIMAL(10,2) NOT NULL
  valor_pago: DECIMAL(10,2) DEFAULT 0
  status: ENUM('aberta', 'fechada', 'vencida', 'paga') DEFAULT 'aberta'
  data_pagamento: DATE
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Transações Recorrentes
TransacoesRecorrentes {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  conta_id: UUID FK(Conta.id) NOT NULL
  categoria_id: UUID FK(Category.id) NOT NULL
  tipo: ENUM('receita', 'despesa') NOT NULL
  nome: VARCHAR(100) NOT NULL
  valor: DECIMAL(10,2) NOT NULL
  frequencia: ENUM('diario', 'semanal', 'quinzenal', 'mensal', 'trimestral', 'semestral', 'anual') NOT NULL
  dia_processamento: INTEGER
  data_inicio: DATE NOT NULL
  data_fim: DATE
  proxima_execucao: DATE NOT NULL
  status: ENUM('ativa', 'pausada', 'finalizada') DEFAULT 'ativa'
  tentativas_falha: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}

-- Notificações
Notificacao {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  tipo: ENUM('vencimento_fatura', 'limite_atingido', 'meta_atingida', 'transacao_recorrente') NOT NULL
  titulo: VARCHAR(200) NOT NULL
  mensagem: TEXT NOT NULL
  lida: BOOLEAN DEFAULT FALSE
  data_envio: TIMESTAMP DEFAULT NOW()
  data_leitura: TIMESTAMP
  dados_extras: JSONB -- Para armazenar dados específicos do tipo de notificação
}

-- Configurações do Usuário
Setting {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  chave: VARCHAR(100) NOT NULL
  valor: TEXT NOT NULL
  tipo: ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string'
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
  UNIQUE(usuario_id, chave)
}

-- Refresh Tokens
RefreshToken {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  token_hash: VARCHAR(255) NOT NULL
  dispositivo: VARCHAR(100)
  ip_address: INET
  user_agent: TEXT
  expires_at: TIMESTAMP NOT NULL
  created_at: TIMESTAMP DEFAULT NOW()
}

-- Cashback
Cashback {
  id: UUID PRIMARY KEY
  usuario_id: UUID FK(Usuario.id) NOT NULL
  cartao_id: UUID FK(Cartao.id) NOT NULL
  despesa_id: UUID FK(Despesa.id) NOT NULL
  valor_transacao: DECIMAL(10,2) NOT NULL
  percentual: DECIMAL(3,2) NOT NULL
  valor_cashback: DECIMAL(10,2) NOT NULL
  data_transacao: DATE NOT NULL
  data_credito: DATE
  status: ENUM('pendente', 'creditado') DEFAULT 'pendente'
  created_at: TIMESTAMP DEFAULT NOW()
}
```

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

## 🔄 Futuras Melhorias (Backend)

### 📈 Integrações Avançadas
- **Open Finance**: Conexão automática com bancos brasileiros via API
- **MercadoPago Advanced**: Processamento completo de pagamentos e recebimentos
- **Importação de Extratos**: Suporte automatizado para OFX, CSV e PDF
- **API Banking**: Integração com APIs de múltiplos bancos e fintechs
- **PIX Integration**: Processamento nativo de transações PIX
- **Crypto Wallet**: Suporte para carteiras de criptomoedas

### 🤖 Inteligência Artificial e Machine Learning
- **ML para Categorização**: Classificação automática de transações baseada em histórico
- **Análise Preditiva**: Previsão de gastos futuros usando modelos estatísticos
- **Sugestões Inteligentes**: Recomendações personalizadas de economia e investimentos
- **Detecção de Anomalias**: Identificação automática de gastos incomuns ou suspeitos
- **OCR para Comprovantes**: Extração automática de dados de notas fiscais e recibos
- **Chatbot Financeiro**: Assistente inteligente para consultas e operações

### 🔧 Performance e Escalabilidade
- **Microserviços**: Separação da aplicação em serviços menores e independentes
- **Message Queue**: Sistema de filas com Redis/RabbitMQ para processamento assíncrono
- **Database Sharding**: Particionamento horizontal para melhor performance
- **CDN**: Distribuição de conteúdo estático e cache global
- **Load Balancer**: Distribuição de carga entre múltiplas instâncias
- **Auto Scaling**: Escalabilidade automática baseada na demanda

### 📊 Analytics e Business Intelligence
- **Data Warehouse**: Armazenamento otimizado para análises complexas
- **ETL Pipeline**: Processamento e transformação de dados em lote
- **Real-time Analytics**: Métricas e dashboard em tempo real
- **Machine Learning Pipeline**: Modelos de ML para insights financeiros
- **Data Lake**: Armazenamento de dados não estruturados
- **Advanced Reporting**: Relatórios executivos e dashboards interativos

### 🔒 Segurança Avançada
- **OAuth 2.0**: Integração com provedores de identidade externos
- **Multi-factor Authentication**: 2FA via SMS, email e aplicativos autenticadores
- **Biometric Authentication**: Autenticação biométrica para operações sensíveis
- **Audit Logs**: Rastreamento completo e imutável de todas as ações
- **GDPR Compliance**: Conformidade completa com proteção de dados
- **Zero Trust Architecture**: Verificação contínua de identidade e permissões

### 🌐 Integrações de Sistema
- **Webhook System**: Sistema completo de webhooks para eventos
- **GraphQL API**: API GraphQL para consultas otimizadas
- **gRPC Services**: Comunicação eficiente entre microserviços
- **Event Sourcing**: Armazenamento de eventos para auditoria e replay
- **CQRS Pattern**: Separação de comandos e consultas
- **Saga Pattern**: Gerenciamento de transações distribuídas

## 🧪 Testes e Qualidade

### 📋 Estratégia de Testes
- **Testes Unitários**: Jest + TypeScript para lógica de negócio
- **Testes de Integração**: Supertest para endpoints da API
- **Testes de Banco**: PostgreSQL em memória para testes isolados
- **Testes de Performance**: Artillery para carga e stress
- **Testes de Segurança**: OWASP ZAP para vulnerabilidades

### 📊 Métricas de Qualidade
- **Cobertura de Código**: Mínimo 80% para produção
- **Code Quality**: SonarQube para análise estática
- **Performance**: Tempo de resposta < 200ms para 95% das requisições
- **Disponibilidade**: SLA de 99.9% uptime
- **Logs**: Estruturados com Winston + ELK Stack

## 🎯 Status do Projeto

🚧 **Em Desenvolvimento Ativo**

### ✅ Funcionalidades Implementadas
- **Autenticação**: Sistema completo JWT + Refresh Tokens
- **CRUD Básico**: Usuários, contas, cartões, transações
- **Cálculos Financeiros**: Saldos, limites, valor disponível
- **Sistema de Parcelas**: Gestão completa de parcelamentos
- **Validação**: Schemas Zod para todos endpoints
- **Cache**: Redis para otimização de consultas
- **Segurança**: Rate limiting, CORS, Helmet

### 🔄 Em Desenvolvimento
- **Sistema de Notificações**: Push notifications e email
- **Relatórios Avançados**: Exportação PDF/Excel
- **Transações Recorrentes**: Processamento automático
- **Sistema de Metas**: Acompanhamento e alertas
- **Integração MercadoPago**: Pagamentos e recebimentos
- **Testes Automatizados**: Cobertura completa

### 📋 Próximas Sprints
1. **Sprint 15**: Finalização do sistema de notificações
2. **Sprint 16**: Relatórios e exportações
3. **Sprint 17**: Dashboard de analytics
4. **Sprint 18**: Testes e documentação
5. **Sprint 19**: Integração com Open Finance
6. **Sprint 20**: Deploy e monitoramento

### 🎯 Roadmap 2024
- **Q1**: Finalização MVP + Testes
- **Q2**: Integrações bancárias
- **Q3**: ML e IA features  
- **Q4**: Mobile app + Scale