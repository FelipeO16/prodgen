# ProdGen - Sistema de Gerenciamento de Produtos

SPA moderna para gerenciamento de produtos com Nuxt 4, Vue 3, TypeScript e Nuxt UI.

## 🌐 Demo Online

**Acesse a aplicação:** [https://prodgen.nuxt.dev/](https://prodgen.nuxt.dev/)

## 🚀 Tecnologias

- **Nuxt 4** - Framework Vue.js
- **Vue 3** - Composition API
- **TypeScript** - Tipagem estática
- **Nuxt UI v3** - Componentes
- **Pinia** - Gerenciamento de estado
- **Tailwind CSS** - Estilização
- **PWA** - Progressive Web App

## ✨ Funcionalidades

- 📦 Listagem com paginação
- 🔍 Busca com debounce
- 🎛️ Filtros por categoria e preço
- 📊 Ordenação múltipla
- ✏️ CRUD completo
- ⚡ Operações em lote (bulk operations)
- 🎯 Modais funcionais com overlay
- 📱 Design responsivo
- ♿ Acessibilidade WCAG AA

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd prodgen

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🧪 Testes

```bash
# Executar testes
npm run test

# Executar testes com coverage
npm run test:coverage

# Executar linting
npm run lint
```

## 📁 Estrutura

```
app/
├── pages/products/     # Rotas de produtos
├── components/         # Componentes Vue
├── stores/            # Estado Pinia
├── services/          # Camada de API
└── server/api/        # Backend mock
```

## 🎯 Funcionalidades Principais

### Dashboard
- Visão geral dos produtos
- Estatísticas rápidas
- Ações principais

### Listagem de Produtos
- Paginação server-side
- Filtros avançados
- Busca inteligente
- Ordenação flexível

### Gestão de Produtos
- Criação com validação
- Edição inline
- Remoção com confirmação
- Preview de imagens

### Operações em Lote (Bulk Operations)
- ✅ Seleção múltipla de produtos
- 📝 Atualização em massa (categoria, preço, destaque)
- 🗑️ Exclusão em massa com confirmação
- 📤 Exportação em CSV e JSON
- 🎯 Modais funcionais com overlay centralizado
- ⌨️ Suporte a tecla Escape para fechar modais
- 🌑 Backdrop escuro com click para fechar


### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview produção
npm run lint         # Linting
npm run test         # Testes unitários
npm run test:run     # Testes sem watch
npm run test:coverage # Testes com coverage
```

## 📱 Responsividade

- **Mobile First** - Design otimizado para mobile
- **Breakpoints** - Tablet, desktop e widescreen
- **Touch Friendly** - Interações otimizadas para touch

## ♿ Acessibilidade

- **WCAG AA** - Conformidade com padrões
- **Keyboard Navigation** - Navegação completa por teclado
- **Screen Readers** - Suporte a leitores de tela
- **Focus Management** - Gerenciamento de foco
- **Modal Accessibility** - Modais acessíveis com ARIA labels

## 🚀 Performance

- **Lazy Loading** - Carregamento sob demanda
- **Image Optimization** - Otimização automática
- **Code Splitting** - Divisão inteligente de código
- **Caching** - Cache de requisições
- **PWA Ready** - App instalável com funcionalidades offline

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.
