-- CreateTable
CREATE TABLE "MenuDish" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "badge" TEXT,
    "spices" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveEvent_pkey" PRIMARY KEY ("id")
);

INSERT INTO "MenuDish" ("id","name","description","price","category","badge","spices","isVegetarian","isAvailable","sortOrder","updatedAt") VALUES
('poisson-braise','Bar Braisé aux Aromates','Bar entier braisé aux aromates locaux, servi avec aloko doré et bobolo artisanal.',5500,'grillades','Incontournable',ARRAY['Djansang','Pébé','Poivre de Penja']::TEXT[],false,true,0,CURRENT_TIMESTAMP),
('poulet-dg','Poulet DG','Poulet sauté aux plantains mûrs frits, légumes croquants et épices camerounaises.',4500,'grillades','Chef',ARRAY['Poivre de Penja','Gingembre frais']::TEXT[],false,true,1,CURRENT_TIMESTAMP),
('brochettes-boeuf','Brochettes Soya','Brochettes de bœuf marinées aux épices soya, grillées au charbon de bois.',2500,'grillades',NULL,ARRAY[]::TEXT[],false,true,2,CURRENT_TIMESTAMP),
('crevettes-grillees','Crevettes Grillées Penja','Crevettes jumbo grillées au beurre d''ail et poivre blanc de Penja.',7000,'grillades','Signature',ARRAY[]::TEXT[],false,true,3,CURRENT_TIMESTAMP),
('ndole','Ndolé Royal','Feuilles de ndolé aux crevettes fumées, viande de bœuf et arachides pilées.',4000,'specialites','Incontournable',ARRAY[]::TEXT[],false,true,4,CURRENT_TIMESTAMP),
('eru','Eru Traditionnel','Eru aux feuilles de waterleaf, crayfish, peau de bœuf et huile de palme rouge.',3500,'specialites',NULL,ARRAY[]::TEXT[],false,true,5,CURRENT_TIMESTAMP),
('mbongo-tchobi','Mbongo Tchobi','Sauce noire traditionnelle au poisson, épicée aux mbongo et hiio.',4500,'specialites','Chef',ARRAY[]::TEXT[],false,true,6,CURRENT_TIMESTAMP),
('koki','Koki aux Haricots','Gâteau de haricots cornilles aux feuilles de bananier, huile de palme et épinards.',2000,'specialites',NULL,ARRAY[]::TEXT[],true,true,7,CURRENT_TIMESTAMP),
('cocktail-cachette','Le Secret de La Cachette','Rhum vieux camerounais, jus de fruit de la passion, sirop de gingembre et zeste de citron vert.',3500,'cocktails','Signature',ARRAY[]::TEXT[],false,true,8,CURRENT_TIMESTAMP),
('cocktail-ambre','L''Ambre de Penja','Whisky infusé au poivre de Penja, miel de forêt, citron et angostura.',4000,'cocktails',NULL,ARRAY[]::TEXT[],false,true,9,CURRENT_TIMESTAMP),
('cocktail-baobab','Sunset Baobab','Gin, pulpe de baobab, jus d''ananas Victoria et sirop de citronnelle.',3000,'cocktails','Nouveau',ARRAY[]::TEXT[],false,true,10,CURRENT_TIMESTAMP),
('jus-foulerou','Jus de Folléré','Infusion d''hibiscus (bissap) glacée, sucrée au miel local.',1000,'boissons',NULL,ARRAY[]::TEXT[],false,true,11,CURRENT_TIMESTAMP),
('jus-gingembre','Ginger Shot Intense','Concentré de gingembre frais, citron vert et piment.',800,'boissons',NULL,ARRAY[]::TEXT[],false,true,12,CURRENT_TIMESTAMP),
('vin-palme','Matango Frais','Vin de palme traditionnel frais du jour, servi en calebasse.',1500,'boissons','Incontournable',ARRAY[]::TEXT[],false,true,13,CURRENT_TIMESTAMP);

INSERT INTO "LiveEvent" ("id","title","date","time","artist","genre","description","isPublished","updatedAt") VALUES
('evt-1','Acoustic Soul Night','2026-09-13','20h00','Blick Bassy Acoustic Set','Afro-Soul / Acoustic','Session acoustique intimiste aux sonorités soul africaines, guitare et voix dans la lumière ambrée.',true,CURRENT_TIMESTAMP),
('evt-2','Jazz & Cocktails Lounge','2026-09-20','21h00','Richard Bona Quartet','Jazz / Afro-Fusion','Une soirée jazz fusion avec cocktails signature et tapas camerounaises.',true,CURRENT_TIMESTAMP),
('evt-3','DJ Set Afro-Vintage','2026-09-27','22h00','DJ Sango','Afrobeats / Amapiano Lounge','DJ set lounge mêlant afrobeats doux, amapiano et classiques camerounais revisités.',true,CURRENT_TIMESTAMP);
