package jwe

import (
	"encoding/json"
	"time"

	"github.com/tgs266/fleet/lib/errors"
	jose "gopkg.in/square/go-jose.v2"
	"k8s.io/client-go/tools/clientcmd/api"
)

type JweManager struct {
	cryptoSystem *cryptoSystem
	tokenTTL     time.Duration
}

type Claims map[Claim]string

type Claim string

const (
	timeFormat       = time.RFC3339
	IAT        Claim = "iat"
	EXP        Claim = "exp"
)

var TOKEN_TTL int = 900

func New() *JweManager {
	cryptoSystem := &cryptoSystem{}
	cryptoSystem.Init()
	return &JweManager{
		cryptoSystem: cryptoSystem,
		tokenTTL:     time.Duration(TOKEN_TTL) * time.Second,
	}
}

func (self *JweManager) Generate(authInfo api.AuthInfo) (string, error) {
	authBytes, err := json.Marshal(authInfo)
	if err != nil {
		return "", err
	}

	jweObject, err := self.cryptoSystem.Encrypter().EncryptWithAuthData(authBytes, self.generateClaims())
	if err != nil {
		return "", err
	}

	return jweObject.FullSerialize(), nil
}

func (self *JweManager) Decrypt(jweToken string) (*api.AuthInfo, error) {
	jweTokenObject, err := self.validate(jweToken)
	if err != nil {
		return nil, err
	}

	decrypted, err := jweTokenObject.Decrypt(self.cryptoSystem.Key())
	if err != nil {
		return nil, errors.NewInvalidJWEToken()
	}

	authInfo := new(api.AuthInfo)
	err = json.Unmarshal(decrypted, authInfo)
	return authInfo, err
}

func (self *JweManager) validate(jweToken string) (*jose.JSONWebEncryption, error) {
	jwe, err := jose.ParseEncrypted(jweToken)
	if err != nil {
		return nil, errors.NewInvalidJWEFormat()
	}

	if self.tokenTTL > 0 {
		claims := Claims{}
		err = json.Unmarshal(jwe.GetAuthData(), &claims)
		if err != nil {
			return nil, errors.NewInvalidClaims()
		}

		if self.isExpired(claims[IAT], claims[EXP]) {
			return nil, errors.NewExpiredJWEToken()
		}
	}

	return jwe, nil
}

func (self *JweManager) RefreshToken(jweToken string) (string, error) {
	authInfo, err := self.Decrypt(jweToken)
	if err != nil {
		return "", err
	}
	return self.Generate(*authInfo)
}

func (self *JweManager) isExpired(iatStr, expStr string) bool {
	iat, err := time.Parse(timeFormat, iatStr)
	if err != nil {
		return true
	}

	exp, err := time.Parse(timeFormat, expStr)
	if err != nil {
		return true
	}

	age := time.Now().Sub(iat.Local())
	return iat.Add(age).After(exp)
}

func (self *JweManager) generateClaims() []byte {
	now := time.Now()
	claims := Claims{
		IAT: now.Format(timeFormat),
	}

	if self.tokenTTL > 0 {
		claims[EXP] = now.Add(self.tokenTTL).Format(timeFormat)
	}

	rawClaims, _ := json.Marshal(claims)
	return rawClaims
}
