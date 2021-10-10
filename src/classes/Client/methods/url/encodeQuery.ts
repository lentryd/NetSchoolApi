export default function (params: { [key: string]: any }) {
  let query = "";

  for (let key in params) {
    query += !!query ? "&" : "?";
    query += key + "=" + encodeURI(params[key]);
  }

  return query;
}
