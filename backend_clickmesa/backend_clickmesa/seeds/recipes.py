
from typing import Annotated, Any, Dict, List
from datetime import datetime, timezone
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend_clickmesa.database import get_session
from backend_clickmesa.models import Recipe, RecipeIngredient, RecipeStep, User

Session = Annotated[AsyncSession, Depends(get_session)]


async def seed_recipes(
    session: Annotated[AsyncSession, Depends(get_session)],
):
    try:
        result = await session.execute(select(Recipe))
        if result.scalars().first():
            print("Banco já populado - pulando seed")
            return
        
        owner = await session.get(User, 1)
        if not owner:
            raise ValueError("Usuário owner com ID 1 não encontrado")

        default_recipes: List[Dict[str, Any]] = [
            {
                "title": "Tartine de queijo grelhado com pera cozida",
                "description": "São três camadas de sabor unidas em uma missão: tirar o seu café da manhã mesmice! Pão tostado, queijo minas grelhado e pera cozida no micro-ondas.",
                "prep_time_minutes": 10,
                "cook_time_minutes": 5,
                "servings": 2,
                "category": "snack",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Pera", "quantity": 150, "unit": "g"},
                    {"name": "Mel", "quantity": 10, "unit": "g"},
                    {"name": "Canela em pó", "quantity": 1, "unit": "pitadas"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Lave, seque e corte a pera ao meio, no sentido do comprimento. Com uma colher de chá, descarte o miolo com as sementes. Descarte o cabo e corte cada metade em fatias finas, de 0,5 cm, no sentido do comprimento.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Numa tigela de vidro coloque as fatias de pera, o mel e a canela. Cubra com um prato e leve ao micro-ondas para rodar por 3 minutos, em potência alta.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Com cuidado e utilizando um pano de prato; a tigela vai estar quente; retire a tigela do micro-ondas e misture delicadamente com uma colher para as fatias cozinharem por igual. Cubra novamente e volte ao micro-ondas para rodar por mais 2 minutos até a pera ficar bem macia e formar uma caldinha. Reserve.",
                    },
                ]
            },
            {
                "title": "Pão de queijo",
                "description": "Casquinha crocante e miolo com um leve puxa-puxa. Prepare e asse na hora ou congele a massa já modelada. Aí, quando quiser pão de queijo quentinho, a massa crua e congelada vai direto ao forno preaquecido. É pão de queijo caseiro e superprático!",
                "prep_time_minutes": 120,
                "cook_time_minutes": 40,
                "servings": 18,
                "category": "snack",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Polvilho azedo", "quantity": 300, "unit": "g"},
                    {"name": "Polvilho doce", "quantity": 150, "unit": "g"},
                    {"name": "Queijo meia-cura ralado grosso", "quantity": 120, "unit": "g"},
                    {"name": "Ovos", "quantity": 3, "unit": "unidades"},
                    {"name": "Água", "quantity": 360, "unit": "ml"},
                    {"name": "Óleo", "quantity": 60, "unit": "ml"},
                    {"name": "Sal", "quantity": 5, "unit": "pitada"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Preaqueça o forno a 200 ºC (temperatura média). Separe duas assadeiras médias antiaderentes (caso não sejam antiaderentes, unte com uma camada fina de óleo).",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Coloque a água e o óleo numa panela pequena (ou fervedor) e leve ao fogo médio para ferver. Enquanto isso, numa tigela grande, misture os polvilhos com o sal — atenção ao medir o polvilho: por ser um ingrediente leve, com uma colher, vá enchendo a xícara medidora com polvilho até formar um montinho, e então nivele com a faca.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Assim que a mistura de água e óleo ferver, despeje aos poucos sobre o polvilho para escaldar, misturando bem com uma colher de pau (ou espátula firme), até incorporar todo o líquido. Espere a massa amornar. Mas espere mesmo: se ela estiver quente e você seguir a receita, vai fazer os ovos que serão adicionados cozinhar e o queijo ralado derreter, isso vai fazer o preparo desandar.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Assim que o polvilho escaldado amornar, adicione o queijo ralado e misture bem com as mãos — nesse momento a massa fica bem pesada; é mais fácil misturar os ingredientes com as mãos.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Numa tigela pequena, quebre um ovo de cada vez e junte à massa — se algum estiver estragado, você não perde a receita. Amasse bem com as mãos a cada adição para incorporar cada ovo totalmente. A textura da massa fica um pouco mais rústica, com gruminhos de polvilho, e pegajosa — não se preocupe, é assim mesmo. O importante é que todos os ingredientes estejam bem misturados, sem que a parte líquida do ovo fique separada da massa.",
                    },
                    {
                        "step_number": 6,
                        "instruction": "Antes de modelar os pães de queijo, com uma colher, raspe toda a massa que estiver grudada nas mãos; depois, lave e seque as mãos. Para modelar os pães: coloque um pouco de óleo num pires para untar as mãos; com uma colher, retire uma porção da massa (cerca de 3 colheres [sopa]) e enrole até que fique do tamanho de uma bola de golfe. Transfira o pão de queijo modelado para a assadeira e repita o processo com o restante da massa, deixando espaço entre cada unidade — os pães crescem ao assar.",
                    },
                    {
                        "step_number": 7,
                        "instruction": "Leve ao forno para assar por cerca de 40 minutos, até crescer e dourar. Retire do forno e sirva a seguir.",
                    }
                ]
            },
            {
                "title": "Bolo de Fubá",
                "description": "Quem resiste a um bolo de fubá quentinho? Feita no liquidificador, esta receita, além de saborosa, é super prática. Não se esqueça de colocar as sementes de erva-doce, elas fazem toda a diferença.",
                "prep_time_minutes": 60,
                "cook_time_minutes": 30,
                "servings": 12,
                "category": "snack",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Fubá mimoso", "quantity": 180, "unit": "g"},
                    {"name": "Açucar", "quantity": 320, "unit": "g"},
                    {"name": "Ovos", "quantity": 4, "unit": "unidades"},
                    {"name": "Óleo", "quantity": 240, "unit": "ml"},
                    {"name": "Leite", "quantity": 240, "unit": "ml"},
                    {"name": "Fermento em pó", "quantity": 14, "unit": "g"},
                    {"name": "Erva-doce", "quantity": 6, "unit": "g"},
                    {"name": "Sal", "quantity": 1, "unit": "pitada"},
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Preaqueça o forno a 180 ºC (temperatura média).",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Com um pedaço de papel toalha (ou pincel), unte com manteiga uma fôrma de bolo, com furo no meio, de 25 cm de diâmetro - tente fazer uma camada bem fina. Polvilhe com farinha e chacoalhe bem para espalhar. Bata sobre a pia para retirar o excesso.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Numa tigela separada, quebre um ovo de cada vez e transfira para o copo do liquidificador - se um estiver estragado você não perde toda a receita. Junte o óleo, o açúcar e o leite. Bata até ficar liso, por cerca de 5 minutos.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Transfira a mistura para uma tigela grande. Junte o fubá e a farinha, passando pela peneira. Com um batedor de arame, mexa delicadamente até a massa ficar lisa. Por último misture o fermento, as sementes de erva-doce e o sal.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Despeje a massa do bolo na fôrma untada e nivele com uma espátula. Leve ao forno preaquecido e deixe assar por cerca de 30 minutos. Para saber se o bolo está assado: espete um palito na massa, se sair limpo é sinal que o bolo está pronto; caso contrário, deixe por mais alguns minutos até que asse completamente.",
                    },
                    {
                        "step_number": 6,
                        "instruction": "Retire do forno e deixe esfriar por 15 minutos antes de desenformar. Sirva em temperatura ambiente.",
                    },
                ]
            },
            {
                "title": "Macarrão com pesto de tomate seco",
                "description": "Uma receita rápida que transforma o clássico pesto em algo surpreendente. O tomate seco dá profundidade ao molho, que fica pronto em minutos e deixa qualquer macarrão com cara de prato especial.",
                "prep_time_minutes": 15,
                "cook_time_minutes": 10,
                "servings": 2,
                "category": "main dish",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Tomate seco", "quantity": 11, "unit": "unidades"},
                    {"name": "Macarrão Espaguete", "quantity": 160, "unit": "g"},
                    {"name": "Óleo", "quantity": 80, "unit": "ml"},
                    {"name": "Queijo parmesão ralado", "quantity": 10, "unit": "g"},
                    {"name": "Castanha-de-caju torrada sem sal", "quantity": 30, "unit": "g"},
                    {"name": "Dente de alho", "quantity": 1, "unit": "unidades"},
                    {"name": "Ramo de Manjericão", "quantity": 1, "unit": "unidades"},
                    {"name": "Sal", "quantity": 1, "unit": "pitada"},
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Leve uma panela média com cerca de 3 litros de água ao fogo alto. Quando ferver, adicione 1½ colher (sopa) de sal, junte o macarrão e misture. Deixe cozinhar pelo tempo indicado na embalagem, ou até ficar al dente, mexendo de vez em quando para os fios não grudarem um no outro.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Assim que o macarrão estiver cozido, reserve 1 xícara (chá) da água do cozimento — ela ajuda a dar ponto ao molho. Escorra o espaguete e transfira de volta para a panela.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Junte o molho pesto de tomate seco e misture delicadamente. Vá regando aos poucos com a água reservada para deixar o molho mais fluido. Sirva a seguir com tomate seco picado, castanha-de-caju picada, lascas de parmesão e folhas de manjericão.",
                    }
                ]
            },
            {
                "title": "Bacalhau com natas",
                "description": "Shhh! Fale baixo para não espalhar todos os truques que deixam esta clássica receita mais prática, acessível e deliciosa. Nesta versão, as batatas são assadas na Air Fryer, e não fritas; o bacalhau usado é o desfiado, que você compra congelado; e só uma panela vai ser utilizada para descongelar o peixe, fazer o refogado e o molho. O gratinado fica supersaboroso — e ainda pensamos em tudo para otimizar sua vida na cozinha.",
                "prep_time_minutes": 60,
                "cook_time_minutes": 80,
                "servings": 6,
                "category": "main dish",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Bacalhau desfiado, dessalgado e congelado", "quantity": 500, "unit": "g"},
                    {"name": "Batatas", "quantity": 4, "unit": "unidades"},
                    {"name": "Cebolas", "quantity": 2, "unit": "unidades"},
                    {"name": "Dentes de Alho", "quantity": 2, "unit": "unidades"},
                    {"name": "Creme de leite fresco", "quantity": 240, "unit": "ml"},
                    {"name": "Leite", "quantity": 360, "unit": "ml"},
                    {"name": "Farinha de trigo", "quantity": 22, "unit": "g"},
                    {"name": "Manteiga", "quantity": 45, "unit": "g"},
                    {"name": "Óleo", "quantity": 45, "unit": "ml"},
                    {"name": "Folhas de louro", "quantity": 2, "unit": "unidades"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Lave, descasque e corte cada batata em 3 fatias no sentido do comprimento. Corte as fatias em tiras de 1,5 cm e as tiras em pedaços de 1,5 cm.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Transfira as batatas para uma tigela e tempere com 1 colher (sopa) de azeite e ¼ de colher (chá) de sal. Misture bem para envolver todos os pedaços com o azeite.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Preaqueça a Air Fryer a 200 ºC e programe para assar por 25 minutos.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Coloque as batatas no cesto e deixe assar pelo tempo programado, até ficarem bem douradas e crocantes — na metade do tempo, abra o cesto e mexa as batatas para que dourem por igual. Enquanto as batatas assam, prepare o restante dos ingredientes.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Descasque e corte as cebolas em meias-luas finas. Descasque e pique fino os dentes de alho. Numa panela média, coloque o leite, o bacalhau, as folhas de louro e leve ao fogo médio para cozinhar por cerca de 15 minutos, até o bacalhau descongelar e ficar macio.",
                    },
                    {
                        "step_number": 6,
                        "instruction": "Sobre uma tigela, passe o bacalhau pela peneira, descarte as folhas de louro e reserve o leite — ele vai ser usado para preparar o bechamel.",
                    },
                    {
                        "step_number": 7,
                        "instruction": "Num refratário de 30 cm x 20 cm (que comporte cerca de 2 litros), coloque as batatas assadas e o bacalhau cozido. Reserve.",
                    },
                    {
                        "step_number": 8,
                        "instruction": "Lave, seque e volte a panela ao fogo médio. Quando aquecer, regue com 2 colheres (sopa) de azeite, adicione a cebola, tempere com uma pitada de sal e refogue por cerca de 6 minutos, até começar a dourar. Adicione o alho e mexa por 1 minuto para perfumar.",
                    },
                    {
                        "step_number": 9,
                        "instruction": "Desligue o fogo e junte o refogado ao bacalhau com batatas no refratário. Misture com uma espátula, quebrando um pouco mais as lascas de bacalhau.",
                    },
                    {
                        "step_number": 10,
                        "instruction": "Preaqueça o forno a 220 ºC (temperatura alta).",
                    },
                    {
                        "step_number": 11,
                        "instruction": "Volte a panela ao fogo baixo (não precisa lavar!) e coloque a manteiga. Assim que derreter, junte a farinha de trigo e mexa por 1 minuto. Acrescente todo o leite reservado e misture bem com um batedor de arame para dissolver os gruminhos de farinha. Aumente o fogo para médio e mexa com o batedor por cerca de 5 minutos, até engrossar. Desligue o fogo, misture o creme de leite e tempere com noz-moscada a gosto. Prove e, se necessário, ajuste o sal — por conta do bacalhau, talvez nem precise salgar.",
                    },
                    {
                        "step_number": 12,
                        "instruction": "Adicione ⅔ do molho sobre o bacalhau com batatas e misture delicadamente. Regue com o restante do molho e leve ao forno para gratinar por cerca de 20 minutos. Sirva a seguir.",
                    },

                ]
            },
            {
                "title": "Frango xadrez",
                "description": "Uma lista de ingredientes e um sonho: um jantar com inspiração oriental para curtir a cozinha no fim de semana ou variar o cardápio do dia a dia. Com este passo a passo, a receita clássica e perfeita de frango xadrez se torna realidade em menos de 30 minutos.",
                "prep_time_minutes": 10,
                "cook_time_minutes": 10,
                "servings": 6,
                "category": "main dish",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Filés de peito de frango", "quantity": 400, "unit": "g"},
                    {"name": "Cebola", "quantity": 1, "unit": "unidades"},
                    {"name": "Pimentão amarelo", "quantity": 150, "unit": "g"},
                    {"name": "Pimentão vermelho", "quantity": 150, "unit": "g"},
                    {"name": "Dentes de alho", "quantity": 2, "unit": "unidades"},
                    {"name": "Molho Shoyu", "quantity": 60, "unit": "ml"},
                    {"name": "Óleo", "quantity": 15, "unit": "ml"},
                    {"name": "Amido de milho", "quantity": 15, "unit": "g"},
                    {"name": "Água", "quantity": 240, "unit": "ml"},
                    {"name": "Amendoim torrado sem pele", "quantity": 35, "unit": "g"},
                    {"name": "Óleo de gergelim torrado", "quantity": 5, "unit": "ml"},
                    {"name": "Sal", "quantity": 1, "unit": "pitada"},
                    {"name": "Pimenta do reino", "quantity": 1, "unit": "pitada"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Corte os filés de frango em cubos de 2 cm e transfira para uma tigela. Tempere com ½ colher (chá) de sal e pimenta a gosto e mantenha em temperatura ambiente enquanto prepara o restante dos ingredientes — o frango não pode estar gelado na hora de ir para a frigideira.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Descasque e corte a cebola em cubos de 2 cm. Descasque e pique fino os dentes de alho. Lave, seque e corte os pimentões ao meio no sentido do comprimento; descarte as sementes e corte as metades em quadrados de 2 cm — você pode reservar o restante dos pimentões na geladeira por até 3 dias, ou no congelador, para usar em outras receitas.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Numa tigela misture o amido de milho com o shoyu e a água, até dissolver.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Leve uma panela wok (ou frigideira grande) ao fogo alto para aquecer. Regue com 1 colher (sopa) de óleo, adicione a cebola, os pimentões e refogue por cerca de 2 minutos, até ficarem levemente macios. Acrescente o frango e deixe cozinhar por cerca de 2 minutos, mexendo de vez em quando, até começar a dourar. Junte o alho picado, o amendoim e mexa por 1 minuto para perfumar.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Regue com a mistura de água, shoyu e amido e mexa por 2 minutos, até formar um molho mais espesso e brilhante. Desligue o fogo, adicione o óleo de gergelim e sirva a seguir com amendoim torrado a gosto.",
                    },
                ]
            },
            {
                "title": "Almôndega com molho de tomate",
                "description": "Os tomates assados na Air Fryer se transformam em um molho rústico com sabor tostadinho. As almôndegas são tão perfeitas para esse molho que até as etapas de preparo delas se encaixam perfeitamente na receita do molho. Em 45 minutos você pode servir um prato delicioso sem nem ter usado o fogão.",
                "prep_time_minutes": 60,
                "cook_time_minutes": 65,
                "servings": 4,
                "category": "main dish",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Patinho moído", "quantity": 400, "unit": "g"},
                    {"name": "Tomates", "quantity": 6, "unit": "unidades"},
                    {"name": "Cebola", "quantity": 1, "unit": "unidades"},
                    {"name": "Dentes de Alho", "quantity": 20, "unit": "g"},
                    {"name": "Farinha de rosca", "quantity": 30, "unit": "g"},
                    {"name": "Óleo", "quantity": 60, "unit": "ml"},
                    {"name": "Ramos de Salsinha", "quantity": 6, "unit": "unidades"},
                    {"name": "Ramos de manjericão", "quantity": 3, "unit": "unidades"},
                    {"name": "Sal", "quantity": 3, "unit": "pitadas"},
                    {"name": "Pimenta do reino", "quantity": 3, "unit": "pitadas"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Lave, seque e corte os tomates ao meio no sentido do comprimento. Descasque e pique fino a cebola e dois dentes de alho (mantenha os outros inteiros com a casca). Lave, seque e pique fino a salsinha.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Coloque os tomates e os dentes de alho inteiros numa tigela grande, tempere com 2 colheres (sopa) de azeite, ½ colher (chá) de sal e pimenta a gosto.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Preaqueça a Air Fryer a 200 ºC e programe para assar por 40 minutos — os tomates para o molho vão assar primeiro e, em seguida, as almôndegas.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Abra a gaveta da Air Fryer e coloque os tomates no cesto, com a polpa para cima, um ao lado do outro — assim eles douram melhor e soltam menos água. Distribua os dentes de alho entre os tomates e raspe a tigela com uma espátula de silicone para aproveitar todo o azeite.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Feche o cesto e deixe assar por 25 minutos, ou até que os tomates fiquem bem dourados — não precisa virar na metade do tempo. Enquanto isso, prepare as almôndegas.",
                    },
                    {
                        "step_number": 6,
                        "instruction": "Na mesma tigela em que temperou os tomates (nem precisa lavar!), coloque a carne moída, a cebola e o alho picados. Adicione 1 colher (sopa) de azeite, ½ colher (chá) de sal e pimenta a gosto e misture bem, amassando com as mãos. Forme uma bola com toda a carne e arremesse contra a tigela algumas vezes para liberar o colágeno — isso evita que as almôndegas se desmanchem na hora de assar.",
                    },
                    {
                        "step_number": 7,
                        "instruction": "Adicione o queijo parmesão, a salsinha e a farinha de rosca à carne e amasse novamente.",
                    },
                    {
                        "step_number": 8,
                        "instruction": "Para modelar as almôndegas: enrole porções da massa em bolinhas do tamanho de uma bola de pingue-pongue e reserve num prato — no total você terá 20 almôndegas.",
                    },
                    {
                        "step_number": 9,
                        "instruction": "Assim que os tomates estiverem dourados, com uma pinça, transfira para a tábua junto com os dentes de alho assados. Distribua as almôndegas no cesto da Air Fryer e borrife azeite (se preferir, pincele ou regue com um pouco de azeite). Deixe assar por 12 minutos, ou até dourar — na metade do tempo, abra a gaveta e dê uma chacoalhada para que as almôndegas assem por igual.",
                    },
                    {
                        "step_number": 10,
                        "instruction": "Enquanto as almôndegas assam, finalize o molho de tomate — assim tudo fica pronto ao mesmo tempo para a refeição. Lave, seque e pique fino o manjericão. Descasque os dentes de alho assados.",
                    },
                    {
                        "step_number": 11,
                        "instruction": "Na tábua, pique os tomates com os dentes de alho — a ideia é fazer um molho rústico. Transfira o tomate picado (com o caldinho) para uma tigela, adicione o manjericão, regue com 1 colher (sopa) de azeite e misture bem. Prove e, se necessário, ajuste o sal.",
                    },
                    {
                        "step_number": 12,
                        "instruction": "Retire as almôndegas assadas da Air Fryer e sirva com o molho de tomate e folhas de salsinha e manjericão a gosto.",
                    },
                ]
            },
            {
                "title": "Arroz com pinhão",
                "description": "Aproveita que é tempo de pinhão — e tempo de pinhão é bem curto! Este arroz com pinhão é uma delícia pra variar o cardápio do dia a dia e aproveitar esse ingrediente tão festivo.",
                "prep_time_minutes": 10,
                "cook_time_minutes": 10,
                "servings": 10,
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Arroz", "quantity": 240, "unit": "g"},
                    {"name": "Pinhão cozido descascado", "quantity": 120, "unit": "g"},
                    {"name": "Cebola", "quantity": 1, "unit": "unidades"},
                    {"name": "Dente de alho", "quantity": 1, "unit": "unidades"},
                    {"name": "Água", "quantity": 600, "unit": "ml"},
                    {"name": "Manteiga", "quantity": 15, "unit": "g"},
                    {"name": "Sal", "quantity": 6, "unit": "g"},
                    {"name": "Folha de louro", "quantity": 1, "unit": "unidades"},
                    {"name": "Ramos de salsinha", "quantity": 5, "unit": "unidades"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Numa chaleira, leve um pouco mais de 2½ xícaras (chá) de água ao fogo baixo para ferver. Descasque e pique fino a cebola e o alho. Corte o pinhão ao meio, no sentido do comprimento, e fatie cada metade em 4 pedaços. Lave, seque e pique fino a salsinha.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Leve uma panela média com a manteiga ao fogo médio para derreter. Adicione a cebola e refogue por cerca de 2 minutos, até murchar. Junte o alho e mexa por 1 minuto para perfumar. Acrescente o pinhão, tempere com uma pitada de sal e refogue por 1 minuto.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Junte o arroz, tempere com 1 colher (chá) de sal e mexa bem para envolver os grãos com o refogado. Regue com a água fervente, misture e não mexa mais.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Assim que a água começar a secar e atingir o nível do arroz, abaixe o fogo e tampe parcialmente a panela. Deixe cozinhar até que o arroz absorva toda a água — para verificar se a água secou, espete o arroz com um garfo e afaste delicadamente alguns grãos do fundo da panela; se ainda estiver molhado, deixe cozinhar mais um pouquinho.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Desligue o fogo, tampe a panela e deixe o arroz terminar de cozinhar no vapor por 5 minutos. Solte os grãos com um garfo, misture a salsinha e transfira para uma tigela. Sirva a seguir.",
                    },
                ]
            },
            {
                "title": "Purê de abóbora",
                "description": "Um purê de abóbora daqueles que derretem na boca, bem lisinho e extra cremoso. O segredo? Pouca água no cozimento, mixer direto na panela e manteiga no final. Receita perfeita pra acompanhar carnes, frango ou peixe — um curinga cheio de sabor!",
                "prep_time_minutes": 10,
                "cook_time_minutes": 25,
                "servings": 6,
                "category": "side dish",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Abóbora japonesa", "quantity": 800, "unit": "g"},
                    {"name": "Manteiga", "quantity": 45, "unit": "g"},
                    {"name": "Dente de Alho", "quantity": 1, "unit": "unidades"},
                    {"name": "Água", "quantity": 240, "unit": "ml"},
                    {"name": "Sal", "quantity": 15, "unit": "g"},
                    {"name": "Noz-moscada ralada", "quantity": 1, "unit": "pitadas"},
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Descasque, descarte as sementes e corte a abóbora em cubos médios de cerca de 3 cm — não precisam ser perfeitos, mas o ideal é que tenham tamanho uniforme para cozinhar por igual. Descasque e pique fino o alho.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Numa panela grande, coloque 1 colher (sopa) de manteiga e leve ao fogo médio. Quando derreter, junte o alho e refogue por 1 minuto, apenas para perfumar.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Adicione a abóbora, tempere com o sal, regue com a água e deixe cozinhar até ferver. Tampe a panela, abaixe o fogo e cozinhe por cerca de 20 minutos, ou até a abóbora ficar bem macia — a quantidade de água é pequena mesmo, o que evita um purê aguado.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Desligue o fogo e, com o mixer, bata a abóbora ainda quente, direto na panela, até formar um purê bem lisinho e cremoso. Tempere com noz-moscada a gosto, junte a manteiga restante e misture bem até derreter. Prove e, se necessário, ajuste o sal. Sirva a seguir.",
                    },
                ]
            },
            {
                "title": "Vinagrete de pepino e tomate com balsâmico",
                "description": "O vinagre balsâmico e o óleo de gergelim dão um ziriguidum delicioso neste vinagrete de pepino. A combinação inusitada e maravilhosa tem tudo para brilhar na sua cozinha, no seu churrasco, ao lado do seu pê-efe ou na mesa com a turma durante aquela refeição especial.",
                "prep_time_minutes": 10,
                "cook_time_minutes": 10,
                "servings": 6,
                "category": "side dish",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Pepinos", "quantity": 2, "unit": "unidades"},
                    {"name": "Tomates", "quantity": 2, "unit": "unidades"},
                    {"name": "Cebola roxa", "quantity": 1, "unit": "unidades"},
                    {"name": "Óleo", "quantity": 45, "unit": "ml"},
                    {"name": "Vinagre balsâmico", "quantity": 45, "unit": "ml"},
                    {"name": "Óleo de gergelim torrado", "quantity": 3, "unit": "ml"},
                    {"name": "Sal", "quantity": 1, "unit": "pitadas"},
                    {"name": "Pimenta do reino", "quantity": 1, "unit": "pitadas"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Com uma escovinha para legumes, lave a casca dos pepinos sob água corrente e seque com um pano. Lave e seque os tomates.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Descarte as pontas, corte cada pepino ao meio no sentido do comprimento e, com uma colher de café, raspe as sementes. Corte cada metade em 4 tiras e as tiras em fatias de 0,5 cm. Corte os tomates ao meio, descarte as sementes e corte cada metade em cubos de cerca de 1 cm. Descasque e corte a cebola em cubinhos.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Numa tigela média, coloque o azeite, o vinagre balsâmico e o óleo de gergelim; tempere com sal e pimenta e misture bem com um garfinho (ou batedor de arame) para emulsionar. Adicione os legumes picados e misture delicadamente. Prove e, se necessário, ajuste o sal. Sirva a seguir.",
                    }
                ]
            },
            {
                "title": "Bombom de sorvete",
                "description": "O mundo perfeito existe, e nele tem aquele bombonzinho de sorvete que todo mundo ama. São poucos ingredientes. Para o sorvete, você só precisa de iogurte e leite condensado; para a casquinha crocante, chocolate e óleo de coco. Com uma receita, você faz 15 bombons, que não levam nenhum aditivo químico para ficar com a cremosidade perfeita.",
                "prep_time_minutes": 120,
                "cook_time_minutes": 10,
                "servings": 7,
                "category": "dessert",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Iogurte natural sem açúcar", "quantity": 170, "unit": "G"},
                    {"name": "Leite condensado", "quantity": 120, "unit": "ml"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Forre uma peneira com um pano de algodão fino e limpo e apoie sobre uma tigela (se preferir, use 2 filtros de café descartáveis cortados ao meio). Coloque o iogurte e deixe drenar na geladeira por 1 hora, até ficar bem cremoso — ele vai liberar o soro aos poucos e ganhar uma consistência mais firme, resultando em ½ xícara (chá) de iogurte cremoso.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Separe duas fôrmas de silicone para gelo (esta receita rende 15 bombons de sorvete) — como o sorvete é cremoso e derrete rápido, é importante que as fôrmas sejam de silicone para ficar mais fácil de desenformar.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Numa tigela, misture o iogurte drenado com o leite condensado. Preencha as cavidades das fôrmas com 1 colher (sopa) do creme e leve ao freezer por, no mínimo, 6 horas (se preferir, prepare no dia anterior).",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Desenforme os cubinhos de sorvete e divida em duas assadeiras pequenas — como o sorvete derrete rápido, desenforme metade de cada vez. Volte o sorvete ao freezer por pelo menos 15 minutos antes de banhar no chocolate — os cubinhos precisam estar bem firmes.",
                    },
                ]
            },
            {
                "title": "Rabanada na Air Fryer",
                "description": "Imagine só se existisse uma gavetinha em que você pudesse colocar o pão embebido em uma mistura de ovos, leite e açúcar e de lá saíssem fatias douradas de rabanada. Existe! É o cestinho da sua Air Fryer. E a mágica acontece em 8 minutos.",
                "prep_time_minutes": 10,
                "cook_time_minutes": 15,
                "servings": 6,
                "category": "dessert",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Pães franceses", "quantity": 3, "unit": "unidades"},
                    {"name": "Ovos", "quantity": 2, "unit": "unidades"},
                    {"name": "Leite", "quantity": 240, "unit": "ml"},
                    {"name": "Açucar", "quantity": 160, "unit": "g"},
                    {"name": "Canela em pó", "quantity": 5, "unit": "pitadas"},
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Corte cada pão em 4 fatias grossas, de cerca de 3 cm de espessura.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Numa tigela pequena, quebre um ovo de cada vez e transfira para uma tigela média — se algum estiver estragado, você não perde a receita. Bata bem com um garfo para misturar as claras com as gemas; adicione o leite, ¼ de xícara (chá) do açúcar e misture bem. Num prato fundo, misture o restante do açúcar com a canela.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Preaqueça a Air Fryer a 180 ºC e programe para assar por 16 minutos — as rabanadas serão assadas em 2 levas de 8 minutos.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Mergulhe 6 fatias de pão na tigela com a mistura de leite e ovos e deixe de molho por 1 minuto — o tempo pode variar; quanto mais grossas (ou mais amanhecidas) estiverem as fatias, mais tempo elas levarão para umedecer.",
                    },
                    {
                        "step_number": 5,
                        "instruction": "Com uma pinça, retire as fatias do leite, deixando escorrer bem o excesso de líquido. Abra a gaveta da Air Fryer e coloque metade das fatias no cesto, uma ao lado da outra. Deixe assar por 8 minutos, ou até dourar — não precisa virar na metade do tempo.",
                    },
                    {
                        "step_number": 6,
                        "instruction": "Com a pinça, retire as rabanadas douradas da Air Fryer e repita o processo com o restante. Passe as rabanadas douradas pelo açúcar com canela e sirva a seguir.",
                    },
                ]
            },
            {
                "title": "Torta brookie",
                "description": "Os sabores do cookie e do brownie se encontram nesta torta surpreendente. A massa tem a crocância do cookie de chocolate e a cobertura tem a cremosidade e o sabor intenso do brownie. Se sozinhos já causam, imagine juntos.",
                "prep_time_minutes": 120,
                "cook_time_minutes": 15,
                "servings": 8,
                "category": "dessert",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Chocolate em gotas", "quantity": 200, "unit": "g"},
                    {"name": "Manteiga em cubos", "quantity": 175, "unit": "g"},
                    {"name": "Ovos", "quantity": 3, "unit": "unidades"},
                    {"name": "Açucar mascavo", "quantity": 100, "unit": "g"},
                    {"name": "Açucar", "quantity": 50, "unit": "g"},
                    {"name": "Farinha de trigo", "quantity": 80, "unit": "g"},
                    {"name": "Sal", "quantity": 1, "unit": "pitadas"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Numa tigela grande de vidro, coloque o chocolate e a manteiga. Leve ao micro-ondas para derreter, em potência média, de 30 em 30 segundos, mexendo a cada etapa.",
                    },
                    {
                        "step_number": 2,
                        "instruction": "Numa tigela pequena, quebre um ovo de cada vez e transfira para outra tigela — se algum estiver estragado você não perde a receita. Bata com um garfo apenas para misturar as claras com as gemas.",
                    },
                    {
                        "step_number": 3,
                        "instruction": "Adicione os açúcares e o sal ao chocolate e misture bem. Junte os ovos e misture bem com a espátula para incorporar. Adicione a farinha aos poucos, mexendo a cada adição.",
                    },
                    {
                        "step_number": 4,
                        "instruction": "Transfira a massa para a fôrma com a base de cookie e leve ao forno para assar por cerca de 35 minutos. Atenção para o ponto: a borda estará firme mas o miolo ainda deve estar cremoso. Retire do forno e espere esfriar completamente antes de desenformar e servir.",
                    }
                ]
            },
            {
                "title": "Smoothie de mamão com melado",
                "description": "Experimente bater o mamão com iogurte natural. Se for caseiro melhor ainda. O smoothie fica cremoso e refrescante. Vale por um café da manhã!",
                "prep_time_minutes": 10,
                "cook_time_minutes": 0,
                "servings": 2,
                "category": "drinks",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Mamão formosa", "quantity": 300, "unit": "g"},
                    {"name": "Iogurte natural sem açucar", "quantity": 170, "unit": "g"},
                    {"name": "Melado de cana", "quantity": 15, "unit": "g"},
                    {"name": "Cubos de gelo", "quantity": 10, "unit": "unidades"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Descasque, descarte as sementes e corte o mamão em pedaços de 2 cm. Transfira para o liquidificador, junte o iogurte, o melado de cana e os cubos de gelo. Bata bem até triturar o gelo e formar uma bebida cremosa. Sirva a seguir.",
                    }
                ]
            },
            {
                "title": "Café gelado com cacau e especiarias",
                "description": "Esta combinação de sabores inusitada vai conquistar o coração dos fãs de café e também a turma que gosta de fugir do óbvio. A bebida é refrescante, perfumada, levemente adocicada e com um toque picante. Delícia! Dica extra: você pode aproveitar o café que sobrou na garrafa térmica.",
                "prep_time_minutes": 10,
                "cook_time_minutes": 0,
                "servings": 1,
                "category": "drinks",
                "image_url": None,
                "owner_id": owner.id,
                "ingredients": [
                    {"name": "Café (coado, de prensa ou italiano)", "quantity": 120, "unit": "ml"},
                    {"name": "Leite", "quantity": 45, "unit": "ml"},
                    {"name": "Cacau em pó", "quantity": 15, "unit": "g"},
                    {"name": "Açucar", "quantity": 15, "unit": "g"},
                    {"name": "Canela em pó", "quantity": 3, "unit": "pitadas"},
                    {"name": "Pimenta-de-caiena", "quantity": 1, "unit": "pitadas"},
                    {"name": "Cubos de gelo", "quantity": 5, "unit": "unidades"}
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "instruction": "Coloque todos os ingredientes num pote de vidro (com tampa), feche e chacoalhe bem para misturar, até formar uma espuminha. Sirva a seguir com mais cubos de gelo a gosto.",
                    }
                ]
            },
        ]

        for recipe_data in default_recipes:
            # Prepare empty lists for relationships
            ingredients = [
                RecipeIngredient(
                    name=ing["name"],
                    quantity=ing["quantity"],
                    unit=ing["unit"]
                ) for ing in recipe_data["ingredients"]
            ]
            
            steps = [
                RecipeStep(
                    step_number=step["step_number"],
                    instruction=step["instruction"]
                ) for step in recipe_data["steps"]
            ]

            # Create recipe with all required fields
            recipe = Recipe(
                title=recipe_data["title"],
                description=recipe_data.get("description"),
                prep_time_minutes=recipe_data.get("prep_time_minutes"),
                cook_time_minutes=recipe_data.get("cook_time_minutes"),
                servings=recipe_data.get("servings"),
                category=recipe_data.get("category"),
                image_url=recipe_data.get("image_url"),
                owner_id=recipe_data["owner_id"],
                ingredients=ingredients,
                steps=steps
            )
            session.add(recipe)
        
        await session.commit()
        print("Seed completed successfully")
    except Exception as e:
        await session.rollback()
        print(f"Erro no seed: {str(e)}")
        raise
