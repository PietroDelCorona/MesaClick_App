# MesaClick App 🍽️🚀

## Branches
- `dev`: Integração contínua
- `feature/backend`: Desenvolvimento da API
- `feature/frontend`: Interface do usuário


## Resumo do Projeto

Muitas pessoas enfrentam dificuldades para organizar refeições e listas de compras de forma eficiente, gerando desperdício de tempo e recursos. Esse problema é relevante porque a falta de planejamento alimentar pode levar a compras desnecessárias, gastos excessivos e dificuldade em manter uma rotina saudável. Para resolver essa questão, o Click Mesa surge como uma plataforma web que auxilia no agendamento de refeições, decomposição de receitas, geração automática de listas de compras e localização de supermercados próximos. Com isso, a ferramenta otimiza o planejamento alimentar, reduzindo tempo e custos, além de facilitar a organização doméstica.

## Definição do Problema

Organizar refeições saudáveis e variadas tem se tornado um desafio crescente na vida moderna. Com rotinas cada vez mais aceleradas, profissionais, pais e estudantes enfrentam dificuldades para conciliar trabalho, estudos e vida pessoal com um planejamento alimentar eficiente. O resultado são escolhas pouco saudáveis, como refeições repetitivas ou excesso de delivery, além de desperdício de alimentos e gastos acima do necessário.

Um exemplo claro desse problema é o caso de Ana, uma profissional que trabalha em tempo integral e cuida de sua família. Ela deseja preparar refeições nutritivas e saborosas, mas se vê constantemente sobrecarregada pela falta de tempo e organização. Sem um planejamento adequado, Ana acaba repetindo pratos ou recorrendo a delivery, o que afeta sua saúde e seu orçamento. Além disso, ela frequentemente compra ingredientes em excesso, que acabam estragando antes de serem usados, e enfrenta dificuldades para encontrar os itens necessários nos supermercados próximos, perdendo tempo em deslocamentos desnecessários.

Esses desafios não são exclusivos de Ana. Muitas pessoas compartilham das mesmas frustrações, evidenciando a necessidade de uma solução que simplifique o processo de planejamento alimentar. Uma plataforma integrada, capaz de sugerir cardápios personalizados, gerar listas de compras automáticas e indicar onde encontrar os ingredientes necessários, poderia transformar a maneira como as pessoas lidam com a alimentação no dia a dia.

Além da praticidade, essa solução traria benefícios econômicos e ambientais, reduzindo o desperdício de alimentos e ajudando os usuários a economizarem tempo e dinheiro. Ao promover uma alimentação mais equilibrada e organizada, a plataforma não apenas resolveria problemas imediatos, mas também contribuiria para um estilo de vida mais saudável e sustentável.

A empresa de pesquisa de opinião Opinion Box em parceria com a empresa de inteligência de dados Neogrid realizou uma pesquisa com consumidores do varejo brasileiro "Tendências de Bens de Consumo para 2024" e alguns dados corroboram com as impressões deste trabalho. Em torno de 60% dos 2.212 entrevistados pela pesquisa, em todo o território nacional, acreditam que tanto preço quanto promoções e desconto são fatores importantes na escolha de produtos enquanto que questões de marca do produto só está representada em 17% na escolha de produto por parte dos consumidores.

Ainda sobre a pesquisa realizada, e que traz impacto para as decisões de escolha das features neste projeto é que em 64% das entrevistas os consumidores buscam comparar preços de supermercados de grande porte com os pequenos mercados de bairro. Reconhecer e localizar os pontos de venda perto de casa ou da localidade que o consumidor se encontra pode se mostrar uma ferramenta muito útil com reflexos não só no tempo despendido para essa atividade como principalmente no orçamento do consumidor. 

Importante destacar que 86% do público entrevistado ainda realiza predominantemente suas compras de supermercado de forma presencial, logo utilizar uma aplicação de rápido acesso que produza uma lista de compras eficiente ainda é uma ferramenta muito útil para o dia a dia dos consumidores.

A organização eficiente de compras e refeições é um desafio para grande parte do público, conforme revelado por uma pesquisa realizada com potenciais usuários da Click Mesa. Apesar de 90% dos entrevistados já adotarem algum tipo de planejamento prévio de compras, 70% ainda recorrem a métodos pouco práticos, como anotações manuais no celular — um processo suscetível a falhas e que demanda esforço constante do usuário. Essa dependência de soluções improvisadas evidencia uma lacuna no mercado: a falta de ferramentas que integrem automação e personalização às necessidades cotidianas.

Entre as funcionalidades analisadas, a decomposição automática de receitas destacou-se como a mais demandada, com 87% de interesse, enquanto o agendamento de refeições teve relevância menor (18%). Já a geração automática de listas de compras e a integração com geolocalização de mercados foram citadas como prioritárias por 30% do público — percentual que, embora aparentemente baixo, representa um nicho significativo quando associado a outros comportamentos. Por exemplo, 80% dos usuários demonstraram abertura a considerar um modelo de assinatura paga, desde que a plataforma ofereça benefícios claros e customização, dois aspectos frequentemente negligenciados por alternativas existentes.

Esses resultados reforçam que, embora haja soluções similares no mercado, a maioria falha em entregar uma experiência verdadeiramente adaptável ao usuário, combinando praticidade (como a automação de listas) e utilidade contextual (como a localização de mercados próximos). O Click Mesa propõe-se a resolver essa deficiência não apenas otimizando tarefas isoladas, mas criando um ecossistema que conecta planejamento, execução e compras de forma intuitiva e personalizável.

Em um cenário onde a tecnologia está cada vez mais presente no cotidiano, desenvolver uma ferramenta que facilite o planejamento de refeições é mais do que uma conveniência é uma forma de melhorar a qualidade de vida das pessoas, tornando a alimentação saudável acessível e sem complicações.

## Objetivos

O projeto Click Mesa tem como objetivo desenvolver uma plataforma inteligente que automatiza o planejamento alimentar, transformando receitas culinárias em listas de compras personalizadas e georreferenciadas. Ao integrar decomposição automática de ingredientes com a localização de supermercados próximos (via APIs como Google Maps), a solução busca otimizar tempo e recursos do usuário, unindo organização doméstica, economia e conveniência em um único ecossistema digital.

O projeto Click Mesa visa transformar o planejamento alimentar através de uma plataforma integrada que combina três pilares fundamentais: (1) simplificação da organização de refeições com agendamento intuitivo de cardápios e ajustes dinâmicos; (2) automação inteligente de listas de compras que categoriza ingredientes a partir das receitas agendadas, eliminando esquecimentos e reduzindo desperdícios; e (3) integração inovadora entre cozinha e mercado, conectando listas de compras a supermercados locais com funcionalidades de geolocalização, rotas e verificação de disponibilidade em tempo real. Esta tríade de soluções posiciona o Click Mesa como ferramenta essencial para transformar a rotina alimentar em um processo eficiente, econômico e adaptável às necessidades contemporâneas.

## Stack Tecnológico

O projeto Click Mesa foi desenvolvido com uma stack tecnológica moderna e robusta, escolhida criteriosamente para atender às demandas específicas da plataforma. Para o backend, optou-se pelo FastAPI (framework web Python) devido à sua performance excepcional, tipagem estática integrada e geração automática de documentação OpenAPI, que agilizam o desenvolvimento de APIs RESTful seguras e escaláveis. Essa escolha é complementada pelo PostgreSQL, um banco de dados relacional que oferece confiabilidade, suporte a consultas complexas e extensibilidade – características essenciais para gerenciar dados estruturados de usuários, receitas e supermercados com integridade.

A integração do Swagger/OpenAPI no desenvolvimento da API do Click Mesa — gerada automaticamente pelo FastAPI — oferece documentação interativa em tempo real, permitindo visualizar endpoints, parâmetros e exemplos de chamadas diretamente na interface. Isso agiliza testes práticos (sem ferramentas externas), sincroniza a equipe com atualizações instantâneas do código e padroniza a integração com frontend ou futuros serviços, reduzindo erros e custos de manutenção. Além disso, a especificação OpenAPI garante compatibilidade para expansões, como geração de SDKs ou adaptação a novos clientes (ex.: apps móveis), consolidando a API como um produto escalável e bem documentado.

No frontend, a combinação de Next.js e React proporciona uma experiência dinâmica e responsiva, aproveitando a renderização híbrida (SSR e CSR) para melhor desempenho e SEO. O Material-UI foi incorporado como biblioteca de componentes para garantir uma interface coesa, acessível e alinhada com as melhores práticas de design, reduzindo o tempo de desenvolvimento sem sacrificar a customização.

A integração com a API do Google Maps será utilizada para fornecer a localização de supermercados próximos ao usuário, enriquecendo a experiência com dados georreferenciados em tempo real. Essa escolha se justifica pela confiabilidade, ampla cobertura e recursos avançados de geolocalização oferecidos pela plataforma do Google, além de sua fácil integração com o ecossistema já adotado (FastAPI no backend e React no frontend). A inclusão dessa API externa reforça a capacidade do sistema em entregar um serviço completo e alinhado com as expectativas do usuário, garantindo precisão e praticidade na funcionalidade de localização.

A infraestrutura utiliza Docker para conteinerização, simplificando a implantação e garantindo consistência entre ambientes de desenvolvimento, teste e produção. Essa abordagem facilita a escalabilidade horizontal e a integração contínua, crítica para uma plataforma que pode enfrentar picos de demanda conforme a base de usuários cresce. Juntas, essas tecnologias formam um ecossistema equilibrado, onde desempenho, manutenibilidade e experiência do usuário são priorizados em cada camada da aplicação.

O deploy é realizado em um serviço de cloud computing (como AWS, Google Cloud ou Heroku), com orquestração via Docker Compose ou Kubernetes para gerenciamento de microsserviços (se aplicável). Essa abordagem assegura escalabilidade automática, alta disponibilidade e monitoramento integrado — essenciais para uma plataforma com demandas variáveis de usuários.

## Descrição da Solução 

O Click Mesa é uma aplicação web desenvolvida para simplificar e otimizar o planejamento alimentar, resolvendo os problemas de desorganização e desperdício identificados na pesquisa. A plataforma funciona como um assistente inteligente, combinando um banco de dados de receitas detalhadas com funcionalidades integradas de geolocalização e automação. Cada receita cadastrada é decomposta em seus ingredientes, que são então convertidos em listas de compras inteligentes, personalizadas de acordo com as necessidades do usuário. Além disso, a integração com APIs de mapas permite a localização de supermercados próximos, fechando o ciclo entre planejamento e execução das compras.

O Click Mesa oferece um sistema de agendamento que permite aos usuários planejar suas refeições diárias ou semanais com poucos cliques. A interface intuitiva possibilita a seleção de receitas pré-cadastradas ou personalizadas, organizando-as em um calendário visual. Essa funcionalidade não apenas economiza tempo, mas também ajuda a manter uma dieta balanceada, já que os usuários podem distribuir os pratos de forma estratégica, evitando repetições ou desequilíbrios nutricionais.

Ao selecionar uma receita, a plataforma realiza automaticamente a decomposição de ingredientes, listando todos os itens necessários para o preparo. Essa funcionalidade é especialmente útil para evitar esquecimentos e compras desnecessárias, já que os usuários têm clareza sobre o que precisam adquirir. Além disso, a decomposição pode ser ajustada de acordo com o número de porções, garantindo precisão nas quantidades e reduzindo desperdícios.

Com base nas receitas agendadas, o Click Mesa gera listas de compras automáticas, agrupando ingredientes por categorias (ex.: hortifrúti, laticínios, mercearia). Essa organização facilita a navegação no supermercado e reduz o tempo gasto nas compras. A lista também pode ser editada manualmente, permitindo a inclusão de itens adicionais ou a remoção daqueles que o usuário já possui em casa.

Integrada a APIs de geolocalização (como Google Maps), a plataforma identifica os supermercados mais próximos do usuário, exibindo rotas e tempos de deslocamento. Opcionalmente, pode incluir informações sobre promoções ou disponibilidade de produtos, tornando a experiência de compra ainda mais eficiente. Essa funcionalidade não apenas poupa tempo, mas também ajuda a reduzir custos, já que os usuários podem comparar opções e escolher o estabelecimento mais conveniente.

## Arquitetura



## Validação



## Estratégia



## Consolidação dos Dados Coletados



## Conclusões



## Limitações do Projeto e Perspectivas Futuras



## Referências Bibliográficas

Docker Documentation. https://docs.docker.com . Acesso em: 20/05/2025

Nextjs Documentation. https://nextjs.org/docs . Acesso em: 20/05/2025.

React Documentation. https://react.dev/learn . Acesso em: 20/05/2025.

Swagger Documentation. https://swagger.io/docs/ . Acesso em: 20/05/2025.

Tendências de Bens de Consumo para 2024. Opinion Box, Neogrid. https://content.app-us1.com/JY8yY/2024/03/09/309591b5-cd62-4339-97e9-e8f614cec834.pdf . Acesso em: 21/04/2025.