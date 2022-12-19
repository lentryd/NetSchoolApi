import Client from "@classes/Client";

interface SchoolSearchData {
  id: number;
  inn: string;
  ogrn: string;
  name: string;
  cityId: number;
  address: null;
  shortName: string;
  provinceId: number;
}

declare module SchoolPreLoginData {

    export interface Country {
        id: number;
        name: string;
    }

    export interface State {
        id: number;
        name: string;
    }

    export interface Province {
        kladr: string;
        id: number;
        name: string;
    }

    export interface City {
        atoTypeName: string;
        id: number;
        name: string;
    }

    export interface Func {
        id: number;
        name: string;
    }

    export interface School {
        id: number;
        name: string;
    }

    export interface RootObject {
        countries: Country[];
        cid: number;
        states: State[];
        sid: number;
        provinces: Province[];
        pid: number;
        cities: City[];
        cn: number;
        funcs: Func[];
        sft: number;
        schools: School[];
        scid: number;
        hlevels?: any;
        ems?: any;
    }

}

export interface SchoolInfo {
  cid: number;
  sid: number;
  pid: number;
  cn: number;
  sft: number;
  scid: number;
}

export default async function (client: Client, school: string | number) {
  const data = await Promise.all([
    client.get("schools/search").then(res => res.json() as Promise<SchoolSearchData[]>),
    client.get("prepareloginform").then(res => res.json() as Promise<SchoolPreLoginData.RootObject>),
  ]).catch((e) => {
    console.error(e);
    throw new Error("Не удалось получить список школ");
  });

  if (typeof school === "string") school = school.toLowerCase();
  const result = data[0].find(({ id, name }) =>
    typeof school !== "string" ? id == school : name.toLowerCase() == school
  );

  if (!result) throw new Error("Не удалось найти школу");

  return {
    cid: data[1].cid,
    sid: data[1].sid,
    pid: result.provinceId,
    cn: result.cityId,
    sft: 2,
    scid: result.id,
  };
}
