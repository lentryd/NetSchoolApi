import Client from "@/classes/Client";

interface GlobalYear {
  id: number;
  name: string;
  endDate: Date;
  startDate: Date;
}

interface SchoolYear {
  id: number;
  name: string;
  closed: string;
  endDate: Date;
  schoolId: number;
  startDate: Date;
  globalYear: GlobalYear;
}

interface User {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
}

interface ContextObject {
  at: string;
  user: User;
  emId?: any;
  roles: string[];
  rights: string[];
  userId: number;
  version: string;
  schoolId: number;
  funcType: string;
  dateFormat: string;
  timeFormat: string;
  schoolyear: SchoolYear;
  productName: string;
  versionDate?: any;
  schoolYearId: number;
  globalYearId: number;
  userLanguage: string;
  organization: Organization;
  organizationName: string;
}

export default async function (client: Client) {
  const data: ContextObject = await client
    .get("context")
    .then((res) => res.json() as any);

  return {
    year: {
      id: data.schoolyear.id,
      gId: data.schoolyear.globalYear.id,
      name: data.schoolyear.name,
      start: new Date(data.schoolyear.startDate),
      end: new Date(data.schoolyear.endDate),
    },
    user: { id: data.user.id, name: data.user.name },
    server: { dateFormat: data.dateFormat, timeFormat: data.timeFormat },
    schoolId: data.schoolId,
  };
}
