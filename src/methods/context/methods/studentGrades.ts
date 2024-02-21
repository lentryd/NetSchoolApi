import Client from "@/classes/Client";

interface RelatedObject {
  type: string;
  ref: string;
}

interface Dependency {
  relatedObject: RelatedObject;
  relatedValue?: any;
  condition: string;
}

interface Filter {
  id: string;
  title: string;
  order: number;
  filterType: string;
  optionalFlag: boolean;
  hideSingleOption: boolean;
  hasSureCheckedFlag: boolean;
  hideTitleFlag: boolean;
  existStateProvider: boolean;
  emptyText: string;
  dependencies: Dependency[];
}

interface FilterPanel {
  filters: Filter[];
}

interface Report {
  id: string;
  name: string;
  group: string;
  level: string;
  order: number;
  filterPanel: FilterPanel;
  presentTypes: any[];
}

interface Item {
  title: string;
  value: string;
}

interface Range {
  start: Date;
  end: Date;
}

interface DefaultRange {
  start: Date;
  end: Date;
}

export interface FilterSource {
  items: Item[];
  defaultValue: string;
  filterId: string;
  nullText?: any;
  minValue?: Date;
  maxValue?: Date;
  range: Range;
  defaultRange: DefaultRange;
}

interface StudentGradesObject {
  report: Report;
  filterSources: FilterSource[];
}

export default async function (client: Client) {
  const { filterSources: data }: StudentGradesObject = await client
    .get("reports/studentGrades")
    .then((res) => res.json() as any);

  const classes =
    data
      .find((f) => f.filterId == "PCLID_IUP")
      ?.items.map((c) => ({ id: parseInt(c.value), name: c.title })) ?? [];

  const subjects =
    data
      .find((f) => f.filterId == "SGID")
      ?.items.map((s) => ({ id: parseInt(s.value), name: s.title })) ?? [];

  const students =
    data
      .find((f) => f.filterId == "SID")
      ?.items.map((s) => ({
        id: parseInt(s.value),
        name: s.title,
      })) ?? [];

  const termFilters = data.find((f) => f.filterId == "TERMID");
  const terms = !termFilters
    ? []
    : await Promise.all(
        termFilters.items.map(async (t) => {
          const filters = await client
            .post("v2/reports/studentgrades/initfilters", {
              body: JSON.stringify({
                params: null,
                selectedData: [{ filterId: "TERMID", filterValue: t.value }],
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => res.json() as Promise<FilterSource[]>);
          const termDates = filters.find((f) => f.filterId == "period")?.range;
          if (!termDates) throw new Error("Не удалось получить даты четверти");

          return {
            id: parseInt(t.value),
            name: t.title,
            isCurrent: termFilters.defaultValue == t.value,
            start: new Date(termDates?.start),
            end: new Date(termDates?.end),
          };
        })
      );

  return {
    user: {
      terms,
      classes,
      students,
    },
    subjects,
  };
}
