import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type QuizPayload = {
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
};

const modules: {
  title: string;
  description: string;
  order: number;
  thumbnail: string;
  quizData: QuizPayload;
}[] = [
  {
    title: "Introduction au Lean Management",
    description:
      "Comprendre les origines du Lean, la chasse aux gaspillages (Muda) et la création de valeur pour le client.",
    order: 1,
    thumbnail: "/thumbnails/lean-intro.png",
    quizData: {
      questions: [
        {
          question: "D'où vient historiquement le Lean Management ?",
          options: [
            "Du système de production Toyota (TPS)",
            "Du management par objectifs de Taylor uniquement",
            "Des normes ISO 9001 des années 2000",
            "Du marketing digital",
          ],
          correctIndex: 0,
        },
        {
          question: "Quel est le principe fondamental du Lean ?",
          options: [
            "Maximiser les stocks pour éviter les ruptures",
            "Maximiser la valeur client en réduisant les gaspillages",
            "Allonger les délais pour mieux contrôler la qualité",
            "Remplacer tous les opérateurs par des machines",
          ],
          correctIndex: 1,
        },
        {
          question: "Qu'est-ce qu'une activité à valeur ajoutée ?",
          options: [
            "Toute tâche demandée par la hiérarchie",
            "Une activité que le client est prêt à payer car elle transforme le produit",
            "Un reporting interne hebdomadaire",
            "Le stockage de pièces de sécurité",
          ],
          correctIndex: 1,
        },
        {
          question: "Que désignent les 7 gaspillages (Muda) ?",
          options: [
            "Sept indicateurs financiers",
            "Les sept niveaux hiérarchiques d'une usine",
            "Des activités sans valeur ajoutée (surproduction, attentes, stocks, etc.)",
            "Sept normes ISO obligatoires",
          ],
          correctIndex: 2,
        },
      ],
    },
  },
  {
    title: "La méthode des 5S",
    description:
      "Organiser le poste de travail : Seiri, Seiton, Seiso, Seiketsu et Shitsuke pour plus de sécurité et d'efficacité.",
    order: 2,
    thumbnail: "/thumbnails/lean-5s.png",
    quizData: {
      questions: [
        {
          question: "Quel 5S consiste à éliminer l'inutile (trier) ?",
          options: ["Seiso", "Shitsuke", "Seiri", "Seiketsu"],
          correctIndex: 2,
        },
        {
          question: "Que signifie le 5S « Seiton » ?",
          options: [
            "Nettoyer le poste",
            "Ranger : une place pour chaque chose",
            "Standardiser les règles",
            "Auditer les fournisseurs",
          ],
          correctIndex: 1,
        },
        {
          question: "À quoi correspond « Seiso » ?",
          options: [
            "Nettoyer et inspecter le poste de travail",
            "Augmenter les lots de production",
            "Former uniquement la direction",
            "Supprimer le standard visuel",
          ],
          correctIndex: 0,
        },
        {
          question: "Quel duo maintient le 5S dans la durée ?",
          options: [
            "Seiri et Seiton uniquement, une seule fois",
            "Seiketsu (standardiser) et Shitsuke (rigueur / discipline)",
            "Seiso remplace tous les autres S",
            "Aucun : le 5S n'a pas besoin d'être maintenu",
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    title: "Le Kaizen (Amélioration Continue)",
    description:
      "Animer des petits pas d'amélioration au quotidien, impliquer les équipes et traiter les problèmes à la source.",
    order: 3,
    thumbnail: "/thumbnails/lean-kaizen.png",
    quizData: {
      questions: [
        {
          question: "Que signifie « Kaizen » ?",
          options: [
            "Changement radical unique",
            "Amélioration continue par petits pas",
            "Réduction des effectifs",
            "Externalisation de la production",
          ],
          correctIndex: 1,
        },
        {
          question: "Que représente le cycle PDCA ?",
          options: [
            "Plan, Do, Check, Act — un cycle d'amélioration",
            "Produce, Deliver, Control, Audit",
            "Un indicateur de stock",
            "Une méthode de recrutement",
          ],
          correctIndex: 0,
        },
        {
          question: "Qui doit participer au Kaizen ?",
          options: [
            "Uniquement les consultants externes",
            "Uniquement la direction",
            "Les équipes de terrain, encadrées par le management",
            "Uniquement le service qualité",
          ],
          correctIndex: 2,
        },
        {
          question: "À quoi servent les suggestions d'amélioration ?",
          options: [
            "À remplacer le management",
            "À capter les idées du terrain et les tester rapidement",
            "À allonger les délais de décision",
            "À augmenter les stocks de sécurité",
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    title: "VSM - Cartographie de la chaîne de valeur",
    description:
      "Visualiser le flux de valeur, distinguer VA et NVA, et identifier les goulots et stocks entre les étapes.",
    order: 4,
    thumbnail: "/thumbnails/lean-vsm.png",
    quizData: {
      questions: [
        {
          question: "À quoi sert une VSM (Value Stream Mapping) ?",
          options: [
            "À dessiner l'organigramme de l'entreprise",
            "À cartographier le flux de valeur du fournisseur au client",
            "À calculer uniquement le chiffre d'affaires",
            "À remplacer le 5S",
          ],
          correctIndex: 1,
        },
        {
          question: "Que mesure le temps de cycle ?",
          options: [
            "Le temps entre deux pièces successives en sortie d'un processus",
            "Le salaire des opérateurs",
            "Le prix de vente",
            "Le nombre de réunions hebdomadaires",
          ],
          correctIndex: 0,
        },
        {
          question: "Quelle information une VSM aide-t-elle à distinguer ?",
          options: [
            "Valeur ajoutée vs non-valeur ajoutée",
            "Couleurs du logo",
            "Le salaire des managers",
            "Les congés payés",
          ],
          correctIndex: 0,
        },
        {
          question: "Dans une VSM, que représente le lead time ?",
          options: [
            "Le temps de pause des opérateurs",
            "Le délai total pour transformer une demande en produit livré",
            "Le prix de vente",
            "Le nombre de références au catalogue",
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    title: "Les indicateurs de performance (KPI) en Lean",
    description:
      "Piloter SQCD : sécurité, qualité, coût, délai — et suivre TRS, temps de cycle, taux de rebut et lead time.",
    order: 5,
    thumbnail: "/thumbnails/lean-kpi.png",
    quizData: {
      questions: [
        {
          question: "Que signifie le TRS (OEE) ?",
          options: [
            "Taux de rendement synthétique d'un équipement",
            "Temps de réunion hebdomadaire",
            "Taux de réduction des stocks uniquement",
            "Tableau de rémunération salariale",
          ],
          correctIndex: 0,
        },
        {
          question: "Qu'est-ce que le Takt Time ?",
          options: [
            "Le rythme de production aligné sur la demande client",
            "Le temps de pause réglementaire",
            "Le délai de paiement des fournisseurs",
            "La durée d'un audit ISO",
          ],
          correctIndex: 0,
        },
        {
          question: "Qu'est-ce qu'un Poka-Yoke ?",
          options: [
            "Un système anti-erreur qui empêche ou signale un défaut",
            "Un indicateur de chiffre d'affaires",
            "Un type de stock de sécurité",
            "Une réunion quotidienne obligatoire",
          ],
          correctIndex: 0,
        },
        {
          question: "Un indicateur qualité Lean doit surtout être :",
          options: [
            "Nombreux, complexes et réservés à la finance",
            "Actionnable, visuel et lié à la non-qualité / valeur client",
            "Indépendant du terrain (gemba)",
            "Calculé uniquement une fois par an",
          ],
          correctIndex: 1,
        },
      ],
    },
  },
];

async function main() {
  await prisma.userProgress.deleteMany();
  await prisma.module.deleteMany();

  for (const module of modules) {
    await prisma.module.create({
      data: {
        title: module.title,
        description: module.description,
        order: module.order,
        thumbnail: module.thumbnail,
        quizData: module.quizData as Prisma.InputJsonValue,
      },
    });
  }

  console.log(`Seed OK : ${modules.length} modules Lean créés.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
