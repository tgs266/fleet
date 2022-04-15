export type JSONValue = string | number | boolean | JSONObject | JSONArray;

export interface JSONObject {
    [x: string]: JSONValue;
}

export interface JSONObjectType<T> {
    [x: string]: T;
}

export interface JSONArray extends Array<JSONValue> {}
