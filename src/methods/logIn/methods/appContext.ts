import Client from "@classes/Client";

interface GlobalYear {
  startDate: Date;
  endDate: Date;
  id: number;
  name: string;
}

interface SchoolYear {
  globalYear: GlobalYear;
  schoolId: number;
  startDate: Date;
  endDate: Date;
  closed: string;
  id: number;
  name: string;
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
  funcType: string;
  schoolId: number;
  dateFormat: string;
  timeFormat: string;
  schoolyear: SchoolYear;
  schoolYearId: number;
  globalYearId: number;
  productName: string;
  versionDate?: any;
  userLanguage: string;
  organization: Organization;
  organizationName: string;
}

export default function (client: Client, at: string) {
  return client
    .get("context", { headers: { at } })
    .then((res) => res.json() as Promise<ContextObject>)
    .then((data) => {
      if (!data) {
        throw new Error("Сетевой не вернул контекст приложения");
      } else {
        return {
          userId: data.userId,
          yearId: data.schoolYearId,
          schoolId: data.schoolId,
          globalYearId: data.globalYearId,
        };
      }
    });
}
