// Mock data shared across the app
export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  birth: string; // dd.mm.yyyy
  ageLabel: string;
  guardian: string;
  guardianEmail: string;
  guardianPhone: string;
  contract: "Actif" | "Suspendu" | "Résilié";
  mealType: "Repas de groupe" | "Repas individuel";
  allergies?: string;
  notes?: string;
};

export const children: Child[] = [
  {
    id: "emma-dupont",
    firstName: "Emma",
    lastName: "Dupont",
    birth: "15.03.2022",
    ageLabel: "2 ans",
    guardian: "Marie Dupont",
    guardianEmail: "marie.dupont@email.com",
    guardianPhone: "+41 79 123 45 67",
    contract: "Actif",
    mealType: "Repas de groupe",
    allergies: "Sans lactose",
    notes: "Éviter tout produit laitier",
  },
  {
    id: "lucas-martin",
    firstName: "Lucas",
    lastName: "Martin",
    birth: "02.07.2021",
    ageLabel: "3 ans",
    guardian: "Pierre Martin",
    guardianEmail: "pierre.martin@email.com",
    guardianPhone: "+41 79 222 33 44",
    contract: "Actif",
    mealType: "Repas de groupe",
  },
  {
    id: "sophie-bernard",
    firstName: "Sophie",
    lastName: "Bernard",
    birth: "11.11.2023",
    ageLabel: "1 an",
    guardian: "Claire Bernard",
    guardianEmail: "claire.bernard@email.com",
    guardianPhone: "+41 79 555 66 77",
    contract: "Actif",
    mealType: "Repas individuel",
    allergies: "Repas individuel",
  },
  {
    id: "antoine-lefevre",
    firstName: "Antoine",
    lastName: "Lefèvre",
    birth: "20.02.2020",
    ageLabel: "4 ans",
    guardian: "Jean Lefèvre",
    guardianEmail: "jean.lefevre@email.com",
    guardianPhone: "+41 79 888 99 00",
    contract: "Suspendu",
    mealType: "Repas de groupe",
  },
  {
    id: "lea-rousseau",
    firstName: "Léa",
    lastName: "Rousseau",
    birth: "05.09.2022",
    ageLabel: "2 ans",
    guardian: "Isabelle Rousseau",
    guardianEmail: "isabelle.rousseau@email.com",
    guardianPhone: "+41 79 444 11 22",
    contract: "Résilié",
    mealType: "Repas de groupe",
  },
];

export const initials = (first: string, last: string) =>
  `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

export type InvoiceStatus = "Brouillon" | "Envoyée" | "Payée" | "En retard" | "Annulée";
export type Invoice = {
  id: string;
  childId: string;
  childName: string;
  period: string;
  amount: number;
  status: InvoiceStatus;
  due?: string;
};

export const invoices: Invoice[] = [
  { id: "INV-2026-05-001", childId: "emma-dupont", childName: "Emma Dupont", period: "Mai 2026", amount: 718, status: "Brouillon" },
  { id: "INV-2026-05-002", childId: "lucas-martin", childName: "Lucas Martin", period: "Mai 2026", amount: 625, status: "Envoyée", due: "30.06.2026" },
  { id: "INV-2026-05-003", childId: "sophie-bernard", childName: "Sophie Bernard", period: "Mai 2026", amount: 540, status: "Payée" },
  { id: "INV-2026-04-004", childId: "antoine-lefevre", childName: "Antoine Lefèvre", period: "Avril 2026", amount: 480, status: "En retard", due: "15.05.2026" },
  { id: "INV-2026-04-005", childId: "emma-dupont", childName: "Emma Dupont", period: "Avril 2026", amount: 695, status: "Payée" },
  { id: "INV-2026-04-006", childId: "lucas-martin", childName: "Lucas Martin", period: "Avril 2026", amount: 610, status: "Annulée" },
];

export const formatCHF = (n: number) => {
  const fixed = n.toFixed(2);
  const [intPart, dec] = fixed.split(".");
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  if (dec === "00") return `CHF ${withSep}.–`;
  return `CHF ${withSep}.${dec}`;
};
