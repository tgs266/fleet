package raw

type Raw map[string]interface{}

func (r Raw) Wrap(apiVersion, kind string) Raw {
	r["kind"] = kind
	r["apiVersion"] = apiVersion
	return r
}
