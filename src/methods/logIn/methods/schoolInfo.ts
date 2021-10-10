import Client from "@classes/Client";

interface SchoolAddress {
  id: number;
  name: string;
  cityId: number;
  stateId: number;
  funcType: number;
  countryId: number;
  provinceId?: number;
  parentCityId?: number;
  municipalityDistrictId: number;
}

function getSchools(client: Client) {
  return client
    .get("addresses/schools?funcType=2")
    .then((res) => res.json() as Promise<SchoolAddress[]>)
    .then((data) => {
      if (!data || !data.length) {
        throw new Error("Сетевой не вернул список школ");
      } else {
        return data;
      }
    });
}

function findSchool(school: string | number, schools: SchoolAddress[]) {
  if (typeof school === "string") school = school.toLowerCase();

  return schools.find(({ id, name }) => {
    if (typeof school === "string") {
      return name.toLowerCase() == school;
    } else {
      return id == school;
    }
  });
}

export interface SchoolInfo {
  cid: number;
  sid: number;
  pid: number;
  cn: number;
  sft: number;
  scid: number;
}

export default function (client: Client, school: string | number) {
  return getSchools(client)
    .then(findSchool.bind(null, school))
    .then((school) => {
      if (!school) {
        throw new Error("Не удалось найти школу");
      } else {
        return {
          cid: school.countryId,
          sid: school.stateId,
          pid: school.municipalityDistrictId,
          cn: school.cityId,
          sft: 2,
          scid: school.id,
        };
      }
    });
}
