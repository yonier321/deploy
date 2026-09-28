export interface GuardianRecord {
  idAcudiente: number;
  idPersona: number;
  nombre: string;
  tipoDocumento: string;
  documento: string;
  telefono: string;
  email: string;
  nacimiento: string;
  idEstado: number;
}

// Mock compartido en memoria hasta que Persona/Acudiente se conecten a la API.
export const guardianRecords: GuardianRecord[] = [
  {
    idAcudiente: 1,
    idPersona: 9,
    nombre: 'María Restrepo',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '43.582.910',
    telefono: '310 448 9021',
    email: 'maria.restrepo@mail.com',
    nacimiento: '1982-04-16',
    idEstado: 1,
  },
  {
    idAcudiente: 2,
    idPersona: 10,
    nombre: 'Luis Gómez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '44.003.322',
    telefono: '311 444 5566',
    email: 'lgomez@mail.com',
    nacimiento: '1972-09-12',
    idEstado: 1,
  },
  {
    idAcudiente: 3,
    idPersona: 11,
    nombre: 'Ana Cano',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '98.765.432',
    telefono: '322 777 8899',
    email: 'acano@mail.com',
    nacimiento: '1980-01-08',
    idEstado: 2,
  },
];

export function findGuardianByDocument(documento: string) {
  const normalized = documento.replace(/\D/g, '');
  if (!normalized) return undefined;
  // Alias conservado para el documento usado por el mock de búsqueda inicial.
  if (normalized === '1037415820') return guardianRecords[0];
  return guardianRecords.find(record => record.documento.replace(/\D/g, '') === normalized);
}

export function createGuardianRecord(data: Omit<GuardianRecord, 'idAcudiente' | 'idPersona' | 'idEstado'>) {
  const record: GuardianRecord = {
    ...data,
    idAcudiente: Math.max(0, ...guardianRecords.map(item => item.idAcudiente)) + 1,
    idPersona: Math.max(1000, ...guardianRecords.map(item => item.idPersona)) + 1,
    idEstado: 1,
  };
  guardianRecords.push(record);
  return record;
}
