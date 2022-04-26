package oidc

type OIDCConfig struct {
	IssuerURL        string
	ClientID         string
	ClientSecret     string
	Host             string
	UseOfflineAccess bool
}
